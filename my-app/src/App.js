// src/App.js
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';  // Correctly import Navbar component
import Scan from './Scan';  // Correctly import Scan component for barcode scanning
import { FaBars } from 'react-icons/fa';  // Import hamburger menu icon
import './App.css';  // Custom CSS for the home page

function App() {
  const [groceryList, setGroceryList] = useState(['Milk', 'Eggs', 'Bread']);  // Sample grocery list
  const [budget, setBudget] = useState(100);  // Sample budget
  const [remainingBudget, setRemainingBudget] = useState(50);  // Sample remaining budget
  const [recommendations, setRecommendations] = useState('');  // Placeholder for AI recommendations
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Login state
  const [isSignUp, setIsSignUp] = useState(false);  // Toggle between sign up and login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Check if token exists in local storage (indicates logged in)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login or sign up
  const handleLoginSignUp = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';  // Ensure the backend URL points to the Flask server

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(`Response from server: `, data);  // Log the response

      if (response.ok) {
        localStorage.setItem('token', data.access_token);  // Simulate login with token or access_token
        setIsLoggedIn(true);  // Mark as logged in
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error occurred during login/signup.');
      console.error("Error in login/signup request: ", err);
    }
  };
  // If not logged in, show the login/signup form
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img src="logo.png" alt="Logo" />;
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLoginSignUp}>
          <div>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        </form>

        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    );
  }

  // Function to add an item to the grocery list
  const addItemToGroceryList = () => {
    const newItem = prompt('Enter new grocery item:');
    if (newItem) {
      setGroceryList([...groceryList, newItem]);
    }
  };

  // Function to fetch AI recommendations (dummy function for now)
  const getAIRecommendations = async () => {
    setRecommendations('Try adding some more vegetables and fruits.');
  };

  // Main App Page (Once logged in)
  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <h1>Grocer-Ease</h1>
        <FaBars className="hamburger-menu" />  {/* Hamburger icon for future settings menu */}
      </header>

      {/* Main Sections */}
      <div className="home-content">
        <div className="section">
          <h2>Grocery List Overview</h2>
          <ul>
            {groceryList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Budget Overview</h2>
          <p>Total Budget: ${budget}</p>
          <p>Remaining Budget: ${remainingBudget}</p>
        </div>

        <div className="section">
          <h2>AI Recommendations</h2>
          {recommendations ? <p>{recommendations}</p> : <p>No recommendations yet.</p>}
        </div>

        <div className="section">
          <h2>Discount/Free Food Alerts</h2>
          <p>Find free food or discounts near you!</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button onClick={addItemToGroceryList}>Add Item to Grocery List</button>
          <button onClick={getAIRecommendations}>Get AI Recommendations</button>
        </div>

        

        </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}

export default App;
// you aint nothin but a broke fein fe

//{/* Barcode Scanning Feature */}
//<Scan />  {/* Make sure Scan is exported properly from Scan.js */} 
      