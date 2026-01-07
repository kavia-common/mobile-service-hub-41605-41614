import React, { useMemo, useState } from "react";

/**
 * Small presentational card for a single brand item.
 */

// PUBLIC_INTERFACE
export default function BrandCard({ name, logoSrc, logoAlt }) {
  /** Render a single brand tile inside the brand grid (supports optional logo). */
  const [imgOk, setImgOk] = useState(true);

  const computedAlt = useMemo(() => {
    if (logoAlt && String(logoAlt).trim()) return String(logoAlt).trim();
    if (name && String(name).trim()) return `${String(name).trim()} logo`;
    return "Brand logo";
  }, [logoAlt, name]);

  const showImage = Boolean(logoSrc) && imgOk;

  return (
    <article className="card brandCard" aria-label={`Brand ${name || ""}`.trim()}>
      <div className="brandCard__inner">
        <div className="brandCard__mark" aria-hidden="true">
          {showImage ? (
            <img
              className="brandCard__logo"
              src={logoSrc}
              alt={computedAlt}
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <span className="brandCard__initial">
              {String(name || "?").slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="brandCard__name">{name}</div>
      </div>
    </article>
  );
}
