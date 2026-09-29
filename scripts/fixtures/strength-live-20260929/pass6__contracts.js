"use strict";

var runtime = require("../runtime/index");
var contracts = require("../contracts/contracts");

var PASS6_VERSION = "pass6.contracts.v1";

var ENTITY_SCHEMAS = Object.freeze({
  ImportSourceDefinition: "import-source-definition.schema.v1",
  ImportSourceVersion: "import-source-version.schema.v1",
  ImportFileDescriptor: "import-file-descriptor.schema.v1",
  ImportColumnMap: "import-column-map.schema.v1",
  ImportRowRecord: "import-row-record.schema.v1",
  ImportExerciseCandidate: "import-exercise-candidate.schema.v1",
  ImportMatchCandidate: "import-match-candidate.schema.v1",
  ImportMatchDecision: "import-match-decision.schema.v1",
  ImportDryRun: "import-dry-run.schema.v1",
  ImportCommit: "import-commit.schema.v1",
  ImportReceipt: "import-receipt.schema.v1",
  ImportRollback: "import-rollback.schema.v1",
  ExportBundleManifest: "export-bundle-manifest.schema.v2",
  EncryptedBackupEnvelope: "encrypted-backup-envelope.schema.v1",
  PassportDefinition: "passport-definition.schema.v1",
  PassportSectionSelection: "passport-section-selection.schema.v1",
  PassportRedactionPolicy: "passport-redaction-policy.schema.v1",
  PassportArtifact: "passport-artifact.schema.v1",
  PassportReceipt: "passport-receipt.schema.v1",
  HandoffEnvelope: "handoff-envelope.schema.v1",
  PlannedExposureHandoff: "planned-exposure-handoff.schema.v1",
  OutcomeHandoff: "outcome-handoff.schema.v1",
  HandoffPreview: "handoff-preview.schema.v1",
  HandoffReceipt: "handoff-receipt.schema.v1",
  HandoffRejection: "handoff-rejection.schema.v1",
  LabContextConsent: "lab-context-consent.schema.v1",
  LabContextSnapshot: "lab-context-snapshot.schema.v1",
  LabContextRevocation: "lab-context-revocation.schema.v1",
  CrossLabRecommendation: "cross-lab-recommendation.schema.v1",
  StrengthSignalV2: "strength-signal.schema.v2",
  StrengthSignalConsent: "strength-signal-consent.schema.v1",
  StrengthSignalReceipt: "strength-signal-receipt.schema.v1",
  CommercialEnvironment: "commercial-environment.schema.v1",
  CommercialOffer: "commercial-offer.schema.v1",
  CommercialPlanMapping: "commercial-plan-mapping.schema.v1",
  BillingInterval: "billing-interval.schema.v1",
  CheckoutIntent: "checkout-intent.schema.v1",
  CheckoutReturnState: "checkout-return-state.schema.v1",
  AccessTransition: "access-transition.schema.v1",
  BillingState: "billing-state.schema.v1",
  UpgradeSurfaceDefinition: "upgrade-surface-definition.schema.v1",
  UpgradeSurfaceImpression: "upgrade-surface-impression.schema.v1",
  ConversionEvent: "conversion-event.schema.v1",
  AnalyticsPayloadReceipt: "analytics-payload-receipt.schema.v1",
  AccountSyncProviderContract: "account-sync-provider-contract.schema.v1"
});

var ENGINE_VERSIONS = Object.freeze({
  csvParser: contracts.formulaVersions.csvParser,
  importSourceDetection: contracts.formulaVersions.importSourceDetection,
  importColumnMapping: contracts.formulaVersions.importColumnMapping,
  importExerciseMatching: contracts.formulaVersions.importExerciseMatching,
  importDeduplication: contracts.formulaVersions.importDeduplication,
  importDryRun: contracts.formulaVersions.importDryRun,
  importCommit: contracts.formulaVersions.importCommit,
  importRollback: contracts.formulaVersions.importRollback,
  exportBundle: contracts.formulaVersions.exportBundle,
  encryptedBackup: contracts.formulaVersions.encryptedBackup,
  strengthPassport: contracts.formulaVersions.strengthPassport,
  passportRedaction: contracts.formulaVersions.passportRedaction,
  planHandoff: contracts.formulaVersions.planHandoff,
  planHandoffMatching: contracts.formulaVersions.planHandoffMatching,
  labsContext: contracts.formulaVersions.labsContext,
  strengthSignal: contracts.formulaVersions.strengthSignal,
  strengthSignalV1Adapter: contracts.formulaVersions.strengthSignalV1Adapter,
  commercialOfferRegistry: contracts.formulaVersions.commercialOfferRegistry,
  memberstackCommercialAdapter: contracts.formulaVersions.memberstackCommercialAdapter,
  checkoutIntent: contracts.formulaVersions.checkoutIntent,
  accessTransition: contracts.formulaVersions.accessTransition,
  upgradeSurface: contracts.formulaVersions.upgradeSurface,
  strengthLabAnalytics: contracts.formulaVersions.strengthLabAnalytics
});

