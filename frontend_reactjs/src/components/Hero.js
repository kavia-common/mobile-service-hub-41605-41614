import React from "react";
import { Link } from "react-router-dom";
import BrandCard from "./BrandCard";

import appleLogo from "../assets/brands/apple.svg";
import samsungLogo from "../assets/brands/samsung.svg";
import googleLogo from "../assets/brands/google.svg";
import oneplusLogo from "../assets/brands/oneplus.svg";
import xiaomiLogo from "../assets/brands/xiaomi.svg";
import huaweiLogo from "../assets/brands/huawei.svg";
import motorolaLogo from "../assets/brands/motorola.svg";
import nokiaLogo from "../assets/brands/nokia.svg";
import sonyLogo from "../assets/brands/sony.svg";
import lgLogo from "../assets/brands/lg.svg";

const defaultBrands = [
  { name: "Apple", logoSrc: appleLogo, logoAlt: "Apple logo" },
  { name: "Samsung", logoSrc: samsungLogo, logoAlt: "Samsung logo" },
  { name: "Google", logoSrc: googleLogo, logoAlt: "Google logo" },
  { name: "OnePlus", logoSrc: oneplusLogo, logoAlt: "OnePlus logo" },
  { name: "Xiaomi", logoSrc: xiaomiLogo, logoAlt: "Xiaomi logo" },
  { name: "Huawei", logoSrc: huaweiLogo, logoAlt: "Huawei logo" },
  { name: "Motorola", logoSrc: motorolaLogo, logoAlt: "Motorola logo" },
  { name: "Nokia", logoSrc: nokiaLogo, logoAlt: "Nokia logo" },
  { name: "Sony", logoSrc: sonyLogo, logoAlt: "Sony logo" },
  { name: "LG", logoSrc: lgLogo, logoAlt: "LG logo" }
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
              <div role="listitem" key={b?.name || String(b)}>
                <BrandCard
                  name={b?.name || b}
                  logoSrc={b?.logoSrc}
                  logoAlt={b?.logoAlt}
                />
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
