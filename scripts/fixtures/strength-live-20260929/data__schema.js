"use strict";

var runtime = require("../runtime/index");
var contracts = require("../contracts/contracts");
var pass4Core = require("../pass4/core");
var pass5Contracts = require("../pass5/contracts");
var pass6Contracts = require("../pass6/contracts");

function emptyMap() {
  return {};
}

function defaultSettings(clock) {
  var now = clock.now();
  return {
    id: "settings_default",
    createdAt: now,
    updatedAt: now,
    units: "lb",
    activeLiftProfileId: null,
    pinnedProfileIds: [],
    bridgePreferences: {
      readBroadContext: false,
      shareBroadStatus: false,
      lastExplicitShareAt: null
    },
    needsActiveProfileChoice: false,
    downgradeState: {
      status: "none",
      preservedAt: null,
      reasonCodes: []
    }
  };
}

function createEmptyState(options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var now = clock.now();
  return {
    schemaVersion: contracts.SCHEMA_VERSION,
    productVersion: contracts.PRODUCT_VERSION,
    buildRevision: contracts.BUILD_REVISION,
    packageHash: contracts.CANONICAL_PACKAGE_HASH,
    createdAt: now,
    updatedAt: now,
    userStrengthProfile: {
      id: "user_strength_profile_default",
      createdAt: now,
      updatedAt: now,
      bodyweightKg: null,
      experienceTag: "unknown",
      goals: []
    },
    standardLiftDefinitions: emptyMap(),
    customLiftDefinitions: emptyMap(),
    liftProfiles: emptyMap(),
    setupProfiles: emptyMap(),
    equipmentProfiles: emptyMap(),
    gymProfiles: emptyMap(),
    evidenceObservations: emptyMap(),
    plannedExposures: emptyMap(),
    sessions: emptyMap(),
    decisions: emptyMap(),
    decisionReceipts: emptyMap(),
    outcomes: emptyMap(),
    goals: emptyMap(),
    pass4: pass4Core.defaultPass4(clock),
    pass5: pass5Contracts.defaultPass5(clock),
    pass6: pass6Contracts.defaultPass6(clock),
    settings: defaultSettings(clock),
    migrationMetadata: {
      id: "migration_metadata_default",
      createdAt: now,
      updatedAt: now,
      status: "fresh",
      source: "empty",
      sourceSchemaVersion: null,
      sourceStorageKey: null,
      backupKey: null,
      unmappedFields: [],
      provenance: []
    },
    domainEvents: [],
    domainEventArchive: {
      entries: [],
      compactedAt: null,
      retained: 0,
      archivedCount: 0,
      archiveKey: null,
      archiveStatus: { available: false, kind: "not_created", error: "" },
      checkpoints: [],
      partialHistory: false,
      nextSequence: 0
    },
    indexes: {
      activeLiftProfileIds: [],
      archivedLiftProfileIds: [],
      setupIdsByLiftProfileId: {},
      equipmentIdsByGymProfileId: {}
    },
    preserved: {
      liftProfileIds: [],
      setupProfileIds: [],
      equipmentProfileIds: [],
      reasonCodes: []
    },
    unknownFields: {},
    persistence: {
      mode: "unknown",
      lastSavedAt: null,
      lastLoadedAt: null,
      lastError: "",
      backupAvailable: false
    }
  };
}

function normalizeEntityMap(value, normalizer, warnings) {
  var out = {};
  if (!runtime.isPlainObject(value)) return out;
  Object.keys(value).sort().forEach(function(id) {
    var normalized = normalizer(value[id], id, warnings);
    if (normalized && normalized.id) out[normalized.id] = normalized;
  });
  return out;
}

function normalizeTimestamp(value, fallback) {
  return runtime.safeISO(value) || fallback;
}

function normalizeDefinition(raw, id, warnings) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var next = runtime.clone(raw);
  next.id = runtime.safeTag(raw.id || id, 120) || runtime.stableId("definition", raw);
  next.version = runtime.safeTag(raw.version || "1", 40) || "1";
  next.displayName = runtime.trim(raw.displayName || raw.name || next.id, 120);
  next.aliases = runtime.safeTags(raw.aliases || [], 24);
  next.movementFamily = runtime.safeTag(raw.movementFamily || "unknown", 80) || "unknown";
  next.implement = runtime.safeTag(raw.implement || "unknown", 80) || "unknown";
  next.loadingModel = runtime.safeTag(raw.loadingModel || "personal_performance_only", 80) || "personal_performance_only";
  next.laterality = runtime.safeTag(raw.laterality || "bilateral", 40) || "bilateral";
  next.defaultUnit = raw.defaultUnit === "kg" ? "kg" : "lb";
  next.estimateEligible = raw.estimateEligible === true;
  next.peerBenchmarkEligible = raw.peerBenchmarkEligible === true;
  next.competitionStandardEligible = raw.competitionStandardEligible === true;
  next.personalComparisonEligible = raw.personalComparisonEligible !== false;
  next.setupRequirements = Array.isArray(raw.setupRequirements) ? raw.setupRequirements.slice() : [];
  next.requiredEquipmentFields = Array.isArray(raw.requiredEquipmentFields) ? raw.requiredEquipmentFields.slice() : [];
  next.deprecated = raw.deprecated === true;
  next.replacedBy = runtime.safeTag(raw.replacedBy || "", 120) || null;
  if (!next.displayName) warnings.push("definition_missing_name:" + next.id);
  return next;
}

