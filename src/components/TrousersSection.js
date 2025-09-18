import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const GET_COLLECTION_PRODUCTS = gql`
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 4) {
        edges {
          node {
            id, title, handle,
            priceRange { minVariantPrice { amount, currencyCode } },
            images(first: 1) { edges { node { url, altText } } }
          }
        }
      }
    }
  }
`;

const TrousersSection = () => {
  const collectionHandle = "trousers"; // Hardcoded handle
  const { loading, error, data } = useQuery(GET_COLLECTION_PRODUCTS, {
    variables: { handle: collectionHandle },
  });

  if (error || (!loading && !data?.collection?.products?.edges?.length)) return null;

  return (
    <div className="top-products-section">
      <h2 className="section-title">Trousers</h2>
      
      {loading ? (
        <p style={{textAlign: 'center', padding: '50px'}}>Loading...</p>
      ) : (
        <div className="product-grid">
          {data.collection.products.edges.map(({ node: product }) => (
            <div key={product.id} className="product-card-wrapper">
              <Link to={`/products/₹{product.handle}`} className="product-card">
                <div className="product-image-container">
                  <img src={product.images.edges[0]?.node.url} alt={product.images.edges[0]?.node.altText || product.title} />
                  <div className="quick-view">QUICK VIEW</div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">
                    ₹{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)} {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <Link to={`/collections/${collectionHandle}`} className="view-all-button">
        View All
      </Link>
    </div>
  );
};

export default TrousersSection;