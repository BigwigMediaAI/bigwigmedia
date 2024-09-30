import React from "react";
import './loader.css'; // Import the CSS file

interface BigwigLoaderProps {
  styleType: 
    | "spin" 
    | "bounce" 
    | "grow" 
    | "cube" 
    | "ripple" 
    | "flip" 
    | "wave" 
    | "rotate" 
    | "pulse" 
    | "scatter"; // Added new style types
}

const BigwigLoader: React.FC<BigwigLoaderProps> = ({ styleType }) => {
  return (
    <div className={`bigwig-loader loader-${styleType}`}>
      <div className="bigwig-circle">
        <div className="bigwig-ai-text">
          <span className="bigwig-a">A</span>
          <span className="bigwig-i">I</span>
        </div>
      </div>
    </div>
  );
};

export default BigwigLoader;
