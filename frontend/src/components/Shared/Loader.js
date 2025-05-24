import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className={`loader ${size}`}></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;