// src/components/CategoriesSection.js
import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./CategoriesSection.css";

const baseCategories = [
  { title: "Maxi & Midi Dress", handle: "maxi-midi-dress", image: "/images/categories1.png" },
  { title: "Short Dress", handle: "short-dress", image: "/images/categories2.png" },
  { title: "Co-ords", handle: "co-ords", image: "/images/categories3.png" },
  { title: "Trousers", handle: "trousers", image: "/images/categories4.png" },
];

const categories = [...baseCategories, ...baseCategories]; 

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <h2 className="categories-title">Change Into The Delan Edit</h2>
      <p className="categories-subtitle"> Discover Your Signature Look</p>
      <Swiper
        modules={[Navigation]}
        speed={600}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        navigation
        className="categories-carousel"
        // ✅ Set slidesPerView directly and update breakpoints
        slidesPerView={3} 
        spaceBetween={30}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {categories.map((cat, index) => (
          <SwiperSlide key={`${cat.handle}-${index}`} className="category-slide">
            <Link to={`/collections/${cat.handle}`} className="category-card">
              <img src={cat.image} alt={cat.title} className="category-img" />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategoriesSection;