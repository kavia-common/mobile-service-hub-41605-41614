import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function ServiceCard({ service }) {
  /** Service card used in grids and lists. */
  const price = service?.priceFrom != null ? `$${service.priceFrom}+` : "Quote";
  const eta = service?.eta || "Varies";

  return (
    <article className="card serviceCard">
      <div className="serviceCard__top">
        <div className="serviceCard__name">{service?.name || "Service"}</div>
        {service?.badge ? <span className="pill pill--amber">{service.badge}</span> : null}
      </div>

      <p className="serviceCard__desc">
        {service?.description || "Details coming soon."}
      </p>

      <div className="serviceCard__meta">
        <div className="metaItem">
          <div className="metaItem__label">ETA</div>
          <div className="metaItem__value">{eta}</div>
        </div>
        <div className="metaItem">
          <div className="metaItem__label">From</div>
          <div className="metaItem__value">{price}</div>
        </div>
      </div>

      <div className="serviceCard__actions">
        <Link to={`/services/${service?.id || ""}`} className="btn btn--soft">
          Details
        </Link>
        <Link to="/booking" className="btn btn--primary">
          Book
        </Link>
      </div>
    </article>
  );
}
