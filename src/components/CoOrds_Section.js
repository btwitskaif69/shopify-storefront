// src/components/CoOrds_Section.js
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './CoOrdsSection.css';

const GET_COLLECTION_PRODUCTS = gql`
  query getCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
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

/**
 * Category meta to show in the CTA area.
 * Order matters — the Nth slide uses the Nth meta.
 * If there are more slides than metas, it loops.
 */
const CATEGORY_META = [
  {
    slug: 'all-dresses',
    title: 'All Dresses',
    subtitle: 'Find Your Vibe in Effortless Dresses',
    tagline: 'Where timeless design meets everyday elegance.',
    cta: 'SHOP NOW',
    to: '/collections/dresses',
  },
  {
    slug: 'maxi-midi',
    title: 'Maxi & Midi Statements',
    subtitle: 'Own Your Moment in Maxi & Midi Styles',
    tagline: 'Flowing silhouettes that speak confidence.',
    cta: 'SHOP NOW',
    to: '/collections/maxi-midi',
  },
  {
    slug: 'evening-edit',
    title: 'The Evening Edit',
    subtitle: 'Turn Every Night Into a Statement',
    tagline: 'Luxury evening wear designed to dazzle.',
    cta: 'SHOP NOW',
    to: '/collections/evening-edit',
  },
  {
    slug: 'all-trousers',
    title: 'All Trousers',
    subtitle: 'Power Dressing, Perfected',
    tagline: 'Tailored trousers for style and substance.',
    cta: 'SHOP NOW',
    to: '/collections/trousers',
  },
  {
    slug: 'global-silhouettes',
    title: 'Global Silhouettes',
    subtitle: 'Inspired by the World, Made for You',
    tagline: 'Western wear with a modern global twist.',
    cta: 'SHOP NOW',
    to: '/collections/global-silhouettes',
  },
  {
    slug: 'classic-bootcut',
    title: 'The Classic Bootcut',
    subtitle: 'Where Elegance Meets Comfort',
    tagline: 'Bootcut trousers designed to flatter every step.',
    cta: 'SHOP NOW',
    to: '/collections/bootcut',
  },
  {
    slug: 'all-tops',
    title: 'All Tops',
    subtitle: 'Elevate Your Everyday',
    tagline: 'Versatile tops for modern women on the move.',
    cta: 'SHOP NOW',
    to: '/collections/tops',
  },
  {
    slug: 'lyrical-blouse',
    title: 'The Lyrical Blouse',
    subtitle: 'Feminine · Fluid · Fearless',
    tagline: 'Blouses that add poetry to your wardrobe.',
    cta: 'SHOP NOW',
    to: '/collections/lyrical-blouse',
  },
  {
    slug: 'thesis-on-shirts',
    title: 'A Thesis on Shirts',
    subtitle: 'Smart. Sharp. Sophisticated.',
    tagline: 'Reimagining shirts for the empowered woman.',
    cta: 'SHOP NOW',
    to: '/collections/shirts',
  },
];

const CoOrdsSection = () => {
  const collectionHandle = 'co-ords';
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_COLLECTION_PRODUCTS, {
    variables: { handle: collectionHandle, first: 12 },
  });

  const products = useMemo(() => {
    const edges = data?.collection?.products?.edges || [];
    return edges
      .map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        image: node.images.edges[0]?.node.url,
        altText: node.images.edges[0]?.node.altText || node.title,
      }))
      .filter(p => Boolean(p.image)); // only keep slides with an image
  }, [data]);

  const hasSlides = products.length > 0;

  const safeIndex = (idx) => {
    if (!hasSlides) return 0;
    const mod = idx % products.length;
    return mod < 0 ? mod + products.length : mod;
  };

  const goToNext = () => {
    if (!hasSlides) return;
    setCurrentIndex((i) => safeIndex(i + 1));
  };

  const goToPrev = () => {
    if (!hasSlides) return;
    setCurrentIndex((i) => safeIndex(i - 1));
  };

  // Keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSlides]);

  // Compute transform and active meta
  const transformPct = hasSlides ? (currentIndex * (100 / products.length)) : 0;
  const trackStyle = hasSlides
    ? { transform: `translateX(-${transformPct}%)`, width: `${products.length * 100}%` }
    : { transform: 'translateX(0)' };

  // Choose meta in sync with the currentIndex
  const activeMeta = CATEGORY_META[safeIndex(currentIndex) % CATEGORY_META.length];

  if (error) {
    console.error('GraphQL Error:', error);
    return null;
  }

  return (
    <section className="co-ords-section">
      <div className="co-ords-top-layout">
        {/* Left Text */}
        <div className="co-ords-text-block left-text" aria-hidden="true">
          <span className="text-line line-1">FIND</span>
          <span className="text-line line-2">YOUR</span>
          <span className="text-line line-3">VIBE</span>
        </div>

        {/* Center Carousel */}
        <div className="co-ords-carousel-center">
          {loading ? (
            <div className="co-ords-loading-placeholder">Loading...</div>
          ) : !hasSlides ? (
            <div className="co-ords-loading-placeholder">No products found.</div>
          ) : (
            <div className="co-ords-carousel-container" role="region" aria-label="Co-ords gallery">
              <button
                className="co-ords-nav-arrow co-ords-nav-left"
                onClick={goToPrev}
                aria-label="Previous product"
                type="button"
              >
                &lt;
              </button>

              <div className="co-ords-products-wrapper">
                <div className="co-ords-products-carousel" style={trackStyle}>
                  {products.map((product, i) => (
                    <div key={product.id} className="co-ords-product-card" aria-hidden={i !== currentIndex}>
                      <img
                        src={product.image}
                        alt={product.altText}
                        className="co-ords-product-image"
                        draggable="false"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="co-ords-nav-arrow co-ords-nav-right"
                onClick={goToNext}
                aria-label="Next product"
                type="button"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        {/* Right Text */}
        <div className="co-ords-text-block right-text" aria-hidden="true">
          <span className="text-line line-1">OWN</span>
          <span className="text-line line-2">YOUR</span>
          <span className="text-line line-3">MOMENT</span>
        </div>
      </div>

      {/* Description Section — synced to current image */}
      <div className="co-ords-description-area" aria-live="polite">
        <h4 className="co-ords-category-title">{activeMeta.title}</h4>
        <h3 className="co-ords-subtitle">{activeMeta.subtitle}</h3>
        <p className="co-ords-tagline">{activeMeta.tagline}</p>

        <button
          className="co-ords-shop-button"
          onClick={() => navigate(activeMeta.to)}
          type="button"
        >
          {activeMeta.cta}
        </button>
      </div>
    </section>
  );
};

export default CoOrdsSection;