function normalizeLiftProfile(raw, id, warnings, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var now = clock.now();
  var source = raw.source === "custom" ? "custom" : "standard";
  var next = runtime.clone(raw);
  next.id = runtime.safeTag(raw.id || id, 120) || runtime.stableId("lift_profile", raw);
  next.createdAt = normalizeTimestamp(raw.createdAt, now);
  next.updatedAt = normalizeTimestamp(raw.updatedAt, next.createdAt);
  next.source = source;
  next.standardDefinitionId = source === "standard" ? runtime.safeTag(raw.standardDefinitionId || raw.definitionId || "", 160) || null : null;
  next.customDefinitionId = source === "custom" ? runtime.safeTag(raw.customDefinitionId || raw.definitionId || "", 160) || null : null;
  next.displayName = runtime.trim(raw.displayName || raw.name || next.standardDefinitionId || next.customDefinitionId || next.id, 120);
  next.status = raw.status === "archived" ? "archived" : "active";
  next.pinned = raw.pinned === true;
  next.defaultSetupProfileId = runtime.safeTag(raw.defaultSetupProfileId || "", 120) || null;
  next.defaultEquipmentProfileId = runtime.safeTag(raw.defaultEquipmentProfileId || "", 120) || null;
  next.lastSelectedAt = normalizeTimestamp(raw.lastSelectedAt, null);
  next.lastTrainedAt = normalizeTimestamp(raw.lastTrainedAt, null);
  next.migration = runtime.isPlainObject(raw.migration) ? runtime.clone(raw.migration) : null;
  if (!next.displayName) warnings.push("lift_profile_missing_name:" + next.id);
  return next;
}

function normalizeSetup(raw, id, warnings, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var now = clock.now();
  var next = runtime.clone(raw);
  next.id = runtime.safeTag(raw.id || id, 120) || runtime.stableId("setup", raw);
  next.createdAt = normalizeTimestamp(raw.createdAt, now);
  next.updatedAt = normalizeTimestamp(raw.updatedAt, next.createdAt);
  next.liftProfileId = runtime.safeTag(raw.liftProfileId || "", 120) || null;
  next.equipmentProfileId = runtime.safeTag(raw.equipmentProfileId || "", 120) || null;
  next.gymProfileId = runtime.safeTag(raw.gymProfileId || "", 120) || null;
  next.name = runtime.trim(raw.name || "Default setup", 120);
  next.status = raw.status === "archived" ? "archived" : "active";
  next.isDefault = raw.isDefault !== false;
  next.fields = runtime.isPlainObject(raw.fields) ? runtime.clone(raw.fields) : {};
  next.fingerprint = runtime.safeTag(raw.fingerprint || "", 120) || null;
  if (!next.liftProfileId) warnings.push("setup_missing_lift_profile:" + next.id);
  return next;
}

function normalizeEquipment(raw, id, warnings, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var now = clock.now();
  var next = runtime.clone(raw);
  next.id = runtime.safeTag(raw.id || id, 120) || runtime.stableId("equipment", raw);
  next.createdAt = normalizeTimestamp(raw.createdAt, now);
  next.updatedAt = normalizeTimestamp(raw.updatedAt, next.createdAt);
  next.type = runtime.safeTag(raw.type || "unknown", 80) || "unknown";
  next.name = runtime.trim(raw.name || next.type, 120);
  next.gymProfileId = runtime.safeTag(raw.gymProfileId || "", 120) || null;
  next.fields = runtime.isPlainObject(raw.fields) ? runtime.clone(raw.fields) : {};
  next.fingerprint = runtime.safeTag(raw.fingerprint || "", 120) || null;
  return next;
}

