import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Hero({ title, subtitle, ctaLabel = "Book a service", ctaTo = "/booking", secondaryLabel = "View services", secondaryTo = "/services" }) {
  /** Hero/banner section with primary and secondary CTAs. */
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__kicker">Mobile help, simplified</div>
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{subtitle}</p>

          <div className="hero__actions">
            <Link to={ctaTo} className="btn btn--primary btn--large">
              {ctaLabel}
            </Link>
            <Link to={secondaryTo} className="btn btn--ghost btn--large">
              {secondaryLabel}
            </Link>
          </div>

          <div className="hero__trust">
            <div className="stat">
              <div className="stat__value">Fast</div>
              <div className="stat__label">Quick turnaround</div>
            </div>
            <div className="stat">
              <div className="stat__value">Clear</div>
              <div className="stat__label">Up-front estimates</div>
            </div>
            <div className="stat">
              <div className="stat__value">Help</div>
              <div className="stat__label">Friendly support</div>
            </div>
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
