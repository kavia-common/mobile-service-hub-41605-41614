import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { listServices } from "../services/servicesApi";
import {
  getBrandFromSearch,
  getPersistedSelectedBrand,
  persistSelectedBrand
} from "../utils/brandSelection";

// PUBLIC_INTERFACE
export default function Booking() {
  /** Booking page with form and basic guidance text (supports selected brand). */
  const location = useLocation();

  const selectedBrand = useMemo(() => {
    const fromQuery = getBrandFromSearch(location.search);
    if (fromQuery) return fromQuery;

    const fromState = location.state?.selectedBrand ? String(location.state.selectedBrand).trim() : "";
    if (fromState) return fromState;

    return getPersistedSelectedBrand();
  }, [location.search, location.state]);

  const [state, setState] = useState({ loading: true, services: [] });

  useEffect(() => {
    if (selectedBrand) persistSelectedBrand(selectedBrand);
  }, [selectedBrand]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await listServices();
      if (!mounted) return;
      setState({ loading: false, services: res.data });
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <div>
            <h1 className="h1">Booking</h1>
            <p className="muted">
              Fill out the form below. Required fields are marked with *.
              {selectedBrand ? (
                <span className="pill pill--amber" style={{ marginLeft: 10 }}>
                  Brand: {selectedBrand}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="card">
          {state.loading ? (
            <div className="loadingRow">
              <div className="spinner" aria-hidden="true" />
              <div>Loading service options…</div>
            </div>
          ) : (
            <BookingForm serviceOptions={state.services} />
          )}
        </div>

        {selectedBrand ? (
          <div className="muted" style={{ marginTop: 10, fontWeight: 700 }}>
            We’ll use your selected brand ({selectedBrand}) when confirming parts/compatibility.
          </div>
        ) : null}
      </div>
    </main>
  );
}
