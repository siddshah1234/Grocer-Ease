// src/FreeFood.js
import React, { useState } from 'react';
import Navbar from './Navbar'; // Import Navbar component
import './FreeFood.css';

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
            <table>
                <tbody>
                    <tr>
                        <td>Food Pantry</td>
                        <td>Address</td>
                    </tr>
            {foods.length > 0?(
            foods[0].map((place,index) =>(
                <tr key={index}>
                <td>
                   <a href={foods[1][index]} target="_blank" rel="noopener noreferrer">
                    {place}
                   </a>
                 </td>
                 <td>{foods[2][index]}</td>
               </tr>
                ))
                ): (
                <tr>
                  <td colSpan="3">No food items found.</td>
                </tr>
              )}
           </tbody>
         </table>
       </div>
      );
}

export default FreeFood;
