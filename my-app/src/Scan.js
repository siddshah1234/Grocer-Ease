// src/Scan.js
import React, { useState } from 'react';

function Scan() {
  const [barcode, setBarcode] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const NUTRITIONIX_APP_ID = 'your-app-id';  // Replace with actual app ID
  const NUTRITIONIX_API_KEY = 'your-api-key';  // Replace with actual API key

  const fetchNutritionInfo = async () => {
    setError('');
    setLoading(true);

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
      setNutritionInfo(data.foods[0]);
      setError('');
    } catch (err) {
      setError('Failed to fetch nutrition information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Scan Item</h1>
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter barcode"
      />
      <button onClick={fetchNutritionInfo} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {nutritionInfo && (
        <div>
          <h2>{nutritionInfo.food_name} ({nutritionInfo.brand_name})</h2>
          <p>Calories: {nutritionInfo.nf_calories} kcal</p>
        </div>
      )}
    </div>
  );
}

export default Scan;
