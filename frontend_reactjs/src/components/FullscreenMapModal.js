import React, { useEffect, useMemo, useRef } from "react";

/**
 * FullscreenMapModal
 * - Covers full viewport with a dimmed backdrop
 * - Locks background scroll while open
 * - Closes on: close button, click outside panel, or Escape key
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

  const normalizedSrc = useMemo(() => {
    const src = String(mapSrc || "").trim();
    return src;
  }, [mapSrc]);

  // Scroll locking + escape-to-close
  useEffect(() => {
    if (!isOpen) return undefined;

    const body = document.body;

    // Compute scrollbar width and compensate padding to prevent layout shift.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.setProperty("--scrollbar-comp", `${Math.max(0, scrollbarWidth)}px`);
    body.classList.add("is-scroll-locked");

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    // Ensure focus is moved inside the dialog for accessibility.
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
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const requestClose = () => {
    if (onClose) onClose();
  };

  const hasChildren = Boolean(children);

  return (
    <div
      className="fsModal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // Click outside to close: only if the click was on the backdrop itself.
        if (e.target === e.currentTarget) requestClose();
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
          aria-label="Close map"
          title="Close"
        >
          ×
        </button>

        <div className="fsModal__content">
          {hasChildren ? (
            <div style={{ width: "100%", height: "100%" }}>
              {children}
            </div>
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
