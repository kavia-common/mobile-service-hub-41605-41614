import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BrandCard from "../components/BrandCard";

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

const popularBrands = [
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

/**
 * Map section (MVP):
 * - Uses a static demo route in Bangalore via Google Maps "directions" embed.
 * - No login and no real-time GPS tracking required.
 *
 * If you later want browser-based location:
 * - you can read navigator.geolocation and dynamically build an embed URL.
 * - keep it optional and failure-tolerant (permission denied, unsupported, etc).
 */

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page with premium, minimal hero + brand quick-pick + trust-building map section. */

  const scrollToBrandSelection = () => {
    const el = document.getElementById("brand-selection");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToMapSection = () => {
    const el = document.getElementById("repair-tracking");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const mapEmbedSrc = useMemo(() => {
    // Demo route in Bangalore:
    // - Origin: a "Service Center" like point (Koramangala)
    // - Destination: the "You" location (MG Road)
    //
    // Google Maps embed doesn't let us rename markers, so we provide an accessible legend below
    // matching the requirements ("Service Center" and "You").
    const origin = encodeURIComponent("Koramangala, Bengaluru, Karnataka");
    const destination = encodeURIComponent("MG Road, Bengaluru, Karnataka");
    return `https://www.google.com/maps?output=embed&dirflg=d&saddr=${origin}&daddr=${destination}`;
  }, []);

  return (
    <main className="home">
      {/* Premium hero (per spec) */}
      <section className="homeHero" aria-label="Hero">
        <div className="homeHero__bg" aria-hidden="true" />
        <div className="homeHero__overlay" aria-hidden="true" />

        <div className="container homeHero__inner">
          <div className="homeHero__content">
            <h1 className="homeHero__title">Trusted Mobile Repair Services Near You</h1>
            <p className="homeHero__subtitle">
              Fast, reliable phone repair for all major brands. Book your service in minutes.
            </p>

            <div className="homeHero__actions">
              <button
                type="button"
                className="btn btn--primary homeHero__cta homeHero__cta--primary"
                onClick={scrollToBrandSelection}
              >
                Select Your Phone Model
              </button>

              <div className="homeHero__belowCta">
                <div className="homeHero__finePrint">
                  No login required • Doorstep service available
                </div>

                <button
                  type="button"
                  className="btn btn--ghost homeHero__ctaSecondary"
                  onClick={scrollToMapSection}
                  style={{
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "rgba(255,255,255,0.92)"
                  }}
                >
                  See tracking preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* MAP + TRUST INDICATORS (per attached requirements) */}
        <section id="repair-tracking" className="section" aria-label="Repair tracking map">
          <h2 className="homeMap__title">Your Device Is Handled Securely — Tracked in Real Time</h2>

          <div className="homeMap__wrap card">
            <div className="homeMap__frame" aria-label="Demo route map from Service Center to you">
              <iframe
                title="Demo repair route map"
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>

            <div className="homeMap__legend" aria-label="Map marker legend">
              <div className="homeMap__legendItem">
                <span className="homeMap__pin homeMap__pin--center" aria-hidden="true" />
                <span><strong>Service Center</strong> (demo)</span>
              </div>
              <div className="homeMap__legendItem">
                <span className="homeMap__pin homeMap__pin--you" aria-hidden="true" />
                <span><strong>You</strong> (demo)</span>
              </div>
            </div>
          </div>

          <div className="homeTrustGrid" role="list" aria-label="Trust indicators">
            <div className="card homeTrustCard" role="listitem">
              <div className="homeTrustCard__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    d="M12 3.8c-3.9 0-7 3.1-7 7 0 3.9 3.1 7 7 7s7-3.1 7-7c0-3.9-3.1-7-7-7z"
                    fill="none"
                    stroke="rgba(37,99,235,0.9)"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 7.2v5.1l3.1 2.0"
                    fill="none"
                    stroke="rgba(245,158,11,0.95)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="homeTrustCard__text">Real-Time Service Updates</div>
            </div>

            <div className="card homeTrustCard" role="listitem">
              <div className="homeTrustCard__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    d="M12 2.8l7 3.4v6.4c0 5-3 8.2-7 9.6-4-1.4-7-4.6-7-9.6V6.2l7-3.4z"
                    fill="none"
                    stroke="rgba(37,99,235,0.9)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.3 12.0l1.8 1.8 3.6-3.9"
                    fill="none"
                    stroke="rgba(245,158,11,0.95)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="homeTrustCard__text">Secure Pickup & Delivery</div>
            </div>

            <div className="card homeTrustCard" role="listitem">
              <div className="homeTrustCard__icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    d="M7 7.5h10"
                    fill="none"
                    stroke="rgba(37,99,235,0.9)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.4 4.8h7.2"
                    fill="none"
                    stroke="rgba(37,99,235,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.6 10.1c-1.3 1.2-2.1 2.9-2.1 4.7 0 3.6 3.4 6.5 7.5 6.5s7.5-2.9 7.5-6.5c0-1.8-.8-3.5-2.1-4.7"
                    fill="none"
                    stroke="rgba(245,158,11,0.95)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="homeTrustCard__text">60-Minute Repair Service</div>
            </div>
          </div>
        </section>

        {/* Brand selection section (CTA scroll target) */}
        <section id="brand-selection" className="section" style={{ paddingTop: 26 }}>
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Choose your brand</h2>
              <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
                Tap a brand to see relevant services. Your selection will carry into booking.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/services" className="btn btn--ghost">
                Browse services
              </Link>
            </div>
          </div>

          <div className="brandBigGrid" role="list" aria-label="Popular brands">
            {popularBrands.map((b) => (
              <div role="listitem" key={b.name}>
                <BrandCard name={b.name} logoSrc={b.logoSrc} logoAlt={b.logoAlt} />
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 22 }}>
          <div className="twoCol">
            <div className="card">
              <div className="pill pill--amber">Step 1</div>
              <h2 className="h2" style={{ marginTop: 10 }}>Choose what you need help with</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Pick a service type (for example: screen repair or battery replacement).
              </p>
              <div style={{ marginTop: 12 }}>
                <Link className="link" to="/services">Browse services →</Link>
              </div>
            </div>

            <div className="card">
              <div className="pill pill--amber">Step 2</div>
              <h2 className="h2" style={{ marginTop: 10 }}>Pick a preferred time</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Choose a date/time that works for you. We’ll confirm availability.
              </p>
            </div>

            <div className="card">
              <div className="pill pill--amber">Step 3</div>
              <h2 className="h2" style={{ marginTop: 10 }}>Share your contact details</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Add your name and email or phone so we can follow up.
              </p>
            </div>

            <div className="card">
              <div className="pill pill--soft">Tip</div>
              <h2 className="h2" style={{ marginTop: 10 }}>Want faster help?</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>
                Include your device model and a short description of the problem (for example: “won’t charge”, “screen cracked”).
              </p>
              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link to="/booking" className="btn btn--primary">
                  Book now
                </Link>
                <Link to="/support" className="btn btn--soft">
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
