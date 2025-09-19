import React, { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import "./Offer.css";

/*
  Ensure .env contains (CRA):
  REACT_APP_SHOPIFY_STOREFRONT_TOKEN=your_token
  REACT_APP_SHOPIFY_API_ENDPOINT=https://your-shop.myshopify.com/api/2025-07/graphql.json
*/

const GET_OFFERS = gql`
  query getOfferProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          handle
          title
          onlineStoreUrl
          featuredImage {
            url
            altText
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
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

function bestDiscountVariant(variants = []) {
  let best = null;
  let bestPct = 0;
  for (const { node: v } of variants) {
    const price = Number(v?.price?.amount ?? 0);
    const cmp = Number(v?.compareAtPrice?.amount ?? 0);
    if (cmp > price && price > 0) {
      const pct = ((cmp - price) / cmp) * 100;
      if (pct > bestPct) {
        bestPct = pct;
        best = { ...v, discountPct: Math.round(pct) };
      }
    }
  }
  return best;
}

function formatMoney(amount, code) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(n);
}

const Offer = () => {
  // Same pattern as your TopProducts; token & endpoint via CRA env
  const { loading, error, data } = useQuery(GET_OFFERS, {
    variables: { first: 24 },
    context: {
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN,
      },
      uri: process.env.REACT_APP_SHOPIFY_API_ENDPOINT,
    },
  });

  // Derive products AFTER data is available
  const products = useMemo(() => {
    const nodes = (data?.products?.edges || []).map((e) => e.node);
    const withOffers = nodes
      .map((p) => {
        const best = bestDiscountVariant(p.variants?.edges || []);
        return best
          ? {
              ...p,
              bestVariant: best,
              to: `/products/${p.handle}`,
            }
          : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.bestVariant.discountPct - a.bestVariant.discountPct);
    return withOffers;
  }, [data]);

  if (loading) {
    return (
      <div className="offer-section center-message">
        <h2 className="offer-title">🔥 Hot Deals of the Day 🔥</h2>
        <p className="offer-message">Finding the best discounts for you…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offer-section center-message">
        <h2 className="offer-title">🔥 Hot Deals of the Day 🔥</h2>
        <p className="offer-message">Error loading offers: {error.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="offer-section center-message">
        <h2 className="offer-title">🔥 Hot Deals of the Day 🔥</h2>
        <p className="offer-message">No discounted products right now.</p>
      </div>
    );
  }

  return (
    <div className="offer-section">
      <div className="offer-header">
        <h2 className="offer-title">🔥 Hot Deals of the Day 🔥</h2>
        <p className="offer-sub">Best deals live right now</p>
      </div>

      <div className="offer-grid">
        {products.map((p) => {
          const v = p.bestVariant;
          return (
            <Link to={p.to} key={p.id} className="offer-card">
              <div className="offer-img">
                <img
                  src={p.featuredImage?.url}
                  alt={p.featuredImage?.altText || p.title}
                />
                <div className="offer-badge">-{v.discountPct}%</div>
              </div>
              <div className="offer-info">
                <h3 className="offer-name">{p.title}</h3>
                <div className="offer-price-row">
                  <span className="price">
                    {formatMoney(v.price.amount, v.price.currencyCode)}
                  </span>
                  <span className="compare">
                    {formatMoney(
                      v.compareAtPrice.amount,
                      v.compareAtPrice.currencyCode
                    )}
                  </span>
                </div>
                {v.title && v.title !== "Default Title" ? (
                  <div className="variant-note">{v.title}</div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Offer;
