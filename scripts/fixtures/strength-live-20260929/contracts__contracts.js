"use strict";

var PRODUCT_VERSION = "3.0.0-pass7";
var SCHEMA_VERSION = 3;
var BUILD_REVISION = "pass7-final-source-reconciliation-2026-07-19";
var CANONICAL_PACKAGE_HASH = "1001072cfb6a9e35a929620e0ec1a069a215c72ff0c67f37dfb7ca4d035d0909";

var storageKeys = Object.freeze({
  activeV3: "nf.strengthLab.v3",
  backupV3: "nf.strengthLab.v3.backup",
  resetTombstoneV3: "nf.strengthLab.v3.reset",
  legacyV2: "nf.strengthLab.v2",
  legacyV1: "nf.strengthLab.v1",
  legacyV2Backup: "nf.strengthLab.v2.backup",
  labsBridge: "nf.labs.v1"
});

var protectedV3Recovery = Object.freeze({
  sourceFormat: storageKeys.activeV3,
  sourceFormatVersion: SCHEMA_VERSION,
  algorithmVersion: "protected-v3-recovery.v1",
  backupKeyPrefix: "nf.strengthLab.recovery.protectedV3.v1.backup.",
  journalKeyPrefix: "nf.strengthLab.recovery.protectedV3.v1.journal.",
  checkpoints: Object.freeze({
    detected: "DETECTED",
    sourceBackupVerified: "SOURCE_BACKUP_VERIFIED",
    parsed: "PARSED",
    quarantined: "QUARANTINED"
  })
});

var protectedV3Staging = Object.freeze({
  transformAlgorithmVersion: "protected-v3-transform.v1",
  candidateEnvelopeVersion: "protected-v3-candidate.v1",
  independentVerifierAlgorithmVersion: "protected-v3-independent-verifier.v1",
  validatorContractVersion: "protected-v3-validator-contract.v1",
  candidateKeyPrefix: "nf.strengthLab.recovery.protectedV3.v1.candidate.",
  stageJournalKeyPrefix: "nf.strengthLab.recovery.protectedV3.v1.stageJournal."
});

var productContract = Object.freeze({
  promise: "Strength Lab helps you estimate strength and understand your lifts.",
  proPromise: "Your program sets the plan. Strength Lab Pro helps you review and adjust today's work.",
  boundary: "Strength Lab Pro supports your decisions with session guidance and progress learning.",
  nonGoals: Object.freeze([
    "full_workout_logger",
    "full_program_generator",
    "injury_diagnosis",
    "medical_claims",
    "ai_coach_chat",
    "composite_strength_score",
    "silent_account_sync",
    "silent_cross_lab_transfer",
    "automatic_checkout_changes",
    "automatic_product_routing",
    "video_form_diagnosis",
    "live_community_benchmark_aggregation",
    "user_result_upload",
    "public_rankings",
    "coach_dashboard",
    "strength_passport_sharing",
    "height_based_peer_percentiles",
    "training_experience_peer_percentiles",
    "universal_machine_conversion",
    "universal_lift_variant_conversion",
    "silent_import_merge",
    "automatic_plan_mutation",
    "hidden_lab_context_modifier",
    "exact_data_nf_labs_payload",
    "memberstack_json_history_database",
    "duplicate_paid_subscription_default",
    "unverified_savings_claim",
    "fabricated_checkout_success",
    "unimplemented_feature_marketing"
  ])
});

var dataClassifications = Object.freeze({
  exactLocalOnly: Object.freeze([
    "loads",
    "repetitions",
    "rpe",
    "rir",
    "estimates",
    "training_maxes",
    "dates",
    "notes",
    "setup_details",
    "observation_ids",
    "session_outcomes",
    "names",
    "emails",
    "member_ids",
    "payment_ids"
  ]),
  allowedEntitlement: Object.freeze(["capability_ids", "resource_counts", "resource_types"]),
  allowedAnalytics: Object.freeze(["event_name", "capability_id", "reason_codes", "state_tags", "counts_bucketed"]),
  allowedBridge: Object.freeze(["readiness_bucket", "trend_bucket", "load_stress_bucket", "review_needed", "updated_bucket"])
});

