import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';  // Import Navbar component
import Home from './Home';       // Separate Home component
import List from './List';       // Separate GroceryList component
import Scan from './Scan';       // Separate Scan component
import Deals from './Deals';     // Separate Deals component
import Freefood from './Freefood';  // Separate FreeFood component
import Account from './Account';  // Separate Account component
import './App.css';              // Custom CSS for the home page

function App() {
  // State and logic for login can remain as is.
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [isSignUp, setIsSignUp] = useState(false);      
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSignUp = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);  // Store token on login
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error occurred during login/signup.');
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />  {/* Include Navbar without <Router> */}

        <Routes>
          {/* Define Routes for different pages */}
          <Route path="/" element={<Home />} />
          <Route path="/grocery-list" element={<List />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/free-food" element={<Freefood />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
