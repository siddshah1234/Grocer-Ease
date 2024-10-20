// src/components/Navbar.js
import React from 'react';
import { FaHome, FaList, FaBarcode, FaTag, FaUtensilSpoon, FaUser } from 'react-icons/fa'; // Updated import

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><a href="/"><FaHome /> Home</a></li>
        <li><a href="/grocery-list"><FaList /> Grocery List</a></li>
        <li><a href="/scan"><FaBarcode /> Scan</a></li>
        <li><a href="/deals"><FaTag /> Deals</a></li>
        <li><a href="/free-food"><FaUtensilSpoon /> Free Meals</a></li> {/* Updated Icon */}
        <li><a href="/account"><FaUser /> Account</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
