"use strict";

var runtime = require("../runtime/index");
var pass4 = require("./contracts");

function getSchema() {
  return require("../data/schema");
}

function getPass2Evidence() {
  return require("../pass2/evidence");
}

function getLoadModels() {
  return require("../lifts/loadModels");
}

function getSetups() {
  return require("../setups/setups");
}

function defaultPass4(clock) {
  var now = clock.now();
  return {
    version: "pass4.local.v1",
    createdAt: now,
    updatedAt: now,
    personalizationPolicy: defaultPersonalizationPolicy(clock),
    derivedModels: {},
    lastValidDerivedModels: {},
    modelHealth: {
      status: "unavailable",
      builtAt: null,
      inputCutoff: null,
      engineVersions: runtime.clone(pass4.ENGINE_VERSIONS),
      sourceCounts: {},
      warnings: []
    },
    rirCalibrationObservations: {},
    bestNextEvidenceDecisions: {},
    goals: {},
    plateauExperiments: {},
    bodyweightObservations: {},
    bodyweightPhases: {},
    variantLinks: {},
    recommendationAccuracyRecords: {},
    cacheInvalidations: []
  };
}

function defaultPersonalizationPolicy(clock) {
  return {
    id: "pass4_policy_default",
    schemaVersion: pass4.ENTITY_SCHEMAS.PersonalizationPolicy,
    createdAt: clock.now(),
    updatedAt: clock.now(),
    mode: "off",
    existingUserDefault: true,
    applyRequiresStatuses: ["usable", "strong"],
    previewRequiresStatuses: ["emerging", "usable", "strong"],
    reversible: true,
    reasonCodes: ["existing_users_remain_generic_until_explicit_policy_change"]
  };
}

function normalizePolicy(raw, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var base = defaultPersonalizationPolicy(clock);
  var mode = pass4.PERSONALIZATION_POLICIES.indexOf(raw.mode) >= 0 ? raw.mode : base.mode;
  return runtime.merge(base, runtime.merge(raw, {
    mode: mode,
    updatedAt: runtime.safeISO(raw.updatedAt) || base.updatedAt,
    applyRequiresStatuses: Array.isArray(raw.applyRequiresStatuses) ? raw.applyRequiresStatuses.slice() : base.applyRequiresStatuses,
    previewRequiresStatuses: Array.isArray(raw.previewRequiresStatuses) ? raw.previewRequiresStatuses.slice() : base.previewRequiresStatuses
  }));
}

function normalizePass4(raw, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var base = defaultPass4(clock);
  raw = runtime.isPlainObject(raw) ? raw : {};
  var out = runtime.merge(base, raw);
  out.personalizationPolicy = normalizePolicy(raw.personalizationPolicy, clock);
  ["derivedModels", "lastValidDerivedModels", "rirCalibrationObservations", "bestNextEvidenceDecisions", "goals", "plateauExperiments", "bodyweightObservations", "bodyweightPhases", "variantLinks", "recommendationAccuracyRecords"].forEach(function(key) {
    out[key] = runtime.isPlainObject(out[key]) ? out[key] : {};
  });
  out.cacheInvalidations = Array.isArray(out.cacheInvalidations) ? out.cacheInvalidations.slice() : [];
  out.updatedAt = runtime.safeISO(out.updatedAt) || clock.now();
  return out;
}

function ensurePass4State(state, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var normalized = getSchema().normalizeState(state, { clock: clock });
  if (!normalized.ok) return normalized;
  normalized.state.pass4 = normalizePass4(normalized.state.pass4, { clock: clock });
  return normalized;
}

function result(ok, data) {
  return runtime.merge({ ok: !!ok }, data || {});
}

function day(value) {
  return runtime.dateOnly(value || "");
}

function ageDays(value, clock) {
  var t = Date.parse(value || "");
  var now = Date.parse((clock || runtime.createClock()).now());
  if (!isFinite(t) || !isFinite(now)) return null;
  return Math.max(0, Math.floor((now - t) / 86400000));
}

function beforeCutoff(record, cutoff) {
  if (!cutoff) return true;
  var recordTime = Date.parse(record.performedAt || record.createdAt || "");
  var cutoffTime = Date.parse(cutoff);
  if (!isFinite(recordTime) || !isFinite(cutoffTime)) return true;
  return recordTime < cutoffTime;
}

