import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeBrandToSearch, persistSelectedBrand } from "../utils/brandSelection";

/**
 * Premium Brand Tile
 *
 * Requirements implemented:
 * - Official logos displayed with equal visual weight (consistent container + sizing).
 * - Subtle uniform container (border + soft surface), smooth hover/focus.
 * - Centered brand label under logo.
 * - Preserve existing navigation: /services?brand=<BrandName> and persisted selection.
 */

// PUBLIC_INTERFACE
export default function BrandCard({
  name,
  logoSrc,
  logoAlt,
  helperText = "",
  secondaryActionLabel = "",
  showSecondaryAction = false
}) {
  /** Premium, accessible brand tile that navigates to Services with brand preselected. */
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(true);

  const computedAlt = useMemo(() => {
    if (logoAlt && String(logoAlt).trim()) return String(logoAlt).trim();
    if (name && String(name).trim()) return `${String(name).trim()} logo`;
    return "Brand logo";
  }, [logoAlt, name]);

  const showImage = Boolean(logoSrc) && imgOk;

  const openBrand = () => {
    const brand = String(name || "").trim();
    if (!brand) return;

    // Keep the existing behavior used by Services/Booking flows.
    persistSelectedBrand(brand);
    navigate(`/services${encodeBrandToSearch(brand)}`, {
      state: { selectedBrand: brand }
    });
  };

  return (
    <button
      type="button"
      className="brandLogoTile brandLogoTile--premium"
      onClick={openBrand}
      aria-label={`Browse services for ${name || "this brand"}`}
      title={name || ""}
    >
      <span className="brandLogoTile__surface" aria-hidden="true" />
      <span className="brandLogoTile__content">
        <span className="brandLogoTile__logoWrap">
          {showImage ? (
            <img
              className="brandLogoTile__img"
              src={logoSrc}
              alt={computedAlt}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <span className="brandLogoTile__fallback" aria-hidden="true">
              {String(name || "?").slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>

        <span className="brandLogoTile__label">{name}</span>
      </span>

      {/* Keep API backward-compatibility (props) without changing visuals. */}
      {Boolean(helperText) && showSecondaryAction && secondaryActionLabel ? (
        <span className="srOnly">
          {helperText} {secondaryActionLabel}
        </span>
      ) : null}
    </button>
  );
}
