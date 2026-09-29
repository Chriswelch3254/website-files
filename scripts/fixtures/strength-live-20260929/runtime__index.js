"use strict";

var contracts = require("../contracts/contracts");

var LB_PER_KG = 2.2046226218;
var KG_PER_LB = 1 / LB_PER_KG;
var BLOCKED_EXACT_KEYS = [
  "load",
  "loadKg",
  "loadLb",
  "reps",
  "rpe",
  "rir",
  "estimate",
  "estimateKg",
  "trainingMax",
  "trainingMaxKg",
  "bodyweight",
  "bodyweightKg",
  "age",
  "score",
  "points",
  "percentile",
  "attempt",
  "workingRange",
  "date",
  "performedOn",
  "createdAt",
  "updatedAt",
  "notes",
  "setup",
  "setupDetails",
  "equipment",
  "equipmentDetails",
  "observationId",
  "sessionId",
  "decisionId",
  "receiptId",
  "outcomeId",
  "target",
  "targetLoad",
  "range",
  "acceptableRange",
  "restDuration",
  "restSeconds",
  "sessionOutcome",
  "name",
  "email",
  "memberId",
  "paymentId",
  "priceId"
];
var SAFE_COUNT_KEYS = {
  activeProfiles: true,
  customProfiles: true,
  setupProfiles: true,
  equipmentProfiles: true,
  resourceCount: true
};

function own(obj, key) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function isPlainObject(value) {
  return !!value && Object.prototype.toString.call(value) === "[object Object]";
}

function clone(value) {
  if (value == null || typeof value !== "object") return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    if (Array.isArray(value)) return value.slice();
    var out = {};
    Object.keys(value).forEach(function(key) {
      out[key] = value[key];
    });
    return out;
  }
}

function merge(base, patch) {
  var out = clone(base) || {};
  if (!isPlainObject(patch)) return out;
  Object.keys(patch).forEach(function(key) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") return;
    if (isPlainObject(out[key]) && isPlainObject(patch[key])) out[key] = merge(out[key], patch[key]);
    else out[key] = clone(patch[key]);
  });
  return out;
}

function asArray(value) {
  return Array.isArray(value) ? value : (value == null ? [] : [value]);
}

function trim(value, max) {
  var s = value == null ? "" : String(value);
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return "";
  return max && s.length > max ? s.slice(0, max) : s;
}

function toNumber(value, fallback) {
  if (typeof value === "number") return isFinite(value) ? value : fallback;
  if (value == null || value === "") return fallback;
  var n = Number(String(value).replace(/,/g, "").trim());
  return isFinite(n) ? n : fallback;
}

function toInteger(value, fallback) {
  var n = toNumber(value, fallback);
  return isFinite(n) ? Math.round(n) : fallback;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function validDateOnly(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) return false;
  var parts = String(value).split("-").map(Number);
  var d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.getFullYear() === parts[0] && d.getMonth() === parts[1] - 1 && d.getDate() === parts[2];
}

function dateOnly(value) {
  if (!value) return "";
  var direct = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (direct && validDateOnly(direct[0])) return direct[0];
  var t = Date.parse(String(value));
  if (!isFinite(t)) return "";
  var d = new Date(t);
  var out = d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  return validDateOnly(out) ? out : "";
}

function safeISO(value) {
  if (!value) return null;
  var t = Date.parse(String(value));
  if (!isFinite(t)) return null;
  return new Date(t).toISOString();
}

function todayLocal(now) {
  var d = now ? new Date(now) : new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

function createClock(fixedIso) {
  var fixed = fixedIso ? safeISO(fixedIso) : null;
  return {
    now: function() {
      return fixed || new Date().toISOString();
    },
    today: function() {
      return todayLocal(fixed || undefined);
    }
  };
}

function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (!isPlainObject(value)) return value;
  var out = {};
  Object.keys(value).sort().forEach(function(key) {
    out[key] = ordered(value[key]);
  });
  return out;
}

function stableStringify(value) {
  try {
    return JSON.stringify(ordered(value));
  } catch (_) {
    return String(value || "");
  }
}

