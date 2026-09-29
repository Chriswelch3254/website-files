"use strict";

var ENGINE_VERSIONS = Object.freeze({
  personalRepStrength: "personal-rep-strength.v2",
  bestNextEvidence: "best-next-evidence.v2",
  rirReportingProfile: "rir-reporting-profile.v1",
  rirBiasProfile: "rir-bias-profile.v1",
  setFatigueProfile: "set-fatigue-profile.v2",
  restResponseProfile: "rest-response-profile.v3",
  warmupPredictiveness: "warmup-predictiveness.v2",
  personalizedDecisionModifier: "personalized-decision-modifier.v1",
  recommendationAccuracy: "recommendation-accuracy.v1",
  meaningfulProgress: "meaningful-progress.v2",
  liftVolatility: "lift-volatility.v2",
  setupConsistency: "setup-consistency.v1",
  personalRecords: "personal-records.v1",
  estimateTrends: "estimate-trends.v2",
  goalRoadmap: "goal-roadmap.v2",
  plateauAssessment: "plateau-assessment.v1",
  plateauExperiment: "plateau-experiment.v1",
  strengthMap: "strength-map.v2",
  variantRelationship: "variant-relationship.v2",
  readinessReliability: "readiness-reliability.v2",
  bodyweightPhaseAnalysis: "bodyweight-phase-analysis.v2"
});

var ENTITY_SCHEMAS = Object.freeze({
  LearningEligibilityResult: "learning-eligibility-result.schema.v1",
  PersonalizationPolicy: "personalization-policy.schema.v1",
  PersonalizationSnapshot: "personalization-snapshot.schema.v1",
  PersonalizationModifier: "personalization-modifier.schema.v1",
  PersonalRepStrengthProfile: "personal-rep-strength-profile.schema.v1",
  RepBandCalibration: "rep-band-calibration.schema.v1",
  FormulaPerformanceProfile: "formula-performance-profile.schema.v1",
  BestNextEvidenceRecommendation: "best-next-evidence-recommendation.schema.v2",
  RIRReportingProfile: "rir-reporting-profile.schema.v1",
  RIRCalibrationObservation: "rir-calibration-observation.schema.v1",
  RIRBiasProfile: "rir-bias-profile.schema.v1",
  SetFatigueProfile: "set-fatigue-profile.schema.v1",
  RestResponseProfile: "rest-response-profile.schema.v1",
  WarmupPredictivenessProfile: "warmup-predictiveness-profile.schema.v1",
  RecommendationAccuracyRecord: "recommendation-accuracy-record.schema.v1",
  RecommendationAccuracySummary: "recommendation-accuracy-summary.schema.v1",
  MeaningfulProgressResult: "meaningful-progress-result.schema.v1",
  LiftVolatilityProfile: "lift-volatility-profile.schema.v1",
  SetupConsistencyProfile: "setup-consistency-profile.schema.v1",
  PersonalRecord: "personal-record.schema.v1",
  EstimateTrendPoint: "estimate-trend-point.schema.v1",
  TrendSeries: "trend-series.schema.v1",
  HistoryQuery: "history-query.schema.v1",
  HistoryPage: "history-page.schema.v1",
  StrengthGoal: "strength-goal.schema.v1",
  GoalMilestone: "goal-milestone.schema.v1",
  GoalRoadmap: "goal-roadmap.schema.v1",
  PlateauAssessment: "plateau-assessment.schema.v1",
  PlateauExperiment: "plateau-experiment.schema.v1",
  PlateauExperimentReview: "plateau-experiment-review.schema.v1",
  StrengthMapSnapshot: "strength-map-snapshot.schema.v1",
  MovementFamilyStatus: "movement-family-status.schema.v1",
  VariantRelationship: "variant-relationship.schema.v1",
  ReadinessReliabilityProfile: "readiness-reliability-profile.schema.v1",
  BodyweightObservation: "bodyweight-observation.schema.v1",
  BodyweightPhase: "bodyweight-phase.schema.v1",
  BodyweightPhaseAnalysis: "bodyweight-phase-analysis.schema.v1"
});

var MODEL_STATUSES = Object.freeze([
  "unavailable",
  "emerging",
  "usable",
  "strong",
  "stale",
  "conflicting"
]);

var PERSONALIZATION_POLICIES = Object.freeze([
  "off",
  "preview_only",
  "apply_when_supported"
]);

var REP_BANDS = Object.freeze([
  Object.freeze({ id: "reps_1_to_3", min: 1, max: 3, label: "1 to 3 reps" }),
  Object.freeze({ id: "reps_4_to_6", min: 4, max: 6, label: "4 to 6 reps" }),
  Object.freeze({ id: "reps_7_to_10", min: 7, max: 10, label: "7 to 10 reps" }),
  Object.freeze({ id: "reps_11_to_15", min: 11, max: 15, label: "11 to 15 reps" })
]);

