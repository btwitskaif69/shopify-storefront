import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import "./Sale.css";

/**
 * We fetch a page of products and check their first variant's compareAtPrice.
 * If compareAtPrice > price, we treat it as "on sale".
 * If you already maintain a "sale" collection, set USE_SALE_COLLECTION = true.
 */
const USE_SALE_COLLECTION = false; // flip to true if you have a "sale" collection

const GET_SALE_COLLECTION = gql`
  query SaleCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            images(first: 1) {
              edges {
                node { url altText }
              }
            }
            variants(first: 1) {
              nodes {
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCTS_PAGE = gql`
  query ProductsForSale($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          handle
          title
          images(first: 1) {
            edges {
              node { url altText }
            }
          }
          variants(first: 1) {
            nodes {
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

function formatMoney(amount, currencyCode) {
  const n = Number(amount || 0);
  if (!Number.isFinite(n)) return "-";
  // Simple INR-friendly formatter; adjust locales as needed
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `₹${Math.round(n)}`;
  }
}

const Sale = () => {
  const { data, loading, error } = useQuery(
    USE_SALE_COLLECTION ? GET_SALE_COLLECTION : GET_PRODUCTS_PAGE,
    {
      variables: USE_SALE_COLLECTION
        ? { handle: "sale", first: 32 }
        : { first: 50 },
      fetchPolicy: "cache-first",
    }
  );

  if (loading) {
    return <div className="sale-wrap"><p className="sale-status">Loading Sale…</p></div>;
  }
  if (error) {
    return <div className="sale-wrap"><p className="sale-status error">Error: {error.message}</p></div>;
  }

  const edges = USE_SALE_COLLECTION
    ? data?.collection?.products?.edges ?? []
    : data?.products?.edges ?? [];

  // Map to a uniform product shape and filter only discounted
  const products = edges
    .map(({ node }) => {
      const img = node.images?.edges?.[0]?.node;
      const v = node.variants?.nodes?.[0];
      const price = v?.price?.amount ? Number(v.price.amount) : null;
      const compare = v?.compareAtPrice?.amount ? Number(v.compareAtPrice.amount) : null;

      let discountPct = null;
      if (price != null && compare != null && compare > price) {
        discountPct = Math.round(((compare - price) / compare) * 100);
      }

      return {
        id: node.id,
        handle: node.handle,
        title: node.title,
        imageUrl: img?.url || "https://via.placeholder.com/800x1000?text=Sale",
        alt: img?.altText || node.title,
        price,
        priceCurrency: v?.price?.currencyCode || "INR",
        compare,
        compareCurrency: v?.compareAtPrice?.currencyCode || v?.price?.currencyCode || "INR",
        discountPct,
      };
    })
    .filter(p => p.discountPct && p.discountPct > 0);

  return (
    <section className="sale-wrap">
      <h1 className="sale-title">On Sale</h1>

      {products.length === 0 ? (
        <p className="sale-status">No discounted items right now—check back soon!</p>
      ) : (
        <div className="sale-grid">
          {products.map(p => (
            <Link key={p.id} to={`/products/${p.handle}`} className="sale-card">
              <div className="sale-image">
                <img src={p.imageUrl} alt={p.alt} loading="lazy" />
                {p.discountPct ? (
                  <span className="sale-badge">-{p.discountPct}%</span>
                ) : null}
              </div>

              <div className="sale-info">
                <h3 className="sale-product-title">{p.title}</h3>

                <div className="sale-prices">
                  <span className="sale-price">
                    {formatMoney(p.price, p.priceCurrency)}
                  </span>
                  {p.compare && p.compare > p.price ? (
                    <span className="sale-compare">
                      {formatMoney(p.compare, p.compareCurrency)}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Sale;
