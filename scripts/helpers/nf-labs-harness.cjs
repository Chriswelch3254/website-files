'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function lockManager() {
  let tail = Promise.resolve();
  return { request(name, options, fn) {
    const task = tail.then(() => fn({ name, mode: options.mode }));
    tail = task.catch(() => {});
    return task;
  } };
}
const mirror = fs.readFileSync(path.join(__dirname, '../../on page embeds/Sitewide Code.txt'), 'utf8');
const source = process.env.NF_LABS_SOURCE ? fs.readFileSync(process.env.NF_LABS_SOURCE, 'utf8') : [...mirror.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('KEY="nf.labs.v2"'));
assert.ok(source, 'canonical embedded bridge exists');
const START = Date.parse('2026-09-29T16:00:00.000Z');
function harness(options = {}) {
  let now = START;
  let snapshot = { status: 'logged-in', settled: true, member: { id: 'member-a' }, revision: 1 };
  if (options.auth) snapshot = options.auth;
  const listeners = {}, subscribers = [], events = [];
  const storage = options.storage || new Map();
  let broken = false, writesBroken = false, deletesBroken = false;
  const session = options.session || new Map();
  const locks = options.locks || lockManager();
  const localStorage = {
    getItem: key => { if (broken) throw Error('storage unavailable'); return storage.get(key) || null; },
    setItem: (key, value) => { if (broken || writesBroken) throw Error('storage unavailable'); storage.set(key, String(value)); },
    removeItem: key => { if (broken || deletesBroken) throw Error('storage unavailable'); storage.delete(key); }
  };
  const auth = { getSnapshot: () => snapshot, subscribe(fn) { subscribers.push(fn); fn(snapshot); return () => {}; } };
  const window = { crypto: require('node:crypto').webcrypto, navigator: options.noLocks ? {} : { locks }, sessionStorage: { getItem: k => session.get(k) || null, setItem: (k,v) => session.set(k,String(v)), removeItem: k => session.delete(k) }, neuform: { auth }, addEventListener(name, fn) { (listeners[name] ||= []).push(fn); }, dispatchEvent(event) { events.push(event); (listeners[event.type] || []).forEach(fn => fn(event)); }, setTimeout };
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  vm.runInNewContext(source, { window, localStorage, Date: Clock, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } }, setTimeout, clearTimeout });
  return { api: window.NF_LABS, storage, session, locks, events, ready() { return window.NF_LABS.ready ? window.NF_LABS.ready() : Promise.resolve(); }, setNow(value) { now = value; }, breakStorage() { broken = true; }, failWrites(value = true, deletes = true) { writesBroken = value; deletesBroken = value && deletes; }, auth(next) { snapshot = { ...snapshot, ...next }; subscribers.forEach(fn => fn(snapshot)); return window.NF_LABS.ready ? window.NF_LABS.ready() : Promise.resolve(); }, storageEvent() { window.dispatchEvent({ type: 'storage', key: 'nf.labs.v2' }); } };
}

module.exports = { harness, START, lockManager };