function hashString(input) {
  var s = String(input || "");
  var h = 2166136261;
  for (var i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ("00000000" + (h >>> 0).toString(16)).slice(-8);
}

function fingerprint(value) {
  return hashString(stableStringify(value));
}

function stableId(prefix, seed) {
  return String(prefix || "id") + "_" + fingerprint(seed);
}

function kgFromDisplay(value, units) {
  var n = toNumber(value, null);
  if (!(n >= 0)) return null;
  return units === "kg" ? n : n * KG_PER_LB;
}

function displayFromKg(valueKg, units) {
  var n = toNumber(valueKg, null);
  if (!(n >= 0)) return null;
  return units === "kg" ? n : n * LB_PER_KG;
}

function convertLoad(value, fromUnit, toUnit) {
  var n = toNumber(value, null);
  if (n == null) return null;
  if (fromUnit === toUnit) return n;
  if (fromUnit === "lb" && toUnit === "kg") return n * KG_PER_LB;
  if (fromUnit === "kg" && toUnit === "lb") return n * LB_PER_KG;
  return null;
}

function roundToIncrement(value, increment) {
  var n = toNumber(value, null);
  var step = toNumber(increment, null);
  if (n == null || !(step > 0)) return null;
  return Math.round(n / step) * step;
}

function safeTag(value, max) {
  var s = trim(value, max || 80);
  if (!s) return "";
  if (/@/.test(s)) return "";
  if (/\b\d{4}-\d{2}-\d{2}\b/.test(s)) return "";
  if (/\b\d{5,}\b/.test(s)) return "";
  return s.replace(/[<>{}"'`\\]/g, "").trim();
}

function safeTags(value, maxItems) {
  var seen = {};
  var out = [];
  asArray(value).forEach(function(item) {
    if (out.length >= (maxItems || 12)) return;
    var tag = safeTag(item, 80);
    if (!tag || seen[tag]) return;
    seen[tag] = true;
    out.push(tag);
  });
  return out;
}

function containsExactDataKey(key) {
  if (SAFE_COUNT_KEYS[key]) return false;
  var k = String(key || "").toLowerCase();
  return BLOCKED_EXACT_KEYS.some(function(blocked) {
    var b = String(blocked).toLowerCase();
    return k === b || k.indexOf(b) !== -1;
  });
}

function bucketCount(count) {
  var n = toInteger(count, 0);
  if (n <= 0) return "0";
  if (n <= 1) return "1";
  if (n <= 3) return "2_to_3";
  if (n <= 10) return "4_to_10";
  return "11_plus";
}

function sanitizeExternalPayload(payload, options) {
  options = options || {};
  var allowed = options.allowed || {};
  var rejected = [];
  var out = {};
  if (!isPlainObject(payload)) return { payload: out, rejected: rejected };
  Object.keys(payload).forEach(function(key) {
    var value = payload[key];
    if (containsExactDataKey(key)) {
      rejected.push(key);
      return;
    }
    if (allowed[key] === "tag") {
      var tag = safeTag(value, 80);
      if (tag) out[key] = tag;
      return;
    }
    if (allowed[key] === "tags") {
      out[key] = safeTags(value, 12);
      return;
    }
    if (allowed[key] === "count") {
      out[key] = bucketCount(value);
      return;
    }
    if (allowed[key] === "boolean") {
      out[key] = !!value;
      return;
    }
    rejected.push(key);
  });
  return { payload: out, rejected: rejected };
}

function normalizeError(error) {
  if (!error) return { name: "Error", message: "Unknown error" };
  return {
    name: safeTag(error.name || "Error", 80) || "Error",
    message: trim(error.message || String(error), 240),
    code: safeTag(error.code || "", 80)
  };
}

function dispatchEvent(env, name, detail) {
  env = env || {};
  var target = env.eventTarget || env.document || (typeof document !== "undefined" ? document : null);
  if (!target || typeof target.dispatchEvent !== "function") return false;
  try {
    var CustomEventCtor = env.CustomEvent || (typeof CustomEvent !== "undefined" ? CustomEvent : null);
    var event = CustomEventCtor ? new CustomEventCtor(name, { detail: detail, bubbles: true }) : { type: name, detail: detail };
    return target.dispatchEvent(event);
  } catch (_) {
    return false;
  }
}

function featureFlags(input) {
  var flags = clone(input) || {};
  return {
    enabled: function(name) {
      return flags[String(name)] === true;
    },
    set: function(name, value) {
      flags[String(name)] = value === true;
      return clone(flags);
    },
    snapshot: function() {
      return clone(flags);
    }
  };
}

function validation(ok, errors, warnings) {
  return {
    ok: !!ok,
    errors: errors || [],
    warnings: warnings || []
  };
}

module.exports = {
  LB_PER_KG: LB_PER_KG,
  KG_PER_LB: KG_PER_LB,
  own: own,
  isPlainObject: isPlainObject,
  clone: clone,
  merge: merge,
  asArray: asArray,
  trim: trim,
  toNumber: toNumber,
  toInteger: toInteger,
  validDateOnly: validDateOnly,
  dateOnly: dateOnly,
  safeISO: safeISO,
  todayLocal: todayLocal,
  createClock: createClock,
  stableStringify: stableStringify,
  fingerprint: fingerprint,
  stableId: stableId,
  kgFromDisplay: kgFromDisplay,
  displayFromKg: displayFromKg,
  convertLoad: convertLoad,
  roundToIncrement: roundToIncrement,
  safeTag: safeTag,
  safeTags: safeTags,
  containsExactDataKey: containsExactDataKey,
  bucketCount: bucketCount,
  sanitizeExternalPayload: sanitizeExternalPayload,
  normalizeError: normalizeError,
  dispatchEvent: dispatchEvent,
  featureFlags: featureFlags,
  validation: validation,
  contracts: contracts
};
