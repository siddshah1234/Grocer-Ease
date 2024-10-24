import React, { useState, useEffect } from 'react';

function GroceryList({ username }) {
  const [groceryList, setGroceryList] = useState([]);  // Empty grocery list initially
  const [newItem, setNewItem] = useState('');  // Track input for a new item

  // Fetch grocery list from the server on component mount
  useEffect(() => {
    const fetchGroceryList = async () => {
      try {
        const response = await fetch(`/api/grocery-list/${username}`);
        if (response.ok) {
          const data = await response.json();
          setGroceryList(data.groceryItems);
        } else {
          console.error('Failed to fetch grocery list');
        }
      } catch (err) {
        console.error('Error fetching grocery list:', err);
      }
    };

    fetchGroceryList();
  }, [username]);

  // Function to add a new item to the grocery list
  const addItem = () => {
    if (newItem.trim() !== '') {
      const updatedList = [...groceryList, newItem];
      setGroceryList(updatedList);
      setNewItem('');
      saveGroceryList(updatedList);  // Save the updated list
    }
  };

  // Function to remove an item from the grocery list by index
  const removeItem = (index) => {
    const updatedList = groceryList.filter((_, i) => i !== index);
    setGroceryList(updatedList);
    saveGroceryList(updatedList);  // Save the updated list
  };

  // Function to save the updated grocery list on the server
  const saveGroceryList = async (updatedList) => {
    try {
      const response = await fetch(`/api/grocery-list/${username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groceryItems: updatedList }),
      });

      if (!response.ok) {
        console.error('Failed to save grocery list');
      }
    } catch (err) {
      console.error('Error saving grocery list:', err);
    }
  };

  return (
    <div>
      <h2>Your Grocery List</h2>
      <ul>
        {groceryList.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)} style={{ marginLeft: '10px' }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add new item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}

export default GroceryList;
