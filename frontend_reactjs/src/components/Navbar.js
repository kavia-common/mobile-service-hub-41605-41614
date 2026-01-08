import React from "react";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Minimal top bar: brand on left + call/WhatsApp quick actions on right. */

  return (
    <header className="nav nav--minimal">
      <div className="container nav__inner nav__inner--minimal">
        <div className="nav__brand nav__brand--minimal">
          <span className="nav__logo" aria-hidden="true">
            MS
          </span>
          <div className="nav__brandText">
            <div className="nav__title">Mobile Service Hub</div>
          </div>
        </div>

        <div className="nav__right nav__right--minimal" aria-label="Contact actions">
          {/* Note: placeholders - replace numbers/links when available */}
          <a className="nav__iconLink" href="tel:+15550102020" aria-label="Call">
            <span className="nav__icon" aria-hidden="true">☎</span>
          </a>
          <a
            className="nav__iconLink"
            href="https://wa.me/15550102020"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <span className="nav__icon" aria-hidden="true">WA</span>
          </a>
        </div>
      </div>
    </header>
  );
}
