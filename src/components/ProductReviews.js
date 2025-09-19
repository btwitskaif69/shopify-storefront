// src/components/ProductReviews.js
import React from "react";
import { useQuery, gql } from "@apollo/client";
import Slider from "react-slick";
import ReviewCard from "./ReviewCard";
import "./ProductReviews.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GET_REVIEWS_QUERY = gql`
  query getProductsWithReviews {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges { node { url altText } }
          }
          metafields(
            identifiers: [{ namespace: "air_reviews_product", key: "data" }]
          ) { key namespace value }
        }
      }
    }
  }
`;

const ProductReviews = () => {
  const { loading, error, data } = useQuery(GET_REVIEWS_QUERY);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading reviews...</p>;
  }

  if (error) {
    return (
      <p style={{ textAlign: "center", padding: "50px" }}>
        Error loading reviews: {error.message}
      </p>
    );
  }

  const reviews = data.products.edges
    .flatMap((edge) => {
      const product = edge.node;
      const reviewMetafield = product.metafields?.find(
        (mf) => mf && mf.namespace === "air_reviews_product" && mf.key === "data"
      );
      if (!reviewMetafield?.value) return [];
      try {
        const payload = JSON.parse(reviewMetafield.value);
        const approved = (payload.reviews || []).filter(r => r.status === "approved");
        return approved.map((r) => ({
          id: `${product.id}-${r.id}`,
          author: r.firstName || r.author || r.name || r.user || "Valued Customer",
          rating: r.rate,
          reviewText: r.text || r.body || r.content || "",
          productTitle: product.title,
          productImage: product.images.edges[0]?.node.url,
        }));
      } catch {
        return [];
      }
    })
    .filter(Boolean);

  if (reviews.length === 0) return null;

  const settings = {
    dots: true,
    infinite: reviews.length > 3,
    speed: 450,            // ↓ slightly faster transition
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2200,   // ↓ decreased scroll timing between slides
    pauseOnHover: true,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: reviews.length > 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: reviews.length > 1 } },
    ],
  };

  return (
    <section className="product-reviews-section">
      <h2 className="section-title">Words from Our Customers</h2>
      <div className="carousel-wrapper">
        <Slider {...settings} className="reviews-carousel">
          {reviews.map((review) => (
            <div key={review.id} className="review-slide">
              <ReviewCard review={review} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ProductReviews;
