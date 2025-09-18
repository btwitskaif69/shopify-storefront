// src/components/ReviewList.js
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_PRODUCT_REVIEWS = gql`
  query getProductReviews($handle: String!) {
    product(handle: $handle) {
      id
      title
      metafields(
        identifiers: [{ namespace: "air_reviews_product", key: "data" }]
      ) {
        key
        namespace
        value
      }
    }
  }
`;

const ReviewList = () => {
  const { handle } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { handle },
  });

  const [visibleCount, setVisibleCount] = useState(3);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;

  const product = data?.product;
  if (!product) return <p>No product found.</p>;

  const reviewMetafield = product.metafields?.[0];
  let reviews = [];

  if (reviewMetafield && reviewMetafield.value) {
    try {
      const reviewPayload = JSON.parse(reviewMetafield.value);
      reviews = (reviewPayload.reviews || []).filter(
        (review) => review.status === "approved"
      );
    } catch (e) {
      console.error("Error parsing review JSON:", e);
    }
  }

  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="review-list" style={styles.container}>
      <h2 style={styles.heading}>Customer Reviews</h2>

      {reviews.slice(0, visibleCount).map((review, index) => (
        <div key={index} style={styles.reviewCard}>
          <p style={styles.rating}>⭐ {review.rate}/5</p>
          <p style={styles.text}>
            “{review.text || review.body || review.content || "No comment"}”
          </p>
         <p style={styles.author}>
          — {review.firstName || review.author || review.name || review.user || "Valued Customer"}
        </p>

        </div>
      ))}

      {visibleCount < reviews.length && (
        <button style={styles.loadMoreBtn} onClick={loadMore}>
          Load More Reviews
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "20px",
    textAlign: "center",
  },
  reviewCard: {
    borderBottom: "1px solid #ddd",
    padding: "15px 0",
  },
  rating: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
  text: {
    fontStyle: "italic",
    marginBottom: "6px",
    color: "#333",
  },
  author: {
    textAlign: "right",
    fontWeight: "500",
    color: "#555",
  },
  loadMoreBtn: {
    display: "block",
    margin: "20px auto 0",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#000",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ReviewList;
