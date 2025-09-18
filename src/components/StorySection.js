import React from 'react';
import './StorySection.css';

const StorySection = () => {
  return (
    <section className="story-section">
      {/* Banner Image */}
      <img 
        src="/images/story-background.png" 
   
        className="story-banner-image"
      />

      {/* Title */}
      <h4 className="story-text">The Delan Essence</h4>

      {/* Description */}
      <h5 className="story-subtext">
        From timeless co-ord sets to empowering silhouettes, we’ve reimagined what modern fashion means for women.
        Across India, women aren’t just wearing Delan—they’re expressing confidence, embracing individuality, and
        shaping their own stories with every outfit.
      </h5>
    </section>
  );
};

export default StorySection;
