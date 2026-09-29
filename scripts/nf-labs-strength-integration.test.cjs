'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { harness, START } = require('./helpers/nf-labs-harness.cjs');
const embed = fs.readFileSync(path.join(__dirname, '../on page embeds/Strength Lab Labs Context and Commerce.txt'), 'utf8');
const source = embed.match(/root\.__define\("pass6\/labs-context\/labs-context",function\(require,module,exports\)\{([\s\S]*?)\n\},\[/)[1];
const cache = {};
function load(id) {
  id = id.replace(/\.js$/, ''); if (cache[id]) return cache[id].exports;
  const m = { exports: {} }; cache[id] = m;
  const text = id === 'pass6/labs-context/labs-context' ? source : fs.readFileSync(path.join(__dirname, 'fixtures/strength-live-20260929', id.replaceAll('/', '__') + '.js'), 'utf8');
  new Function('require', 'module', 'exports', text)(r => load(path.posix.normalize(path.posix.join(path.posix.dirname(id), r))), m, m.exports);
  return m.exports;
}
const labs = load('pass6/labs-context/labs-context'), schema = load('data/schema'), runtime = load('runtime/index');
const clock = runtime.createClock(new Date(START).toISOString());
const access = { kind: 'nutrition_and_strength_standalone', authoritative: true, stale: false, current: true, hasNutritionPro: true, hasStrengthPro: true, memberId: 'member-a', authRevision: 1 };
async function fixture() {
  const h = harness(); await h.ready();
  const env = { NF_LABS: h.api }, options = { clock, accessState: access, globalConsent: true, runtimeEnv: env };
  const s = h.api.getState(); s.consent.enabled = true; s.consent.sources.nutrition = true; s.consent.sources.strength = true; await h.api.setState(s);
  async function publish() {
    const s = h.api.getState(); return h.api.writeNutritionSignal({ subjectId: s.subjectId, authRevision: s.authRevision, revision: s.revision, stateId: s.stateId, available: true, status: 'ready', updatedAt: clock.now(), staleAt: new Date(START + 86400000).toISOString(), payload: { phaseTag: 'cutting' } });
  }
  await publish();
  const state = labs.consent(schema.normalizeState({}, { clock }).state, 'nutrition', options).state;
  return { h, env, options, state, publish };
}
function domainOnly(state) { const out = JSON.parse(JSON.stringify(state)); delete out.pass6.labsContext; return out; }
test('captured Strength module consumes bounded data without altering domain state', async () => {
  const f = await fixture(), out = labs.generateRecommendation(f.state, f.env, ['nutrition'], f.options);
  assert.equal(out.ok, true); assert.equal(out.recommendation.doesNotAlterDecision, true);
  assert.deepEqual(domainOnly(out.state), domainOnly(f.state));
  assert.equal(labs.recommendationHistory(out.state, access, f.options).recommendations.length, 1);
});
test('Strength rejects another member and a stale auth revision even with local consent', async () => {
  const f = await fixture();
  for (const other of [{ ...access, memberId: 'member-b' }, { ...access, authRevision: 2 }]) {
    const foreign = JSON.parse(JSON.stringify(f.state));
    Object.values(foreign.pass6.labsContext.consents).forEach(c => { c.memberScope = other.memberId; c.authRevision = other.authRevision; });
    assert.equal(labs.readContext(foreign, f.env, 'nutrition', { ...f.options, accessState: other }).ok, false);
  }
});
test('a source stop immediately makes earlier connected recommendations unusable', async () => {
  const f = await fixture(), out = labs.generateRecommendation(f.state, f.env, ['nutrition'], f.options);
  await f.h.api.revokeSource('nutrition');
  assert.equal(labs.readContext(out.state, f.env, 'nutrition', f.options).ok, false);
  const history = labs.recommendationHistory(out.state, access, f.options);
  assert.equal(history.ok && history.recommendations.length > 0, false);
});
test('reconnecting and republishing cannot revive a recommendation from an earlier permission', async () => {
  const f = await fixture(), out = labs.generateRecommendation(f.state, f.env, ['nutrition'], f.options);
  await f.h.api.revokeSource('nutrition');
  const s = f.h.api.getState(); s.consent.sources.nutrition = true; await f.h.api.setState(s); await f.publish();
  const state = labs.consent(out.state, 'nutrition', f.options).state;
  const history = labs.recommendationHistory(state, access, f.options);
  assert.equal(history.ok && history.recommendations.length > 0, false);
});
test('recommendation history rechecks source expiry and cannot trust a caller consent flag', async () => {
  const f = await fixture(), out = labs.generateRecommendation(f.state, f.env, ['nutrition'], f.options);
  f.h.setNow(START + 86400000);
  const history = labs.recommendationHistory(out.state, access, { ...f.options, clock: runtime.createClock(new Date(START + 86400000).toISOString()) });
  assert.equal(history.ok && history.recommendations.length > 0, false);
  const withoutBridge = labs.recommendationHistory(out.state, access, { globalConsent: true, clock });
  assert.equal(withoutBridge.ok, false);
});
test('current canonical access remains fail closed until server mapping is resolved', async () => {
  const f = await fixture();
  const out = labs.readContext(f.state, f.env, 'nutrition', { ...f.options, accessState: { ...access, kind: 'strength_pro', memberId: '', hasNutritionPro: false, crossLabEligible: false } });
  assert.equal(out.reason, 'nutrition_pro_required');
});
test('Strength publication waits for the bridge receipt and rejects a false receipt', async () => {
  const f = await fixture();
  const preview = labs.previewStrengthSignal({ trendBucket: 'improving' }, f.options);
  assert.equal(preview.ok, true);
  const good = await labs.publishStrengthSignal(f.state, f.env, preview.signal, { ...f.options, confirmed: true });
  assert.equal(good.ok, true); assert.equal(f.h.api.getState().sources.strength.payload.trendBucket, 'improving');
  const denied = { ...f.env, NF_LABS: { ...f.h.api, writeStrengthSignal: async () => false } };
  const bad = await labs.publishStrengthSignal(f.state, denied, preview.signal, { ...f.options, confirmed: true });
  assert.equal(bad.ok, false);
});
test('confirming an old Strength preview does not refresh its original expiry', async () => {
  const f = await fixture(), preview = labs.previewStrengthSignal({ trendBucket: 'stable' }, f.options);
  f.h.setNow(START + 22 * 86400000);
  const out = await labs.publishStrengthSignal(f.state, f.env, preview.signal, { ...f.options, clock: runtime.createClock(new Date(START + 22 * 86400000).toISOString()), confirmed: true });
  assert.equal(out.ok, false); assert.equal(f.h.api.getState().sources.strength.available, false);
});
test('Strength cannot acknowledge success when cleanup remains pending', async () => {
  const f = await fixture(), preview = labs.previewStrengthSignal({ trendBucket: 'improving' }, f.options);
  const out = await labs.publishStrengthSignal(f.state, f.env, preview.signal, { ...f.options, confirmed: true });
  f.h.failWrites();
  const stop = await labs.revokeStrengthSignal(out.state, f.env, preview.signal.id, f.options);
  assert.equal(stop.ok, false); assert.equal(stop.reason, 'cleanup_pending');
  assert.equal(f.h.api.getState().sources.strength.available, false);
});
