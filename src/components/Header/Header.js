import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaTruck,
  FaBars, // Hamburger Icon
  FaTimes, // Close Icon
} from "react-icons/fa";

const GET_COLLECTIONS = gql`
  query GetCollections {
    collections(first: 20) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

const Header = () => {
  const { loading, error, data } = useQuery(GET_COLLECTIONS);
  const { cart } = useCart();
  const { customer, logout } = useAuth();

  // State for desktop dropdown
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // --- NEW: State for mobile sidebar ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // For sidebar accordion

  const cartItemCount = cart
    ? cart.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0)
    : 0;

  const excludedHandles = ["home-page"];
  const navCollections =
    data?.collections.edges.filter(
      (edge) => !excludedHandles.includes(edge.node.handle)
    ) || [];

  // --- NEW: Handlers for sidebar ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen);

  return (
    <>
      <header className="site-header">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            {/* --- NEW: Hamburger Menu Icon --- */}
            <button className="hamburger-menu" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <Link to="/tools/track-order" className="header-link track-order-link">
              <FaTruck /> <span>Track Order</span>
            </Link>
          </div>

          {/* Logo Center */}
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img
                src="/images/delan-logo.png"
                alt="DELAN brand logo"
                className="logo-image"
              />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="top-bar-right">
            <Link to="/search" className="header-icon" title="Search">
              <FaSearch />
            </Link>

            <Link to="/cart" className="header-icon cart-icon" title="Cart">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </Link>

            {customer ? (
              <div
                className="user-menu"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className="header-link user-button"
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} // For mobile click
                >
                  <FaUser />
                  <span className="user-name">{customer.firstName}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/account" className="user-menu-link">
                      My Account
                    </Link>
                    <button onClick={logout} className="logout-button">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="login-signup-links">
                <Link to="/account/login" className="header-link">
                  Login
                </Link>
                <span>/</span>
                <Link to="/account/register" className="header-link">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Nav (for desktop) */}
        <nav className="main-nav">
          <ul>
            <li><Link to="/">HOME</Link></li>
            <li
              className="dropdown"
              onMouseEnter={() => setOpenDropdown("products")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link to="/collections">
                OUR PRODUCTS <span className="arrow">▼</span>
              </Link>
              <ul
                className={`dropdown-menu ${
                  openDropdown === "products" ? "is-open" : ""
                }`}
              >
                {loading && <li>Loading...</li>}
                {error && <li>Error: {error.message}</li>}
                {navCollections.map(({ node: collection }) => (
                  <li key={collection.id}>
                    <Link to={`/collections/${collection.handle}`}>
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link to="/collections/offers">OUR OFFERS</Link></li>
            <li><Link to="contact">CONTACT US</Link></li>
          </ul>
        </nav>
      </header>

      {/* --- NEW: Sidebar for Mobile --- */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      ></div>
      <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/" onClick={closeSidebar}>Home</Link></li>
            <li className="sidebar-dropdown">
              <div className="sidebar-dropdown-toggle" onClick={toggleProducts}>
                Our Products
                <span className={`arrow ${isProductsOpen ? "up" : "down"}`}>▼</span>
              </div>
              {isProductsOpen && (
                <ul className="sidebar-dropdown-menu">
                  {loading && <li>Loading...</li>}
                  {error && <li>Error loading collections.</li>}
                  {navCollections.map(({ node: collection }) => (
                    <li key={collection.id}>
                      <Link
                        to={`/collections/${collection.handle}`}
                        onClick={closeSidebar}
                      >
                        {collection.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li><Link to="/collections/offers" onClick={closeSidebar}>Our Offers</Link></li>
            <li><Link to="/contact" onClick={closeSidebar}>Contact Us</Link></li>
            <li className="sidebar-divider"><hr /></li>
            <li><Link to="/tools/track-order" onClick={closeSidebar}><FaTruck /> Track Order</Link></li>
            {customer ? (
                <>
                    <li><Link to="/account" onClick={closeSidebar}><FaUser /> My Account</Link></li>
                    <li><button onClick={() => { logout(); closeSidebar(); }} className="sidebar-logout-button">Log Out</button></li>
                </>
            ) : (
                <>
                    <li><Link to="/account/login" onClick={closeSidebar}>Login</Link></li>
                    <li><Link to="/account/register" onClick={closeSidebar}>Sign Up</Link></li>
                </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;