import React, { useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import './TopProducts.css';

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
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
      }
      userErrors { field message }
    }
  }
`;

const TopProducts = () => {
  const { loading, error, data } = useQuery(GET_TOP_PRODUCTS, {
    variables: { handle: 'top-products' },
  });

  const [cartBusy, setCartBusy] = useState({}); // productId -> boolean

  const [createCart] = useMutation(CART_CREATE);
  const [addLines] = useMutation(CART_LINES_ADD);

  const products = useMemo(() => {
    const edges = data?.collection?.products?.edges ?? [];
    return edges.map(({ node: product }) => {
      // parse rating if present
      let ratingValue = 0;
      if (product.rating?.value) {
        try {
          const obj = JSON.parse(product.rating.value);
          ratingValue = Math.round(parseFloat(obj.value));
        } catch (e) {
          // ignore parse errors
        }
      }
      const imageUrl =
        product.images?.edges?.[0]?.node?.url ||
        'https://via.placeholder.com/600x800';
      const altText =
        product.images?.edges?.[0]?.node?.altText || product.title;

      const variantNode = product.variants?.edges?.[0]?.node || null;
      const variantId = variantNode?.id || null;
      const available = !!variantNode?.availableForSale;

      return {
        ...product,
        ratingValue,
        imageUrl,
        altText,
        variantId,
        available,
      };
    });
  }, [data]);

  const getStoredCartId = () => {
    try {
      return localStorage.getItem('shopifyCartId') || null;
    } catch {
      return null;
    }
  };
  const setStoredCartId = (id) => {
    try {
      localStorage.setItem('shopifyCartId', id);
    } catch {
      /* ignore */
    }
  };

  const handleAddToCart = useCallback(
    async (product) => {
      // prevent multiple clicks on the same card
      setCartBusy((b) => ({ ...b, [product.id]: true }));

      try {
        // Need a variant to add
        if (!product.variantId) {
          throw new Error('No purchasable variant found.');
        }

        const lines = [{ merchandiseId: product.variantId, quantity: 1 }];

        let cartId = getStoredCartId();
        if (!cartId) {
          // First time: create a cart with this line
          const res = await createCart({ variables: { lines } });
          const errs = res?.data?.cartCreate?.userErrors;
          if (errs?.length) throw new Error(errs.map((e) => e.message).join('; '));

          cartId = res?.data?.cartCreate?.cart?.id;
          if (!cartId) throw new Error('Failed to create cart');
          setStoredCartId(cartId);
        } else {
          // Existing cart: add the line
          const res = await addLines({ variables: { cartId, lines } });
          const errs = res?.data?.cartLinesAdd?.userErrors;
          if (errs?.length) throw new Error(errs.map((e) => e.message).join('; '));
        }

        // Optional: toast/snackbar—here we just flip button label briefly
        setCartBusy((b) => ({ ...b, [product.id]: 'added' }));
        setTimeout(() => {
          setCartBusy((b) => ({ ...b, [product.id]: false }));
        }, 1000);
      } catch (e) {
        console.error('Add to cart error:', e);
        setCartBusy((b) => ({ ...b, [product.id]: false }));
        alert(`Could not add to cart: ${e.message || e}`);
      }
    },
    [addLines, createCart]
  );

  if (loading)
    return (
      <p style={{ textAlign: 'center', padding: '50px' }}>
        Loading Shop By Category...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: 'center', padding: '50px' }}>
        Error loading products: {error.message}
      </p>
    );

  if (!data || !data.collection || products.length === 0) {
    return (
      <div className="top-products-section">
        <h2 className="section-title">Shop By Category</h2>
        <p>The "top-products" collection could not be found or is empty.</p>
      </div>
    );
  }

  return (
    <div className="top-products-section">
      <h2 className="section-title">Shop By Category</h2>

      <div className="product-grid">
        {products.map((product) => {
          const busyState = cartBusy[product.id];
          const isBusy = busyState === true;
          const justAdded = busyState === 'added';

          return (
            <div key={product.id} className="product-card-wrapper">
              <Link
                to={`/products/${product.handle}`}
                className="product-card"
                aria-label={product.title}
              >
                <div className="product-image-container">
                  <img src={product.imageUrl} alt={product.altText} />
                  <div className="quick-view">QUICK VIEW</div>
                </div>

                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">
                    ₹
                    {parseFloat(
                      product.priceRange.minVariantPrice.amount
                    ).toFixed(0)}{' '}
                    {product.priceRange.minVariantPrice.currencyCode}
                  </p>
                  {product.ratingValue > 0 ? (
  <div className="star-rating">
    {'★'.repeat(product.ratingValue)}
    {'☆'.repeat(5 - product.ratingValue)}
  </div>
) : (
  // Reserve height so all cards line up the same
  <div className="star-rating star-placeholder" aria-hidden="true" />
)}

                  {/* Actions (Add to Cart) — stop navigation when clicked */}
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
                      aria-label={
                        product.available ? 'Add to cart' : 'Out of stock'
                      }
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

      <Link to="/collections/top-products" className="view-all-button">
        View All
      </Link>
    </div>
  );
};

export default TopProducts;
