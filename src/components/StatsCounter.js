import React, { useState, useEffect, useRef } from 'react';
import './StatsCounter.css'; // We'll create this CSS file next

const StatsCounter = () => {
  // You can change these target numbers
  const stats = [
    { id: 1, label: 'Orders Delivered', target: 3456, suffix: '+' },
    { id: 2, label: 'Happy Clients', target: 1289, suffix: '+' },
    { id: 3, label: 'Curated Products', target: 68, suffix: '+' }
  ];

  // Custom hook for the count-up animation
  const useCountUp = (target, isVisible) => {
    const [count, setCount] = useState(0);
    const duration = 2000; // Animation duration in milliseconds

    useEffect(() => {
      if (!isVisible) return;
      let start = 0;
      const end = target;
      if (start === end) return;
      let startTime = null;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) window.requestAnimationFrame(animate);
      };
      
      window.requestAnimationFrame(animate);
    }, [target, isVisible]);
    
    return count;
  };

  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Animate only once
      }
    }, { threshold: 0.3 }); // Trigger when 30% of the component is visible
    
    const currentRef = statsRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  // Individual Stat Item component
  const StatItem = ({ label, target, suffix }) => {
    const count = useCountUp(target, isVisible);
    return (
      <div className="stat-item">
        <h3 className="stat-number">
          {count.toLocaleString()}{suffix}
        </h3>
        <p className="stat-label">{label}</p>
      </div>
    );
  };

  return (
    <div className="stats-section">
      <div ref={statsRef} className="stats-container">
        {stats.map(stat => (
          <StatItem key={stat.id} label={stat.label} target={stat.target} suffix={stat.suffix} />
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;