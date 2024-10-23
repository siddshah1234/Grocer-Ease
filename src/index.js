// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App';
import Scan from './Scan';
import List from './List';
import FreeFood from './FreeFood';


ReactDOM.render(
  <BrowserRouter>  {/* Wrap everything with BrowserRouter */}
    <Routes>
      <Route path="/" element={<App />} /> 
      <Route path="/scan" element={<Scan />} /> 
      <Route path="/list" element={<List />} />  
      <Route path="/free-food" element={<FreeFood />} /> 
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')  // Correctly closing ReactDOM.render()
);


//<Route exact path="/" element={<App />} />