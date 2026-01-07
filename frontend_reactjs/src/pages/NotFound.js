import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page. */
  return (
    <main className="section">
      <div className="container">
        <div className="empty">
          <div className="empty__title">Page not found</div>
          <div className="empty__text">The page you’re looking for doesn’t exist.</div>
          <div style={{ marginTop: 16 }}>
            <Link to="/" className="btn btn--primary">Go home</Link>
            <span style={{ display: "inline-block", width: 10 }} />
            <Link to="/services" className="btn btn--soft">Browse services</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
