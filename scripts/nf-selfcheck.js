#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const repoRoot = process.cwd();
const SITEWIDE_REL = normalizeRel(path.join('on page embeds', 'Sitewide Code.txt'));
const SELFCHECK_REL = normalizeRel(path.join('scripts', 'nf-selfcheck.js'));
const TRAINING_PAGE = 'Training Plans Page Settings Code.txt';
const BLOGS_PAGE = 'Blogs Hub Page Settings Code.txt';
const TRAINING_CMS_PAGE = 'Training Plans CMS Collection Page Page Settings Code.txt';
const TRAINING_EMBED = normalizeRel(path.join('on page embeds', 'Training Plans Page On Page Embeds.txt'));
const BLOGS_EMBED = normalizeRel(path.join('on page embeds', 'Blogs Hub On Page Embeds.txt'));
const HOMEPAGE_EMBED = normalizeRel(path.join('on page embeds', 'Homepage On Page Embeds.txt'));
const TRAINING_CMS_EMBED = normalizeRel(path.join('on page embeds', 'Training PLans CMS Collection Page On Page Embeds.txt'));
const EMBEDS_WITH_LITERAL_BAN = [
  HOMEPAGE_EMBED,
  TRAINING_EMBED,
  TRAINING_CMS_EMBED
];
const BANNED_LITERALS = ['#2d86c2', '#f3fbff', '#1a2a33', '#e11d48'];
const PROHIBITED_PATTERNS = [
  { name: 'dataLayer.push(', regex: /dataLayer\.push\(/g },
  { name: 'dl.push(', regex: /\bdl\.push\(/g },
  { name: "gtag(event)", regex: /gtag\(("|')event\1/g },
  { name: "fbq('track'", regex: /fbq\('track'/g }
];
const ROOT_PATTERN = /^\s*:root\s*\{/gm;
const BASE_PRIMITIVE_PATTERNS = [
  { name: 'base .nf-btn', regex: /^\s*\.nf-btn\b/gm },
  { name: 'base .nf-card', regex: /^\s*\.nf-card\b/gm }
];
const GTAG_EVENT_PATTERN = /gtag\(("|')event\1/g;
function normalizeRel(relPath) {
  return relPath.split(path.sep).join('/');
}
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
function getTargetFiles() {
  return walk(repoRoot)
    .filter((full) => {
      const rel = normalizeRel(path.relative(repoRoot, full));
      const base = path.basename(full);
      return base.endsWith('.txt') || base.endsWith('.js') || rel === 'README.md';
    })
    .sort((a, b) => normalizeRel(path.relative(repoRoot, a)).localeCompare(normalizeRel(path.relative(repoRoot, b))));
}
function parseScriptBlocks(text) {
  const blocks = [];
  const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  let idx = 0;
  while ((m = regex.exec(text))) {
    idx += 1;
    const body = m[1] || '';
    const start = m.index;
    const end = regex.lastIndex;
    const startLine = text.slice(0, start).split('\n').length;
    const endLine = text.slice(0, end).split('\n').length;
    blocks.push({ blockIndex: idx, body, startLine, endLine });
  }
  return blocks;
}
function normalizeScriptBody(body) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}
function hasMarker(text, marker) {
  if (marker instanceof RegExp) return marker.test(text);
  return text.includes(marker);
}
const failures = [];
const warnings = [];
const infos = [];
const fileEntries = [];
for (const full of getTargetFiles()) {
  const rel = normalizeRel(path.relative(repoRoot, full));
  const content = fs.readFileSync(full, 'utf8');
  const scripts = parseScriptBlocks(content);
  fileEntries.push({ rel, content, scripts });
}
infos.push(`Scanned files: ${fileEntries.length}`);
infos.push(`Scanned script blocks: ${fileEntries.reduce((n, f) => n + f.scripts.length, 0)}`);
// (1) prohibited direct emissions outside Sitewide
for (const file of fileEntries) {
  const isSitewide = file.rel === SITEWIDE_REL;
  for (const block of file.scripts) {
    for (const p of PROHIBITED_PATTERNS) {
      p.regex.lastIndex = 0;
      let m;
      while ((m = p.regex.exec(block.body))) {
        if (isSitewide) continue;
        const lineOffset = block.body.slice(0, m.index).split('\n').length - 1;
        const line = block.startLine + lineOffset;
        failures.push(`${file.rel}:${line} contains prohibited ${p.name} outside Sitewide`);
      }
    }
  }
}
// (2) sitewide canonical APIs
const sitewide = fileEntries.find((f) => f.rel === SITEWIDE_REL);
if (!sitewide) {
  failures.push(`Missing required file: ${SITEWIDE_REL}`);
} else {
  const required = [
    'window.neuform.canTrack',
    'window.neuform.track',
    'window.neuform.trackOnce'
  ];
  for (const marker of required) {
    if (!sitewide.content.includes(marker)) {
      failures.push(`${SITEWIDE_REL} missing canonical API marker: ${marker}`);
    }
  }
}
// (2b) Sitewide is the only global :root token authority
for (const file of fileEntries) {
  if (file.rel === SITEWIDE_REL) continue;
  ROOT_PATTERN.lastIndex = 0;
  let m;
  while ((m = ROOT_PATTERN.exec(file.content))) {
    const line = file.content.slice(0, m.index).split('\n').length;
    failures.push(`${file.rel}:${line} contains :root outside Sitewide`);
  }
}
// (2c) Base primitives must not be declared outside Sitewide
for (const file of fileEntries) {
  if (file.rel === SITEWIDE_REL) continue;
  for (const p of BASE_PRIMITIVE_PATTERNS) {
    p.regex.lastIndex = 0;
    let m;
    while ((m = p.regex.exec(file.content))) {
      const line = file.content.slice(0, m.index).split('\n').length;
      failures.push(`${file.rel}:${line} contains ${p.name} outside Sitewide`);
    }
  }
}
// (2d) Canonical token literals must be absent in selected embeds
for (const rel of EMBEDS_WITH_LITERAL_BAN) {
  const entry = fileEntries.find((f) => f.rel === rel);
  if (!entry) {
    failures.push(`Missing required file: ${rel}`);
    continue;
  }
  for (const lit of BANNED_LITERALS) {
    let idx = entry.content.indexOf(lit);
    while (idx !== -1) {
      const line = entry.content.slice(0, idx).split('\n').length;
      failures.push(`${rel}:${line} contains banned literal ${lit}`);
      idx = entry.content.indexOf(lit, idx + lit.length);
    }
  }
}
// (2e) No direct gtag("event"|'event') outside self-check itself
for (const file of fileEntries) {
  if (file.rel === SELFCHECK_REL) continue;
  GTAG_EVENT_PATTERN.lastIndex = 0;
  let m;
  while ((m = GTAG_EVENT_PATTERN.exec(file.content))) {
    const line = file.content.slice(0, m.index).split('\n').length;
    failures.push(`${file.rel}:${line} contains direct gtag(event) emission outside ${SELFCHECK_REL}`);
  }
}
// (3) Training and Blog marker checks
const markerChecks = [
  {
    file: TRAINING_PAGE,
    checks: [
      { label: '__NF_TRAINING_PLANS_BOOTED__', marker: '__NF_TRAINING_PLANS_BOOTED__' },
      { label: 'dataset.nfPlansInit', marker: 'dataset.nfPlansInit' },
      { label: 'aria-busy set', marker: "setAttribute('aria-busy'" },
      { label: 'aria-busy clear', marker: "removeAttribute('aria-busy'" },
      { label: 'minHeight lock/unlock (style.minHeight usage)', marker: 'style.minHeight' },
      { label: 'focus restoration helper', marker: 'restorePagerFocus' },
      { label: 'normalizeHubMedia helper', marker: 'normalizeHubMedia' },
      { label: 'pagehide cleanup', marker: /pagehide/ }
    ]
  },
  {
    file: BLOGS_PAGE,
    checks: [
      { label: '__NF_BLOG_HUB_BOOTED__', marker: '__NF_BLOG_HUB_BOOTED__' },
      { label: 'dataset.nfBlogInit', marker: 'dataset.nfBlogInit' },
      { label: 'aria-busy set', marker: "setAttribute('aria-busy'" },
      { label: 'aria-busy clear', marker: "removeAttribute('aria-busy'" },
      { label: 'minHeight lock/unlock', marker: 'style.minHeight' },
      { label: 'focus restoration helper', marker: 'restorePagerFocus' },
      { label: 'normalizeHubMedia helper', marker: 'normalizeHubMedia' },
      { label: 'pagehide cleanup', marker: /pagehide/ },
      { label: 'pager aria-disabled updates', marker: 'aria-disabled' }
    ]
  }
];
for (const rule of markerChecks) {
  const entry = fileEntries.find((f) => f.rel === rule.file);
  if (!entry) {
    failures.push(`Missing required file: ${rule.file}`);
    continue;
  }
  for (const check of rule.checks) {
    if (!hasMarker(entry.content, check.marker)) {
      failures.push(`${rule.file} missing marker: ${check.label}`);
    }
  }
}
// (4) Hub embed reduced-motion swap-transition guardrails
const embedChecks = [
  {
    file: TRAINING_EMBED,
    checks: [
      { label: 'PRM media query', marker: '@media (prefers-reduced-motion: reduce)' },
      { label: 'nf-page transition override', marker: '.nf-page' },
      { label: 'updating track transition override', marker: '.nf-tiles.is-updating .nf-page-track' }
    ]
  },
  {
    file: BLOGS_EMBED,
    checks: [
      { label: 'PRM media query', marker: '@media (prefers-reduced-motion: reduce)' },
      { label: 'nf-page transition override', marker: '.nf-page' },
      { label: 'updating track transition override', marker: '.blog_list.is-updating .nf-page-track' }
    ]
  }
];
for (const rule of embedChecks) {
  const entry = fileEntries.find((f) => f.rel === rule.file);
  if (!entry) {
    failures.push(`Missing required file: ${rule.file}`);
    continue;
  }
  for (const check of rule.checks) {
    if (!hasMarker(entry.content, check.marker)) {
      failures.push(`${rule.file} missing marker: ${check.label}`);
    }
  }
}
// (5) Training Plans CMS template script-block integrity
const trainingCms = fileEntries.find((f) => f.rel === TRAINING_CMS_PAGE);
if (!trainingCms) {
  failures.push(`Missing required file: ${TRAINING_CMS_PAGE}`);
} else {
  if (trainingCms.scripts.length !== 4) {
    failures.push(`${TRAINING_CMS_PAGE} must have exactly 4 <script> blocks; found ${trainingCms.scripts.length}`);
  }
  const seen = new Map();
  for (const block of trainingCms.scripts) {
    const norm = normalizeScriptBody(block.body);
    if (seen.has(norm)) {
      const prior = seen.get(norm);
      failures.push(`${TRAINING_CMS_PAGE} has duplicate normalized script blocks: #${prior} and #${block.blockIndex}`);
    } else {
      seen.set(norm, block.blockIndex);
    }
  }
}
// (6) Conversion controls / hash-button anti-pattern
for (const file of fileEntries) {
  const regex = /<a\b[^>]*href\s*=\s*(["'])#\1[^>]*role\s*=\s*(["'])button\2/gi;
  let m;
  while ((m = regex.exec(file.content))) {
    const line = file.content.slice(0, m.index).split('\n').length;
    failures.push(`${file.rel}:${line} contains a[href="#"][role="button"] anti-pattern`);
  }
}
// (7) Stripe links require checkout_outbound instrumentation (heuristic)
const stripeEmbed = fileEntries.find((f) => f.rel === TRAINING_CMS_EMBED);
if (stripeEmbed) {
  const stripeLinkCount = (stripeEmbed.content.match(/stripe-link-base/g) || []).length;
  const hasMarker = stripeEmbed.content.includes('data-checkout-destination="stripe"');
  if (stripeLinkCount > 0 && !hasMarker) {
    failures.push(`${TRAINING_CMS_EMBED} has Stripe link placeholders without data-checkout-destination="stripe" marker`);
  }
}
const trainingCmsEntry = fileEntries.find((f) => f.rel === TRAINING_CMS_PAGE);
if (trainingCmsEntry && !trainingCmsEntry.content.includes("event: 'checkout_outbound'")) {
  failures.push(`${TRAINING_CMS_PAGE} missing checkout_outbound instrumentation`);
}
// (8) Event dictionary enforcement (canonical OR explicit allowlist)
const CANONICAL_EVENTS = new Set([
  'page_view','cta_click','plan_card_click','buy_click','checkout_outbound','begin_checkout',
  'lead_submit_attempt','lead_submit_success','lead_submit_error','purchase_thankyou_view','support_click','social_click'
]);
const EVENT_ALLOWLIST = new Set([
  'Lead','generate_lead','view_item_list','select_item','nf_terms_block','nf_product_impression',
  'nf_plan_preview_open','nf_catalog_filter','nf_add_on_toggled','nf_sticky_cta_show','nf_sticky_cta_hide',
  'nf_download_click','nf_thankyou_open','nf_post_purchase_nudge','nf_copy','nf_tool_view','nf_tool_action',
  'nf_cookie_pref_update','nf_cookie_pref_reset','nf_plan_card_missing_data','gtm.js'
]);
for (const file of fileEntries) {
  if (file.rel === SELFCHECK_REL) continue;
  const regexes = [
    /window\.neuform\.track(?:Once)?\(\s*['"]([^'"]+)['"]/g,
    /\bevent\s*:\s*['"]([^'"]+)['"]/g
  ];
  for (const re of regexes) {
    let m;
    while ((m = re.exec(file.content))) {
      const name = m[1];
      if (CANONICAL_EVENTS.has(name) || EVENT_ALLOWLIST.has(name)) continue;
      if (/^nf_/.test(name) || /^view\./.test(name) || /^blog_/.test(name) || /^page_/.test(name)) continue;
      if (/^scroll_depth_/.test(name) || /^gtm\./.test(name)) continue;
      if (/^nf_ap_access_/.test(name)) continue;
      const line = file.content.slice(0, m.index).split('\n').length;
      failures.push(`${file.rel}:${line} uses non-dictionary event '${name}'`);
    }
  }
}
// (9) Schema governance: duplicate Product JSON-LD and canonical mutation guards
const schemaFiles = [SITEWIDE_REL, 'Blog Post Template Collection Page Settings Code.txt'];
for (const rel of schemaFiles) {
  const entry = fileEntries.find((f) => f.rel === rel);
  if (!entry) continue;
  const productTypeHits = (entry.content.match(/"@type"\s*:\s*"Product"/g) || []).length;
  if (productTypeHits > 1 && rel === SITEWIDE_REL) {
    failures.push(`${rel} contains multiple Product schema literals; enforce single deterministic Product node`);
  }
  const canonicalMutationPattern = /(createElement\(['"]link['"]\)[\s\S]{0,200}canonical|setAttribute\(['"]rel['"],\s*['"]canonical['"]\))/i;
  if (canonicalMutationPattern.test(entry.content)) {
    failures.push(`${rel} appears to mutate canonical link; canonical must be read-only`);
  }
  const appendSchemaPattern = /application\/ld\+json[\s\S]{0,260}appendChild\(/gi;
  let m;
  while ((m = appendSchemaPattern.exec(entry.content))) {
    const line = entry.content.slice(0, m.index).split('\n').length;
    if (!entry.content.slice(Math.max(0, m.index - 200), m.index + 260).includes('replaceWith')) {
      failures.push(`${rel}:${line} appends JSON-LD without explicit replace/idempotence guard`);
    }
  }
}
// (10) DLTER save governance checks
const DLTER_QUIZ_FILE = 'DLTER Quiz Page Settings Code.txt';
const DLTER_LEGACY_URL_SNIPPET = 'https://script.google.com/macros/s/AKfycbyof7-DsgWWdkZmyOPxEs7UxEWDog1Pip6KqCLykx-NK2ud0qGaFQsXnmE5p3QCYmSC/exec';
const dlterQuizEntry = fileEntries.find((f) => f.rel === DLTER_QUIZ_FILE);
if (!dlterQuizEntry) {
  failures.push(`Missing required file: ${DLTER_QUIZ_FILE}`);
} else {
  if (dlterQuizEntry.content.includes('DLTER_SAVE_ENDPOINT_URL') && !dlterQuizEntry.content.includes('DLTER_SAVE_CONFIG')) {
    failures.push(`${DLTER_QUIZ_FILE} uses DLTER_SAVE_ENDPOINT_URL without required relay preference config block`);
  }
  const requiredDlterEvents = [
    'dlter_save_attempt',
    'dlter_save_success',
    'dlter_save_fail',
    'dlter_save_fallback_to_legacy'
  ];
  for (const evt of requiredDlterEvents) {
    if (!dlterQuizEntry.content.includes(evt)) {
      failures.push(`${DLTER_QUIZ_FILE} missing required telemetry marker: ${evt}`);
    }
  }
  if (dlterQuizEntry.content.includes('mode: "no-cors"')) {
    warnings.push(`${DLTER_QUIZ_FILE} contains no-cors usage in DLTER save flow (best-effort only; avoid for deterministic saves)`);
  }
}
for (const file of fileEntries) {
  if (file.rel === DLTER_QUIZ_FILE || file.rel === SELFCHECK_REL) continue;
  let idx = file.content.indexOf(DLTER_LEGACY_URL_SNIPPET);
  while (idx !== -1) {
    const line = file.content.slice(0, idx).split('\n').length;
    failures.push(`${file.rel}:${line} contains hardcoded DLTER Apps Script URL outside ${DLTER_QUIZ_FILE}`);
    idx = file.content.indexOf(DLTER_LEGACY_URL_SNIPPET, idx + DLTER_LEGACY_URL_SNIPPET.length);
  }
}
console.log('NeuForm self-check report');
console.log('========================');
for (const info of infos) console.log(`INFO: ${info}`);
if (warnings.length) {
  for (const warning of warnings) console.log(`WARN: ${warning}`);
}
if (failures.length) {
  for (const failure of failures) console.log(`FAIL: ${failure}`);
  console.log(`RESULT: FAIL (${failures.length} issue${failures.length === 1 ? '' : 's'})`);
  process.exit(1);
}
console.log('RESULT: PASS');
process.exit(0);