var privacyRules = Object.freeze({
  exactDataExternal: "verified_consented_strength_account_storage_only",
  entitlementAuthority: "verified_memberstack_or_session_bound_server_capabilities",
  localStorageAuthority: "not_trusted",
  bridgeWrites: "explicit_user_action_only",
  analyticsMode: "sanitized_allowlist_only",
  accountStorage: Object.freeze({
    contractVersion: "strength-cloud.v1",
    consentVersion: "strength-cloud-consent.v1",
    destination: "same_origin_strength_cloud_bff",
    ownership: "server_verified_strength_namespace",
    writes: "explicit_server_capability_and_current_strength_consent",
    conflicts: "explicit_review_with_retained_revisions",
    crossLabTransfer: false,
    analyticsTrainingData: false,
    clientEncryptionClaim: false
  })
});

var safetyBoundaries = Object.freeze({
  diagnosis: "not_supported",
  painHandling: "refer_out_or_stop",
  heavyWork: "secondary_check_only",
  unsupportedEstimate: "explain_and_decline"
});

var eventNames = Object.freeze({
  migrationStarted: "nf_strength_lab_v3_migration_started",
  migrationCompleted: "nf_strength_lab_v3_migration_completed",
  profileCreated: "nf_strength_lab_v3_profile_created",
  profileChanged: "nf_strength_lab_v3_profile_changed",
  profileArchived: "nf_strength_lab_v3_profile_archived",
  profileRestored: "nf_strength_lab_v3_profile_restored",
  setupChanged: "nf_strength_lab_v3_setup_changed",
  equipmentChanged: "nf_strength_lab_v3_equipment_changed",
  evidenceCreated: "nf_strength_lab_v3_evidence_created",
  importCommitted: "nf_strength_lab_v3_import_committed",
  restoreCommitted: "nf_strength_lab_v3_restore_committed",
  capabilityDenied: "nf_strength_lab_v3_capability_denied",
  downgradePreserved: "nf_strength_lab_v3_downgrade_preserved",
  bridgeShared: "nf_strength_lab_v3_bridge_shared",
  proPlanCreated: "nf_strength_lab_v3_pro_plan_created",
  proPlanEvaluated: "nf_strength_lab_v3_pro_plan_evaluated",
  proWarmupGenerated: "nf_strength_lab_v3_pro_warmup_generated",
  proWarmupStepCompleted: "nf_strength_lab_v3_pro_warmup_step_completed",
  proFinalCheckpointRecorded: "nf_strength_lab_v3_pro_final_checkpoint_recorded",
  proTodayCallCreated: "nf_strength_lab_v3_pro_today_call_created",
  proTodayCallAdjusted: "nf_strength_lab_v3_pro_today_call_adjusted",
  proTodayCallExpired: "nf_strength_lab_v3_pro_today_call_expired",
  proTodayCallCancelled: "nf_strength_lab_v3_pro_today_call_cancelled",
  proFirstSetRecorded: "nf_strength_lab_v3_pro_first_set_recorded",
  proRemainingWorkCalculated: "nf_strength_lab_v3_pro_remaining_work_calculated",
  proRestTimerStarted: "nf_strength_lab_v3_pro_rest_timer_started",
  proRestTimerCompleted: "nf_strength_lab_v3_pro_rest_timer_completed",
  proRestTimerReset: "nf_strength_lab_v3_pro_rest_timer_reset",
  proReviewDeferred: "nf_strength_lab_v3_pro_review_deferred",
  proReviewCompleted: "nf_strength_lab_v3_pro_review_completed",
  proEvidencePromoted: "nf_strength_lab_v3_pro_evidence_promoted",
  proNextExposureCreated: "nf_strength_lab_v3_pro_next_exposure_created",
  proWhatIfRun: "nf_strength_lab_v3_pro_what_if_run",
  proRebaselineStarted: "nf_strength_lab_v3_pro_rebaseline_started",
  proTravelModeStarted: "nf_strength_lab_v3_pro_travel_mode_started",
  proTravelModeEnded: "nf_strength_lab_v3_pro_travel_mode_ended",
  proSafetyStop: "nf_strength_lab_v3_pro_safety_stop",
  pass5ProfileChanged: "nf_strength_lab_v3_pass5_profile_changed",
  pass5AssetLoaded: "nf_strength_lab_v3_pass5_asset_loaded",
  pass5BenchmarkCalculated: "nf_strength_lab_v3_pass5_benchmark_calculated",
  pass5BenchmarkWithheld: "nf_strength_lab_v3_pass5_benchmark_withheld",
  pass5SnapshotCreated: "nf_strength_lab_v3_pass5_snapshot_created",
  pass5RebasePreviewed: "nf_strength_lab_v3_pass5_rebase_previewed",
  pass5RebaseApplied: "nf_strength_lab_v3_pass5_rebase_applied",
  pass5ModeCreated: "nf_strength_lab_v3_pass5_mode_created",
  pass5AttemptChanged: "nf_strength_lab_v3_pass5_attempt_changed",
  pass5ScopedReset: "nf_strength_lab_v3_pass5_scoped_reset",
  pass5AssetCacheReset: "nf_strength_lab_v3_pass5_asset_cache_reset",
  pass6ImportPreviewed: "nf_strength_lab_import_preview",
  pass6ImportCommitted: "nf_strength_lab_import_complete",
  pass6PassportGenerated: "nf_strength_lab_passport_generated",
  pass6HandoffPreviewed: "nf_strength_lab_handoff_preview",
  pass6HandoffConfirmed: "nf_strength_lab_handoff_confirmed",
  pass6ContextConnected: "nf_strength_lab_context_connected",
  pass6SignalShared: "nf_strength_lab_signal_shared",
  pass6UpgradeIntent: "nf_strength_lab_upgrade_intent",
  pass6CheckoutStart: "nf_strength_lab_checkout_start",
  pass6CheckoutCancel: "nf_strength_lab_checkout_cancel",
  pass6CheckoutError: "nf_strength_lab_checkout_error",
  pass6UpgradeSuccess: "nf_strength_lab_upgrade_success",
  pass6AccessPending: "nf_strength_lab_access_pending",
  pass6AccessRestored: "nf_strength_lab_access_restored",
  pass6DowngradeDetected: "nf_strength_lab_downgrade_detected"
});

