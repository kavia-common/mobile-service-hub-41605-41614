import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function Support() {
  /** Support page with FAQ placeholders and a contact form. */
  const [values, setValues] = useState({ name: "", contact: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.contact.trim() || !values.message.trim()) {
      setStatus({ state: "error", message: "Please complete all fields before sending." });
      return;
    }
    setStatus({ state: "loading", message: "Sending…" });
    // mock
    await new Promise((r) => setTimeout(r, 600));
    // eslint-disable-next-line no-console
    console.warn("[Support] Mock contact submission:", values);
    setValues({ name: "", contact: "", message: "" });
    setStatus({ state: "success", message: "Message sent (demo). We’ll respond soon." });
  };

  return (
    <main className="section">
      <div className="container">
        <div className="pageHeader">
          <h1 className="h1">Support</h1>
          <p className="muted">Find answers fast or send us a message.</p>
        </div>

        <div className="twoCol">
          <section className="card">
            <h2 className="h2">FAQ</h2>
            <div className="faq">
              <details className="faq__item">
                <summary>How do I book a service?</summary>
                <p className="muted">Go to Booking, pick a service, and submit your preferred date/time.</p>
              </details>
              <details className="faq__item">
                <summary>Do you offer same-day appointments?</summary>
                <p className="muted">Many services can be scheduled quickly depending on availability.</p>
              </details>
              <details className="faq__item">
                <summary>What information should I include?</summary>
                <p className="muted">Device model, symptoms, and any troubleshooting steps you already tried.</p>
              </details>
            </div>
          </section>

          <section className="card">
            <h2 className="h2">Contact</h2>
            <form className="form" onSubmit={submit} noValidate>
              <div className="field">
                <label className="label" htmlFor="supportName">Name *</label>
                <input
                  id="supportName"
                  className="input"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="supportContact">Email or phone *</label>
                <input
                  id="supportContact"
                  className="input"
                  value={values.contact}
                  onChange={(e) => setValues((v) => ({ ...v, contact: e.target.value }))}
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="supportMsg">Message *</label>
                <textarea
                  id="supportMsg"
                  className="input"
                  rows={5}
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                />
              </div>

              <div className="form__actions">
                <button className="btn btn--primary btn--large" type="submit" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending…" : "Send message"}
                </button>
                <div className="form__hint">Demo mode: message submission is mocked.</div>
              </div>

              {status.state !== "idle" ? (
                <div className={`alert ${status.state === "success" ? "alert--success" : status.state === "error" ? "alert--error" : ""}`}>
                  {status.message}
                </div>
              ) : null}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