var THRESHOLDS = Object.freeze({
  personalRepStrength: Object.freeze({
    emerging: Object.freeze({ observations: 1, sessions: 1, dates: 1 }),
    usable: Object.freeze({ observations: 4, sessions: 3, dates: 3, repBands: 2 }),
    strong: Object.freeze({ observations: 8, sessions: 5, dates: 5, repBands: 3 }),
    staleDays: 180,
    conflictMadPct: 0.085,
    maxUsableCorrectionPct: 0.03,
    maxStrongCorrectionPct: 0.05
  }),
  bestNextEvidence: Object.freeze({
    emergingNeeds: 1,
    minLoadableOptions: 1,
    maxRecommendedEffortRir: 3,
    noFailureRequired: true
  }),
  rirReporting: Object.freeze({
    emergingReports: 3,
    usableReports: 6,
    strongReports: 12,
    staleDays: 180
  }),
  rirBias: Object.freeze({
    minObservations: 3,
    minSessions: 2,
    minDates: 2,
    maxCorrectionRir: 1.5,
    staleDays: 180
  }),
  setFatigue: Object.freeze({
    minSessions: 3,
    minComparableMultiSetSessions: 3,
    minSetsPerSession: 2,
    maxModifierPct: 0.03
  }),
  restResponse: Object.freeze({
    minSessions: 4,
    minDistinctRestBands: 2,
    maxModifierPct: 0.025
  }),
  warmupPredictiveness: Object.freeze({
    minSessions: 4,
    minDistinctCheckpointCategories: 2
  }),
  accuracy: Object.freeze({
    smallSampleRecords: 5,
    withinRangePct: 0.025
  }),
  progress: Object.freeze({
    minComparableObservations: 2,
    confirmedOutsideBandPct: 0.025,
    probableOutsideBandPct: 0.012,
    historyPageSizeDefault: 20,
    historyPageSizeMax: 100
  }),
  goals: Object.freeze({
    minTrendPoints: 4,
    forecastHorizonDays: 365,
    milestoneCount: 3
  }),
  plateau: Object.freeze({
    minComparableObservations: 6,
    minDays: 28,
    highVolatilityPct: 0.075
  }),
  strengthMap: Object.freeze({
    staleDays: 180,
    evidenceGapMinObservations: 2
  }),
  variantRelationship: Object.freeze({
    minPairedWindows: 3,
    maxWindowDays: 21
  }),
  readinessReliability: Object.freeze({
    minSamples: 6,
    minDistinctReadinessValues: 3
  }),
  bodyweightPhase: Object.freeze({
    minObservations: 4,
    minPhaseDays: 14
  })
});

var EXCLUSION_CODES = Object.freeze({
  safetyStopped: "safety_stopped",
  painOrInstability: "pain_or_instability",
  techniqueBelowThreshold: "technique_below_threshold",
  incompatibleSetup: "incompatible_setup",
  reviewRequiredSetup: "review_required_setup",
  differentEquipment: "different_equipment",
  travelExcluded: "temporary_travel_excluded",
  archivedOrInvalidated: "archived_or_invalidated",
  unsupportedLoadModel: "unsupported_load_model",
  unresolvedImport: "unresolved_import",
  missingEffort: "missing_effort",
  duplicateOrReplay: "duplicate_or_replay",
  afterCutoff: "after_input_cutoff",
  outsideRepRange: "outside_supported_rep_range",
  missingOutcome: "missing_outcome"
});

var ACCURACY_CLASSIFICATIONS = Object.freeze([
  "within_range",
  "conservative",
  "aggressive",
  "uncertain",
  "safety_excluded",
  "not_scorable"
]);

var PLATEAU_CLASSIFICATIONS = Object.freeze([
  "insufficient_data",
  "mixed_setup",
  "high_uncertainty",
  "probable_plateau",
  "progressing_conservatively",
  "aggressive_progression",
  "normal_variability",
  "not_plateau"
]);

var PASS4_FEATURES = Object.freeze([
  "learning_eligibility",
  "personal_rep_strength",
  "best_next_evidence",
  "rir_reporting",
  "rir_bias",
  "set_fatigue",
  "rest_response",
  "warmup_predictiveness",
  "personalization_modifier",
  "recommendation_accuracy",
  "meaningful_progress",
  "personal_records",
  "history_trends",
  "goals",
  "plateaus",
  "plateau_experiments",
  "strength_map",
  "variant_relationships",
  "readiness_reliability",
  "bodyweight_phase"
]);

module.exports = {
  ENGINE_VERSIONS: ENGINE_VERSIONS,
  ENTITY_SCHEMAS: ENTITY_SCHEMAS,
  MODEL_STATUSES: MODEL_STATUSES,
  PERSONALIZATION_POLICIES: PERSONALIZATION_POLICIES,
  REP_BANDS: REP_BANDS,
  THRESHOLDS: THRESHOLDS,
  EXCLUSION_CODES: EXCLUSION_CODES,
  ACCURACY_CLASSIFICATIONS: ACCURACY_CLASSIFICATIONS,
  PLATEAU_CLASSIFICATIONS: PLATEAU_CLASSIFICATIONS,
  PASS4_FEATURES: PASS4_FEATURES
};