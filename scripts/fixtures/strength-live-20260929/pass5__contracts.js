"use strict";

var runtime = require("../runtime/index");

var PASS5_VERSION = "pass5.local.v1";

var ENGINE_VERSIONS = Object.freeze({
  benchmarkEtl: "benchmark-etl.v1",
  benchmarkAssetSchema: "benchmark-asset-schema.v1",
  benchmarkEligibility: "benchmark-eligibility.v1",
  benchmarkCohort: "benchmark-cohort.v1",
  benchmarkPercentile: "benchmark-percentile.v1",
  benchmarkConfidence: "benchmark-confidence.v1",
  benchmarkWidening: "benchmark-widening.v1",
  benchmarkNextMarker: "benchmark-next-marker.v1",
  benchmarkSnapshot: "benchmark-snapshot.v1",
  benchmarkTrend: "benchmark-trend.v1",
  relativeStrength: "relative-strength.v1",
  dots: "dots.v1",
  wilksOriginal: "wilks-original.v1",
  wilks2020: "wilks-2020.v1",
  ipfGl2020: "ipf-gl-2020.v1",
  mcculloch: "mcculloch.v1",
  gamx: "gamx.v1",
  robi: "robi.v1",
  powerliftingMeetMode: "powerlifting-meet-mode.v1",
  powerliftingAttemptPlan: "powerlifting-attempt-plan.v1",
  powerliftingLiveAttempt: "powerlifting-live-attempt.v1",
  powerliftingMeetWarmup: "powerlifting-meet-warmup.v1",
  calisthenicsMode: "calisthenics-mode.v1",
  homeGymMachineMode: "home-gym-machine-mode.v1",
  weightliftingMode: "weightlifting-mode.v1",
  unilateralComparison: "unilateral-comparison.v1"
});

var ENTITY_SCHEMAS = Object.freeze({
  ComparisonProfile: "comparison-profile.schema.v1",
  ComparisonPreference: "comparison-preference.schema.v1",
  ComparisonProfileRevision: "comparison-profile-revision.schema.v1",
  BenchmarkSourceManifest: "benchmark-source-manifest.schema.v1",
  BenchmarkAssetManifest: "benchmark-asset-manifest.schema.v1",
  BenchmarkDataDictionary: "benchmark-data-dictionary.schema.v1",
  BenchmarkMethodology: "benchmark-methodology.schema.v1",
  BenchmarkCohortDefinition: "benchmark-cohort-definition.schema.v1",
  BenchmarkCohortKey: "benchmark-cohort-key.schema.v1",
  BenchmarkEligibility: "benchmark-eligibility.schema.v1",
  BenchmarkQuery: "benchmark-query.schema.v1",
  BenchmarkQueryReceipt: "benchmark-query-receipt.schema.v1",
  BenchmarkAtomicCell: "benchmark-atomic-cell.schema.v1",
  BenchmarkDistribution: "benchmark-distribution.schema.v1",
  BenchmarkResult: "benchmark-result.schema.v1",
  PercentileRange: "percentile-range.schema.v1",
  BenchmarkConfidence: "benchmark-confidence.schema.v1",
  CohortWideningStep: "cohort-widening-step.schema.v1",
  NextPercentileMarker: "next-percentile-marker.schema.v1",
  BenchmarkSnapshot: "benchmark-snapshot.schema.v1",
  BenchmarkTrendSeries: "benchmark-trend-series.schema.v1",
  BenchmarkSourceRebase: "benchmark-source-rebase.schema.v1",
  RelativeStrengthResult: "relative-strength-result.schema.v1",
  ScoringFormulaDefinition: "scoring-formula-definition.schema.v1",
  ScoringFormulaSource: "scoring-formula-source.schema.v1",
  ScoringResult: "scoring-result.schema.v1",
  SportModeProfile: "sport-mode-profile.schema.v1",
  PowerliftingCompetitionProfile: "powerlifting-competition-profile.schema.v1",
  PowerliftingMeetPlan: "powerlifting-meet-plan.schema.v1",
  PowerliftingAttemptPlan: "powerlifting-attempt-plan.schema.v1",
  PowerliftingAttemptResult: "powerlifting-attempt-result.schema.v1",
  PowerliftingMeetWarmupPlan: "powerlifting-meet-warmup-plan.schema.v1",
  PowerliftingMeetDecisionReceipt: "powerlifting-meet-decision-receipt.schema.v1",
  CalisthenicsProfile: "calisthenics-profile.schema.v1",
  WeightliftingProfile: "weightlifting-profile.schema.v1",
  WeightliftingAttemptBoard: "weightlifting-attempt-board.schema.v1",
  WeightliftingCategoryTable: "weightlifting-category-table.schema.v1",
  HomeGymMachineModeProfile: "home-gym-machine-mode-profile.schema.v1",
  UnilateralComparisonResult: "unilateral-comparison-result.schema.v1",
  AdvancedModeReceipt: "advanced-mode-receipt.schema.v1"
});

