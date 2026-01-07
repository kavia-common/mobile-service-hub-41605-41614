import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAppEnv } from "../config/env";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with responsive menu and a toggleable search control. */
  const env = useMemo(() => getAppEnv(), []);
  const [open, setOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus the input when it becomes visible.
  useEffect(() => {
    if (searchOpen) {
      // Delay slightly to ensure the element is in the DOM.
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [searchOpen]);

  // Close search on Escape for good UX.
  useEffect(() => {
    if (!searchOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const toggleSearch = () => {
    setSearchOpen((v) => !v);
  };

  return (
    <header className="nav">
      <div className="container nav__inner">
        <div className="nav__brand">
          <span className="nav__logo" aria-hidden="true">
            MS
          </span>
          <div className="nav__brandText">
            <div className="nav__title">Mobile Service Hub</div>
            <div className="nav__subtitle">{env.apiBase ? "Connected" : "Offline demo"}</div>
          </div>
        </div>

        <div className="nav__right">
          <div className={`nav__search ${searchOpen ? "nav__search--open" : ""}`}>
            <button
              type="button"
              className="nav__iconBtn"
              onClick={toggleSearch}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen ? "true" : "false"}
              aria-controls="navbar-search"
            >
              <span className="nav__icon" aria-hidden="true">
                ⌕
              </span>
              <span className="nav__iconBtnText">Search</span>
            </button>

            <div className="nav__searchFieldWrap">
              <input
                id="navbar-search"
                ref={inputRef}
                className="nav__searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="search for your device"
                aria-label="Search for your device"
                autoComplete="off"
              />
              <button
                type="button"
                className="nav__clearBtn"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                disabled={!query}
                title="Clear"
              >
                ×
              </button>
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
        </div>

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
