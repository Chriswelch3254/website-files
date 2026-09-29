/* Run: node --test scripts/nf-labs-contract.test.cjs */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { harness, START, lockManager } = require('./helpers/nf-labs-harness.cjs');
async function enable(h, name = 'nutrition') {
  await h.ready(); const s = h.api.getState(); s.consent.enabled = true; s.consent.sources[name] = true;
  return await h.api.setState(s);
}
function signal(h, override = {}) {
  const state = h.api.getState();
  return { subjectId: state.subjectId, authRevision: state.authRevision, revision: state.revision, stateId: state.stateId,
    available: true, status: 'ready', updatedAt: new Date(START).toISOString(), staleAt: new Date(START + 86400000).toISOString(),
    payload: { phaseTag: 'cutting', macroStyleTag: 'balanced', warningTags: [] }, ...override };
}
async function publish(h, override) { return h.api.writeNutritionSignal(signal(h, override)); }
test('approved bounded payload and declared expiry survive a write and same-account reload', async () => {
  const h = harness(); await enable(h); const result = await publish(h);
  assert.equal(result.payload.phaseTag, 'cutting'); assert.equal(result.staleAt, '2026-09-30T16:00:00.000Z');
  const reload = harness({ storage: h.storage }); await reload.ready(); assert.equal(reload.api.getState().sources.nutrition.payload.phaseTag, 'cutting');
});
test('explicit source denial wins over an older source consent flag', async () => {
  const h = harness(); await enable(h); await publish(h); let s = h.api.getState();
  s.sources.nutrition.consent = true; s.consent.sources.nutrition = false; await h.api.setState(s);
  assert.equal(h.api.getState().consent.sources.nutrition, false);
  assert.equal(h.api.getState().sources.nutrition.available, false);
});
test('record consent cannot grant global or source permission', async () => {
  const h = harness(); const result = await publish(h, { consent: true });
  assert.equal(result, false); assert.equal(h.api.getState().consent.enabled, false);
});
test('a legacy synchronous publisher gets an immediate false result, never a truthy pending receipt', async () => {
  const h = harness(); await enable(h, 'strength');
  assert.equal(h.api.writeStrengthSignal({ status: 'generated', readinessColor: 'green', updatedAt: new Date(START).toISOString() }), false);
});
test('global stop-sharing removes reusable payloads', async () => {
  const h = harness(); await enable(h); await publish(h); const s = h.api.getState(); s.consent.enabled = false; await h.api.setState(s);
  assert.equal(h.api.getState().sources.nutrition.available, false);
  assert.equal(JSON.stringify(h.api.getState()).includes('cutting'), false);
});
for (const [label, override] of [
  ['missing expiry', { staleAt: null }], ['expiry before update', { staleAt: '2026-09-28T00:00:00.000Z' }],
  ['future update', { updatedAt: '2026-09-30T00:00:00.000Z' }], ['invalid timestamp', { staleAt: 'not-a-date' }],
  ['already expired', { updatedAt: '2026-09-27T00:00:00.000Z', staleAt: '2026-09-28T00:00:00.000Z' }]
]) test('rejects ' + label, async () => { const h = harness(); await enable(h); assert.equal(await publish(h, override), false); });
test('freshness is recalculated at read time, including the exact expiry boundary', async () => {
  const h = harness(); await enable(h); await publish(h); h.setNow(START + 86400000);
  const s = h.api.getState().sources.nutrition; assert.equal(s.available, false); assert.equal(s.freshness, 'stale');
});
test('private exact fields reject the entire new publication without changing existing state', async () => {
  const h = harness(); await enable(h); await publish(h); const before = JSON.stringify(h.api.getState());
  assert.equal(await publish(h, { payload: { phaseTag: 'maintenance', calories: 2400, foodLog: ['private'] } }), false);
  assert.equal(JSON.stringify(h.api.getState()), before);
});
test('private values cannot be disguised as approved tags', async () => {
  const h = harness(); await enable(h);
  assert.equal(await publish(h, { payload: { phaseTag: 'private@example.com' } }), false);
  assert.equal(await publish(h, { payload: { phaseTag: 'my_private_response' } }), false);
});
test('no consent or source information crosses a member switch', async () => {
  const h = harness(); await enable(h); await publish(h); await h.auth({ member: { id: 'member-b' }, revision: 2 });
  assert.equal(h.api.getState().consent.enabled, false); assert.equal(h.api.getState().sources.nutrition.available, false);
});
test('logout and unresolved identity hide shared data', async () => {
  const h = harness(); await enable(h); await publish(h); await h.auth({ status: 'loading', settled: false, member: null, revision: 2 });
  assert.equal(h.api.getState().sources.nutrition.available, false);
  await h.auth({ status: 'logged-out', settled: true, member: null, revision: 3 });
  assert.equal(h.api.getState().consent.enabled, false); assert.equal(await publish(h), false);
});
test('an in-flight publication from a previous account is rejected', async () => {
  const h = harness(); await enable(h); const old = signal(h); await h.auth({ member: { id: 'member-b' }, revision: 2 }); await enable(h);
  assert.equal(await h.api.writeNutritionSignal(old), false);
});
test('unscoped historical local state never becomes another member’s permission', async () => {
  const storage = new Map([['nf.labs.v2', JSON.stringify({ schemaVersion: 2, consent: { enabled: true, sources: { nutrition: true } }, sources: { nutrition: { available: true, updatedAt: new Date(START).toISOString(), consent: true } } })]]);
  const h = harness({ storage }); assert.equal(h.api.getState().consent.enabled, false); assert.equal(h.api.getState().sources.nutrition.available, false);
});
test('revocation cannot be undone by a stale tab or stale source snapshot', async () => {
  const first = harness(); await enable(first); await publish(first); const second = harness({ storage: first.storage });
  await second.ready(); const staleState = second.api.getState(), staleSignal = signal(second); await first.api.revokeSource('nutrition');
  assert.equal(await second.api.setState(staleState), false); assert.equal(await second.api.writeNutritionSignal(staleSignal), false);
  assert.equal(second.api.getState().consent.sources.nutrition, false);
});
test('separate devices do not pretend to have synchronized consent', async () => {
  const first = harness(); await enable(first); await publish(first); const device = harness();
  assert.equal(device.api.getState().consent.enabled, false); assert.equal(device.api.getState().sources.nutrition.available, false);
});
test('failed durable writes never return a successful receipt', async () => {
  const h = harness(); await enable(h); h.breakStorage(); assert.equal(await publish(h), false);
});
test('sharing does not write domain records or invoke a domain engine', async () => {
  const h = harness(); h.storage.set('nutrition.targets', '{"calories":2100}'); h.storage.set('strength.history', '["untouched"]');
  await enable(h); await publish(h); await h.api.revokeSource('nutrition');
  assert.equal(h.storage.get('nutrition.targets'), '{"calories":2100}'); assert.equal(h.storage.get('strength.history'), '["untouched"]');
});
test('source expiry and field allowlists are independent for readiness and Reality Types', async () => {
  const h = harness(); await enable(h, 'readiness'); await enable(h, 'dlter');
  const readiness = await h.api.writeReadinessSignal(signal(h, { payload: { colorTag: 'red', sleepBucket: 'low', stressBucket: 'high' } }));
  assert.equal(readiness.payload.sleepBucket, 'low');
  const dlter = await h.api.writeDLTERSignal(signal(h, { payload: { typeTag: 'structured-empathic-lens' } }));
  assert.equal(dlter.payload.typeTag, 'structured-empathic-lens');
  assert.equal(await h.api.writeDLTERSignal(signal(h, { payload: { phaseTag: 'cutting' } })), false);
});
test('cross-tab mutations wait for the shared lock; a queued stop wins over publication', async () => {
  const locks = lockManager(), first = harness({ locks }); await enable(first); await publish(first);
  const second = harness({ locks, storage: first.storage }); await second.ready();
  const before = first.storage.get('nf.labs.v2');
  let release, acquired;
  const entered = new Promise(resolve => { acquired = resolve; });
  const held = locks.request('nf.labs.v2', { mode: 'exclusive' }, () => { acquired(); return new Promise(resolve => { release = resolve; }); });
  await entered;
  const pendingWrite = publish(first, { payload: { phaseTag: 'maintenance' } });
  const pendingStop = second.api.revokeSource('nutrition');
  const unchanged = first.storage.get('nf.labs.v2') === before;
  release(); await held; await pendingWrite; await pendingStop;
  assert.equal(unchanged, true, 'no shared write happens outside the lock');
  assert.equal(first.api.getState().consent.sources.nutrition, false);
});
test('explicit reconnect clears only that permission and never restores the old payload', async () => {
  const h = harness(); await enable(h); await enable(h, 'readiness'); await publish(h);
  await h.api.writeReadinessSignal(signal(h, { payload: { colorTag: 'green' } }));
  await h.api.revokeSource('nutrition'); await enable(h);
  const s = h.api.getState();
  assert.equal(s.consent.sources.nutrition, true); assert.equal(s.sources.nutrition.available, false);
  assert.equal(s.sources.readiness.available, true);
  assert.ok(await publish(h));
});
test('failed stop suppresses reads and survives this tab reloading until cleanup can finish', async () => {
  const h = harness(); await enable(h); await publish(h); h.failWrites();
  assert.equal(await h.api.revokeSource('nutrition'), false);
  assert.equal(h.api.getState().sources.nutrition.available, false);
  const reload = harness({ storage: h.storage, session: h.session }); await reload.ready();
  assert.equal(reload.api.getState().consent.enabled, false);
  assert.equal(JSON.stringify(reload.api.getState()).includes('cutting'), false);
});
test('quota failure removes shared data durably when deletion remains available', async () => {
  const h = harness(); await enable(h); await publish(h); h.failWrites(true, false);
  await h.api.revokeSource('nutrition');
  const reload = harness({ storage: h.storage }); await reload.ready();
  assert.equal(reload.api.getState().consent.enabled, false);
});
test('failed logout cleanup cannot revive old context on same-account reauthentication', async () => {
  const h = harness(); await enable(h); await publish(h); h.failWrites();
  await h.auth({ status: 'logged-out', settled: true, member: null, revision: 2 });
  h.failWrites(false);
  await h.auth({ status: 'logged-in', settled: true, member: { id: 'member-a' }, revision: 3 });
  assert.equal(h.api.getState().consent.enabled, false);
  assert.equal(h.api.getState().sources.nutrition.available, false);
});
test('an unsupported cross-tab lock implementation fails closed', async () => {
  const h = harness({ noLocks: true });
  assert.equal(await enable(h), false);
  assert.equal(h.api.getState().consent.enabled, false);
});
test('an unknown-only payload cannot create usable context', async () => {
  const h = harness(); await enable(h);
  assert.equal(await publish(h, { payload: { phaseTag: 'unknown' } }), false);
});
test('cleanup and reconnect cannot reuse a token from an earlier storage generation', async () => {
  const h = harness(); await enable(h); const stale = signal(h);
  h.failWrites(true, false); await h.api.revokeSource('nutrition'); h.failWrites(false);
  const reload = harness({ storage: h.storage }); await enable(reload);
  assert.equal(reload.api.getState().revision, stale.revision, 'regression fixture revisits the same numeric revision');
  assert.equal(await reload.api.writeNutritionSignal(stale), false);
});
