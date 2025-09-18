import React from 'react';
import './MomentsThatMatterSection.css';

const MomentsThatMatterSection = () => {
  return (
    <section className="moments-section">
      <div className="marquee-container">
        {/* ✅ This new wrapper will contain both copies of the text and will be animated */}
        <div className="marquee-content">
          {/* This is the first (original) block of text */}
          <div className="marquee-text">
            <span>FOR THE MOMENTS THAT MATTER</span>
            <span>FOR THE MOMENTS THAT MATTER</span>
          </div>
          {/* ✅ This is the second (cloned) block of text for a seamless loop */}
          <div className="marquee-text" aria-hidden="true">
            <span>FOR THE MOMENTS THAT MATTER</span>
            <span>FOR THE MOMENTS THAT MATTER</span>
          </div>
        </div>
      </div>

      <img 
        src="./images/bg_section.png" // Make sure this is your transparent mannequin image
        alt="Mannequins showcasing outfits" 
        className="models-image" 
      />
    </section>
  );
};

export default MomentsThatMatterSection;