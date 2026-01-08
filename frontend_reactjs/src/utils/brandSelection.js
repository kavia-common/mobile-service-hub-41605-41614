/**
 * Helpers for selecting a device brand across routes (Home -> Services -> Booking).
 *
 * We use a query string (?brand=Apple) as the shareable/refresh-safe source of truth,
 * and also persist to localStorage so the choice can be recovered if the user
 * lands on /booking directly.
 */

const STORAGE_KEY = "msh.selectedBrand";

const normalizeBrand = (value) => {
  if (value === undefined || value === null) return "";
  const trimmed = String(value).trim();
  return trimmed;
};

// PUBLIC_INTERFACE
export function encodeBrandToSearch(brand) {
  /** Encode a brand value into a URL search string (e.g. "?brand=Apple"). */
  const b = normalizeBrand(brand);
  if (!b) return "";
  const params = new URLSearchParams();
  params.set("brand", b);
  return `?${params.toString()}`;
}

// PUBLIC_INTERFACE
export function getBrandFromSearch(search) {
  /** Extract a brand value from a location.search string. */
  const params = new URLSearchParams(search || "");
  return normalizeBrand(params.get("brand"));
}

// PUBLIC_INTERFACE
export function persistSelectedBrand(brand) {
  /** Persist selected brand to localStorage (best-effort). */
  const b = normalizeBrand(brand);
  try {
    if (!b) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, b);
  } catch {
    // Ignore storage failures (private mode, disabled storage, etc.)
  }
}

// PUBLIC_INTERFACE
export function getPersistedSelectedBrand() {
  /** Read the persisted selected brand from localStorage (best-effort). */
  try {
    return normalizeBrand(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return "";
  }
}

// PUBLIC_INTERFACE
export function clearPersistedSelectedBrand() {
  /** Clear persisted brand selection (best-effort). */
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
