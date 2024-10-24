// src/Navbar.js
import React from 'react';
import { FaHome, FaList, FaBarcode, FaTag, FaUtensilSpoon, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link properly


function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/list"><FaList /> Grocery List</Link></li>
        <li><Link to="/scan"><FaBarcode /> Scan</Link></li>
        <li><Link to="/deals"><FaTag /> Deals</Link></li>
        <li><Link to="/free-food"><FaUtensilSpoon /> Free Meals</Link></li>
        <li><Link to="/account"><FaUser /> Account</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
