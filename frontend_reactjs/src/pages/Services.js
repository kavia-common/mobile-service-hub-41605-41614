import React, { useEffect, useState } from "react";
import { listServices } from "../services/servicesApi";
import ServiceCard from "../components/ServiceCard";

// PUBLIC_INTERFACE
export default function Services() {
  /** Services list page. */
  const [state, setState] = useState({ loading: true, services: [], source: "mock" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listServices();
      if (!mounted) return;
      setState({ loading: false, services: res.data, source: res.source });
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <h1 className="h1">Services</h1>
          <p className="muted">
            Browse available services. Details view is ready for backend integration.
            <span className="pill pill--soft" style={{ marginLeft: 10 }}>{state.source}</span>
          </p>
        </div>

        {state.loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="card skeleton" key={i} aria-hidden="true" />
            ))}
          </div>
        ) : state.services.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No services found</div>
            <div className="empty__text">Try again later.</div>
          </div>
        ) : (
          <div className="grid">
            {state.services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </main>
  );
}
