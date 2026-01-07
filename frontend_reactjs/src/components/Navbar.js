import React, { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAppEnv } from "../config/env";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with responsive menu. */
  const env = useMemo(() => getAppEnv(), []);
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="nav__brand">
          <span className="nav__logo" aria-hidden="true">MS</span>
          <div className="nav__brandText">
            <div className="nav__title">Mobile Service Hub</div>
            <div className="nav__subtitle">
              {env.apiBase ? "Connected" : "Offline demo"}
            </div>
          </div>
        </div>

        <button
          className="nav__menuBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open ? "true" : "false"}
        >
          <span className="nav__menuIcon" aria-hidden="true" />
        </button>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`} aria-label="Primary">
          <NavLink
            to="/category/mobile-phone"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Mobile Phone
          </NavLink>
          <NavLink
            to="/category/tablet"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Tablet
          </NavLink>
          <NavLink
            to="/category/macbook"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            MacBook
          </NavLink>
          <NavLink
            to="/category/smartwatch"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Smartwatch
          </NavLink>

          <NavLink
            to="/booking"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Booking
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            Support
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