var RESULT_TYPES = Object.freeze([
  "verified_competition_result",
  "estimated_strength_range",
  "completed_gym_set",
  "historical_manual"
]);

var SEX_CATEGORIES = Object.freeze(["M", "F", "Mx"]);
var TESTED_SCOPES = Object.freeze(["all_recorded", "tested_category"]);
var EVENT_TYPES = Object.freeze(["full_power", "bench_only", "squat_only", "deadlift_only"]);
var EQUIPMENT_TYPES = Object.freeze(["Raw", "Wraps", "Single-ply", "Multi-ply"]);
var AGE_BANDS = Object.freeze(["youth", "teen_junior", "open", "masters_35_plus", "unknown_age"]);
var LIFTS = Object.freeze(["total", "squat", "bench", "deadlift"]);

var ELIGIBILITY_STATUSES = Object.freeze([
  "eligible",
  "missing_profile_field",
  "unsupported_lift",
  "personal_only",
  "stale_bodyweight",
  "estimated_range_allowed",
  "verified_result_allowed",
  "asset_missing",
  "asset_corrupt",
  "asset_stale",
  "insufficient_sample"
]);

var SAMPLE_THRESHOLDS = Object.freeze({
  strong: 100,
  usable: 40,
  limited: 20,
  minimum: 20
});

var PASS5_FEATURES = Object.freeze([
  "local_comparison_profile",
  "source_backed_benchmark_assets",
  "percentile_ranges",
  "next_percentile_marker",
  "benchmark_snapshots",
  "source_rebase",
  "relative_strength_formulas",
  "powerlifting_mode",
  "calisthenics_mode",
  "home_gym_machine_mode",
  "weightlifting_mode",
  "unilateral_comparison"
]);

var NON_GOALS = Object.freeze([
  "live_community_benchmark_aggregation",
  "user_result_upload",
  "public_rankings",
  "coach_dashboard",
  "account_backup_or_sync",
  "strength_passport_sharing",
  "automatic_training_plan_handoff",
  "nutrition_lab_or_dlter_change",
  "memberstack_or_stripe_change",
  "camera_velocity_or_video_analysis",
  "full_workout_programming",
  "injury_prediction_or_diagnosis",
  "composite_strength_score",
  "height_based_percentile",
  "training_experience_percentile",
  "universal_machine_conversion",
  "universal_lift_variant_conversion"
]);

var EVENT_NAMES = Object.freeze({
  profileChanged: "nf_strength_lab_v3_pass5_profile_changed",
  assetLoaded: "nf_strength_lab_v3_pass5_asset_loaded",
  benchmarkCalculated: "nf_strength_lab_v3_pass5_benchmark_calculated",
  benchmarkWithheld: "nf_strength_lab_v3_pass5_benchmark_withheld",
  snapshotCreated: "nf_strength_lab_v3_pass5_snapshot_created",
  rebasePreviewed: "nf_strength_lab_v3_pass5_rebase_previewed",
  rebaseApplied: "nf_strength_lab_v3_pass5_rebase_applied",
  modeCreated: "nf_strength_lab_v3_pass5_mode_created",
  attemptChanged: "nf_strength_lab_v3_pass5_attempt_changed",
  scopedReset: "nf_strength_lab_v3_pass5_scoped_reset",
  assetCacheReset: "nf_strength_lab_v3_pass5_asset_cache_reset"
});

function defaultPass5(clock) {
  var now = clock.now();
  return {
    version: PASS5_VERSION,
    createdAt: now,
    updatedAt: now,
    comparisonProfile: null,
    comparisonProfileRevisions: {},
    comparisonPreferences: {
      testedScope: "all_recorded",
      sourcePreference: "openpowerlifting_current_era",
      resultTypePreference: "show_verified_and_estimated_separately",
      heightUsed: false,
      trainingExperienceUsed: false
    },
    benchmarkSnapshots: {},
    benchmarkTrends: {},
    benchmarkRebases: {},
    benchmarkQueries: {},
    assetCache: {
      status: "empty",
      activeAssetVersion: null,
      loadedAt: null,
      lastError: "",
      corruptAssetClearedAt: null
    },
    sportModes: {
      powerlifting: {},
      calisthenics: {},
      homeGymMachine: {},
      weightlifting: {},
      unilateral: {}
    },
    relativeScoringHistory: {},
    events: [],
    scopedResetLog: [],
    unknownFuturePass5: {}
  };
}

function objectOrEmpty(value) {
  return runtime.isPlainObject(value) ? value : {};
}

function normalizePreference(raw) {
  raw = objectOrEmpty(raw);
  return {
    testedScope: TESTED_SCOPES.indexOf(raw.testedScope) >= 0 ? raw.testedScope : "all_recorded",
    sourcePreference: runtime.safeTag(raw.sourcePreference || "openpowerlifting_current_era", 120) || "openpowerlifting_current_era",
    resultTypePreference: runtime.safeTag(raw.resultTypePreference || "show_verified_and_estimated_separately", 120) || "show_verified_and_estimated_separately",
    heightUsed: false,
    trainingExperienceUsed: false
  };
}

