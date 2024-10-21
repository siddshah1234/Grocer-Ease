// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App';

ReactDOM.render(
  <BrowserRouter>  {/* Wrap the App with BrowserRouter */}
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
