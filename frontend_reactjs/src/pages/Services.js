import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listServices } from "../services/servicesApi";
import ServiceCard from "../components/ServiceCard";
import {
  clearPersistedSelectedBrand,
  getBrandFromSearch,
  getPersistedSelectedBrand,
  persistSelectedBrand
} from "../utils/brandSelection";

// PUBLIC_INTERFACE
export default function Services() {
  /** Services list page (supports preselected brand via ?brand=...). */
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedBrand = useMemo(() => {
    // Priority: query string (shareable) -> route state -> persisted
    const fromQuery = getBrandFromSearch(location.search);
    if (fromQuery) return fromQuery;

    const fromState = location.state?.selectedBrand ? String(location.state.selectedBrand).trim() : "";
    if (fromState) return fromState;

    return getPersistedSelectedBrand();
  }, [location.search, location.state]);

  const [state, setState] = useState({
    loading: true,
    services: [],
    source: "mock",
    selectedBrand: ""
  });

  // Keep selectedBrand state in sync and persist (best-effort).
  useEffect(() => {
    if (preselectedBrand) persistSelectedBrand(preselectedBrand);
    setState((s) => ({ ...s, selectedBrand: preselectedBrand }));
  }, [preselectedBrand]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listServices();
      if (!mounted) return;
      setState((s) => ({ ...s, loading: false, services: res.data, source: res.source }));
    })();
    return () => { mounted = false; };
  }, []);

  // Note: Current service dataset has no brand metadata. For now we keep the UI/flow
  // (brand is selected + carried forward) and show an "Active filter" indicator.
  const visibleServices = state.services;

  const clearBrand = () => {
    clearPersistedSelectedBrand();
    navigate("/services", { replace: true, state: {} });
  };

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <div>
            <h1 className="h1">Services</h1>
            <p className="muted" style={{ marginTop: 6 }}>
              Browse available services.
              <span className="pill pill--soft" style={{ marginLeft: 10 }}>{state.source}</span>
              {state.selectedBrand ? (
                <span className="pill pill--amber" style={{ marginLeft: 10 }}>
                  Brand: {state.selectedBrand}
                </span>
              ) : null}
            </p>
          </div>

          {state.selectedBrand ? (
            <div className="pageHeader__actions">
              <button type="button" className="btn btn--ghost" onClick={clearBrand}>
                Clear brand
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => navigate("/booking", { state: { selectedBrand: state.selectedBrand } })}
              >
                Book for {state.selectedBrand}
              </button>
            </div>
          ) : null}
        </div>

        {state.loading ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="card skeleton" key={i} aria-hidden="true" />
            ))}
          </div>
        ) : visibleServices.length === 0 ? (
          <div className="empty">
            <div className="empty__title">No services found</div>
            <div className="empty__text">Try again later.</div>
          </div>
        ) : (
          <div className="grid">
            {visibleServices.map((s) => (
              <ServiceCard key={s.id} service={s} selectedBrand={state.selectedBrand} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
