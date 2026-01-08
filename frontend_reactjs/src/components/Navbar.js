import React, { useEffect, useRef, useState } from "react";

/**
 * Inline SVG icons (no external deps) with gradient strokes for a premium look.
 * Kept as components to ensure consistent sizing and to avoid layout shift.
 */

function PhoneIcon() {
  return (
    <svg
      className="nav__glyph"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nav-g-phone" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.55" stopColor="rgba(37,99,235,0.95)" />
          <stop offset="1" stopColor="rgba(245,158,11,0.95)" />
        </linearGradient>
      </defs>

      {/* Futuristic handset + signal arcs (stroke-only to feel "premium/tech") */}
      <path
        d="M8.6 3.8c.5 0 .95.3 1.15.76l.95 2.16c.18.43.08.92-.25 1.25l-1.2 1.2a14.6 14.6 0 0 0 5.58 5.58l1.2-1.2c.33-.33.82-.43 1.25-.25l2.16.95c.46.2.76.65.76 1.15v2.2c0 .83-.67 1.5-1.5 1.5C10.95 21 3 13.05 3 3.8c0-.83.67-1.5 1.5-1.5h2.1z"
        fill="none"
        stroke="url(#nav-g-phone)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M14.2 6.2c1.9.55 3.05 1.7 3.6 3.6"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14.2 3.8c3.3.7 5.3 2.7 6 6"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="nav__glyph"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="nav-g-wa" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.5" stopColor="rgba(37,99,235,0.95)" />
          <stop offset="1" stopColor="rgba(245,158,11,0.95)" />
        </linearGradient>
      </defs>

      {/* Chat bubble ring */}
      <path
        d="M12 3.5c-4.6 0-8.3 3.5-8.3 7.9 0 1.5.45 3 .9 3.9L3.5 20.5l5.1-1.1c1.05.55 2.35.85 3.4.85 4.6 0 8.3-3.5 8.3-7.9S16.6 3.5 12 3.5z"
        fill="none"
        stroke="url(#nav-g-wa)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Minimal "call" glyph inside (keeps recognizable without using WA logo) */}
      <path
        d="M9.3 9.5l1.2 2c.18.3.14.68-.1.94l-.78.86c.75 1.07 1.7 2.02 2.77 2.77l.86-.78c.26-.24.64-.28.94-.1l2 1.2c.4.24.52.74.27 1.13-.4.62-1.08 1-1.82 1-3.65 0-6.62-2.97-6.62-6.62 0-.74.38-1.42 1-1.82.39-.25.89-.13 1.13.27z"
        fill="none"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Scroll-hide navbar behavior notes:
 * - We keep the navbar fixed (overlay) so it never affects document flow => no layout shift.
 * - On scroll down: hide (translateY out of viewport).
 * - On scroll up: show.
 *
 * Refinements for smoothness:
 * - Hysteresis: larger threshold to hide than to show, so tiny jitter doesn't flip state.
 * - Time/velocity gating: ignores tiny, low-intent movement (especially on mobile momentum).
 * - Top "dead-zone": always show for the first few pixels for predictability.
 * - Settle timer: after a hide, we require a brief "settle" before allowing a show;
 *   this prevents immediate re-show during overscroll/bounce/momentum.
 */
const SCROLL_HIDE_DELTA_PX_DESKTOP = 20;
const SCROLL_SHOW_DELTA_PX_DESKTOP = 12;

const SCROLL_HIDE_DELTA_PX_MOBILE = 28;
const SCROLL_SHOW_DELTA_PX_MOBILE = 16;

/**
 * Ignore tiny deltas entirely (trackpad jitter / iOS bounce micro-movements).
 * This is intentionally small so "real" scroll still feels responsive.
 */
const SCROLL_IGNORE_DELTA_PX = 2;

/**
 * Always show near top; slightly larger than before to reduce "flicker"
 * when a user is at the top and lightly nudges the page.
 */
const SCROLL_TOP_DEADZONE_PX = 18;

/**
 * Throttle toggle frequency so the navbar never flickers during momentum.
 * Mobile uses a slightly longer throttle to compensate for stronger inertial scroll.
 */
const SCROLL_TOGGLE_THROTTLE_MS_DESKTOP = 140;
const SCROLL_TOGGLE_THROTTLE_MS_MOBILE = 180;

/**
 * After hiding, require a short "settle" before allowing show. Helps prevent:
 * - bounce at scroll end
 * - tiny direction changes during momentum deceleration
 */
const SCROLL_AFTER_HIDE_SETTLE_MS_DESKTOP = 120;
const SCROLL_AFTER_HIDE_SETTLE_MS_MOBILE = 160;

/**
 * If no scroll events happen for a bit, we reset the accumulator so that
 * the next tiny nudge doesn't "inherit" previous momentum.
 */
const SCROLL_IDLE_RESET_MS = 220;

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Minimal top bar: brand on left + call/WhatsApp quick actions on right, with scroll-aware hide/show. */
  const [isHidden, setIsHidden] = useState(false);

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const hiddenRef = useRef(false);

  // Accumulate scroll delta until it exceeds a threshold (prevents "micro scroll" jitter toggles)
  const accDeltaRef = useRef(0);

  // Toggle gating
  const lastToggleTsRef = useRef(0);
  const lastScrollTsRef = useRef(0);

  // Timer to reset accumulator after scroll stops
  const idleResetTimerRef = useRef(null);

  // When we hide, block showing until this timestamp (prevents immediate bounce re-show)
  const blockShowUntilTsRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY || 0;

    const isMobile = () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(max-width: 720px)").matches;

    const getThresholds = () => {
      const mobile = isMobile();
      return {
        hideDelta: mobile ? SCROLL_HIDE_DELTA_PX_MOBILE : SCROLL_HIDE_DELTA_PX_DESKTOP,
        showDelta: mobile ? SCROLL_SHOW_DELTA_PX_MOBILE : SCROLL_SHOW_DELTA_PX_DESKTOP,
        throttleMs: mobile ? SCROLL_TOGGLE_THROTTLE_MS_MOBILE : SCROLL_TOGGLE_THROTTLE_MS_DESKTOP,
        settleAfterHideMs: mobile ? SCROLL_AFTER_HIDE_SETTLE_MS_MOBILE : SCROLL_AFTER_HIDE_SETTLE_MS_DESKTOP
      };
    };

    const scheduleIdleReset = () => {
      if (idleResetTimerRef.current) window.clearTimeout(idleResetTimerRef.current);
      idleResetTimerRef.current = window.setTimeout(() => {
        accDeltaRef.current = 0;
      }, SCROLL_IDLE_RESET_MS);
    };

    const onScroll = () => {
      // Use rAF to avoid doing setState for every scroll event.
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;

        const dy = y - lastY;
        lastYRef.current = y;

        const now = Date.now();
        lastScrollTsRef.current = now;
        scheduleIdleReset();

        // Always show near the very top for better discoverability/predictability.
        if (y <= SCROLL_TOP_DEADZONE_PX) {
          accDeltaRef.current = 0;
          blockShowUntilTsRef.current = 0;
          if (hiddenRef.current) {
            hiddenRef.current = false;
            setIsHidden(false);
          }
          tickingRef.current = false;
          return;
        }

        // Ignore very small deltas (prevents jitter toggles).
        if (Math.abs(dy) <= SCROLL_IGNORE_DELTA_PX) {
          tickingRef.current = false;
          return;
        }

        // Accumulate deltas; reset accumulator when direction flips.
        const prevAcc = accDeltaRef.current;
        if (prevAcc === 0) {
          accDeltaRef.current = dy;
        } else if ((prevAcc > 0 && dy > 0) || (prevAcc < 0 && dy < 0)) {
          accDeltaRef.current = prevAcc + dy;
        } else {
          accDeltaRef.current = dy;
        }

        const acc = accDeltaRef.current;

        const { hideDelta, showDelta, throttleMs, settleAfterHideMs } = getThresholds();

        // Only allow toggling every so often (throttle).
        const canToggle = now - lastToggleTsRef.current >= throttleMs;

        // Apply hysteresis based on current state.
        let nextHidden = hiddenRef.current;

        if (!hiddenRef.current) {
          // Currently visible: only hide after a more intentional downward scroll.
          if (acc > hideDelta) nextHidden = true;
        } else {
          // Currently hidden: show after user scrolls up a bit,
          // but not during the "settle" window after a hide.
          const canShowAfterHide = now >= blockShowUntilTsRef.current;
          if (canShowAfterHide && acc < -showDelta) nextHidden = false;
        }

        if (nextHidden !== hiddenRef.current && canToggle) {
          hiddenRef.current = nextHidden;
          setIsHidden(nextHidden);
          lastToggleTsRef.current = now;
          accDeltaRef.current = 0; // reset after state change to avoid immediate re-toggle

          if (nextHidden) {
            // We just hid: block re-show briefly to avoid bounce/momentum flicker.
            blockShowUntilTsRef.current = now + settleAfterHideMs;
          }
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleResetTimerRef.current) window.clearTimeout(idleResetTimerRef.current);
    };
  }, []);

  return (
    <header
      className={`nav nav--minimal nav--fixed ${isHidden ? "nav--hidden" : ""}`}
      data-hidden={isHidden ? "true" : "false"}
    >
      <div className="nav__container">
        <div className="nav__inner nav__inner--minimal">
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
            <a className="nav__iconLink nav__iconLink--premium" href="tel:+15550102020" aria-label="Call">
              <span className="nav__iconFx" aria-hidden="true">
                <PhoneIcon />
              </span>
            </a>

            <a
              className="nav__iconLink nav__iconLink--premium"
              href="https://wa.me/15550102020"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <span className="nav__iconFx" aria-hidden="true">
                <WhatsAppIcon />
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
