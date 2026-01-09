import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeBrandToSearch, persistSelectedBrand } from "../utils/brandSelection";

/**
 * Large, tap-friendly Brand card (02.03).
 *
 * Behavior:
 * - Clicking navigates to /services?brand=<BrandName>
 * - Also persists the selection so Booking can default to the same brand.
 *
 * UI refinements:
 * - Optional helper text under the brand name
 * - Optional secondary action (small button) without triggering the main navigation
 */

// PUBLIC_INTERFACE
export default function BrandCard({
  name,
  logoSrc,
  logoAlt,
  helperText = "View compatible options and pricing.",
  secondaryActionLabel = "Browse",
  showSecondaryAction = true
}) {
  /** Render a large clickable brand card that navigates to Services with brand preselected. */
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
      className="brandBigCard"
      onClick={openBrand}
      aria-label={`Browse services for ${name || "this brand"}`}
    >
      <span className="brandBigCard__inner">
        <span className="brandBigCard__mark" aria-hidden="true">
          {showImage ? (
            <img
              className="brandBigCard__logo"
              src={logoSrc}
              alt={computedAlt}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <span className="brandBigCard__initial">
              {String(name || "?").slice(0, 1).toUpperCase()}
            </span>
          )}
        </span>

        <span className="brandBigCard__text">
          <span className="brandBigCard__nameRow">
            <span className="brandBigCard__name">{name}</span>
            <span className="brandBigCard__arrow" aria-hidden="true">
              →
            </span>
          </span>

          {helperText ? <span className="brandBigCard__helper">{helperText}</span> : null}

          {showSecondaryAction ? (
            <span className="brandBigCard__actions">
              <span
                role="button"
                tabIndex={0}
                className="brandBigCard__secondaryBtn"
                onClick={(e) => {
                  // Prevent triggering the main button click.
                  e.preventDefault();
                  e.stopPropagation();
                  openBrand();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    openBrand();
                  }
                }}
                aria-label={`${secondaryActionLabel} ${name || "brand"}`}
              >
                {secondaryActionLabel}
              </span>
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
