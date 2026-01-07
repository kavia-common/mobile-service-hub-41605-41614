import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { getAppEnv } from "../config/env";

// PUBLIC_INTERFACE
export default function Footer() {
  /** Footer with contact details. */
  const env = useMemo(() => getAppEnv(), []);

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <div className="footer__brand">Mobile Service Hub</div>
          <p className="footer__text">
            Convenient mobile maintenance and repair information with a simple booking flow.
          </p>
          <div className="footer__meta">
            <div><span className="pill pill--soft">Theme</span> Ocean Professional</div>
            <div><span className="pill pill--soft">Mode</span> {env.nodeEnv}</div>
          </div>
        </div>

        <div className="footer__col">
          <div className="footer__heading">Explore</div>
          <Link className="footer__link" to="/services">Services</Link>
          <Link className="footer__link" to="/booking">Booking</Link>
          <Link className="footer__link" to="/support">Support</Link>
        </div>

        <div className="footer__col">
          <div className="footer__heading">Contact</div>
          <div className="footer__text">Email: support@mobileservicehub.example</div>
          <div className="footer__text">Phone: (555) 010-2020</div>
          <div className="footer__text">Hours: Mon–Sat, 9am–6pm</div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottomInner">
          <span>© {new Date().getFullYear()} Mobile Service Hub</span>
          <span className="footer__small">Built with React • Responsive UI</span>
        </div>
      </div>
    </footer>
  );
}
