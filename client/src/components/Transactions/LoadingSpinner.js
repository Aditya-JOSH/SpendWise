import React from 'react';

const LoadingSpinner = ({ message }) => (
  <div className="transactions-loading">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
