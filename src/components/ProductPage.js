import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useCart } from '../context/CartContext';
import AddReviewForm from './AddReviewForm';
import RelatedProducts from './RelatedProducts';
import RecentlyViewed from './RecentlyViewed';
import ShineSection from './ShineSection';
import ReviewList from './ReviewList';
import ProductUSP from './ProductUSP';
import './ProductPage.css';
import InstagramCircles from './InstagramCircles';
import TopProductsMarquee from './TopProductsMarquee';
import { FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const GET_PRODUCT_BY_HANDLE = gql`
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      options(first: 3) {
        id
        name
        values
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            sku
            image { url }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      metafields(identifiers: [
        { namespace: "air_reviews_product", key: "data" },
        { namespace: "air_reviews_product", key: "review_avg" },
        { namespace: "air_reviews_product", key: "review_count" }
      ]) {
        key
        namespace
        type
        value
      }
    }
  }
`;

const ProductPage = () => {
  const { handle } = useParams();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [openSections, setOpenSections] = useState({}); // dropdown control

  useEffect(() => {
    if (handle) {
      const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedHistory = history.filter(h => h !== handle);
      updatedHistory.unshift(handle);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedHistory.slice(0, 5)));
    }
  }, [handle]);

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
  });

  useEffect(() => {
    if (data && data.product) {
      const defaultOptions = {};
      data.product.options.forEach(option => {
        defaultOptions[option.name] = option.values[0];
      });
      setSelectedOptions(defaultOptions);
      setMainImage(data.product.images.edges[0]?.node);
    }
  }, [data]);

  if (loading) return <p style={{ textAlign: 'center', padding: '100px 0' }}>Loading product...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '100px 0' }}>Error: {error.message}</p>;
  if (!data || !data.product) return <p style={{ textAlign: 'center', padding: '100px 0' }}>Product not found.</p>;

  const product = data.product;

  const selectedVariant = data.product.variants.edges.find(edge => {
    return edge.node.selectedOptions.every(option => {
      return selectedOptions[option.name] === option.value;
    });
  })?.node;

  const handleOptionClick = (optionName, value) => {
    const newSelectedOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelectedOptions);

    const newVariant = data.product.variants.edges.find(edge =>
      edge.node.selectedOptions.every(opt => newSelectedOptions[opt.name] === opt.value)
    )?.node;

    if (newVariant && newVariant.image) {
      setMainImage(newVariant.image);
    } else {
      setMainImage(product.images.edges[0]?.node);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      addToCart(selectedVariant.id, quantity);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    } else {
      alert("Please select all options or this variant is unavailable.");
    }
  };

  // --- Reviews parsing from metafield ---
  let reviews = [];
  if (product.metafields && product.metafields.length > 0) {
    const reviewMetafield = product.metafields.find(
      mf => mf && mf.namespace === 'air_reviews_product' && mf.key === 'data'
    );
    if (reviewMetafield && reviewMetafield.value) {
      try {
        const parsedData = JSON.parse(reviewMetafield.value);
        reviews = parsedData.reviews || [];
      } catch (e) {
        console.error("Error parsing reviews from metafield:", e);
        reviews = [];
      }
    }
  }

  const approvedReviews = reviews.filter(r => r.status === "approved");

  const avgRating = approvedReviews.length
    ? (approvedReviews.reduce((sum, r) => sum + (r.rate || 0), 0) / approvedReviews.length).toFixed(1)
    : null;

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
     <div className="marquee-wrapper">
      <TopProductsMarquee />
    </div>
      <div className="product-page-layout">
        {/* LEFT COLUMN: IMAGES & WHY YOU'LL LOVE THIS */}
        <div className="product-image-gallery">
          {/* Thumbnails */}
          <div className="thumbnail-list">
            {product.images.edges.map(({ node: image }, index) => (
              <button
                key={index}
                className={`thumbnail-item ${mainImage?.url === image.url ? 'active' : ''}`}
                onClick={() => setMainImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.altText || product.title}
                />
              </button>
            ))}
          </div>

          <div className="image-and-love-wrapper">
            {/* Main image with zoom */}
            <div className="main-image-viewer">
              {mainImage && (
                <InnerImageZoom
                  src={mainImage.url}
                  zoomSrc={mainImage.url}
                  alt={mainImage.altText || product.title}
                  zoomType="hover"
                  zoomPreload={true}
                  fullscreenOnMobile={true}
                />
              )}
            </div>

            {/* Why You’ll Love This Section */}
            <div className="why-love-section">
              <h2>Why You’ll Love This</h2>
              <div
                className="why-love-content"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT DETAILS */}
        <div className="product-details-column">
          <h1 className="product-title-main">{product.title}</h1>
          <p className="product-subtitle">Designed for Timeless Elegance</p>

          <div className="price-and-reviews">
            <p className="product-price-main">
              Rs. {selectedVariant?.price.amount || product.variants.edges[0].node.price.amount}
              {selectedVariant?.compareAtPrice && (
                <span className="compare-at-price">Rs. {selectedVariant.compareAtPrice.amount}</span>
              )}
            </p>
            {avgRating ? (
              <span className="reviews-link">
                ⭐ {avgRating}/5 ({approvedReviews.length} reviews)
              </span>
            ) : (
              <span className="reviews-link">No reviews yet</span>
            )}
          </div>

          {product.options.map((option) => (
            <div key={option.id} className="variant-group">
              <h3 className="variant-name">{option.name}: <span>{selectedOptions[option.name]}</span></h3>
              <div className="variant-values">
                {option.values.map((value) => (
                  <button
                    key={value}
                    className={`variant-button ${selectedOptions[option.name] === value ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option.name, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="actions-row">
            <div className="quantity-input-new">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              className="add-to-cart-button-new"
              disabled={!selectedVariant || !selectedVariant.availableForSale}
            >
              {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
            </button>
            <button className="wishlist-button"><FaHeart /></button>
          </div>

          <div className="offer-banner">
            <p>Flat 10% off on first purchase, up to Rs.500</p>
          </div>
          
          <InstagramCircles />
         

          {/* Dropdown Sections */}
          <div className="product-dropdowns">
            {[
              { key: "highlights", title: "Highlights", content: "<ul><li>Built in cups that stay in place</li><li>No see-through</li><li>Anti-camel toe</li><li>Chlorine resistant</li></ul>" },
              { key: "fabric", title: "Fabric Details", content: "<ul><li>80% Nylon – Comfort & freedom in/out of water</li><li>20% Spandex – Durability and stretch</li></ul>" },
              { key: "wash", title: "Wash-Care Details", content: "<ul><li>Line dry in shade</li></ul>" }
            ].map(section => (
              <div key={section.key} className="dropdown-section">
                <button className="dropdown-header" onClick={() => toggleSection(section.key)}>
                  <span>{section.title}</span>
                  {openSections[section.key] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openSections[section.key] && (
                  <div
                    className="dropdown-content"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            ))}
          </div>

          <AddReviewForm
            productId={product.id}
            productHandle={product.handle}
            productTitle={product.title}
            productImage={mainImage?.url}
            productSku={selectedVariant?.sku}
          />
        </div>
      </div>

      <div className={`cart-popup ${showPopup ? 'show' : ''}`}>
        ✅ {quantity} × {product.title} added to cart
      </div>

      <RelatedProducts productId={product.id} />
      <RecentlyViewed currentProductHandle={product.handle} />
      <ProductUSP />
      <ReviewList reviews={approvedReviews} />
      <ShineSection text="Own It #TrustYourStyle" />
    </>
  );
};

export default ProductPage;
