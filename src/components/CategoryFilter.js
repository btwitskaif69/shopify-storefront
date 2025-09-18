import React, { useState } from 'react';
import './CategoryFilter.css'; // We'll create this file next

// The data for our categories
const categories = [
  { id: 'trousers', name: 'Trousers' },
  { id: 'short-dress', name: 'Short Dress' },
  { id: 'maxi-midi-dress', name: 'Maxi & Midi Dress' },
  { id: 'co-ords', name: 'Co-ords' },
];

// A simple SVG icon to use as a placeholder
const ImageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const CategoryFilter = () => {
  // State to keep track of which boxes are checked
  const [checkedState, setCheckedState] = useState(
    // Initialize all categories as unchecked
    categories.reduce((acc, category) => {
      acc[category.id] = false;
      return acc;
    }, {})
  );

  // Function to handle checkbox clicks
  const handleOnChange = (categoryId) => {
    // Create a new state object to avoid direct mutation
    const updatedCheckedState = {
      ...checkedState,
      [categoryId]: !checkedState[categoryId], // Toggle the value
    };
    setCheckedState(updatedCheckedState);
    console.log('Updated filters:', updatedCheckedState); // You can see the selected filters in the console
  };

  return (
    <div className="category-filter-container">
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.id} className="filter-item">
            <input
              type="checkbox"
              id={category.id}
              name={category.name}
              value={category.id}
              checked={checkedState[category.id]}
              onChange={() => handleOnChange(category.id)}
            />
            <div className="icon-placeholder">
              <ImageIcon />
            </div>
            <label htmlFor={category.id}>{category.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;