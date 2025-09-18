import React, { useEffect, useRef, useState } from "react";
import "./ContactUs.css";

const CONTACT_ENDPOINT = "/contact.php";

export default function ContactUs() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // === Water Background Animation ===
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 40;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.random() * 30 + 20;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, this.r * 0.2, this.x, this.y, this.r);
        gradient.addColorStop(0, "rgba(90, 31, 54, 0.6)");  // Dark pinkish
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Background water gradient
      const backgroundGradient = ctx.createLinearGradient(0, 0, width, height);
      backgroundGradient.addColorStop(0, "#d7a7b7");
      backgroundGradient.addColorStop(1, "#f4d8e2");
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw ripples
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    }

    animate();

    // Resize handling
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // === Form Submission ===
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
      trap: form.get("contact[website]"),
    };

    try {
      const resp = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
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
    <div className="contact-page">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="water-background"></canvas>

      {/* Contact Form */}
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>If you have any questions, please fill out the form below and our team will get back to you as soon as possible.</p>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
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
      </div>
    </div>
  );
}
