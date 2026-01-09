import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeBrandToSearch, persistSelectedBrand } from "../utils/brandSelection";

/**
 * BrandLogoTile (replaces previous card-style BrandCard).
 *
 * Requirements implemented:
 * - Flat official logos (no card background/border/shadow).
 * - Uniform sizing and centered alignment.
 * - Subtle hover (scale + opacity) and accessible focus ring.
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
  /** Render a flat, clickable brand logo tile that navigates to Services with brand preselected. */
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

    persistSelectedBrand(brand);
    navigate(`/services${encodeBrandToSearch(brand)}`, {
      state: { selectedBrand: brand }
    });
  };

  return (
    <button
      type="button"
      className="brandLogoTile"
      onClick={openBrand}
      aria-label={`Browse services for ${name || "this brand"}`}
      title={name || ""}
    >
      <span className="brandLogoTile__inner">
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

      {/* Keep API backward-compatibility (props), but do not render card UI per requirements. */}
      {Boolean(helperText) && showSecondaryAction && secondaryActionLabel ? (
        <span className="srOnly">
          {helperText} {secondaryActionLabel}
        </span>
      ) : null}
    </button>
  );
}
