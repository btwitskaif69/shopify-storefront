import React from 'react';
import './ShineSection.css';


const ShineSection = ({ text }) => {
  return (
    <section className="shine-section-wrapper">
      {/* Shine Section Text */}
      <div className="shine-section">
        <h2 className="shine-text" data-text={text}>
          {text}
        </h2>
      </div>
    </section>
  );
};

export default ShineSection;
