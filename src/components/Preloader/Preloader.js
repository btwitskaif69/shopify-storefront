import React, { useRef, useState } from "react";
import "./Preloader.css";

const Preloader = ({ onVideoEnd, hintText = "Click To Start" }) => {
  const videoRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleScreenClick = () => {
    if (videoRef.current && !hasStarted) {
      videoRef.current
        .play()
        .then(() => setHasStarted(true))
        .catch((err) => console.error("Preloader play error:", err));
    }
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    if (videoRef.current) videoRef.current.pause();
    onVideoEnd && onVideoEnd();
  };

  return (
    <div
      className="preloader-container"
      onClick={handleScreenClick}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src="/videos/intro_viddd.mp4"
        playsInline
        muted={false}
        controls={false}
        onEnded={onVideoEnd}
        className="preloader-video"
      />

      {/* Cursor-following hint (hidden after the video starts) */}
      {!hasStarted && (
        <div
          className="cursor-hint"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <span className="hint-text">{hintText}</span>
        </div>
      )}

      {hasStarted && (
        <button className="skip-button" onClick={handleSkip}>
          Skip
        </button>
      )}
    </div>
  );
};

export default Preloader;
