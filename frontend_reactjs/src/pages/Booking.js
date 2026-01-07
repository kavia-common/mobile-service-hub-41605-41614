import React, { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import { listServices } from "../services/servicesApi";

// PUBLIC_INTERFACE
export default function Booking() {
  /** Booking page with form and basic guidance text. */
  const [state, setState] = useState({ loading: true, services: [] });

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
          <h1 className="h1">Booking</h1>
          <p className="muted">
            Fill out the form below. Required fields are marked with *.
          </p>
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
      </div>
    </main>
  );
}
