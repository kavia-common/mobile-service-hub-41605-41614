import { getAppEnv, warnIfMissingBackend } from "../config/env";
import { mockServices } from "../data/mockServices";

/**
 * Very small data layer: attempts to fetch from backend if configured,
 * otherwise uses mock data.
 */

const withTimeout = (promise, ms = 8000) => {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Request timeout")), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
};

// PUBLIC_INTERFACE
export async function listServices() {
  /** Fetch list of services from backend when available; else return mock data. */
  const env = getAppEnv();
  warnIfMissingBackend(env);

  if (!env.apiBase) return { source: "mock", data: mockServices };

  try {
    const url = new URL("/api/services", env.apiBase).toString();
    const res = await withTimeout(fetch(url, { headers: { Accept: "application/json" } }), 8000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // Expect either {data:[...]} or [...]
    const data = Array.isArray(json) ? json : json?.data;
    if (!Array.isArray(data)) throw new Error("Unexpected response format");

    return { source: "api", data };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[servicesApi] Falling back to mock services due to error:", e);
    return { source: "mock", data: mockServices };
  }
}

// PUBLIC_INTERFACE
export async function getServiceById(id) {
  /** Fetch a single service by id; falls back to mock. */
  const { data } = await listServices();
  const found = data.find((s) => String(s.id) === String(id));
  return found || null;
}
