import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * FullscreenMapModal
 * - Covers full viewport with a dimmed/blurred backdrop
 * - Locks background scroll while open (with scrollbar compensation to avoid layout shift)
 * - Closes on: close button, click outside panel, or Escape key
 * - Keeps DOM mounted briefly for smooth close animation
 *
 * Supports two rendering modes:
 * 1) iframe mode via `mapSrc`
 * 2) custom content via `children` (preferred for interactive maps)
 */

// PUBLIC_INTERFACE
export default function FullscreenMapModal({
  isOpen,
  title = "Map",
  mapSrc,
  onClose,
  children
}) {
  /** Fullscreen map overlay modal (iframe or custom content). */
  const panelRef = useRef(null);
  const previouslyFocusedElRef = useRef(null);

  // Keep the modal mounted while closing, so CSS can animate out.
  const [isMounted, setIsMounted] = useState(Boolean(isOpen));
  const [phase, setPhase] = useState(isOpen ? "open" : "closed"); // "opening" | "open" | "closing" | "closed"

  const normalizedSrc = useMemo(() => {
    const src = String(mapSrc || "").trim();
    return src;
  }, [mapSrc]);

  // Drive mount/unmount and phase from `isOpen`.
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setPhase("opening");
      // Next frame: switch to "open" so transitions trigger reliably.
      const raf = window.requestAnimationFrame(() => setPhase("open"));
      return () => window.cancelAnimationFrame(raf);
    }

    if (!isOpen && isMounted) {
      setPhase("closing");
    }

    return undefined;
  }, [isOpen, isMounted]);

  // Scroll locking + ESC to close + focus management
  useEffect(() => {
    if (!isMounted) return undefined;

    const body = document.body;

    // Compute scrollbar width and compensate padding to prevent layout shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.setProperty("--scrollbar-comp", `${Math.max(0, scrollbarWidth)}px`);
    body.classList.add("is-scroll-locked");

    // Remember focus before opening so we can restore it on close.
    if (phase === "opening" || phase === "open") {
      previouslyFocusedElRef.current = document.activeElement;
    }

    const requestClose = () => {
      if (onClose) onClose();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
        return;
      }

      // Lightweight focus trap (keeps tab focus inside the modal panel)
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;

        const focusable = panel.querySelectorAll(
          [
            "a[href]",
            "button:not([disabled])",
            "textarea:not([disabled])",
            "input:not([disabled])",
            "select:not([disabled])",
            "[tabindex]:not([tabindex='-1'])"
          ].join(",")
        );

        if (!focusable.length) {
          e.preventDefault();
          panel.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const isShift = e.shiftKey;
        const active = document.activeElement;

        if (!isShift && active === last) {
          e.preventDefault();
          first.focus();
        } else if (isShift && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    // Move focus inside dialog for accessibility.
    window.setTimeout(() => {
      try {
        panelRef.current?.focus();
      } catch {
        // ignore
      }
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.classList.remove("is-scroll-locked");
      body.style.removeProperty("--scrollbar-comp");

      // Restore focus to whatever was focused prior to opening.
      const prev = previouslyFocusedElRef.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus();
        } catch {
          // ignore
        }
      }
    };
  }, [isMounted, phase, onClose]);

  if (!isMounted) return null;

  const requestClose = () => {
    if (onClose) onClose();
  };

  const hasChildren = Boolean(children);

  return (
    <div
      className={`fsModal ${phase === "open" || phase === "opening" ? "is-open" : ""} ${
        phase === "closing" ? "is-closing" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // Click outside to close: only if the click was on the backdrop itself.
        if (e.target === e.currentTarget) requestClose();
      }}
      onAnimationEnd={(e) => {
        // Only react to overlay animation end (not children).
        if (e.target !== e.currentTarget) return;

        if (phase === "closing") {
          setIsMounted(false);
          setPhase("closed");
        }
      }}
    >
      <div
        className="fsModal__panel"
        ref={panelRef}
        tabIndex={-1}
        onMouseDown={(e) => {
          // Prevent bubbling so clicks inside panel don't trigger backdrop close.
          e.stopPropagation();
        }}
      >
        <button
          type="button"
          className="fsModal__close"
          onClick={requestClose}
          aria-label="Close map dialog"
          title="Close"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="fsModal__content">
          {hasChildren ? (
            <div style={{ width: "100%", height: "100%" }}>{children}</div>
          ) : normalizedSrc ? (
            <iframe
              className="fsModal__iframe"
              title={title}
              src={normalizedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          ) : (
            <div className="empty" style={{ margin: 0 }}>
              <div className="empty__title">Map unavailable</div>
              <div className="empty__text">No map source was provided.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
