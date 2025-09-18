import React, { useRef, useState, useEffect } from "react";
import "./WatchAndBuy.css";

const WatchAndBuy = () => {
  const videos = [
    { id: 1, videoUrl: "/videos/Video-111.mp4", productName: "Tropical Blush Co-ord Set", productLink: "/collections/co-ords/products/tropical-blush-set", thumbnail: "/images/image1.png" },
    { id: 2, videoUrl: "/videos/Video-114.mp4", productName: "Earthy Green Co-ord Set", productLink: "https://shopify-storefront-rlry.vercel.app/products/earthy-green-embroidered-waistcoat-co-ord-set", thumbnail: "/images/image2.png" },
    { id: 3, videoUrl: "/videos/Video-339.mp4", productName: "Sunsoaked Terra Co-ord Set", productLink: "/collections/co-ords/products/sunsoaked-terra-set", thumbnail: "/images/image3.png" },
    { id: 4, videoUrl: "/videos/Video-766.mp4", productName: "High Waist Flared Trousers", productLink: "/collections/bottoms/products/high-waist-trousers", thumbnail: "/images/image4.png" },
    { id: 5, videoUrl: "/videos/Video-609.mp4", productName: "Leopard Print One-Shoulder Maxi Dress", productLink: "https://delan1.myshopify.com/products/leopard-print-one-shoulder-maxi-dress", thumbnail: "/images/image5.png" },
    { id: 6, videoUrl: "/videos/Video-766.mp4", productName: "High Waist Flared Trousers", productLink: "/collections/bottoms/products/high-waist-trousers", thumbnail: "/images/image4.png" },
  ];

  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 300;
    const first = track.querySelector(".video-card");
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    return (first?.getBoundingClientRect().width || 280) + gap;
  };

  const scrollByCards = (n) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: n * getStep(), behavior: "smooth" });
  };

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  // drag-to-scroll (desktop) + touch works by default
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const down = (e) => {
      isDown = true;
      el.classList.add("dragging");
      startX = (e.touches ? e.touches[0].pageX : e.pageX);
      startLeft = el.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      const x = (e.touches ? e.touches[0].pageX : e.pageX);
      el.scrollLeft = startLeft - (x - startX);
    };
    const up = () => { isDown = false; el.classList.remove("dragging"); };

    el.addEventListener("mousedown", down);
    el.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", up);

    return () => {
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", up);
    };
  }, []);

  return (
    <section className="watch-buy-section">
      <h2 className="section-title">Discover Your Look</h2>

      <div className="slider-shell">
        <button
          className="slider-nav prev"
          onClick={() => scrollByCards(-1)}
          disabled={!canPrev}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="videos-container" ref={trackRef} role="region" aria-label="Reels carousel">
          {videos.map((item) => (
            <div key={item.id} className="video-card">
              <video
                src={item.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="video-reel"
              />
              <div className="product-info">
                <div className="product-left">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="product-thumbnail"
                  />
                  <div>
                    <p className="product-name">{item.productName}</p>
                    {/* If you have price, show it here */}
                    {/* <p className="product-price">₹2,990</p> */}
                  </div>
                </div>
                <a href={item.productLink} className="buy-button">Buy</a>
              </div>
            </div>
          ))}
        </div>

        <button
          className="slider-nav next"
          onClick={() => scrollByCards(1)}
          disabled={!canNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default WatchAndBuy;