var NON_GOALS = Object.freeze([
  "silent_import_merge",
  "automatic_plan_mutation",
  "hidden_lab_context_modifier",
  "exact_data_nf_labs_payload",
  "live_account_sync",
  "memberstack_json_history_database",
  "duplicate_paid_subscription_default",
  "unverified_savings_claim",
  "fabricated_checkout_success",
  "unimplemented_feature_marketing",
  "public_rankings",
  "coach_dashboard",
  "medical_guidance"
]);

function now(clock) {
  return (clock || runtime.createClock()).now();
}

function emptyMap() {
  return {};
}

function defaultPass6(clock) {
  var t = now(clock);
  return {
    schemaVersion: "pass6.state.schema.v1",
    productVersion: contracts.PRODUCT_VERSION,
    createdAt: t,
    updatedAt: t,
    imports: {
      stagedDryRuns: emptyMap(),
      committedImports: emptyMap(),
      receipts: emptyMap(),
      rollbacks: emptyMap()
    },
    exports: {
      bundles: emptyMap(),
      backups: emptyMap(),
      encryptedBackups: emptyMap()
    },
    passports: {
      definitions: emptyMap(),
      artifacts: emptyMap(),
      receipts: emptyMap()
    },
    handoffs: {
      inbound: emptyMap(),
      outbound: emptyMap(),
      previews: emptyMap(),
      receipts: emptyMap(),
      replayKeys: emptyMap()
    },
    labsContext: {
      consents: emptyMap(),
      snapshots: emptyMap(),
      revocations: emptyMap(),
      recommendations: emptyMap()
    },
    strengthSignals: {
      consents: emptyMap(),
      published: emptyMap(),
      receipts: emptyMap(),
      revoked: emptyMap()
    },
    commercial: {
      checkoutIntents: emptyMap(),
      accessTransitions: emptyMap(),
      billingStates: emptyMap(),
      upgradeSurfaceImpressions: emptyMap()
    },
    analytics: {
      receipts: emptyMap(),
      sentKeys: emptyMap()
    },
    accountSync: {
      provider: "disabled_unconfigured",
      enabled: false,
      lastStatus: "disabled",
      lastCheckedAt: t,
      offlineQueue: []
    },
    flags: {
      accountSyncReadyOnly: true,
      exactTrainingExternal: false,
      memberstackJsonHistoryStorage: false,
      automaticCrossProductTransfer: false
    },
    unknownFields: {}
  };
}

function normalizeRecord(raw, id, fallbackType, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var t = now(clock);
  var out = runtime.clone(raw);
  out.id = runtime.safeTag(raw.id || id || runtime.stableId(fallbackType || "pass6", raw), 160);
  out.schemaVersion = runtime.safeTag(raw.schemaVersion || ENTITY_SCHEMAS[fallbackType] || "pass6-record.schema.v1", 120);
  out.productVersion = runtime.safeTag(raw.productVersion || contracts.PRODUCT_VERSION, 80) || contracts.PRODUCT_VERSION;
  out.createdAt = runtime.safeISO(raw.createdAt) || t;
  out.updatedAt = runtime.safeISO(raw.updatedAt) || out.createdAt;
  out.environment = runtime.safeTag(raw.environment || "local_fixture", 40) || "local_fixture";
  out.redactionState = runtime.safeTag(raw.redactionState || "default", 80) || "default";
  out.userConfirmationState = runtime.safeTag(raw.userConfirmationState || "not_required", 80) || "not_required";
  out.reasonCodes = runtime.safeTags(raw.reasonCodes || [], 20);
  return out;
}

function normalizeMap(value, type, clock) {
  var out = {};
  if (!runtime.isPlainObject(value)) return out;
  Object.keys(value).sort().forEach(function(id) {
    var record = normalizeRecord(value[id], id, type, clock);
    if (record.id) out[record.id] = record;
  });
  return out;
}

