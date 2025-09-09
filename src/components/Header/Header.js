// src/components/Header/Header.jsx
import React, { useEffect, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaTruck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

/**
 * Storefront API: fetch a navigation menu by handle.
 * Your Shopify Admin → Navigation → "Main menu" has handle: "main-menu"
 */
const GET_MENU = gql`
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      id
      items {
        title
        url
        items {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
  }
`;

/** Convert Shopify navigation URLs to SPA-relative paths */
function toRelative(url) {
  if (!url) return "#";
  // Already relative?
  if (url.startsWith("/")) return url;

  try {
    const u = new URL(url);
    // Common Shopify resource types we expect in nav
    // /collections/... , /products/... , /pages/... , /blogs/... , /policies/...
    if (
      u.pathname.startsWith("/collections") ||
      u.pathname.startsWith("/products") ||
      u.pathname.startsWith("/pages") ||
      u.pathname.startsWith("/blogs") ||
      u.pathname.startsWith("/policies")
    ) {
      return u.pathname + u.search + u.hash;
    }
    // Fallback: external link
    return url;
  } catch {
    return url;
  }
}

export default function Header() {
  const location = useLocation();

  // --- Fetch Shopify Main Menu ---
  const { loading, error, data } = useQuery(GET_MENU, {
    variables: { handle: "main-menu" },
  });

  const menuItems = useMemo(() => data?.menu?.items ?? [], [data]);

  // --- App contexts ---
  const { cart } = useCart();
  const { customer, logout } = useAuth();

  const cartItemCount = cart
    ? cart.lines.edges.reduce((n, e) => n + e.node.quantity, 0)
    : 0;

  // --- Desktop dropdown state ---
  const [openDropdown, setOpenDropdown] = useState(null); // index of open parent or null
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // --- Mobile sidebar state ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState({}); // {index: bool}

  // Close menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsUserMenuOpen(false);
    setIsSidebarOpen(false);
    setOpenMobileGroups({});
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleMobileGroup = (idx) =>
    setOpenMobileGroups((m) => ({ ...m, [idx]: !m[idx] }));

  return (
    <>
      <header className="site-header">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="hamburger-menu"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <FaBars />
            </button>

            <Link
              to="/tools/track-order"
              className="header-link track-order-link"
            >
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
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <FaUser />
                  <span className="user-name">{customer.firstName}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <Link to="/account" className="user-menu-link" role="menuitem">
                      My Account
                    </Link>
                    <button onClick={logout} className="logout-button" role="menuitem">
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

        {/* Main Nav (Desktop) */}
        <nav className="main-nav" aria-label="Primary">
          <ul>
            {loading && <li>Loading…</li>}
            {error && <li>Error loading menu</li>}

            {!loading &&
              !error &&
              menuItems.map((item, idx) => {
                const hasChildren = (item.items?.length ?? 0) > 0;
                const isOpen = openDropdown === idx;

                const TopLink = (
                  <Link to={toRelative(item.url)}>{item.title}</Link>
                );

                return (
                  <li
                    key={`${item.title}-${idx}`}
                    className={`dropdown ${hasChildren ? "has-children" : ""}`}
                    onMouseEnter={() => hasChildren && setOpenDropdown(idx)}
                    onMouseLeave={() => hasChildren && setOpenDropdown(null)}
                  >
                    {hasChildren ? (
                      <button
                        className="dropdown-trigger"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() =>
                          setOpenDropdown((v) => (v === idx ? null : idx))
                        }
                      >
                        {item.title} <span className="arrow">▾</span>
                      </button>
                    ) : (
                      TopLink
                    )}

                    {hasChildren && (
                      <ul className={`dropdown-menu ${isOpen ? "is-open" : ""}`}>
                        {item.items.map((sub, sIdx) => (
                          <li key={`${sub.title}-${sIdx}`}>
                            <Link to={toRelative(sub.url)}>{sub.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

            {/* You can add extra static items if needed:
                <li><Link to="/contact">Contact</Link></li>
            */}
          </ul>
        </nav>
      </header>

      {/* Sidebar (Mobile) */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />
      <aside className={`sidebar-container ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button
            className="close-sidebar-btn"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Mobile">
          <ul>
            {loading && <li>Loading…</li>}
            {error && <li>Error loading menu</li>}

            {!loading &&
              !error &&
              menuItems.map((item, idx) => {
                const hasChildren = (item.items?.length ?? 0) > 0;
                const open = !!openMobileGroups[idx];

                if (!hasChildren) {
                  return (
                    <li key={`${item.title}-${idx}`}>
                      <Link to={toRelative(item.url)} onClick={closeSidebar}>
                        {item.title}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={`${item.title}-${idx}`} className="sidebar-dropdown">
                    <div
                      className="sidebar-dropdown-toggle"
                      onClick={() => toggleMobileGroup(idx)}
                    >
                      {item.title}
                      <span className={`arrow ${open ? "up" : "down"}`}>▾</span>
                    </div>

                    {open && (
                      <ul className="sidebar-dropdown-menu">
                        {item.items.map((sub, sIdx) => (
                          <li key={`${sub.title}-${sIdx}`}>
                            <Link
                              to={toRelative(sub.url)}
                              onClick={closeSidebar}
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

            <li className="sidebar-divider">
              <hr />
            </li>

            <li>
              <Link to="/tools/track-order" onClick={closeSidebar}>
                <FaTruck /> Track Order
              </Link>
            </li>

            {customer ? (
              <>
                <li>
                  <Link to="/account" onClick={closeSidebar}>
                    <FaUser /> My Account
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      closeSidebar();
                    }}
                    className="sidebar-logout-button"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/account/login" onClick={closeSidebar}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/account/register" onClick={closeSidebar}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
}