function normalizeRecord(raw, id, type, clock) {
  raw = runtime.isPlainObject(raw) ? raw : {};
  var now = clock.now();
  var next = runtime.clone(raw);
  next.id = runtime.safeTag(raw.id || id, 120) || runtime.stableId(type, raw);
  next.createdAt = normalizeTimestamp(raw.createdAt, now);
  next.updatedAt = normalizeTimestamp(raw.updatedAt, next.createdAt);
  return next;
}

function rebuildIndexes(state) {
  var active = [];
  var archived = [];
  Object.keys(state.liftProfiles).sort().forEach(function(id) {
    if (state.liftProfiles[id].status === "archived") archived.push(id);
    else active.push(id);
  });
  var setupIdsByLiftProfileId = {};
  Object.keys(state.setupProfiles).sort().forEach(function(id) {
    var setup = state.setupProfiles[id];
    if (!setup.liftProfileId) return;
    if (!setupIdsByLiftProfileId[setup.liftProfileId]) setupIdsByLiftProfileId[setup.liftProfileId] = [];
    setupIdsByLiftProfileId[setup.liftProfileId].push(id);
  });
  var equipmentIdsByGymProfileId = {};
  Object.keys(state.equipmentProfiles).sort().forEach(function(id) {
    var equipment = state.equipmentProfiles[id];
    if (!equipment.gymProfileId) return;
    if (!equipmentIdsByGymProfileId[equipment.gymProfileId]) equipmentIdsByGymProfileId[equipment.gymProfileId] = [];
    equipmentIdsByGymProfileId[equipment.gymProfileId].push(id);
  });
  state.indexes = {
    activeLiftProfileIds: active,
    archivedLiftProfileIds: archived,
    setupIdsByLiftProfileId: setupIdsByLiftProfileId,
    equipmentIdsByGymProfileId: equipmentIdsByGymProfileId
  };
  if (state.settings.activeLiftProfileId && !state.liftProfiles[state.settings.activeLiftProfileId]) {
    state.settings.activeLiftProfileId = active[0] || null;
  }
  state.settings.pinnedProfileIds = (state.settings.pinnedProfileIds || []).filter(function(id) {
    return !!state.liftProfiles[id];
  });
  return state;
}

function captureUnknownTopLevel(raw) {
  var known = {
    schemaVersion: true,
    productVersion: true,
    buildRevision: true,
    packageHash: true,
    createdAt: true,
    updatedAt: true,
    userStrengthProfile: true,
    standardLiftDefinitions: true,
    customLiftDefinitions: true,
    liftProfiles: true,
    setupProfiles: true,
    equipmentProfiles: true,
    gymProfiles: true,
    evidenceObservations: true,
    plannedExposures: true,
    sessions: true,
    decisions: true,
    decisionReceipts: true,
    outcomes: true,
    goals: true,
    pass4: true,
    pass5: true,
    pass6: true,
    settings: true,
    migrationMetadata: true,
    domainEvents: true,
    domainEventArchive: true,
    indexes: true,
    preserved: true,
    unknownFields: true,
    persistence: true
  };
  var out = {};
  if (!runtime.isPlainObject(raw)) return out;
  Object.keys(raw).forEach(function(key) {
    if (!known[key]) out[key] = runtime.clone(raw[key]);
  });
  return out;
}

