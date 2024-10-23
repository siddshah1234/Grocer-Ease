// src/FreeFood.js
import React, { useState } from 'react';
import Navbar from './Navbar'; // Import Navbar component

function FreeFood(){
    const [foods, setFoods] = useState([])
    const [distance, setDistance] = useState('')
    const [zip, setZip] = useState('')

    const getFoods = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/free-food/findfood',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ distance, zip }),
              });
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);  // Handle non-200 responses
                }

              const data = await response.json();
              setFoods(data);
        } catch(error){
            alert(error)
        }
    }
    return (
        
        <div>
            <Navbar />
            <form onSubmit={getFoods}>
                <div>
                    <label htmlFor="zip">Zipcode:</label>
                    <input
                        type="text"
                        id="zip"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="distance">Distance:</label>
                    <input
                        type="text"
                        id="distance"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                    />
                </div>
                <button type="submit">Search</button>
            </form>
            {foods && (
                <div className="result">
                <h3>Response Data:</h3>
                <p><strong>Array 1:</strong> {JSON.stringify(foods[0])}</p>
                <p><strong>Array 2:</strong> {JSON.stringify(foods[1])}</p>
                <p><strong>Array 3:</strong> {JSON.stringify(foods[2])}</p>
                </div>
            )}
        </div>
      );
}

export default FreeFood;
