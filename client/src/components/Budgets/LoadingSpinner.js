import React from 'react';

const LoadingSpinner = ({ message }) => (
  <div className="budgets-loading">
    <div className="loading-spinner"></div>
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
