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
