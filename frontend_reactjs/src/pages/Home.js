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
  /** Simplified Home page for public users with a clear step-based flow + brand quick-pick (02.03). */
  return (
    <main className="section">
      <div className="container">
        <header className="card" style={{ padding: 22 }}>
          <div className="pill pill--soft">Mobile Service Hub</div>
          <h1 className="h1" style={{ marginTop: 10 }}>Book a repair in 3 simple steps</h1>
          <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
            Tell us what device you have, what’s wrong, and how to reach you. We’ll confirm the details and next steps.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <Link to="/booking" className="btn btn--primary btn--large">
              Start booking
            </Link>
            <Link to="/support" className="btn btn--ghost btn--large">
              I have a question
            </Link>
          </div>
        </header>

        {/* 02.03 Brand section: large tap-friendly cards */}
        <section className="section" style={{ paddingTop: 22 }}>
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Choose your brand</h2>
              <p className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>
                Tap a brand to see relevant services. Your selection will carry into booking.
              </p>
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