function normalizePass6(raw, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var base = defaultPass6(clock);
  if (!runtime.isPlainObject(raw)) return base;
  var next = runtime.merge(base, raw);
  next.schemaVersion = "pass6.state.schema.v1";
  next.productVersion = runtime.safeTag(next.productVersion || contracts.PRODUCT_VERSION, 80) || contracts.PRODUCT_VERSION;
  next.createdAt = runtime.safeISO(next.createdAt) || base.createdAt;
  next.updatedAt = runtime.safeISO(next.updatedAt) || next.createdAt;
  next.imports.stagedDryRuns = normalizeMap(next.imports && next.imports.stagedDryRuns, "ImportDryRun", clock);
  next.imports.committedImports = normalizeMap(next.imports && next.imports.committedImports, "ImportCommit", clock);
  next.imports.receipts = normalizeMap(next.imports && next.imports.receipts, "ImportReceipt", clock);
  next.imports.rollbacks = normalizeMap(next.imports && next.imports.rollbacks, "ImportRollback", clock);
  next.exports.bundles = normalizeMap(next.exports && next.exports.bundles, "ExportBundleManifest", clock);
  next.exports.backups = normalizeMap(next.exports && next.exports.backups, "ExportBundleManifest", clock);
  next.exports.encryptedBackups = normalizeMap(next.exports && next.exports.encryptedBackups, "EncryptedBackupEnvelope", clock);
  next.passports.definitions = normalizeMap(next.passports && next.passports.definitions, "PassportDefinition", clock);
  next.passports.artifacts = normalizeMap(next.passports && next.passports.artifacts, "PassportArtifact", clock);
  next.passports.receipts = normalizeMap(next.passports && next.passports.receipts, "PassportReceipt", clock);
  next.handoffs.inbound = normalizeMap(next.handoffs && next.handoffs.inbound, "PlannedExposureHandoff", clock);
  next.handoffs.outbound = normalizeMap(next.handoffs && next.handoffs.outbound, "OutcomeHandoff", clock);
  next.handoffs.previews = normalizeMap(next.handoffs && next.handoffs.previews, "HandoffPreview", clock);
  next.handoffs.receipts = normalizeMap(next.handoffs && next.handoffs.receipts, "HandoffReceipt", clock);
  next.handoffs.replayKeys = runtime.isPlainObject(next.handoffs && next.handoffs.replayKeys) ? runtime.clone(next.handoffs.replayKeys) : {};
  next.labsContext.consents = normalizeMap(next.labsContext && next.labsContext.consents, "LabContextConsent", clock);
  next.labsContext.snapshots = normalizeMap(next.labsContext && next.labsContext.snapshots, "LabContextSnapshot", clock);
  next.labsContext.revocations = normalizeMap(next.labsContext && next.labsContext.revocations, "LabContextRevocation", clock);
  next.labsContext.recommendations = normalizeMap(next.labsContext && next.labsContext.recommendations, "CrossLabRecommendation", clock);
  next.strengthSignals.consents = normalizeMap(next.strengthSignals && next.strengthSignals.consents, "StrengthSignalConsent", clock);
  next.strengthSignals.published = normalizeMap(next.strengthSignals && next.strengthSignals.published, "StrengthSignalV2", clock);
  next.strengthSignals.receipts = normalizeMap(next.strengthSignals && next.strengthSignals.receipts, "StrengthSignalReceipt", clock);
  next.strengthSignals.revoked = normalizeMap(next.strengthSignals && next.strengthSignals.revoked, "StrengthSignalReceipt", clock);
  next.commercial.checkoutIntents = normalizeMap(next.commercial && next.commercial.checkoutIntents, "CheckoutIntent", clock);
  next.commercial.accessTransitions = normalizeMap(next.commercial && next.commercial.accessTransitions, "AccessTransition", clock);
  next.commercial.billingStates = normalizeMap(next.commercial && next.commercial.billingStates, "BillingState", clock);
  next.commercial.upgradeSurfaceImpressions = normalizeMap(next.commercial && next.commercial.upgradeSurfaceImpressions, "UpgradeSurfaceImpression", clock);
  next.analytics.receipts = normalizeMap(next.analytics && next.analytics.receipts, "AnalyticsPayloadReceipt", clock);
  next.analytics.sentKeys = runtime.isPlainObject(next.analytics && next.analytics.sentKeys) ? runtime.clone(next.analytics.sentKeys) : {};
  next.accountSync = runtime.merge(base.accountSync, next.accountSync || {});
  next.accountSync.provider = "disabled_unconfigured";
  next.accountSync.enabled = false;
  next.flags = runtime.merge(base.flags, next.flags || {});
  next.flags.accountSyncReadyOnly = true;
  next.flags.exactTrainingExternal = false;
  next.flags.memberstackJsonHistoryStorage = false;
  next.flags.automaticCrossProductTransfer = false;
  next.unknownFields = runtime.isPlainObject(next.unknownFields) ? runtime.clone(next.unknownFields) : {};
  return next;
}

function accountSyncProviderContract() {
  return {
    schemaVersion: ENTITY_SCHEMAS.AccountSyncProviderContract,
    provider: "disabled_unconfigured",
    enabled: false,
    methods: ["connect", "disconnect", "status", "uploadEncryptedSnapshot", "downloadEncryptedSnapshot", "listRevisions", "resolveConflict", "deleteRemoteData", "flushOfflineQueue"],
    defaultStatus: "disabled",
    uploadOccurs: false,
    memberstackJsonHistoryStorage: false,
    consentBypassAllowed: false
  };
}

module.exports = {
  PASS6_VERSION: PASS6_VERSION,
  ENTITY_SCHEMAS: ENTITY_SCHEMAS,
  ENGINE_VERSIONS: ENGINE_VERSIONS,
  NON_GOALS: NON_GOALS,
  defaultPass6: defaultPass6,
  normalizePass6: normalizePass6,
  normalizeRecord: normalizeRecord,
  accountSyncProviderContract: accountSyncProviderContract
};
