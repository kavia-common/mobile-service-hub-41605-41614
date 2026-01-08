import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Home() {
  /** Simplified Home page for public users with a clear step-based flow. */
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
