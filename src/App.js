// src/App.js
import React, { useState } from 'react';
import Navbar from './Navbar';  // Import Navbar component
import { FaBars } from 'react-icons/fa';  // Import hamburger menu icon
import './App.css';  // Custom CSS for the home page

function App() {
  const [groceryList, setGroceryList] = useState(['Milk', 'Eggs', 'Bread']);  // Sample grocery list
  const [budget, setBudget] = useState(100);  // Sample budget
  const [remainingBudget, setRemainingBudget] = useState(50);  // Sample remaining budget
  const [recommendations, setRecommendations] = useState('');  // Placeholder for AI recommendations
  const [barcode, setBarcode] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState(null);

  // Handle adding a new item to the grocery list
  const addItem = () => {
    const newItem = prompt('Enter new grocery item:');
    if (newItem) {
      setGroceryList([...groceryList, newItem]);
    }
  };

  // Fetch AI recommendations
  const getAIRecommendations = async () => {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grocery_list: groceryList })
    });
    const data = await response.json();
    setRecommendations(data.recommendations);
  };

  // Scan barcode for nutrition info
  const scanBarcode = async () => {
    const response = await fetch('/api/nutrition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode })
    });
    const data = await response.json();
    setNutritionInfo(data);
  };

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
          <button onClick={addItem}>Add Item to Grocery List</button>
          <button onClick={getAIRecommendations}>Get AI Recommendations</button>
        </div>

        {/* Barcode Scanner */}
        <div className="barcode-scanner">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode"
          />
          <button onClick={scanBarcode}>Scan</button>
          {nutritionInfo && (
            <div>
              <h3>{nutritionInfo.food_name}</h3>
              <p>Calories: {nutritionInfo.nf_calories}</p>
              <p>Protein: {nutritionInfo.nf_protein}g</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}

export default App;
