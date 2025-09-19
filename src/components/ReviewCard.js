// src/components/ReviewCard.js
import React from "react";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card">
      <div className="review-card-inner">
        {/* Front: Review content */}
        <div className="review-card-front">
          <p className="review-rating">{"⭐".repeat(review.rating)}</p>
          <p className="review-text">"{review.reviewText}"</p>
          <div className="review-author-info">
            <p className="review-author">- {review.author}</p>
            <p className="review-product">on {review.productTitle}</p>
          </div>
        </div>

        {/* Back: Product image */}
        <div className="review-card-back">
          {review.productImage ? (
            <img
              src={review.productImage}
              alt={review.productTitle}
              className="review-product-img"
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;