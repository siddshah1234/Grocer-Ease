import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';  // Import Navbar component
import Scan from './Scan';  // Import Scan component
import './App.css';  // Custom CSS for the home page
import Logo from "./images/logo.PNG";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

function App() {
  const [selectedPage, setSelectedPage] = useState('home');  // Track the selected page
  const [groceryList, setGroceryList] = useState([]);  // Empty grocery list initially
  const [budget, setBudget] = useState(100);  // Default budget
  const [remainingBudget, setRemainingBudget] = useState(50);  // Placeholder for remaining budget
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
      console.log(`Response from server: `, data);

      if (response.ok) {
        localStorage.setItem('token', data.access_token);  // Simulate login with token or access_token
        setIsLoggedIn(true);  // Mark as logged in
        setUsername(username);  // Correctly store the username in the state
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Error occurred during login/signup.');
      console.error("Error in login/signup request: ", err);
    }
  };


  // Function to fetch the grocery list and budget for the user
  const fetchGroceryList = useCallback(async () => {
    try {
      const response = await fetch(`/api/grocery-list/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch grocery list');
      }
      const data = await response.json();
      setGroceryList(data.groceryItems);
      // Assuming budget information is included in the data (if not, you can set it separately)
      setRemainingBudget(budget - data.totalCost);  // Calculate remaining budget based on total cost
    } catch (err) {
      console.error('Error fetching grocery list:', err);
    }
  }, [username, budget]);

  // Save grocery list to the backend
  const saveGroceryList = async (updatedList) => {
    try {
      const response = await fetch(`/api/grocery-list/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groceryItems: updatedList }),
      });

      if (!response.ok) {
        throw new Error('Failed to save grocery list');
      }
    } catch (err) {
      console.error('Error saving grocery list:', err);
    }
  };

  // Fetch grocery list when component mounts or username changes
  useEffect(() => {
    if (username) {
      fetchGroceryList();
    }
  }, [username, fetchGroceryList]);

  // Function to add an item to the grocery list
  const addItemToGroceryList = () => {
    const newItem = prompt('Enter new grocery item:');
    if (newItem) {
      const updatedList = [...groceryList, newItem];
      setGroceryList(updatedList);
      saveGroceryList(updatedList);  // Save the updated list to the backend
    }
  };

  // Function to remove an item from the grocery list
  const removeItemFromGroceryList = (index) => {
    const updatedList = groceryList.filter((_, i) => i !== index);
    setGroceryList(updatedList);
    saveGroceryList(updatedList);  // Save the updated list to the backend
  };

  // Function to fetch AI recommendations (dummy function for now)
  const getAIRecommendations = async () => {
    setRecommendations('Try adding some more vegetables and fruits.');
  };

  // Function to determine which page to show
  const renderPage = () => {
    switch (selectedPage) {
      case 'home':
        return (
          <div className="home-content">
            <div className="section">
              <h2>Grocery List Overview</h2>
              <ul>
                {groceryList.map((item, index) => (
                  <li key={index}>
                    {item}
                    <button onClick={() => removeItemFromGroceryList(index)} style={{ marginLeft: '10px' }}>
                      Remove
                    </button>
                  </li>
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
            <div className="quick-actions">
              <button onClick={addItemToGroceryList}>Add Item to Grocery List</button>
              <button onClick={getAIRecommendations}>Get AI Recommendations</button>
            </div>
          </div>
        );
      case 'scan':
        return <Scan />;
      default:
        return <div>Page not found</div>;
    }
  };

  // If not logged in, show the login/signup form
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <img src={Logo} alt="Logo" />
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

  return (
    <div className="App">
      <Navbar setSelectedPage={setSelectedPage} />
      {/* Header */}
      <header className="App-header">
        <h1>Grocer-Ease</h1>
        <div className='slogan'>
        <p>making shopping simple.</p>
        </div>
      </header>

      {/* Dynamic content based on selected page */}
      {renderPage()}

      {/* Bottom Navigation */}
      <div className="Contact">
        <h2>Contact Us</h2>
        <footer>
            <p><FontAwesomeIcon icon={faCamera} style={{ color: 'white' }} /> Instagram</p>
            <p><FontAwesomeIcon icon={faFacebookF} style={{ color: 'white' }} /> FaceBook</p>
            <p><FontAwesomeIcon icon={faEnvelope} style={{ color: 'white' }} /> Email Us</p>
        </footer>
      </div>
      
    </div>
  );
}

export default App;
