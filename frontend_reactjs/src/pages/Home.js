import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";
import { listServices } from "../services/servicesApi";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page with featured services banner, services grid, and CTA. */
  const [state, setState] = useState({ loading: true, services: [], source: "mock" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listServices();
      if (!mounted) return;
      setState({ loading: false, services: res.data.slice(0, 6), source: res.source });
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <main>
      <Hero
        title="Mobile services, booking, and support—one place."
        subtitle="Explore common device services, request a booking in minutes, and get help when you need it."
      />

      <section className="section">
        <div className="container">
          <div className="sectionHeader">
            <div>
              <h2 className="h2">Services</h2>
              <p className="muted">
                {state.loading ? "Loading services…" : `Showing ${state.services.length} services (${state.source}).`}
              </p>
            </div>
            <Link to="/services" className="btn btn--soft">View all</Link>
          </div>

          {state.loading ? (
            <div className="grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="card skeleton" key={i} aria-hidden="true" />
              ))}
            </div>
          ) : state.services.length === 0 ? (
            <div className="empty">
              <div className="empty__title">No services available</div>
              <div className="empty__text">Please check back later.</div>
            </div>
          ) : (
            <div className="grid">
              {state.services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section section--cta">
        <div className="container cta">
          <div className="cta__content">
            <h2 className="h2">Ready to book?</h2>
            <p className="muted">
              Tell us what you need and your preferred time. We’ll follow up with confirmation and next steps.
            </p>
          </div>
          <div className="cta__actions">
            <Link to="/booking" className="btn btn--primary btn--large">Start booking</Link>
            <Link to="/support" className="btn btn--ghost btn--large">Get support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
