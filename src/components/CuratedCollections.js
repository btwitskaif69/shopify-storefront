import React from "react";
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./CuratedCollections.css";

/**
 * Pass custom labels/handles with the `items` prop (length 3).
 * Example:
 * <CuratedCollections items={[
 *   { label: "SUMMER & RESORT", handle: "summer-resort" },
 *   { label: "WINTER & FESTIVE", handle: "winter-festive" },
 *   { label: "THE FINISHING STROKE: TOPS", handle: "tops" }
 * ]}/>
 */
const DEFAULT_ITEMS = [
  { label: "SUMMER & RESORT", labelSmall: true, handle: "summer-resort" },
  { label: "WINTER & FESTIVE", labelSmall: true, handle: "winter-festive" },
  { label: "THE FINISHING STROKE: TOPS", labelSmall: true, handle: "tops" },
];

const GET_CURATED = gql`
  query CuratedCollections($h1: String!, $h2: String!, $h3: String!) {
    c1: collection(handle: $h1) {
      id
      handle
      title
      image { url altText }
    }
    c2: collection(handle: $h2) {
      id
      handle
      title
      image { url altText }
    }
    c3: collection(handle: $h3) {
      id
      handle
      title
      image { url altText }
    }
  }
`;

const CuratedCollections = ({ items = DEFAULT_ITEMS }) => {
  const [i1, i2, i3] = items;

  const { loading, error, data } = useQuery(GET_CURATED, {
    variables: { h1: i1.handle, h2: i2.handle, h3: i3.handle },
  });

  const cards = [
    { cfg: i1, col: data?.c1 },
    { cfg: i2, col: data?.c2 },
    { cfg: i3, col: data?.c3 },
  ];

  return (
    <section className="curated-section">
      <header className="curated-header">
        <h2 className="curated-title">DESIGNED FOR YOUR TRUE STYLE</h2>
        <p className="curated-subtitle">
          To make things easier, we’ve gathered your favorites here.
        </p>
      </header>

      {loading && (
        <div className="curated-skeleton-row">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div className="curated-card skeleton" key={idx}>
              <div className="curated-card-img" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="curated-error">
          Couldn’t load curated collections: {error.message}
        </div>
      )}

      {!loading && !error && (
        <Swiper
          modules={[Navigation]}
          navigation
          className="curated-swiper"
          slidesPerView={3}
          spaceBetween={24}
          loop={false}
          breakpoints={{
            0:    { slidesPerView: 1, spaceBetween: 16 },
            640:  { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {cards.map(({ cfg, col }) => {
            const img = col?.image?.url || "/images/placeholder-4x5.png";
            const alt = col?.image?.altText || col?.title || cfg.label;
            const link = `/collections/${col?.handle || cfg.handle}`;

            return (
              <SwiperSlide key={cfg.handle}>
                <article className="curated-card">
                  <div className="curated-card-label">
                    {cfg.label}
                  </div>
                  <Link to={link} aria-label={`Open ${cfg.label}`}>
                    <div className="curated-card-img">
                      <img src={img} alt={alt} loading="lazy" />
                    </div>
                  </Link>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default CuratedCollections;
