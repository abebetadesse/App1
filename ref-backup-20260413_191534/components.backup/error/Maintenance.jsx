import React from "react";
/* eslint-disable no-unused-vars */
// src/pages/errors/Maintenance.jsx

const Maintenance = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🔧</h1>
      <h2>Maintenance in Progress</h2>
      <p style={{ fontSize: '1.1rem', margin: '20px 0', lineHeight: '1.6' }}>
        We're currently performing scheduled maintenance to improve your experience. 
        The platform will be back online shortly.
      </p>
      <div style={{ marginTop: '30px' }}>
        <p>Thank you for your patience!</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '20px' }}>
          - The Tham Platform Team
        </p>
      </div>
    </div>
  );
};

export default Maintenance;