// src/Account.js
import React from 'react';

function Account({ handleLogout }) {
  return (
    <div className="account">
      <h2>Account Overview</h2>
      <button onClick={handleLogout}>Logout</button>
      <p>Manage your profile, set your preferences, and adjust your budget.</p>
    </div>
  );
}

export default Account;
