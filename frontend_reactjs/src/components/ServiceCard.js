import React from "react";
import { Link } from "react-router-dom";
import { encodeBrandToSearch, persistSelectedBrand } from "../utils/brandSelection";

// PUBLIC_INTERFACE
export default function ServiceCard({ service, selectedBrand = "" }) {
  /** Service card used in grids and lists; carries selected brand into Booking. */
  const price = service?.priceFrom != null ? `$${service.priceFrom}+` : "Quote";
  const eta = service?.eta || "Varies";

  const brand = String(selectedBrand || "").trim();

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

        <Link
          to={`/booking${encodeBrandToSearch(brand)}`}
          state={brand ? { selectedBrand: brand } : undefined}
          className="btn btn--primary"
          onClick={() => {
            if (brand) persistSelectedBrand(brand);
          }}
        >
          Book
        </Link>
      </div>
    </article>
  );
}