function repBandFor(reps) {
  reps = runtime.toInteger(reps, null);
  for (var i = 0; i < pass4.REP_BANDS.length; i += 1) {
    var band = pass4.REP_BANDS[i];
    if (reps >= band.min && reps <= band.max) return band;
  }
  return null;
}

function activeSetupFor(state, liftProfileId, setupProfileId) {
  if (setupProfileId && state.setupProfiles && state.setupProfiles[setupProfileId]) return state.setupProfiles[setupProfileId];
  var profile = state.liftProfiles && state.liftProfiles[liftProfileId];
  return getPass2Evidence().activeSetupForProfile(state, profile);
}

function definitionFor(state, liftProfileId) {
  var profile = state.liftProfiles && state.liftProfiles[liftProfileId];
  return getPass2Evidence().definitionForProfile(state, profile);
}

function observationDateKey(observation) {
  return day(observation.performedAt || observation.createdAt || "");
}

function sourceSessionKey(record) {
  return record.sessionId || record.plannedExposureId || observationDateKey(record) || record.id;
}

function uniqueCount(list) {
  var seen = {};
  list.forEach(function(item) {
    if (item != null && item !== "") seen[item] = true;
  });
  return Object.keys(seen).length;
}

function roundPct(value) {
  var n = runtime.toNumber(value, 0);
  return Math.round(n * 10000) / 10000;
}

function roundOne(value) {
  var n = runtime.toNumber(value, null);
  return n == null ? null : Math.round(n * 10) / 10;
}

function average(values) {
  values = values.filter(function(value) { return value != null && isFinite(value); });
  if (!values.length) return null;
  return values.reduce(function(sum, value) { return sum + value; }, 0) / values.length;
}

