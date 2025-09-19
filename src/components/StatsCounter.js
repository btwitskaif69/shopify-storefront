import React, { useState, useEffect, useRef } from 'react';
import './StatsCounter.css';

const StatsCounter = () => {
  // Updated stats to match your example
  const stats = [
    { id: 1, label: 'Happy Customers', target: 10, suffix: 'L+' },
    { id: 2, label: 'Styles Purchased', target: 3, suffix: 'M+' },
    { id: 3, label: 'Offline Stores Near You', target: 15, suffix: '' }
  ];

  // Count-up hook
  const useCountUp = (target, isVisible) => {
    const [count, setCount] = useState(0);
    const duration = 2000; // ms

    useEffect(() => {
      if (!isVisible) return;
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) window.requestAnimationFrame(animate);
      };

      window.requestAnimationFrame(animate);
    }, [target, isVisible]);

    return count;
  };

  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // run once
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = statsRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const StatItem = ({ label, target, suffix }) => {
    const count = useCountUp(target, isVisible);
    return (
      <div className="stat-item">
        <h3 className="stat-number">
          {count.toLocaleString()}
          {suffix}
        </h3>
        <p className="stat-label">{label}</p>
      </div>
    );
  };

  return (
    <section className="stats-wrapper">
      {/* Intro block styled to match the section */}
      <div className="stats-intro">
        <h1 className="stats-heading">The Delan Essence</h1>
        <p className="stats-subtitle">
          From timeless co-ord sets to empowering silhouettes, we’ve reimagined what modern fashion means for women.
          Across India, women aren’t just wearing Delan—they’re expressing confidence, embracing individuality, and
          shaping their own stories with every outfit.
        </p>
      </div>

      <div className="stats-section">
        <div ref={statsRef} className="stats-container">
          {stats.map((s) => (
            <StatItem
              key={s.id}
              label={s.label}
              target={s.target}
              suffix={s.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
