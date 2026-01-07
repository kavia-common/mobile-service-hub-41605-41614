/**
 * Environment configuration helpers for the frontend.
 * Uses CRA-style REACT_APP_* env vars.
 */

const toBool = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const safeJsonParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[env] Failed to parse JSON env var:", e);
    return fallback;
  }
};

// PUBLIC_INTERFACE
export function getAppEnv() {
  /** Return normalized environment configuration for the app. */
  const apiBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    "";

  const frontendUrl = process.env.REACT_APP_FRONTEND_URL || "";
  const wsUrl = process.env.REACT_APP_WS_URL || "";
  const nodeEnv = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || "development";

  const logLevel = process.env.REACT_APP_LOG_LEVEL || (nodeEnv === "production" ? "warn" : "info");

  const featureFlags = safeJsonParse(process.env.REACT_APP_FEATURE_FLAGS, {});
  const experimentsEnabled = toBool(process.env.REACT_APP_EXPERIMENTS_ENABLED, false);

  return {
    apiBase,
    frontendUrl,
    wsUrl,
    nodeEnv,
    logLevel,
    healthcheckPath: process.env.REACT_APP_HEALTHCHECK_PATH || "/health",
    trustProxy: toBool(process.env.REACT_APP_TRUST_PROXY, false),
    port: process.env.REACT_APP_PORT || "3000",
    enableSourceMaps: toBool(process.env.REACT_APP_ENABLE_SOURCE_MAPS, true),
    nextTelemetryDisabled: toBool(process.env.REACT_APP_NEXT_TELEMETRY_DISABLED, true),
    featureFlags,
    experimentsEnabled
  };
}

// PUBLIC_INTERFACE
export function warnIfMissingBackend(env = getAppEnv()) {
  /** Log a helpful warning if backend/api base URL is not configured. */
  if (!env.apiBase) {
    // eslint-disable-next-line no-console
    console.warn(
      "[Mobile Service Hub] No API base configured (REACT_APP_API_BASE or REACT_APP_BACKEND_URL). Using mock data."
    );
  }
}