function median(values) {
  values = values.filter(function(value) { return value != null && isFinite(value); }).sort(function(a, b) { return a - b; });
  if (!values.length) return null;
  var mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

function mad(values) {
  var med = median(values);
  if (med == null) return null;
  return median(values.map(function(value) { return Math.abs(value - med); }));
}

function clamp(value, min, max) {
  var n = runtime.toNumber(value, 0);
  return Math.max(min, Math.min(max, n));
}

function winsorize(values, pct) {
  values = values.filter(function(value) { return value != null && isFinite(value); }).sort(function(a, b) { return a - b; });
  if (!values.length) return [];
  pct = pct == null ? 0.1 : pct;
  var lo = values[Math.floor((values.length - 1) * pct)];
  var hi = values[Math.ceil((values.length - 1) * (1 - pct))];
  return values.map(function(value) { return clamp(value, lo, hi); });
}

function statusFromCounts(counts, threshold, options) {
  options = options || {};
  threshold = threshold || {};
  var observations = counts.observations || counts.sourceCount || 0;
  var sessions = counts.sessions || counts.independentSessionCount || 0;
  var dates = counts.dates || counts.independentDateCount || 0;
  if (options.conflicting) return "conflicting";
  if (options.stale) return "stale";
  if (threshold.strong && observations >= threshold.strong.observations && sessions >= threshold.strong.sessions && dates >= threshold.strong.dates && (!threshold.strong.repBands || counts.repBands >= threshold.strong.repBands)) return "strong";
  if (threshold.usable && observations >= threshold.usable.observations && sessions >= threshold.usable.sessions && dates >= threshold.usable.dates && (!threshold.usable.repBands || counts.repBands >= threshold.usable.repBands)) return "usable";
  if (threshold.emerging && observations >= threshold.emerging.observations && sessions >= threshold.emerging.sessions && dates >= threshold.emerging.dates) return "emerging";
  return "unavailable";
}

function eligibilityReasonCopy(code) {
  var copy = {};
  copy[pass4.EXCLUSION_CODES.safetyStopped] = "Safety-stopped records are excluded.";
  copy[pass4.EXCLUSION_CODES.painOrInstability] = "Pain or instability outcomes are excluded.";
  copy[pass4.EXCLUSION_CODES.techniqueBelowThreshold] = "Technique quality was below the accepted threshold.";
  copy[pass4.EXCLUSION_CODES.incompatibleSetup] = "The setup is incompatible with the requested setup.";
  copy[pass4.EXCLUSION_CODES.reviewRequiredSetup] = "The setup requires review before pooling.";
  copy[pass4.EXCLUSION_CODES.differentEquipment] = "The equipment fingerprint differs.";
  copy[pass4.EXCLUSION_CODES.travelExcluded] = "Temporary travel evidence is excluded by default.";
  copy[pass4.EXCLUSION_CODES.archivedOrInvalidated] = "The record is archived or invalidated.";
  copy[pass4.EXCLUSION_CODES.unsupportedLoadModel] = "The load model does not support this model.";
  copy[pass4.EXCLUSION_CODES.unresolvedImport] = "Imported evidence needs resolution before learning.";
  copy[pass4.EXCLUSION_CODES.missingEffort] = "The model requires effort or outcome data.";
  copy[pass4.EXCLUSION_CODES.duplicateOrReplay] = "Duplicate or replay artifacts are excluded.";
  copy[pass4.EXCLUSION_CODES.afterCutoff] = "The record is after the model input cutoff.";
  copy[pass4.EXCLUSION_CODES.outsideRepRange] = "The repetition range is unsupported for this model.";
  copy[pass4.EXCLUSION_CODES.missingOutcome] = "The model requires a completed outcome.";
  return copy[code] || "The record is outside the documented model scope.";
}

function filterCompatibleObservations(state, query) {
  query = query || {};
  var clock = query.clock || runtime.createClock(query.fixedNow);
  var cutoff = query.inputCutoff || clock.now();
  var liftProfileId = runtime.safeTag(query.liftProfileId || state.settings && state.settings.activeLiftProfileId || "", 120);
  var targetSetup = activeSetupFor(state, liftProfileId, query.setupProfileId);
  var definition = definitionFor(state, liftProfileId);
  var adapter = getLoadModels().getAdapter(definition && definition.loadingModel);
  var included = [];
  var excluded = [];
  var seen = {};
  getPass2Evidence().observationList(state, { liftProfileId: liftProfileId }).forEach(function(observation) {
    function exclude(code) {
      excluded.push({
        id: observation.id,
        sourceId: observation.id,
        performedAt: observation.performedAt || observation.createdAt || "",
        reason: code,
        explanation: eligibilityReasonCopy(code)
      });
    }
    if (seen[observation.id]) return exclude(pass4.EXCLUSION_CODES.duplicateOrReplay);
    seen[observation.id] = true;
    if (!beforeCutoff(observation, cutoff)) return exclude(pass4.EXCLUSION_CODES.afterCutoff);
    if (observation.status && observation.status !== "active") return exclude(pass4.EXCLUSION_CODES.archivedOrInvalidated);
    if (observation.resultType === "safety_stopped" || observation.status === "safety_stopped") return exclude(pass4.EXCLUSION_CODES.safetyStopped);
    if (observation.painOrInstability === true || observation.resultType === "pain_or_instability") return exclude(pass4.EXCLUSION_CODES.painOrInstability);
    if (observation.techniqueQuality === "poor" || observation.techniqueQuality === "limited" && query.acceptLimitedTechnique !== true) return exclude(pass4.EXCLUSION_CODES.techniqueBelowThreshold);
    if (observation.resultType === "imported_result" && observation.importResolved !== true && query.allowUnresolvedImports !== true) return exclude(pass4.EXCLUSION_CODES.unresolvedImport);
    if ((observation.trainingContext === "travel" || observation.temporaryTravel === true) && query.includeTravelEvidence !== true) return exclude(pass4.EXCLUSION_CODES.travelExcluded);
    if (!observation.effortMethod && query.requiresEffort !== false) return exclude(pass4.EXCLUSION_CODES.missingEffort);
    if (query.repRangeMax && observation.repetitions > query.repRangeMax) return exclude(pass4.EXCLUSION_CODES.outsideRepRange);
    if (query.repRangeMin && observation.repetitions < query.repRangeMin) return exclude(pass4.EXCLUSION_CODES.outsideRepRange);
    if (targetSetup && observation.setupProfileId && state.setupProfiles && state.setupProfiles[observation.setupProfileId]) {
      var comparison = getSetups().compareSetups(state.setupProfiles[observation.setupProfileId], targetSetup);
      if (comparison.status === "incompatible") return exclude(pass4.EXCLUSION_CODES.incompatibleSetup);
      if (comparison.status === "review_required" && query.includeReviewRequired !== true) return exclude(pass4.EXCLUSION_CODES.reviewRequiredSetup);
    } else if (query.requiresSetup !== false) {
      return exclude(pass4.EXCLUSION_CODES.reviewRequiredSetup);
    }
    if (query.equipmentProfileId && targetSetup && state.setupProfiles[observation.setupProfileId] && state.setupProfiles[observation.setupProfileId].equipmentProfileId && state.setupProfiles[observation.setupProfileId].equipmentProfileId !== query.equipmentProfileId) return exclude(pass4.EXCLUSION_CODES.differentEquipment);
    var load = adapter.estimateEligibleLoad(observation.storedLoad || {});
    if (query.requiresEstimateEligible !== false && (!load.supported || !(load.loadKg > 0))) return exclude(pass4.EXCLUSION_CODES.unsupportedLoadModel);
    included.push({
      id: observation.id,
      sourceId: observation.id,
      sourceType: "evidence_observation",
      observation: observation,
      performedAt: observation.performedAt || observation.createdAt || "",
      date: observationDateKey(observation),
      sessionKey: sourceSessionKey(observation),
      liftProfileId: observation.liftProfileId,
      setupProfileId: observation.setupProfileId,
      equipmentProfileId: state.setupProfiles && state.setupProfiles[observation.setupProfileId] && state.setupProfiles[observation.setupProfileId].equipmentProfileId || null,
      reps: observation.repetitions,
      rir: runtime.toNumber(observation.rir, null),
      rpe: runtime.toNumber(observation.rpe, null),
      effortMethod: observation.effortMethod || "",
      techniqueQuality: observation.techniqueQuality || "unknown",
      resultType: observation.resultType || "completed_gym_set",
      loadKg: load.supported ? load.loadKg : null,
      ageDays: ageDays(observation.performedAt || observation.createdAt, clock),
      repBand: repBandFor(observation.repetitions),
      storedLoad: runtime.clone(observation.storedLoad || {}),
      setupFingerprint: observation.setupFingerprint || ""
    });
  });
  var dates = included.map(function(item) { return item.date; });
  var sessions = included.map(function(item) { return item.sessionKey; });
  var bands = included.map(function(item) { return item.repBand && item.repBand.id; }).filter(Boolean);
  return {
    schemaVersion: pass4.ENTITY_SCHEMAS.LearningEligibilityResult,
    engineVersion: "learning-eligibility.v1",
    liftProfileId: liftProfileId,
    setupProfileId: targetSetup && targetSetup.id || null,
    inputCutoff: cutoff,
    included: included,
    excluded: excluded,
    sourceCount: included.length,
    independentSessionCount: uniqueCount(sessions),
    independentDateCount: uniqueCount(dates),
    repBandCount: uniqueCount(bands),
    dateRange: dateRange(dates),
    setupScope: targetSetup ? "setup:" + targetSetup.id : "no_setup_scope",
    equipmentScope: targetSetup && targetSetup.equipmentProfileId ? "equipment:" + targetSetup.equipmentProfileId : "no_equipment_scope",
    reasonCodes: excluded.map(function(item) { return item.reason; }).filter(function(code, index, all) { return all.indexOf(code) === index; })
  };
}

function dateRange(dates) {
  dates = dates.filter(Boolean).sort();
  return { first: dates[0] || null, last: dates[dates.length - 1] || null };
}

function modelMetadata(engineVersion, eligibility, clock, extra) {
  extra = extra || {};
  return runtime.merge({
    engineVersion: engineVersion,
    builtAt: clock.now(),
    inputCutoff: eligibility && eligibility.inputCutoff || clock.now(),
    sourceIds: eligibility ? eligibility.included.map(function(item) { return item.sourceId; }) : [],
    sourceCount: eligibility ? eligibility.sourceCount : 0,
    independentSessionCount: eligibility ? eligibility.independentSessionCount : 0,
    independentDateCount: eligibility ? eligibility.independentDateCount : 0,
    dateRange: eligibility ? eligibility.dateRange : { first: null, last: null },
    setupScope: eligibility ? eligibility.setupScope : "",
    equipmentScope: eligibility ? eligibility.equipmentScope : "",
    excludedCount: eligibility ? eligibility.excluded.length : 0,
    exclusions: eligibility ? eligibility.excluded.map(function(item) { return { sourceId: item.sourceId, reason: item.reason }; }) : []
  }, extra);
}

function invalidateFor(state, reason, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var normalized = ensurePass4State(state, { clock: clock });
  if (!normalized.ok) return normalized;
  normalized.state.pass4.cacheInvalidations.push({
    id: runtime.stableId("pass4_invalidation", { reason: reason, now: clock.now(), count: normalized.state.pass4.cacheInvalidations.length }),
    createdAt: clock.now(),
    reasonCode: runtime.safeTag(reason || "model_input_changed", 80) || "model_input_changed"
  });
  normalized.state.pass4.updatedAt = clock.now();
  return result(true, { state: normalized.state });
}

function cacheHealth(state, clock, inputCutoff) {
  var pass = state.pass4 || {};
  return {
    status: "ready",
    builtAt: clock.now(),
    inputCutoff: inputCutoff || clock.now(),
    engineVersions: runtime.clone(pass4.ENGINE_VERSIONS),
    sourceCounts: {
      evidenceObservations: Object.keys(state.evidenceObservations || {}).length,
      sessions: Object.keys(state.sessions || {}).length,
      outcomes: Object.keys(state.outcomes || {}).length,
      goals: Object.keys(pass.goals || {}).length,
      bodyweightObservations: Object.keys(pass.bodyweightObservations || {}).length,
      rirCalibrationObservations: Object.keys(pass.rirCalibrationObservations || {}).length
    },
    warnings: []
  };
}

function writeDerivedModels(state, models, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var normalized = ensurePass4State(state, { clock: clock });
  if (!normalized.ok) return normalized;
  var next = normalized.state;
  try {
    next.pass4.derivedModels = runtime.clone(models || {});
    next.pass4.lastValidDerivedModels = runtime.clone(models || {});
    next.pass4.modelHealth = cacheHealth(next, clock, options.inputCutoff);
    next.pass4.updatedAt = clock.now();
    return result(true, { state: next, models: next.pass4.derivedModels, modelHealth: next.pass4.modelHealth });
  } catch (error) {
    next.pass4.derivedModels = runtime.clone(next.pass4.lastValidDerivedModels || {});
    next.pass4.modelHealth = runtime.merge(cacheHealth(next, clock, options.inputCutoff), {
      status: "stale",
      warnings: ["rebuild_failed_last_valid_preserved"],
      error: runtime.normalizeError(error)
    });
    return result(false, { state: next, reason: "pass4_rebuild_failed", error: runtime.normalizeError(error) });
  }
}

function privacySafeHealth(state, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var normalized = ensurePass4State(state, { clock: clock });
  if (!normalized.ok) return normalized;
  var health = normalized.state.pass4.modelHealth || {};
  return {
    generatedAt: clock.now(),
    status: health.status || "unavailable",
    engineVersions: runtime.clone(pass4.ENGINE_VERSIONS),
    sourceCounts: health.sourceCounts || {},
    warningCount: (health.warnings || []).length,
    warnings: (health.warnings || []).slice(0, 12),
    privacy: "Counts and statuses only. Exact loads, reps, bodyweight, dates, notes, model values, and IDs are not exported."
  };
}

module.exports = {
  defaultPass4: defaultPass4,
  defaultPersonalizationPolicy: defaultPersonalizationPolicy,
  normalizePolicy: normalizePolicy,
  normalizePass4: normalizePass4,
  ensurePass4State: ensurePass4State,
  result: result,
  day: day,
  ageDays: ageDays,
  beforeCutoff: beforeCutoff,
  repBandFor: repBandFor,
  definitionFor: definitionFor,
  activeSetupFor: activeSetupFor,
  observationDateKey: observationDateKey,
  sourceSessionKey: sourceSessionKey,
  uniqueCount: uniqueCount,
  roundPct: roundPct,
  roundOne: roundOne,
  average: average,
  median: median,
  mad: mad,
  winsorize: winsorize,
  clamp: clamp,
  statusFromCounts: statusFromCounts,
  eligibilityReasonCopy: eligibilityReasonCopy,
  filterCompatibleObservations: filterCompatibleObservations,
  dateRange: dateRange,
  modelMetadata: modelMetadata,
  invalidateFor: invalidateFor,
  writeDerivedModels: writeDerivedModels,
  privacySafeHealth: privacySafeHealth
};
