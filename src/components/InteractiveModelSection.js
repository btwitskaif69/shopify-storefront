import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Model } from './Model';
import { useWindowSize } from './hooks/useWindowSize'; // ✅ Import the new hook
import './InteractiveModelSection.css';

// ✅ USP positions for desktop
const uspsDesktop = [
  { text: 'Like every piece is designed just for you.', position: { top: '20%', left: '25%' } },
  { text: 'Comfort that hugs, style that truly stays.', position: { top: '20%', left: '70%' } },
  { text: 'A wardrobe choice you’ll never regret making.', position: { top: '60%', left: '25%' } },
  { text: 'Outfits that vibe with every mood and moment.', position: { top: '60%', left: '70%' } },
  { text: 'Quality that speaks before you even say a word.', position: { top: '80%', left: '50%' } },
];

// ✅ USP positions for mobile/tablet (vertically stacked)
const uspsMobile = [
  { text: 'Like every piece is designed just for you.', position: { top: '20%', left: '50%' } },
  { text: 'Comfort that hugs, style that truly stays.', position: { top: '35%', left: '50%' } },
  { text: 'A wardrobe choice you’ll never regret making.', position: { top: '50%', left: '50%' } },
  { text: 'Outfits that vibe with every mood and moment.', position: { top: '65%', left: '50%' } },
  { text: 'Quality that speaks before you even say a word.', position: { top: '80%', left: '50%' } },
];

const UspItem = ({ usp, index, scrollYProgress }) => {
  const start = index * 0.2;
  const end = start + 0.2;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    <motion.div
      className="usp-text"
      style={{ top: usp.position.top, left: usp.position.left, opacity }}
    >
      {usp.text}
    </motion.div>
  );
};

const InteractiveModelSection = ({ nextSectionRef }) => {
  const sectionRef = useRef(null);
  const { width } = useWindowSize(); // ✅ Get window width
  const isMobile = width < 768; // ✅ Define our breakpoint

  // ✅ Choose the correct USP layout and camera position based on screen width
  const usps = isMobile ? uspsMobile : uspsDesktop;
  const cameraPosition = isMobile ? [0, 0, 8] : [0, 0, 6.5]; // Zoom out slightly on mobile

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const modelRotation = useTransform(scrollYProgress, [0, 1], [0, 2 * Math.PI]);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (latest >= 0.98 && nextSectionRef?.current) {
        nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, [scrollYProgress, nextSectionRef]);

  return (
    <section ref={sectionRef} className="interactive-section">
      <div className="sticky-container">
        
        <div className="interactive-heading">
          <h2>Why Delan Feels Like You:</h2>
          <p>Because fashion should vibe with your story.</p>
        </div>

        <Canvas
          camera={{ position: cameraPosition, fov: 50 }}
          style={{
            width: '100%',
            height: '100%',
            // Let mobile scrolling pass through the canvas
            pointerEvents: isMobile ? 'none' : 'auto',
            touchAction: isMobile ? 'pan-y' : 'auto',
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Model modelRotation={modelRotation} />
          {/* Controls are disabled anyway; feel free to remove entirely */}
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>

        {usps.map((usp, index) => ( // ✅ Map over the dynamically chosen `usps` array
          <UspItem
            key={index}
            usp={usp}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

export default InteractiveModelSection;