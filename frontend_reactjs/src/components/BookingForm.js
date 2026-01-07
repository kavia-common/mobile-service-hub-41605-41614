import React, { useMemo, useState } from "react";
import { getAppEnv } from "../config/env";

const initialState = {
  name: "",
  contact: "",
  serviceType: "",
  datetime: "",
  notes: ""
};

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.contact.trim()) errors.contact = "Contact is required.";
  if (!values.serviceType.trim()) errors.serviceType = "Please select a service type.";
  if (!values.datetime.trim()) errors.datetime = "Preferred date/time is required.";
  return errors;
};

// PUBLIC_INTERFACE
export default function BookingForm({ serviceOptions = [], onSubmitted }) {
  /** Booking form with basic validation; submits to backend when configured else mocks. */
  const env = useMemo(() => getAppEnv(), []);
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ state: "loading", message: "Submitting request…" });

    try {
      if (env.apiBase) {
        const url = new URL("/api/bookings", env.apiBase).toString();
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // eslint-disable-next-line no-console
        console.warn("[Booking] Mock submission (no backend configured):", values);
        await new Promise((r) => setTimeout(r, 700));
      }

      setStatus({ state: "success", message: "Booking request sent! We’ll contact you shortly." });
      setValues(initialState);
      if (onSubmitted) onSubmitted(values);
    } catch (err) {
      setStatus({ state: "error", message: "Could not submit booking. Please try again." });
      // eslint-disable-next-line no-console
      console.warn("[Booking] submission error:", err);
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form__grid">
        <div className="field">
          <label className="label" htmlFor="name">Full name *</label>
          <input
            id="name"
            className={`input ${errors.name ? "input--error" : ""}`}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
          />
          {errors.name ? <div className="error">{errors.name}</div> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="contact">Email or phone *</label>
          <input
            id="contact"
            className={`input ${errors.contact ? "input--error" : ""}`}
            value={values.contact}
            onChange={(e) => setField("contact", e.target.value)}
            placeholder="jane@example.com"
            autoComplete="email"
          />
          {errors.contact ? <div className="error">{errors.contact}</div> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="serviceType">Service type *</label>
          <select
            id="serviceType"
            className={`input ${errors.serviceType ? "input--error" : ""}`}
            value={values.serviceType}
            onChange={(e) => setField("serviceType", e.target.value)}
          >
            <option value="">Select…</option>
            {serviceOptions.map((opt) => (
              <option key={opt.id} value={opt.name}>
                {opt.name}
              </option>
            ))}
          </select>
          {errors.serviceType ? <div className="error">{errors.serviceType}</div> : null}
        </div>

        <div className="field">
          <label className="label" htmlFor="datetime">Preferred date/time *</label>
          <input
            id="datetime"
            className={`input ${errors.datetime ? "input--error" : ""}`}
            value={values.datetime}
            onChange={(e) => setField("datetime", e.target.value)}
            placeholder="2026-01-10 14:30"
          />
          {errors.datetime ? <div className="error">{errors.datetime}</div> : null}
        </div>

        <div className="field field--full">
          <label className="label" htmlFor="notes">Notes (optional)</label>
          <textarea
            id="notes"
            className="input"
            value={values.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Device model, symptoms, anything we should know…"
            rows={4}
          />
        </div>
      </div>

      <div className="form__actions">
        <button className="btn btn--primary btn--large" type="submit" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Submitting…" : "Submit booking"}
        </button>
        <div className="form__hint">
          {env.apiBase ? "Submits to backend when available." : "Demo mode: submission is mocked."}
        </div>
      </div>

      {status.state !== "idle" ? (
        <div className={`alert ${status.state === "success" ? "alert--success" : status.state === "error" ? "alert--error" : ""}`}>
          {status.message}
        </div>
      ) : null}
    </form>
  );
}
