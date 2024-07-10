import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState,useRef } from "react";



const usersData = [
    "Freelancers",
    "Product Managers",
    "Designers",
    "Engineers",
    "Marketers",
    "Digital Marketers",
    "Agencies",
    "Startups",
    "Solo Entrepreneurs",
    "Business Enterprises"
];


const WhoCanUseIt = () => {
    const [wordIndex, setWordIndex] = useState(0);
    const [change, setChange] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setWordIndex((prevIndex) => (prevIndex + 1) % usersData.length);
        }, 2000);
        return () => clearInterval(interval);
      }, []);

    return (
        <div className="mt-20   text-black dark:text-gray-200 text-center font-outfit text-[14px] md:text-[20px] lg:text-[30px] font-normal max-w-5xl mx-auto flex gap-2 justify-center flex-wrap">
        <span className='w-1/2  '>Tools Meticulously Designed for{" "}</span>
        <span className="w-1/2 rotating-words fontW  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold" style={{ animation: "rotate 2s infinite" }}>
          {usersData[wordIndex]}
        </span>{" "}
      </div>
    );
};

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom:2.5rem;
  color: #777;
  text-shadow: 5px 7px 2px rgba(1.7, 2.3, 2.5, 2.6);
  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for smaller screens */
  }
`;

export default WhoCanUseIt;
