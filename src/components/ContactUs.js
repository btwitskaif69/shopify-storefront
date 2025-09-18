import React, { useState } from "react";
import "./ContactUs.css";
<<<<<<< HEAD
import DotGrid from "./DotGrid";

const CONTACT_ENDPOINT = "/contact.php";

export default function ContactUs() {
  const [status, setStatus] = useState("idle");
=======

// Change this when you deploy:
// - Vercel now: const CONTACT_ENDPOINT = "/api/contact";
// - Hostinger later: const CONTACT_ENDPOINT = "/contact.php";
const CONTACT_ENDPOINT = "/contact.php";

export default function ContactUs() {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
>>>>>>> bf89f051a3026c67d62d4f815c83700b1dc01ffa
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("contact[name]"),
      email: form.get("contact[email]"),
      phone: form.get("contact[phone]"),
      message: form.get("contact[body]"),
<<<<<<< HEAD
      trap: form.get("contact[website]"),
=======
      trap: form.get("contact[website]"), // honeypot
>>>>>>> bf89f051a3026c67d62d4f815c83700b1dc01ffa
    };

    try {
      const resp = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
<<<<<<< HEAD
        const data = await resp.json().catch(() => ({}));
=======
        const data = await resp.json().catch(()=>({}));
>>>>>>> bf89f051a3026c67d62d4f815c83700b1dc01ffa
        throw new Error(data?.error || "Failed to send");
      }

      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setError(err.message || "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="contact-container">
<<<<<<< HEAD
      {/* Background DotGrid */}
      <div className="dotgrid-wrapper">
        <DotGrid
          dotSize={10}
          gap={15}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Foreground Form */}
      <div className="contact-content">
        <h1>Contact Us</h1>
        <p>
          If you have any questions, please fill out the form below and our team
          will get back to you as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          {/* hidden honeypot */}
          <input
            type="text"
            name="contact[website]"
            tabIndex="-1"
            autoComplete="off"
            style={{
              position: "absolute",
              left: "-9999px",
              height: 0,
              width: 0,
              opacity: 0,
            }}
          />

          <label>
            Name:
            <input type="text" name="contact[name]" required />
          </label>

          <label>
            Email:
            <input type="email" name="contact[email]" required />
          </label>

          <label>
            Phone (optional):
            <input type="text" name="contact[phone]" />
          </label>

          <label>
            Message:
            <textarea name="contact[body]" rows="5" required />
          </label>

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {status === "ok" && (
            <p style={{ color: "#2e7d32" }}>
              Thanks! We’ll get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p style={{ color: "#b00020" }}>{error}</p>
          )}
        </form>
      </div>
=======
      <h1>Contact Us</h1>
      <p>If you have any questions, please fill out the form below and our team will get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {/* hidden honeypot */}
        <input
          type="text"
          name="contact[website]"
          tabIndex="-1"
          autoComplete="off"
          style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
        />

        <label>Name:
          <input type="text" name="contact[name]" required />
        </label>

        <label>Email:
          <input type="email" name="contact[email]" required />
        </label>

        <label>Phone (optional):
          <input type="text" name="contact[phone]" />
        </label>

        <label>Message:
          <textarea name="contact[body]" rows="5" required />
        </label>

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send"}
        </button>

        {status === "ok" && <p style={{ color: "#2e7d32" }}>Thanks! We’ll get back to you shortly.</p>}
        {status === "error" && <p style={{ color: "#b00020" }}>{error}</p>}
      </form>
>>>>>>> bf89f051a3026c67d62d4f815c83700b1dc01ffa
    </div>
  );
}
