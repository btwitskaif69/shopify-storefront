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
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(
            identifiers: [{ namespace: "air_reviews_product", key: "data" }]
          ) {
            key
            namespace
            value
          }
        }
      }
    }
  }
`;

const ProductReviews = () => {
  const { loading, error, data } = useQuery(GET_REVIEWS_QUERY);

  if (loading) {
    return (
      <p style={{ textAlign: "center", padding: "50px" }}>Loading reviews...</p>
    );
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
        (mf) =>
          mf &&
          mf.namespace === "air_reviews_product" &&
          mf.key === "data"
      );

      if (!reviewMetafield || !reviewMetafield.value) {
        return [];
      }

      try {
        const reviewPayload = JSON.parse(reviewMetafield.value);
        const approvedReviews = (reviewPayload.reviews || []).filter(
          (review) => review.status === "approved"
        );

        // Create a card for each approved review for a product
        return approvedReviews.map((review) => ({
          id: `${product.id}-${review.id}`,
          author: review.firstName || review.author || review.name || review.user || "Valued Customer",
          rating: review.rate,
          reviewText: review.text || review.body || review.content || "",
          productTitle: product.title,
          productImage: product.images.edges[0]?.node.url,
        }));
      } catch (e) {
        console.error("Error parsing review JSON:", e, reviewMetafield.value);
        return [];
      }
    })
    .filter(Boolean);

  if (reviews.length === 0) {
    return null;
  }

 const settings = {
  dots: true,
  infinite: reviews.length > 3,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: true,

  // Added autoplay settings
  autoplay: true,           
  autoplaySpeed: 2000,      

  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: reviews.length > 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: reviews.length > 1,
      },
    },
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


// import React from 'react';
// import ReviewCard from './ReviewCard';
// import './ProductReviews.css';

// // We now only import the single image you've added
// import productImage from '../assets/images/product-1.jpg';

// // Updated mock data to use the same image for every review
// const mockReviews = [
//   { id: 1, author: 'Sienna M.', rating: 5, reviewText: 'The fit is absolutely perfect, and the fabric feels incredibly luxurious. A new staple in my wardrobe!', productTitle: 'Earthy Green Waistcoat', productImage: productImage },
//   { id: 2, author: 'Chloe T.', rating: 5, reviewText: 'Effortlessly chic. I received so many compliments the first time I wore this out.', productTitle: 'Rust Mirage Co-ord Set', productImage: productImage },
//   { id: 3, author: 'Amelia R.', rating: 4, reviewText: 'Beautiful design and very comfortable. The attention to detail is amazing.', productTitle: 'Sunbaked Jungle Co-ord', productImage: productImage },
//   { id: 4, author: 'Isabella G.', rating: 5, reviewText: 'This dress is a dream! The timeless pattern and flowy fabric are simply stunning.', productTitle: 'Indigo Garden Dress', productImage: productImage },
//   { id: 5, author: 'Olivia P.', rating: 5, reviewText: 'Sustainable and stylish. It’s rare to find a brand that does both so well. Highly recommend!', productTitle: 'Earthy Green Waistcoat', productImage: productImage },
//   { id: 6, author: 'Sophia L.', rating: 4, reviewText: 'I love the versatility. It can be dressed up for an evening out or worn casually.', productTitle: 'Rust Mirage Co-ord Set', productImage: productImage },
// ];

// const ProductReviews = () => {
//   return (
//     <section className="product-reviews-section">
//       <h2 className="section-title">Words from Our Customers</h2>
//       <div className="reviews-grid">
//         {mockReviews.map((review) => (
//           <ReviewCard key={review.id} review={review} />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ProductReviews;