var capabilityRegistry = Object.freeze({
  free_active_lift_profiles: {
    id: "free_active_lift_profiles",
    tier: "free",
    limit: 4,
    actions: Object.freeze(["lift.profile.activate", "lift.profile.select"])
  },
  free_standard_lift_profiles: {
    id: "free_standard_lift_profiles",
    tier: "free",
    limit: "unlimited_within_active_limit",
    actions: Object.freeze(["lift.profile.create_standard"])
  },
  free_basic_custom_lift: {
    id: "free_basic_custom_lift",
    tier: "free",
    limit: 1,
    actions: Object.freeze(["lift.profile.create_custom_basic"])
  },
  free_one_setup_per_lift: {
    id: "free_one_setup_per_lift",
    tier: "free",
    limit: 1,
    actions: Object.freeze(["setup.activate"])
  },
  free_basic_evidence: {
    id: "free_basic_evidence",
    tier: "free",
    actions: Object.freeze(["evidence.create_basic"])
  },
  free_calculator_toolkit: {
    id: "free_calculator_toolkit",
    tier: "free",
    actions: Object.freeze(["calculator.use_basic"])
  },
  free_relative_scoring: {
    id: "free_relative_scoring",
    tier: "free",
    actions: Object.freeze(["calculator.relative_strength"])
  },
  free_benchmark_profile_preview: {
    id: "free_benchmark_profile_preview",
    tier: "free",
    actions: Object.freeze(["benchmark.profile.preview"])
  },
  free_today_range_basic: {
    id: "free_today_range_basic",
    tier: "free",
    actions: Object.freeze(["today.range.basic"])
  },
  free_records_recent_history: {
    id: "free_records_recent_history",
    tier: "free",
    actions: Object.freeze(["history.read_recent"])
  },
  free_raw_import_export: {
    id: "free_raw_import_export",
    tier: "free",
    actions: Object.freeze(["data.export_raw", "data.import_raw"])
  },
  free_data_portability: {
    id: "free_data_portability",
    tier: "free",
    actions: Object.freeze(["data.import_preview", "data.import_commit", "data.export_raw", "data.backup_plain", "data.restore_plain"])
  },
  free_account_checkout_intent: {
    id: "free_account_checkout_intent",
    tier: "free",
    actions: Object.freeze(["commercial.checkout_intent", "commercial.manage_plan"])
  },
  pro_unlimited_lift_profiles: {
    id: "pro_unlimited_lift_profiles",
    tier: "pro",
    actions: Object.freeze(["lift.profile.activate_unlimited"])
  },
  pro_unlimited_custom_lifts: {
    id: "pro_unlimited_custom_lifts",
    tier: "pro",
    actions: Object.freeze(["lift.profile.create_custom_unlimited"])
  },
  pro_multiple_setups: {
    id: "pro_multiple_setups",
    tier: "pro",
    actions: Object.freeze(["setup.create_multiple", "setup.activate_multiple"])
  },
  pro_multiple_equipment_profiles: {
    id: "pro_multiple_equipment_profiles",
    tier: "pro",
    actions: Object.freeze(["equipment.create_multiple"])
  },
  pro_planned_exposure_check: {
    id: "pro_planned_exposure_check",
    tier: "pro",
    actions: Object.freeze(["decision.planned_exposure"])
  },
  pro_adaptive_warmup: {
    id: "pro_adaptive_warmup",
    tier: "pro",
    actions: Object.freeze(["decision.adaptive_warmup"])
  },
  "strength.today.plannedExposure": {
    id: "strength.today.plannedExposure",
    tier: "pro",
    actions: Object.freeze(["decision.planned_exposure"])
  },
  "strength.today.adaptiveWarmup": {
    id: "strength.today.adaptiveWarmup",
    tier: "pro",
    actions: Object.freeze(["decision.adaptive_warmup"])
  },
  "strength.today.exactCall": {
    id: "strength.today.exactCall",
    tier: "pro",
    actions: Object.freeze(["decision.exact_today_call"])
  },
  "strength.today.finalWarmup": {
    id: "strength.today.finalWarmup",
    tier: "pro",
    actions: Object.freeze(["decision.final_warmup_checkpoint"])
  },
  "strength.today.firstSet": {
    id: "strength.today.firstSet",
    tier: "pro",
    actions: Object.freeze(["decision.first_set_check"])
  },
  "strength.today.remainingWork": {
    id: "strength.today.remainingWork",
    tier: "pro",
    actions: Object.freeze(["decision.remaining_work"])
  },
  "strength.today.smartRest": {
    id: "strength.today.smartRest",
    tier: "pro",
    actions: Object.freeze(["decision.smart_rest"])
  },
  "strength.today.review": {
    id: "strength.today.review",
    tier: "pro",
    actions: Object.freeze(["decision.outcome_review"])
  },
  "strength.today.nextExposure": {
    id: "strength.today.nextExposure",
    tier: "pro",
    actions: Object.freeze(["decision.next_exposure"])
  },
  "strength.today.whatChanged": {
    id: "strength.today.whatChanged",
    tier: "pro",
    actions: Object.freeze(["decision.what_changed"])
  },
  "strength.today.replay": {
    id: "strength.today.replay",
    tier: "pro",
    actions: Object.freeze(["decision.replay"])
  },
  "strength.today.whatIf": {
    id: "strength.today.whatIf",
    tier: "pro",
    actions: Object.freeze(["decision.what_if"])
  },
  "strength.today.returnMode": {
    id: "strength.today.returnMode",
    tier: "pro",
    actions: Object.freeze(["decision.return_rebaseline"])
  },
  "strength.today.travelMode": {
    id: "strength.today.travelMode",
    tier: "pro",
    actions: Object.freeze(["decision.travel_gym"])
  },
  "strength.evidence.bestNext": {
    id: "strength.evidence.bestNext",
    tier: "pro",
    actions: Object.freeze(["evidence.best_next"])
  },
  pro_first_set_check: {
    id: "pro_first_set_check",
    tier: "pro",
    actions: Object.freeze(["decision.first_set_check"])
  },
  pro_remaining_work_guidance: {
    id: "pro_remaining_work_guidance",
    tier: "pro",
    actions: Object.freeze(["decision.remaining_work"])
  },
  pro_smart_rest_foundation: {
    id: "pro_smart_rest_foundation",
    tier: "pro",
    actions: Object.freeze(["decision.smart_rest"])
  },
  pro_personal_calibration: {
    id: "pro_personal_calibration",
    tier: "pro",
    actions: Object.freeze(["learning.personal_calibration"])
  },
  pro_progress_intelligence: {
    id: "pro_progress_intelligence",
    tier: "pro",
    actions: Object.freeze(["progress.full_intelligence"])
  },
  pro_peer_benchmarks: {
    id: "pro_peer_benchmarks",
    tier: "pro",
    actions: Object.freeze(["benchmarks.peer"])
  },
  pro_benchmark_intelligence: {
    id: "pro_benchmark_intelligence",
    tier: "pro",
    actions: Object.freeze(["benchmark.calculate", "benchmark.snapshot", "benchmark.rebase"])
  },
  pro_advanced_modes: {
    id: "pro_advanced_modes",
    tier: "pro",
    actions: Object.freeze(["mode.advanced"])
  },
  pro_advanced_strength_modes: {
    id: "pro_advanced_strength_modes",
    tier: "pro",
    actions: Object.freeze(["mode.powerlifting", "mode.calisthenics", "mode.machine", "mode.weightlifting", "mode.unilateral"])
  },
  pass5_asset_cache_reset: {
    id: "pass5_asset_cache_reset",
    tier: "free",
    actions: Object.freeze(["benchmark.asset_cache.reset"])
  },
  pro_connected_neuform_handoffs: {
    id: "pro_connected_neuform_handoffs",
    tier: "pro",
    actions: Object.freeze(["bridge.connected_handoff"])
  },
  pro_strength_passport: {
    id: "pro_strength_passport",
    tier: "pro",
    actions: Object.freeze(["report.strength_passport"])
  },
  pro_contextual_upgrade_surfaces: {
    id: "pro_contextual_upgrade_surfaces",
    tier: "pro",
    actions: Object.freeze(["commercial.upgrade_surface"])
  }
});

