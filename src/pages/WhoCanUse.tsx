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
        <div className="mt-6 md:mt-14 text-black dark:text-gray-200 text-center font-outfit text-[18px] md:text-[20px] lg:text-[30px] font-normal md:max-w-5xl max-w-7xl mx-auto flex gap-2 justify-center flex-wrap">
        <span className='w-4/5'>Tools Meticulously Designed for{" "}</span>
        <span className="w-4/5 rotating-words fontW  bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold" style={{ animation: "rotate 2s infinite" }}>
          {usersData[wordIndex]}
        </span>{" "}
      </div>
    );
};



export default WhoCanUseIt;
