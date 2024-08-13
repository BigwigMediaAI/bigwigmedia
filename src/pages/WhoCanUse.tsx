import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const usersData = [
  { text: "Freelancers", color: "bg-black" },
  { text: "Product Managers", color: "bg-black" },
  { text: "Designers", color: "bg-black" },
  { text: "Engineers", color: "bg-black" },
  { text: "Marketers", color: "bg-black" },
  { text: "Digital Marketers", color: "bg-black" },
  { text: "Agencies", color: "bg-black" },
  { text: "Startups", color: "bg-black" },
  { text: "Solo Entrepreneurs", color: "bg-black" },
  { text: "Business Enterprises", color: "bg-black" }
];

const WhoCanUseIt = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % usersData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 md:mt-14 text-[var(--primary-text-color)] text-center font-outfit text-[18px] md:text-[20px] lg:text-[30px] font-normal md:max-w-5xl max-w-7xl mx-auto flex flex-col items-center">
      <h1 className="w-full text-center">Tools Meticulously Designed for{" "}</h1>
      <h1
        className={`w-fit fontW text-white border-2 ${usersData[wordIndex].color} border-white rounded-md px-2 py-1 bg-clip-padding`}
        style={{ 
          animation: "rotate 2s infinite", 
          display: "inline-block" 
        }}
      >
        {usersData[wordIndex].text}
      </h1>
    </div>
  );
};

export default WhoCanUseIt;
