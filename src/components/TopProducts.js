import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

// --- SLIDER IMPORTS REMOVED ---

// Import the component's specific styles
import './TopProducts.css';

// --- CUSTOM ARROW COMPONENTS REMOVED ---

const GET_TOP_PRODUCTS = gql`
  query getTopProducts($handle: String!) {
    collection(handle: $handle) {
      title
      products(first: 8) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            rating: metafield(namespace: "reviews", key: "rating") {
              value
            }
          }
        }
      }
    }
  }
`;

const TopProducts = () => {
  const { loading, error, data } = useQuery(GET_TOP_PRODUCTS, {
    variables: { handle: "top-products" },
  });

  // --- SLIDER SETTINGS OBJECT REMOVED ---

  if (loading) return <p style={{textAlign: 'center', padding: '50px'}}>Loading Our Curated Collection...</p>;
  if (error) return <p style={{textAlign: 'center', padding: '50px'}}>Error loading products: {error.message}</p>;

  if (!data || !data.collection || data.collection.products.edges.length === 0) {
    return (
      <div className="top-products-section">
        <h2 className="section-title">Our Curated Collection</h2>
        <p>The "top-products" collection could not be found or is empty.</p>
      </div>
    );
  }

  const products = data.collection.products.edges;

  return (
    <div className="top-products-section">
      <h2 className="section-title">{'Our Curated Collection'}</h2>
      
      {/* ✅ KEY CHANGE: Replaced Slider with a div for the grid */}
      <div className="product-grid">
        {products.map(({ node: product }) => {
            let ratingValue = 0;
            if (product.rating && product.rating.value) {
                try {
                    const ratingObject = JSON.parse(product.rating.value);
                    ratingValue = Math.round(parseFloat(ratingObject.value));
                } catch (e) {
                    console.error("Could not parse rating value:", product.rating.value);
                }
            }

            const imageUrl = product.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/600x800';

            return (
                // The key is now on the top-level element inside the map
                <div key={product.id} className="product-card-wrapper">
                  <Link to={`/products/${product.handle}`} className="product-card">
                      <div className="product-image-container">
                          <img src={imageUrl} alt={product.images?.edges?.[0]?.node?.altText || product.title} />
                          <div className="quick-view">QUICK VIEW</div>
                      </div>
                      <div className="product-info">
                          <h3 className="product-title">{product.title}</h3>
                          <p className="product-price">
                              ₹{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)} {product.priceRange.minVariantPrice.currencyCode}
                          </p>
                          {ratingValue > 0 && (
                              <div className="star-rating">
                                  {'★'.repeat(ratingValue)}
                                  {'☆'.repeat(5 - ratingValue)}
                              </div>
                          )}
                      </div>
                  </Link>
                </div>
            );
        })}
      </div>
      
      <Link to="/collections/top-products" className="view-all-button">
        View All
      </Link>
    </div>
  );
};

export default TopProducts;