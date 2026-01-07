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
  const overlayInputId = "navbar-search-overlay";

  const closeSearch = () => setSearchOpen(false);

  // Focus the input when the overlay becomes visible.
  useEffect(() => {
    if (!searchOpen) return undefined;

    // Delay slightly to ensure the element is in the DOM.
    const id = setTimeout(() => inputRef.current?.focus(), 0);

    // Prevent background scroll while the overlay is open (mobile-friendly),
    // but compensate for scrollbar width to avoid horizontal layout "jump".
    const body = document.body;
    const prevPaddingRight = body.style.paddingRight;
    const prevComp = body.style.getPropertyValue("--scrollbar-comp");

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.setProperty("--scrollbar-comp", `${Math.max(0, scrollbarWidth)}px`);
    body.classList.add("is-scroll-locked");

    return () => {
      clearTimeout(id);
      body.classList.remove("is-scroll-locked");

      // Restore any previous values
      body.style.paddingRight = prevPaddingRight;
      if (prevComp) body.style.setProperty("--scrollbar-comp", prevComp);
      else body.style.removeProperty("--scrollbar-comp");
    };
  }, [searchOpen]);

  // Close search on Escape for good UX.
  useEffect(() => {
    if (!searchOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeSearch();
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
          {/* Keep the trigger button in the navbar so spacing never changes. */}
          <div className="nav__search">
            <button
              type="button"
              className="nav__iconBtn"
              onClick={toggleSearch}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen ? "true" : "false"}
              aria-controls={overlayInputId}
            >
              <span className="nav__icon" aria-hidden="true">
                ⌕
              </span>
              <span className="nav__iconBtnText">Search</span>
            </button>
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

      {/* Overlay layer is outside the nav__inner flow so nothing shifts/compresses. */}
      <div
        className={`navSearchOverlay ${searchOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        aria-hidden={searchOpen ? "false" : "true"}
        onMouseDown={(e) => {
          // Click on the backdrop closes; clicks inside panel should not.
          if (e.target === e.currentTarget) closeSearch();
        }}
      >
        <div
          className="navSearchOverlay__panel"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="container navSearchOverlay__inner">
            <div className="navSearchOverlay__fieldWrap">
              <div className="navSearchOverlay__fieldMain">
                <input
                  id={overlayInputId}
                  ref={inputRef}
                  className="nav__searchInput navSearchOverlay__input"
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

              <button
                type="button"
                className="navSearchOverlay__closeBtn"
                onClick={closeSearch}
                aria-label="Close search"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="navSearchOverlay__hint" aria-hidden="true">
              Press Esc to close
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
