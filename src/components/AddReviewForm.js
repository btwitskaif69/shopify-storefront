import React, { useState } from 'react';
import './AddReviewForm.css';

const API_ENDPOINT = 'https://app.airreviews.io/review/submit';
const SHOP_ID = '4GGLsnRA4vQdKunZWVFe'; 

const AddReviewForm = ({ productId, productHandle, productTitle, productImage, productSku }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shopifyProductId = productId ? parseInt(productId.split('/').pop(), 10) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopifyProductId) {
      setMessage('Error: Product ID is missing.');
      return;
    }
    if (rating === 0) {
      setMessage('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    setMessage('Submitting your review...');

    const reviewData = {
      shopId: SHOP_ID,
      productId: shopifyProductId,
      rate: rating,
      status: "disapproved",
      content: review,
      author: name,
      productHandle,
      productTitle,
      productImage,
      productSku
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to submit review.');
      }

      setMessage('✅ Thank you! Your review has been submitted for approval.');
      setName('');
      setReview('');
      setRating(0);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Write a Review</h3>

      {/* ⭐ Star Rating */}
      <div className="star-rating">
        {[...Array(5)].map((star, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              className={`star ${starValue <= (hover || rating) ? 'filled' : ''}`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(rating)}
            >
              ★
            </span>
          );
        })}
      </div>

      {rating > 0 && (
        <form onSubmit={handleSubmit} className="review-form">
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="review">Review</label>
          <textarea 
            id="review"
            rows="5"
            placeholder="Share your thoughts..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>

          <button type="submit" className="submit-review-button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default AddReviewForm;
