import React, { useState, useEffect, useRef } from 'react';

const UspShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const componentRef = useRef(null);

  const usps = [
    {
      title: 'Crafted from 100% natural fabrics',
      description:
        'Experience the pure comfort and breathability of materials sourced directly from nature, ensuring a soft touch on your skin and a clear conscience.',
      image: '/images/11.png',
    },
    {
      title: 'Uncompromised quality at fair prices',
      description:
        'We believe luxury should be accessible. Our direct-to-consumer model eliminates middlemen, allowing us to offer premium garments without the premium price tag.',
      image: '/images/22.png',
    },
    {
      title: 'Sustainable fashion for conscious living',
      description:
        'From ethical sourcing to eco-friendly packaging, every step of our process is designed to minimize our environmental footprint and promote a healthier planet.',
      image: '/images/33.png',
    },
    {
      title: 'Elegant designs, timeless everyday wear',
      description:
        'Our collections are thoughtfully designed to be both beautiful and versatile, creating staple pieces that you will cherish and wear for years to come.',
      image: '/images/44.png',
    },
    {
      title: 'Comfort, style, and responsibility combined',
      description:
        'You no longer have to choose. Our brand is a promise of clothing that looks good, feels good, and does good for the world.',
      image: '/images/55.png',
    },
  ];

  const handleScroll = () => {
    if (componentRef.current) {
      const { height } = componentRef.current.getBoundingClientRect();
      const scrollOffset = window.innerHeight * 0.5;
      const scrollPosition = window.scrollY + scrollOffset;
      const componentTop = componentRef.current.offsetTop;

      const scrollProgress = scrollPosition - componentTop;
      const sectionHeight = height / usps.length;

      const newIndex = Math.min(
        usps.length - 1,
        Math.max(0, Math.floor(scrollProgress / sectionHeight))
      );

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex]);

  const styles = {
    container: {
      display: 'flex',
      minHeight: '350vh',
      backgroundColor: '#fff',
      fontFamily: 'system-ui, sans-serif',
    },
    leftPanel: {
      width: '50%',
      position: 'sticky',
      top: 0,
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    rightPanel: {
      width: '50%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '30vh 10vw 0 0',
      position: 'sticky',
      top: 0,
      height: '100vh',
    },
    uspContent: {
      maxWidth: '500px',
      lineHeight: '1.6',
      paddingRight: '80px',
    },
    uspItem: {
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      position: 'absolute',
      width: '420px',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      position: 'absolute',
      maxWidth: '70%',
      transition: 'all 0.8s ease-in-out',
      objectFit: 'contain',
    },
  };

  const getImageStyle = (index) => {
    const total = usps.length;
    const relativeIndex = (index - activeIndex + total) % total;

    if (relativeIndex === 0) {
      return {
        ...styles.image,
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
        zIndex: 3,
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))',
      };
    } else if (relativeIndex === 1) {
      return {
        ...styles.image,
        opacity: 0.7,
        transform: 'translate(-120px, 160px) scale(0.8)',
        zIndex: 2,
        filter: 'blur(2px)',
      };
    } else if (relativeIndex === total - 1) {
      return {
        ...styles.image,
        opacity: 0.5,
        transform: 'translate(-120px, -160px) scale(0.8)',
        zIndex: 1,
        filter: 'blur(3px)',
      };
    }

    return {
      ...styles.image,
      opacity: 0,
      transform: 'translate(0, 0) scale(0.4)',
      zIndex: 0,
    };
  };

  return (
    <div ref={componentRef} style={styles.container}>
      {/* Left side images */}
      <div style={styles.leftPanel}>
        <div style={styles.imageContainer}>
          {usps.map((usp, index) => (
            <img
              key={index}
              src={usp.image}
              alt={usp.title}
              style={getImageStyle(index)}
            />
          ))}
        </div>
      </div>

      {/* Right side text */}
      <div style={styles.rightPanel}>
        <div style={styles.uspContent}>
          {usps.map((usp, index) => (
            <div
              key={index}
              style={{
                ...styles.uspItem,
                opacity: activeIndex === index ? 1 : 0,
                transform:
                  activeIndex === index
                    ? 'translateY(0)'
                    : 'translateY(20px)',
              }}
            >
              <h2
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-primary)', // 👈 ADDED: Uses the primary font
                }}
              >
                {usp.title}
              </h2>
              <p
                style={{
                  fontSize: '1.3rem',
                  color: 'a64d79;',
                  marginBottom: '1rem',
                  lineHeight: '1.8',
                  maxWidth: '500ch', // 👈 CHANGED: Adjusted for ~15 words per line
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {usp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UspShowcase;