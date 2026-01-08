import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encodeBrandToSearch, persistSelectedBrand } from "../utils/brandSelection";

/**
 * Large, tap-friendly Brand card (02.03).
 *
 * Behavior:
 * - Clicking navigates to /services?brand=<BrandName>
 * - Also persists the selection so Booking can default to the same brand.
 */

// PUBLIC_INTERFACE
export default function BrandCard({ name, logoSrc, logoAlt }) {
  /** Render a large clickable brand card that navigates to Services with brand preselected. */
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(true);

  const computedAlt = useMemo(() => {
    if (logoAlt && String(logoAlt).trim()) return String(logoAlt).trim();
    if (name && String(name).trim()) return `${String(name).trim()} logo`;
    return "Brand logo";
  }, [logoAlt, name]);

  const showImage = Boolean(logoSrc) && imgOk;

  const onOpen = () => {
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
      onClick={onOpen}
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
          <span className="brandBigCard__name">{name}</span>
          <span className="brandBigCard__hint">View services →</span>
        </span>
      </span>
    </button>
  );
}
