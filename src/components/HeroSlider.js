import React, { useState, useEffect } from "react";
import "./HeroSlider.css";

const sliderImages = ["/images/hero1.png", "/images/hero2.png"];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hero-slider"
      role="region"
      aria-label="Hero slider"
      aria-roledescription="carousel"
      aria-live="polite"
    >
      {sliderImages.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          className={index === currentIndex ? "slide active" : "slide"}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          sizes="100vw"
        />
      ))}
    </div>
  );
};

export default HeroSlider;