var formulaVersions = Object.freeze({
  loadModel: "load-models.v1",
  setupComparator: "setup-comparator.v1",
  migration: "migration.v1",
  capability: "capability.v1",
  plannedExposure: "planned-exposure.v2",
  adaptiveWarmup: "adaptive-warmup.v1",
  plateChangeOptimizer: "plate-change-optimizer.v1",
  todayStrengthCall: "today-strength-call.v4",
  finalWarmupAdjustment: "final-warmup-adjustment.v1",
  firstSetCheck: "first-set-check.v3",
  remainingWork: "remaining-work.v3",
  smartRestWeb: "smart-rest-web.v3",
  outcomeReview: "outcome-review.v1",
  nextExposure: "next-exposure.v1",
  whatChanged: "what-changed.v1",
  decisionReplay: "decision-replay.v1",
  whatIf: "what-if.v1",
  returnRebaseline: "return-rebaseline.v1",
  travelGym: "travel-gym.v1",
  personalRepStrength: "personal-rep-strength.v2",
  bestNextEvidenceV2: "best-next-evidence.v2",
  rirReportingProfile: "rir-reporting-profile.v1",
  rirBiasProfile: "rir-bias-profile.v1",
  setFatigueProfile: "set-fatigue-profile.v1",
  restResponseProfile: "rest-response-profile.v3",
  warmupPredictiveness: "warmup-predictiveness.v2",
  personalizedDecisionModifier: "personalized-decision-modifier.v1",
  recommendationAccuracy: "recommendation-accuracy.v1",
  meaningfulProgress: "meaningful-progress.v2",
  goalRoadmap: "goal-roadmap.v2",
  plateauAssessment: "plateau-assessment.v1",
  strengthMap: "strength-map.v2",
  readinessReliability: "readiness-reliability.v2",
  bodyweightPhaseAnalysis: "bodyweight-phase-analysis.v2",
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
  unilateralComparison: "unilateral-comparison.v1",
  csvParser: "csv-parser.v1",
  importSourceDetection: "import-source-detection.v1",
  importColumnMapping: "import-column-mapping.v1",
  importExerciseMatching: "import-exercise-matching.v1",
  importDeduplication: "import-deduplication.v1",
  importDryRun: "import-dry-run.v1",
  importCommit: "import-commit.v1",
  importRollback: "import-rollback.v1",
  exportBundle: "export-bundle.v2",
  encryptedBackup: "encrypted-backup.v1",
  strengthPassport: "strength-passport.v1",
  passportRedaction: "passport-redaction.v1",
  planHandoff: "plan-handoff.v1",
  planHandoffMatching: "plan-handoff-matching.v1",
  labsContext: "labs-context.v1",
  strengthSignal: "strength-signal.v2",
  strengthSignalV1Adapter: "strength-signal-v1-adapter.v1",
  commercialOfferRegistry: "commercial-offer-registry.v1",
  memberstackCommercialAdapter: "memberstack-commercial-adapter.v1",
  checkoutIntent: "checkout-intent.v1",
  accessTransition: "access-transition.v1",
  upgradeSurface: "upgrade-surface.v1",
  strengthLabAnalytics: "strength-lab-analytics.v1"
});

var forwardCompatibility = Object.freeze({
  unknownFields: "preserve_when_safe",
  futureSchema: "fail_closed_no_destructive_downgrade",
  generatedArtifacts: "deterministic_from_source"
});

function getCapability(id) {
  return capabilityRegistry[id] || null;
}

function listCapabilities() {
  return Object.keys(capabilityRegistry).map(function(key) {
    return capabilityRegistry[key];
  });
}

module.exports = {
  PRODUCT_VERSION: PRODUCT_VERSION,
  SCHEMA_VERSION: SCHEMA_VERSION,
  BUILD_REVISION: BUILD_REVISION,
  CANONICAL_PACKAGE_HASH: CANONICAL_PACKAGE_HASH,
  storageKeys: storageKeys,
  protectedV3Recovery: protectedV3Recovery,
  protectedV3Staging: protectedV3Staging,
  productContract: productContract,
  dataClassifications: dataClassifications,
  privacyRules: privacyRules,
  safetyBoundaries: safetyBoundaries,
  eventNames: eventNames,
  capabilityRegistry: capabilityRegistry,
  formulaVersions: formulaVersions,
  forwardCompatibility: forwardCompatibility,
  getCapability: getCapability,
  listCapabilities: listCapabilities
};