function normalizePass5(raw, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var base = defaultPass5(clock);
  raw = objectOrEmpty(raw);
  var out = runtime.merge(base, raw);
  out.version = PASS5_VERSION;
  out.updatedAt = runtime.safeISO(out.updatedAt) || clock.now();
  out.comparisonPreferences = normalizePreference(raw.comparisonPreferences);
  [
    "comparisonProfileRevisions",
    "benchmarkSnapshots",
    "benchmarkTrends",
    "benchmarkRebases",
    "benchmarkQueries",
    "relativeScoringHistory"
  ].forEach(function(key) {
    out[key] = objectOrEmpty(out[key]);
  });
  out.sportModes = runtime.merge(base.sportModes, objectOrEmpty(raw.sportModes));
  out.assetCache = runtime.merge(base.assetCache, objectOrEmpty(raw.assetCache));
  out.events = Array.isArray(raw.events) ? raw.events.slice() : [];
  out.scopedResetLog = Array.isArray(raw.scopedResetLog) ? raw.scopedResetLog.slice() : [];
  out.unknownFuturePass5 = objectOrEmpty(raw.unknownFuturePass5);
  return out;
}

function pass5Event(type, detail, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  return {
    id: runtime.stableId("pass5_event", { type: type, detail: detail, at: clock.now() }),
    at: clock.now(),
    type: EVENT_NAMES[type] || type,
    detail: sanitizeEventDetail(detail || {})
  };
}

function sanitizeEventDetail(detail) {
  var allowed = {
    capabilityId: "tag",
    status: "tag",
    reason: "tag",
    reasonCodes: "tags",
    sourceVersion: "tag",
    assetVersion: "tag",
    mode: "tag",
    count: "count",
    sampleSize: "count"
  };
  return runtime.sanitizeExternalPayload(detail, { allowed: allowed }).payload;
}

function appendPass5Event(state, type, detail, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var next = runtime.clone(state || {});
  next.pass5 = normalizePass5(next.pass5, { clock: clock });
  next.pass5.events.push(pass5Event(type, detail, { clock: clock }));
  next.pass5.updatedAt = clock.now();
  return { ok: true, state: next };
}

function scopedReset(state, scope, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var next = runtime.clone(state || {});
  next.pass5 = normalizePass5(next.pass5, { clock: clock });
  var pass5 = next.pass5;
  var resetScope = runtime.safeTag(scope || "asset_cache", 80) || "asset_cache";
  if (resetScope === "comparison") {
    pass5.comparisonProfile = null;
    pass5.comparisonProfileRevisions = {};
    pass5.benchmarkQueries = {};
  } else if (resetScope === "asset_cache") {
    pass5.assetCache = runtime.merge(defaultPass5(clock).assetCache, {
      status: "empty",
      corruptAssetClearedAt: clock.now()
    });
  } else if (resetScope === "powerlifting" || resetScope === "calisthenics" || resetScope === "homeGymMachine" || resetScope === "weightlifting" || resetScope === "unilateral") {
    pass5.sportModes[resetScope] = {};
  } else if (resetScope === "all_pass5") {
    next.pass5 = defaultPass5(clock);
    pass5 = next.pass5;
  }
  pass5.scopedResetLog.push({
    id: runtime.stableId("pass5_reset", { scope: resetScope, at: clock.now(), count: pass5.scopedResetLog.length }),
    at: clock.now(),
    scope: resetScope
  });
  pass5.updatedAt = clock.now();
  return { ok: true, state: next, scope: resetScope };
}

module.exports = {
  PASS5_VERSION: PASS5_VERSION,
  ENGINE_VERSIONS: ENGINE_VERSIONS,
  ENTITY_SCHEMAS: ENTITY_SCHEMAS,
  RESULT_TYPES: RESULT_TYPES,
  SEX_CATEGORIES: SEX_CATEGORIES,
  TESTED_SCOPES: TESTED_SCOPES,
  EVENT_TYPES: EVENT_TYPES,
  EQUIPMENT_TYPES: EQUIPMENT_TYPES,
  AGE_BANDS: AGE_BANDS,
  LIFTS: LIFTS,
  ELIGIBILITY_STATUSES: ELIGIBILITY_STATUSES,
  SAMPLE_THRESHOLDS: SAMPLE_THRESHOLDS,
  PASS5_FEATURES: PASS5_FEATURES,
  NON_GOALS: NON_GOALS,
  EVENT_NAMES: EVENT_NAMES,
  defaultPass5: defaultPass5,
  normalizePass5: normalizePass5,
  pass5Event: pass5Event,
  appendPass5Event: appendPass5Event,
  scopedReset: scopedReset
};
