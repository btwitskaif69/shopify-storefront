import React, { useEffect, useMemo, useState } from "react";
import "./HeroSlider.css";

const sliderImages = ["/images/hero1.png", "/images/hero2.png"];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile via matchMedia so it updates on resize/orientation change
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = (e) => setIsMobile(e.matches);
    apply(mq);
    mq.addEventListener ? mq.addEventListener("change", apply) : mq.addListener(apply);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", apply) : mq.removeListener(apply);
    };
  }, []);

  // Rotate images only when NOT on mobile (since mobile shows a video)
  useEffect(() => {
    if (isMobile) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isMobile]);

  const ariaProps = useMemo(
    () => ({
      role: "region",
      "aria-label": "Hero slider",
      "aria-roledescription": "carousel",
      "aria-live": "polite",
    }),
    []
  );

  return (
    <div className="hero-slider" {...ariaProps}>
      {/* Mobile: show video */}
      {isMobile ? (
        <video
          key="hero-mobile-video"
          className="hero-video"
          src="/videos/hero.mp4"
          playsInline
          muted
          autoPlay
          loop
          preload="metadata"
          poster={sliderImages[0]}
          aria-label="Hero video"
        />
      ) : (
        // Desktop/Tablet: show cross-fading images
        sliderImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Slide ${index + 1}`}
            className={index === currentIndex ? "slide active" : "slide"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            sizes="100vw"
          />
        ))
      )}
    </div>
  );
};

export default HeroSlider;
