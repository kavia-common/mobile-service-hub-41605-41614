import React from "react";
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

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page with premium, minimal hero + brand quick-pick. */

  const scrollToBrandSelection = () => {
    const el = document.getElementById("brand-selection");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                className="btn btn--primary btn--large homeHero__cta"
                onClick={scrollToBrandSelection}
              >
                Select Your Phone Model
              </button>
            </div>

            <div className="homeHero__finePrint">
              No login required • Doorstep service available
            </div>
          </div>
        </div>
      </section>

      <div className="container">
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
