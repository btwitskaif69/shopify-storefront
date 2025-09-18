import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee'; 
import './TopProductsMarquee.css';

const GET_TOP_PRODUCTS = gql`
  query getTopProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 10) {
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
          }
        }
      }
    }
  }
`;

const TopProductsMarquee = () => {
  const { loading, error, data } = useQuery(GET_TOP_PRODUCTS, {
    variables: { handle: "top-products" },
  });

  // Don't render anything if loading or error
  if (loading || error || !data?.collection?.products?.edges?.length) {
    return null;
  }

  const products = data.collection.products.edges;

  return (
    <div className="marquee-wrapper">
      <Marquee
        pauseOnHover={true}     // ✅ Stops moving when hovered
        speed={40}              // Speed of scroll
        gradient={false}        // Removes fade effect
      >
        {products.map(({ node: product }) => (
          <Link
            to={`/products/${product.handle}`} 
            key={product.id}
            className="marquee-item"
          >
            <img
              src={product.images.edges[0]?.node.url}
              alt={product.images.edges[0]?.node.altText || product.title}
              className="marquee-image"
            />
            <span className="marquee-title">{product.title}</span>
          </Link>
        ))}
      </Marquee>
    </div>
  );
};

export default TopProductsMarquee;
