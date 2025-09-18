import React, { useState } from 'react';
import './FlippingCard.css';

const FlippingCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flipping-card" onClick={handleClick} aria-hidden="true">
      <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* Front of the Card */}
        <div className="card-face card-front">
          <div className="card-content">
            <h2 className="front-text">
              <span className="line1">DELAN</span>
              <br />
              <span className="line2">REMEMBER</span>
              <br />
              <span className="line3">HER</span>
            </h2>
            <div className="flip-arrow-container">
              <svg width="150" height="90" viewBox="0 0 150 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M149 45C149 45 120.364 12.3571 85 1C49.6364 -10.3571 1 45 1 45M149 45C149 45 120.364 77.6429 85 89C49.6364 100.357 1 45 1 45M149 45H1" stroke="#E8A0A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="50" y="48" fontFamily="Georgia, serif" fontSize="20" fill="#8C4F6B" fontWeight="bold">FLIP!</text>
              </svg>
              <div className="corner-peel"></div>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div className="card-face card-back">
          <div className="card-content">
            <h5 className="back-text">
              Finding clothes that show who you really are, while lasting beyond quick fashion trends feels impossible. For 25 years, Delan has helped modern women solve this problem with perfectly fitted pieces made from beautiful, long-lasting fabrics that never go out of style. We don't just make clothes, we create confidence. When you wear Delan, you're not copying others. You're showing the world who you are. 
              Own it #TrustYourStyle
            </h5>
            <div className="back-arrow-container">
              <p className="back-arrow-text">BACK</p>

              {/* Animated Flip Arrow */}
              <svg 
                className="flip-arrow-icon"
                xmlns="http://www.w3.org/2000/svg" 
                width="40" height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#E8A0A3" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 12a10 10 0 1 0 4-8" />
                <polyline points="2 2 2 8 8 8" />
              </svg>

              <p className="flip-again-text">FLIP AGAIN!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;
