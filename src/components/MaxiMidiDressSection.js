// src/components/MaxiMidiDressSection.js
import React, { useMemo, useState, useCallback } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './ProductGrid.css';

const GET_COLLECTION_PRODUCTS = gql`
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 4) {
        edges {
          node {
            id
            title
            handle
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 1) { edges { node { url altText } } }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* Storefront cart mutations */
const CART_CREATE = gql`
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl totalQuantity }
      userErrors { field message }
    }
  }
`;
const CART_LINES_ADD = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity }
      userErrors { field message }
    }
  }
`;

const MaxiMidiDressSection = () => {
  const collectionHandle = 'maxi-midi-dress';
  const { loading, error, data } = useQuery(GET_COLLECTION_PRODUCTS, {
    variables: { handle: collectionHandle },
  });

  const [createCart] = useMutation(CART_CREATE);
  const [addLines] = useMutation(CART_LINES_ADD);
  const [busy, setBusy] = useState({}); // productId -> boolean | 'added'

  const products = useMemo(() => {
    const edges = data?.collection?.products?.edges ?? [];
    return edges.map(({ node }) => {
      const imageUrl = node.images?.edges?.[0]?.node?.url || '';
      const altText = node.images?.edges?.[0]?.node?.altText || node.title;
      const variant = node.variants?.edges?.[0]?.node || null;
      return {
        ...node,
        imageUrl,
        altText,
        variantId: variant?.id || null,
        available: !!variant?.availableForSale,
      };
    });
  }, [data]);

  const getCartId = () => {
    try { return localStorage.getItem('shopifyCartId') || null; } catch { return null; }
  };
  const setCartId = (id) => {
    try { localStorage.setItem('shopifyCartId', id); } catch {}
  };

  const handleAddToCart = useCallback(
    async (product) => {
      if (!product?.variantId) return;
      setBusy((b) => ({ ...b, [product.id]: true }));
      try {
        const lines = [{ merchandiseId: product.variantId, quantity: 1 }];

        let cartId = getCartId();
        if (!cartId) {
          const res = await createCart({ variables: { lines } });
          const errs = res?.data?.cartCreate?.userErrors;
          if (errs?.length) throw new Error(errs.map(e => e.message).join('; '));
          cartId = res?.data?.cartCreate?.cart?.id;
          if (!cartId) throw new Error('Failed to create cart');
          setCartId(cartId);
        } else {
          const res = await addLines({ variables: { cartId, lines } });
          const errs = res?.data?.cartLinesAdd?.userErrors;
          if (errs?.length) throw new Error(errs.map(e => e.message).join('; '));
        }

        setBusy((b) => ({ ...b, [product.id]: 'added' }));
        setTimeout(() => setBusy((b) => ({ ...b, [product.id]: false })), 900);
      } catch (e) {
        console.error('Add to cart error:', e);
        setBusy((b) => ({ ...b, [product.id]: false }));
        alert(`Could not add to cart: ${e.message || e}`);
      }
    },
    [createCart, addLines]
  );

  if (error || (!loading && !data?.collection?.products?.edges?.length)) return null;

  return (
    <div className="top-products-section">
      <h2 className="section-title">Maxi &amp; Midi Dresses</h2>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const isBusy = busy[product.id] === true;
            const justAdded = busy[product.id] === 'added';

            return (
              <div key={product.id} className="product-card-wrapper">
                <Link
                  to={`/products/${product.handle}`} // ✅ fixed path
                  className="product-card"
                  aria-label={product.title}
                >
                  <div className="product-image-container">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.altText} />
                    )}
                    <div className="quick-view">QUICK VIEW</div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">
                      ₹{parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}{' '}
                      {product.priceRange.minVariantPrice.currencyCode}
                    </p>

                    {/* Add to Cart */}
                    <div className="product-actions">
                      <button
                        className="add-to-cart-btn"
                        disabled={!product.available || isBusy}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        aria-disabled={!product.available || isBusy}
                        aria-label={product.available ? 'Add to cart' : 'Out of stock'}
                      >
                        {!product.available
                          ? 'Out of stock'
                          : isBusy
                          ? 'Adding...'
                          : justAdded
                          ? 'Added!'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <Link to={`/collections/${collectionHandle}`} className="view-all-button">
        View All
      </Link>
    </div>
  );
};

export default MaxiMidiDressSection;
