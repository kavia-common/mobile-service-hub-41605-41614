import React from "react";

/**
 * Small presentational card for a single brand item.
 */

// PUBLIC_INTERFACE
export default function BrandCard({ name }) {
  /** Render a single brand tile inside the brand grid. */
  return (
    <article className="card brandCard" aria-label={`Brand ${name}`}>
      <div className="brandCard__inner">
        <div className="brandCard__mark" aria-hidden="true">
          {String(name || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="brandCard__name">{name}</div>
      </div>
    </article>
  );
}
