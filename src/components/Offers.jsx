// src/components/Offers.jsx
import React from "react";
import Marquee from "react-fast-marquee";
import "./Offers.css"; // Import the traditional CSS

export default function Offers() {
  return (
    <section className="offers-section">
      {/* Marquee Scroller */}
      <div className="offers-marquee-container">
        <Marquee gradient={false} speed={60} pauseOnHover={true}>
          <span className="offers-marquee-text">
            ₹200 off + Free Shipping for First Order
          </span>
          <span className="offers-marquee-text">
            ₹200 off + Free Shipping for First Order
          </span>
          <span className="offers-marquee-text">
            ₹200 off + Free Shipping for First Order
          </span>
        </Marquee>
      </div>
    </section>
  );
}