function normalizeState(raw, options) {
  options = options || {};
  var clock = options.clock || runtime.createClock(options.fixedNow);
  var now = clock.now();
  var warnings = [];
  if (!runtime.isPlainObject(raw)) {
    return { ok: true, state: createEmptyState({ clock: clock }), warnings: ["empty_state_created"] };
  }
  var schemaVersion = runtime.toInteger(raw.schemaVersion, 0);
  if (schemaVersion > contracts.SCHEMA_VERSION) {
    return {
      ok: false,
      reason: "future_schema",
      schemaVersion: schemaVersion,
      maxSupportedSchemaVersion: contracts.SCHEMA_VERSION,
      warnings: ["future_schema_rejected"]
    };
  }
  var state = createEmptyState({ clock: clock });
  state.schemaVersion = contracts.SCHEMA_VERSION;
  state.productVersion = runtime.safeTag(raw.productVersion || contracts.PRODUCT_VERSION, 80) || contracts.PRODUCT_VERSION;
  state.buildRevision = runtime.safeTag(raw.buildRevision || contracts.BUILD_REVISION, 120) || contracts.BUILD_REVISION;
  state.packageHash = runtime.safeTag(raw.packageHash || contracts.CANONICAL_PACKAGE_HASH, 160) || contracts.CANONICAL_PACKAGE_HASH;
  state.createdAt = normalizeTimestamp(raw.createdAt, now);
  state.updatedAt = normalizeTimestamp(raw.updatedAt, state.createdAt);
  state.userStrengthProfile = normalizeRecord(raw.userStrengthProfile, "user_strength_profile_default", "user_strength_profile", clock);
  state.standardLiftDefinitions = normalizeEntityMap(raw.standardLiftDefinitions, function(item, id) {
    return normalizeDefinition(item, id, warnings);
  }, warnings);
  state.customLiftDefinitions = normalizeEntityMap(raw.customLiftDefinitions, function(item, id) {
    return normalizeDefinition(item, id, warnings);
  }, warnings);
  state.liftProfiles = normalizeEntityMap(raw.liftProfiles, function(item, id) {
    return normalizeLiftProfile(item, id, warnings, clock);
  }, warnings);
  state.setupProfiles = normalizeEntityMap(raw.setupProfiles, function(item, id) {
    return normalizeSetup(item, id, warnings, clock);
  }, warnings);
  state.equipmentProfiles = normalizeEntityMap(raw.equipmentProfiles, function(item, id) {
    return normalizeEquipment(item, id, warnings, clock);
  }, warnings);
  state.gymProfiles = normalizeEntityMap(raw.gymProfiles, function(item, id) {
    return normalizeRecord(item, id, "gym", clock);
  }, warnings);
  state.evidenceObservations = normalizeEntityMap(raw.evidenceObservations, function(item, id) {
    return normalizeRecord(item, id, "evidence", clock);
  }, warnings);
  state.plannedExposures = normalizeEntityMap(raw.plannedExposures, function(item, id) {
    return normalizeRecord(item, id, "planned_exposure", clock);
  }, warnings);
  state.sessions = normalizeEntityMap(raw.sessions, function(item, id) {
    return normalizeRecord(item, id, "session", clock);
  }, warnings);
  state.decisions = normalizeEntityMap(raw.decisions, function(item, id) {
    return normalizeRecord(item, id, "decision", clock);
  }, warnings);
  state.decisionReceipts = normalizeEntityMap(raw.decisionReceipts, function(item, id) {
    return normalizeRecord(item, id, "decision_receipt", clock);
  }, warnings);
  state.outcomes = normalizeEntityMap(raw.outcomes, function(item, id) {
    return normalizeRecord(item, id, "outcome", clock);
  }, warnings);
  state.goals = normalizeEntityMap(raw.goals, function(item, id) {
    return normalizeRecord(item, id, "goal", clock);
  }, warnings);
  state.pass4 = pass4Core.normalizePass4(raw.pass4, { clock: clock });
  state.pass5 = pass5Contracts.normalizePass5(raw.pass5, { clock: clock });
  state.pass6 = pass6Contracts.normalizePass6(raw.pass6, { clock: clock });
  state.settings = runtime.merge(defaultSettings(clock), raw.settings || {});
  state.settings.updatedAt = normalizeTimestamp(state.settings.updatedAt, now);
  state.settings.units = state.settings.units === "kg" ? "kg" : "lb";
  state.settings.activeLiftProfileId = runtime.safeTag(state.settings.activeLiftProfileId || "", 120) || null;
  state.settings.pinnedProfileIds = runtime.safeTags(state.settings.pinnedProfileIds || [], 50);
  state.migrationMetadata = runtime.merge(state.migrationMetadata, raw.migrationMetadata || {});
  state.migrationMetadata.updatedAt = normalizeTimestamp(state.migrationMetadata.updatedAt, now);
  state.domainEvents = Array.isArray(raw.domainEvents) ? raw.domainEvents.map(function(event, index) {
    return normalizeRecord(event, "event_" + index, "domain_event", clock);
  }) : [];
  state.domainEventArchive = runtime.merge(state.domainEventArchive, raw.domainEventArchive || {});
  state.domainEventArchive.entries = Array.isArray(state.domainEventArchive.entries) ? state.domainEventArchive.entries.map(function(event, index) {
    return normalizeRecord(event, "archived_event_" + index, "domain_event", clock);
  }) : [];
  state.domainEventArchive.compactedAt = normalizeTimestamp(state.domainEventArchive.compactedAt, null);
  state.domainEventArchive.retained = runtime.toInteger(state.domainEventArchive.retained, 0);
  state.domainEventArchive.archivedCount = runtime.toInteger(state.domainEventArchive.archivedCount, state.domainEventArchive.entries.length);
  state.domainEventArchive.checkpoints = Array.isArray(state.domainEventArchive.checkpoints) ? state.domainEventArchive.checkpoints.map(function(item, index) {
    return normalizeRecord(item, "event_checkpoint_" + index, "event_checkpoint", clock);
  }) : [];
  state.domainEventArchive.archiveStatus = runtime.isPlainObject(state.domainEventArchive.archiveStatus) ? runtime.clone(state.domainEventArchive.archiveStatus) : { available: false, kind: "unknown", error: "" };
  state.domainEventArchive.partialHistory = state.domainEventArchive.partialHistory === true;
  state.domainEventArchive.nextSequence = runtime.toInteger(state.domainEventArchive.nextSequence, state.domainEvents.reduce(function(best, item) {
    var seq = runtime.toInteger(item && item.sequence, -1);
    return seq > best ? seq : best;
  }, -1) + 1);
  state.preserved = runtime.merge(state.preserved, raw.preserved || {});
  state.unknownFields = runtime.merge(raw.unknownFields || {}, captureUnknownTopLevel(raw));
  state.persistence = runtime.merge(state.persistence, raw.persistence || {});
  rebuildIndexes(state);
  return { ok: true, state: state, warnings: warnings };
}

