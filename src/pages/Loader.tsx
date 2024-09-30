import React from 'react';
import './loader.css'; // Import the corresponding CSS

const BigwigLoader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="flipping-cards">
        <div className="card">B</div>
        <div className="card">I</div>
        <div className="card">G</div>
        <div className="card">W</div>
        <div className="card">I</div>
        <div className="card">G</div>
      </div>
    </div>
  );
};

export default BigwigLoader;
