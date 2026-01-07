import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServiceById } from "../services/servicesApi";

// PUBLIC_INTERFACE
export default function ServiceDetail() {
  /** Service detail page (mock-ready and backend-ready). */
  const { serviceId } = useParams();
  const [state, setState] = useState({ loading: true, service: null });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const service = await getServiceById(serviceId);
      if (!mounted) return;
      setState({ loading: false, service });
    })();
    return () => { mounted = false; };
  }, [serviceId]);

  if (state.loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="card skeleton" style={{ height: 220 }} aria-hidden="true" />
        </div>
      </main>
    );
  }

  if (!state.service) {
    return (
      <main className="section">
        <div className="container">
          <div className="empty">
            <div className="empty__title">Service not found</div>
            <div className="empty__text">The service you requested doesn’t exist.</div>
            <div style={{ marginTop: 16 }}>
              <Link to="/services" className="btn btn--soft">Back to services</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const s = state.service;

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <div>
            <h1 className="h1">{s.name}</h1>
            <p className="muted">{s.description}</p>
          </div>
          <div className="pageHeader__actions">
            <Link to="/booking" className="btn btn--primary">Book</Link>
            <Link to="/services" className="btn btn--soft">All services</Link>
          </div>
        </div>

        <div className="detailGrid">
          <div className="card detailCard">
            <div className="detailCard__title">What’s included</div>
            <ul className="list">
              <li>Initial assessment</li>
              <li>Recommended fix options</li>
              <li>Up-front estimate before work</li>
            </ul>
          </div>

          <div className="card detailCard">
            <div className="detailCard__title">Estimated turnaround</div>
            <div className="detailCard__big">{s.eta || "Varies"}</div>
            <div className="muted">Actual times may vary by device model and availability.</div>
          </div>

          <div className="card detailCard">
            <div className="detailCard__title">Starting price</div>
            <div className="detailCard__big">{s.priceFrom != null ? `$${s.priceFrom}+` : "Quote"}</div>
            <div className="muted">Final cost confirmed after assessment.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