function exportRaw(state, options) {
  options = options || {};
  var normalized = normalizeState(state, options);
  if (!normalized.ok) return normalized;
  var out = runtime.clone(normalized.state);
  if (options.eventArchive && Array.isArray(options.eventArchive.entries)) {
    out.domainEventArchive.entries = options.eventArchive.entries.map(function(event, index) {
      return normalizeRecord(event, "exported_archived_event_" + index, "domain_event", options.clock || runtime.createClock(options.fixedNow));
    });
    out.domainEventArchive.archiveStatus = runtime.merge(out.domainEventArchive.archiveStatus || {}, { available: true, kind: "included_in_export" });
    out.domainEventArchive.partialHistory = false;
  } else if (out.domainEventArchive && out.domainEventArchive.archivedCount > 0 && !out.domainEventArchive.entries.length) {
    out.domainEventArchive.partialHistory = true;
  }
  if (options.includeRuntime !== true) {
    out.persistence = {
      mode: "exported",
      lastSavedAt: null,
      lastLoadedAt: null,
      lastError: "",
      backupAvailable: false
    };
  }
  return {
    ok: true,
    exportedAt: (options.clock || runtime.createClock(options.fixedNow)).now(),
    productVersion: contracts.PRODUCT_VERSION,
    buildRevision: contracts.BUILD_REVISION,
    packageHash: contracts.CANONICAL_PACKAGE_HASH,
    schemaVersion: contracts.SCHEMA_VERSION,
    state: out
  };
}

function preservationImportError(raw) {
  if (!raw || raw.schemaVersion !== "strength-guest-workspace-export.v1") return null;
  return { ok: false, reason: "preservation_export_requires_recovery", message: "This is a raw preservation export, not a normal backup. Keep this file for recovery. Your current records have not changed." };
}

function importPreview(raw, options) {
  var rejected = preservationImportError(raw);
  if (rejected) return rejected;
  var normalized = normalizeState(raw, options || {});
  if (!normalized.ok) return normalized;
  return {
    ok: true,
    schemaVersion: normalized.state.schemaVersion,
    productVersion: normalized.state.productVersion,
    counts: {
      liftProfiles: Object.keys(normalized.state.liftProfiles).length,
      setupProfiles: Object.keys(normalized.state.setupProfiles).length,
      equipmentProfiles: Object.keys(normalized.state.equipmentProfiles).length,
      evidenceObservations: Object.keys(normalized.state.evidenceObservations).length,
      decisions: Object.keys(normalized.state.decisions).length,
      outcomes: Object.keys(normalized.state.outcomes).length,
      pass5BenchmarkSnapshots: Object.keys(normalized.state.pass5 && normalized.state.pass5.benchmarkSnapshots || {}).length,
      pass6ImportReceipts: Object.keys(normalized.state.pass6 && normalized.state.pass6.imports && normalized.state.pass6.imports.receipts || {}).length,
      pass6PassportReceipts: Object.keys(normalized.state.pass6 && normalized.state.pass6.passports && normalized.state.pass6.passports.receipts || {}).length,
      domainEvents: normalized.state.domainEvents.length,
      archivedDomainEvents: normalized.state.domainEventArchive.entries.length || runtime.toInteger(normalized.state.domainEventArchive.archivedCount, 0)
    },
    warnings: normalized.warnings,
    stateFingerprint: runtime.fingerprint(normalized.state)
  };
}

module.exports = {
  createEmptyState: createEmptyState,
  normalizeState: normalizeState,
  rebuildIndexes: rebuildIndexes,
  exportRaw: exportRaw,
  preservationImportError: preservationImportError,
  importPreview: importPreview
};
