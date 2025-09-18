// src/components/StickyNav.js

import React, { useState } from 'react';
import { Link } from 'react-scroll';
import './StickyNav.css';

// ✅ Define navigation items to match the section IDs from HomePage
const navItems = [
  { label: 'Categories', targetId: 'categories-section' },
  { label: 'Bestsellers', targetId: 'top-products-section' },
  { label: 'Trousers', targetId: 'trousers-section' },
  { label: 'Short Dress', targetId: 'short-dress-section' },
  { label: 'Maxi & Midi', targetId: 'maxi-midi-dress-section' },
  { label: 'Co-ords', targetId: 'co-ords-section' },
  { label: 'Reviews', targetId: 'reviews-section' },
];

const StickyNav = () => {
  const [activeLink, setActiveLink] = useState(navItems[0].targetId);

  return (
    <>
      <nav className="sticky-nav-bar">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.targetId}
            spy={true}
            smooth={true}
            offset={-90} // Offset for fixed nav
            duration={500}
            className={`nav-link ${activeLink === item.targetId ? 'active' : ''}`}
            onClick={() => setActiveLink(item.targetId)}
            onSetActive={() => setActiveLink(item.targetId)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Add a wrapper to prevent content from being hidden under navbar */}
      <div className="page-content">
        {/* All your sections go here */}
      </div>
    </>
  );
};

export default StickyNav;
