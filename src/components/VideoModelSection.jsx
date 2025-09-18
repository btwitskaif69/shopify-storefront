import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ 1. Import Link
import "./Categories.css";

export default function Categories() {
  // ✅ 2. Add a 'handle' for the URL to each category
  const categories = [
    { name: "THE 9-TO-5 WARDROBE", img: "/images/7.jpeg", handle: "maxi-midi-dress" },
    { name: "FOR A TABLE FOR TWO", img: "/images/666.png", handle: "maxi-midi-dress" },
    { name: "THE MAIN EVENT", img: "/images/111.png", handle: "short-dress" },
    { name: "THE FESTIVE CHAPTER", img: "/images/122.png", handle: "co-ords" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextIndex = (activeIndex + 1) % categories.length;
  const nextNextIndex = (activeIndex + 2) % categories.length;

  return (
    <div className="container">
      <div className="main">
        <div className="category-list">
          {categories.map((cat, idx) => (
            // ✅ 3. Wrap the span with a Link component
            <Link 
              key={cat.name} 
              to={`/collections/${cat.handle}`} 
              className="category-link"
            >
              <span
                onMouseEnter={() => setActiveIndex(idx)}
                className={`category-item ${activeIndex === idx ? "active" : ""}`}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Center Product Preview (no changes here) */}
        <div className="preview">
          <AnimatePresence mode="wait">
            <motion.img
              key={categories[activeIndex].name}
              src={categories[activeIndex].img}
              alt={categories[activeIndex].name}
              className="main-img"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -40 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="blurred-images">
            <AnimatePresence mode="wait">
              <motion.img
                key={categories[nextIndex].name + "-next"}
                src={categories[nextIndex].img}
                alt={categories[nextIndex].name}
                className="blurred-img"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.img
                key={categories[nextNextIndex].name + "-next-next"}
                src={categories[nextNextIndex].img}
                alt={categories[nextNextIndex].name}
                className="blurred-img deeper-blur"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="right-space"></div>
      </div>
    </div>
  );
}