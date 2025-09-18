import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Logo and Tagline Column */}
        <div className="footer-column footer-logo-column">
          <Link to="/" className="footer-logo-link">
            <img
              src="/images/delan-logo.png"
              alt="DELAN brand logo"
              className="footer-logo-image"
            />
          </Link>
          <p className="footer-tagline">
            Timeless Elegance, Modern Sophistication.
          </p>
        </div>

        {/* Navigation + Social Links */}
        <div className="footer-links-wrapper">
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/returns-exchange">Return/Exchange</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/affiliate-program">Affiliate Marketing</Link></li>
              <li><Link to="/blogs/news">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/delan.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/delanonlinestore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Delan. All Rights Reserved.</p>
      </div>
    </footer>
  );
};


export default Footer;
