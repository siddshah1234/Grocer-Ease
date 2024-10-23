// src/Scan.js
import React, { useState } from 'react';
import Navbar from './Navbar'; // Import Navbar component

function Scan() {
  const [barcode, setBarcode] = useState(''); // State for storing barcode input
  const [nutritionInfo, setNutritionInfo] = useState(null); // State for storing nutrition data
  const [error, setError] = useState(''); // State for error handling
  const [loading, setLoading] = useState(false); // State for loading state

  // Nutritionix API details
  const NUTRITIONIX_APP_ID = 'da114bcd'; // Replace with your App ID
  const NUTRITIONIX_API_KEY = 'a88477084af1fffc75dde66cfa47bd1f'; // Replace with your API Key

  // Function to fetch nutrition data from Nutritionix API
  const fetchNutritionInfo = async () => {
    setError(''); // Clear any previous errors
    setLoading(true); // Set loading state

    if (!barcode) {
      setError('Please enter a barcode.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://trackapi.nutritionix.com/v2/search/item/?upc=${barcode}`,
        {
          method: 'GET',
          headers: {
            'x-app-id': NUTRITIONIX_APP_ID,
            'x-app-key': NUTRITIONIX_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nutrition information');
      }

      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        setNutritionInfo(data.foods[0]); // Set the nutrition info to the first item in the response
        setError('');
      } else {
        setNutritionInfo(null);
        setError('No nutrition information found for this barcode.');
      }
    } catch (err) {
      setError('Failed to fetch nutrition information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-container">
      {/* Navbar at the top */}
      <Navbar /> 

      <h1>Scan Item</h1>
      <div className="barcode-scanner">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode"
        />
        <button onClick={fetchNutritionInfo} disabled={loading}>
          {loading ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display nutrition information */}
      {nutritionInfo && (
        <div className="nutrition-info">
          <h3>{nutritionInfo.food_name} ({nutritionInfo.brand_name})</h3>
          <p>Calories: {nutritionInfo.nf_calories} kcal</p>
          <p>Protein: {nutritionInfo.nf_protein}g</p>
          <p>Fat: {nutritionInfo.nf_total_fat}g</p>
          <p>Carbohydrates: {nutritionInfo.nf_total_carbohydrate}g</p>
          <p>Sugars: {nutritionInfo.nf_sugars}g</p>
          <p>Serving Size: {nutritionInfo.serving_qty} {nutritionInfo.serving_unit}</p>
          <img src={nutritionInfo.photo.thumb} alt="Food item" />
          <p>Ingredients: {nutritionInfo.nf_ingredient_statement}</p>
        </div>
      )}
    </div>
  );
}

export default Scan;
