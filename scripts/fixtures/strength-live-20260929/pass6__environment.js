"use strict";

var LIVE_HOSTNAMES = Object.freeze(["neuform-fitness.com", "www.neuform-fitness.com"]);

function runtimeConfig(runtimeEnv) {
  runtimeEnv = runtimeEnv || {};
  return runtimeEnv.NF_STRENGTH_LAB_V3 && runtimeEnv.NF_STRENGTH_LAB_V3.config || runtimeEnv.config || {};
}

function hostname(runtimeEnv) {
  runtimeEnv = runtimeEnv || {};
  var loc = runtimeEnv.location || runtimeEnv.window && runtimeEnv.window.location || {};
  return String(loc.hostname || runtimeEnv.hostname || "").toLowerCase();
}

function normalizeExplicit(value) {
  var env = String(value || "").toLowerCase().trim();
  if (env === "mock") return "mock";
  if (env === "live" || env === "production") return "live";
  if (env === "sandbox" || env === "staging" || env.indexOf("sandbox_") === 0 || env.indexOf("staging_") === 0) return "sandbox";
  if (env === "local_fixture" || env === "fixture" || env === "local" || env === "closed") return "local_fixture";
  return "";
}

function isLiveHost(host) {
  host = String(host || "").toLowerCase();
  return LIVE_HOSTNAMES.indexOf(host) >= 0;
}

function isApprovedSandboxHost(host) {
  host = String(host || "").toLowerCase();
  return /\.webflow\.io$/.test(host);
}

function isProductionLikeHost(host) {
  host = String(host || "").toLowerCase();
  return !!host && host.indexOf("neuform-fitness.com") >= 0 && !isLiveHost(host) && !isApprovedSandboxHost(host);
}

function runtimeEnvFromOptions(options) {
  options = options || {};
  return options.runtimeEnv || options.env || options.global || {};
}

function resolveEnvironment(options) {
  options = options || {};
  var runtimeEnv = runtimeEnvFromOptions(options);
  var config = runtimeConfig(runtimeEnv);
  var explicit = normalizeExplicit(options.environment);
  if (explicit) return explicit;
  explicit = normalizeExplicit(config.commercialEnvironment);
  if (explicit) return explicit;
  var host = hostname(runtimeEnv);
  if (isLiveHost(host)) return "live";
  if (isApprovedSandboxHost(host)) return "sandbox";
  return "local_fixture";
}

function resolveEnvironmentDetails(options) {
  options = options || {};
  var runtimeEnv = runtimeEnvFromOptions(options);
  var env = resolveEnvironment(options);
  var host = hostname(runtimeEnv);
  return {
    environment: env,
    hostname: host,
    live: env === "live",
    sandbox: env === "sandbox",
    mock: env === "mock",
    localFixture: env === "local_fixture",
    commercialAllowed: env === "live" || env === "sandbox" || env === "mock",
    commercialFailClosed: env === "local_fixture" || isProductionLikeHost(host)
  };
}

module.exports = {
  LIVE_HOSTNAMES: LIVE_HOSTNAMES,
  isLiveHost: isLiveHost,
  isApprovedSandboxHost: isApprovedSandboxHost,
  isProductionLikeHost: isProductionLikeHost,
  resolveEnvironment: resolveEnvironment,
  resolveEnvironmentDetails: resolveEnvironmentDetails
};
