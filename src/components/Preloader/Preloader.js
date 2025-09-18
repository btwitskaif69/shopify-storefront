import React, { useRef, useState } from 'react';
import './Preloader.css';

const Preloader = ({ onVideoEnd }) => {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleScreenClick = () => {
    if (videoRef.current && !hasStarted) {
      videoRef.current.play()
        .then(() => {
          setHasStarted(true);
          console.log("Preloader video started");
        })
        .catch(err => {
          console.error("Error playing preloader video:", err);
        });
    }
  };

  const handleSkip = (e) => {
    e.stopPropagation(); // prevent play on skip click
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onVideoEnd(); // end preloader
  };

  return (
    <div className="preloader-container" onClick={handleScreenClick}>
      <video
        ref={videoRef}
        src="/videos/intro_viddd.mp4"
        playsInline
        muted={false}
        controls={false}
        onEnded={onVideoEnd}
        className="preloader-video"
      />
      {!hasStarted && (
        <div className="preloader-overlay">
          <p className="preloader-hint">Click to Start</p>
        </div>
      )}
      {hasStarted && (
        <button className="skip-button" onClick={handleSkip}>
          Skip Video
        </button>
      )}
    </div>
  );
};

export default Preloader;
