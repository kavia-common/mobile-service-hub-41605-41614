import React from "react";
import { Link } from "react-router-dom";
import BrandCard from "./BrandCard";

const defaultBrands = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Huawei",
  "Motorola",
  "Nokia",
  "Sony",
  "LG"
];

// PUBLIC_INTERFACE
export default function Hero({
  ctaLabel = "Book a service",
  ctaTo = "/booking",
  secondaryLabel = "View services",
  secondaryTo = "/services",
  brands = defaultBrands
}) {
  /** Hero/banner section with a brand grid plus primary and secondary CTAs. */
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__gridHeader">
            <div>
              <div className="pill pill--soft">Brands we support</div>
              <p className="muted hero__gridSub">
                Select a brand to explore common services and repairs. (Placeholder list)
              </p>
            </div>
          </div>

          <div className="brandGrid" role="list" aria-label="Supported brands">
            {brands.slice(0, 10).map((b) => (
              <div role="listitem" key={b}>
                <BrandCard name={b} />
              </div>
            ))}
          </div>

          <div className="hero__actions">
            <Link to={ctaTo} className="btn btn--primary btn--large">
              {ctaLabel}
            </Link>
            <Link to={secondaryTo} className="btn btn--ghost btn--large">
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="hero__card" aria-label="Featured services">
          <div className="heroCard__header">
            <div className="heroCard__title">Featured services</div>
            <div className="heroCard__badge">This week</div>
          </div>
          <ul className="heroCard__list">
            <li><span className="dot dot--primary" /> Screen repair</li>
            <li><span className="dot dot--amber" /> Battery replacement</li>
            <li><span className="dot dot--primary" /> Charging port fixes</li>
            <li><span className="dot dot--amber" /> Diagnostics</li>
          </ul>
          <div className="heroCard__footer">
            <Link to="/services" className="link">
              Browse all services →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
