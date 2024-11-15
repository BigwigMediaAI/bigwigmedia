import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Stats from "./Stats";
import Modal from "../components/Model";
import LoginModal from '../components/Model2';
import FAQ from "./Faq";
import LandingBlog from "./LandingBlog";
import Testimonials from "./Testimonials";
import PricingPlan from "./Pricing";
import Features from "./Features";
import WhoCanUseIt from "./WhoCanUse";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

import '../App.css'
import img1 from '../assets/first.jpg'
import first from '../assets/bigwig-img-removebg-preview.png'
import line1 from '../assets/line1.png'
import line2 from '../assets/line2.png'
import stats from '../assets/stats.jpg'
import ToolShowcase from "./ToolsShowCase";
import BestTool from "./BestTools";
import gif from "../assets/image_generator.gif"
import aiInSocial from "../assets/Intro video website-1.mp4"
import sora from "../assets/27725-365890983_medium.mp4"
import intro from "../assets/intro logo.mp4"
import verified from "../assets/verified.png"

const Landing = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false); // State to show/hide scroll-to-top button

  useEffect(() => {
    const modalShown = sessionStorage.getItem("modalShown");
    if (!modalShown && isSignedIn && user?.createdAt) { // Check if user is signed in and createdAt is available
      const userCreatedAt = new Date(user.createdAt);
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate.getTime() - userCreatedAt.getTime();
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      // console.log("User created at:", userCreatedAt);
      // console.log("Current time:", currentDate);
      // console.log("Difference in days:", differenceInDays);
      if (differenceInDays <= 1) { // Show modal only if user is signed in and created within the last 1 days
        setShowTrialModal(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleCloseTrialModal = () => {
    setShowTrialModal(false);
    sessionStorage.setItem("modalShown", "true");
  };


  // Function to handle Explore button click
  const handleExploreClick = () => {
    if (isSignedIn) {
      navigate('/tool'); // Redirect to /tool if logged in
    } else {
      setTimeout(() => {
        setShowLoginModal(true); 
      }, 0);
      // Show login modal if not logged in
    }
  };

  const rotatingWords = [
    "Your Work",
    "Your Life",
    "Your Task",
    "Your Job",
    "Start-Up",
    "Business",
    "Everything",
  ];

  const rotatingColors = [
    "#343474", // Calm Blue
    "#ee3d49", // Orange
    "#343474", // Red
    "#ee3d49", // Green
    "#343474", // Purple
    "#ee3d49", // Yellow
    "#343474", // Light Blue
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

    // Handle scroll to top button visibility
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  return (
    <div className="bg-[var(--background-color)]">
      <Nav />
      <div className="relative">
  {/* Background Image */}
  <video src={sora} autoPlay muted loop className="w-full opacity-90 object-cover" />

  {/* Text Section (Top Center) */}
  <div className="w-full absolute top-0 left-1/2 transform -translate-x-1/2 pt-8 md:pt-16 flex flex-col items-center text-center space-y-2 md:space-y-4">
    <div className=" flex gap-3 text-center md:text-xl text-sm  bg-white text-[var(--teal-color)] px-10 py-2 rounded-2xl">
      <img src={verified} alt=""  className="w-4 h-4 md:w-6 md:h-6"/>
      <p>Verified by OpenAI</p>
    </div>

    <div className="text-white text-center font-outfit text-[20px] md:text-[30px] lg:text-[40px] font-normal w-full flex gap-2 justify-center flex-wrap">
            <span>Tools to Make{" "}</span>
            <span
              className="rotating-words fontW w-1/3 md:w-1/5 lg:w-1/6 font-outfit font-semibold text-white"
              style={{
                backgroundColor: rotatingColors[wordIndex],
                animation: `moveUp 2s ease-in-out infinite, rotate 2s infinite`,
                borderRadius: "0.25rem"
              }}
            >
              {rotatingWords[wordIndex]}
            </span>{" "}
            <span>Simple</span>
          </div>
    <p className="px-5 text-sm md:text-xl font-medium text-white max-w-lg sm:max-w-2xl">
      Discover AI tools for social media, marketing, and more—boost productivity and creativity.
    </p>
    <video 
  src={intro} 
  autoPlay
  muted
  loop
  className="w-3/4 md:w-2/3 mt-4 md:mt-6 px-4 py-2 rounded-lg border-2  bg-black"
/>
  </div>
</div>

<section className="my-10 md:mt-10 about pt-20 md:pt-10 px-6 md:px-10 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="heading text-center mb-4">
      
      <h2 className="text-xl md:text-4xl font-bold text-gray-800 leading-snug">
        Unlock Your Potential with Our Comprehensive Solutions
      </h2>
    </div>

    <div className="content flex flex-col md:flex-row items-center gap-8">
      {/* Left Content */}
      <div className="left md:w-1/2 p-6 rounded-lg">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 leading-tight">
          A Suite of Tools for Every Need
        </h3>
        <p className="mb-6 text-md text-gray-700 text-justify leading-relaxed">
          Our platform offers an extensive collection of over 230 tools designed to enhance productivity and creativity. From image generation and prompt creators to marketing and email tools, we provide everything you need to streamline your workflow.
        </p>
        <p className="mb-6 text-md text-gray-700 text-justify leading-relaxed">
          Whether you’re looking for HR solutions, video editing tools, file converters, or QR code generators, we’ve got you covered. Discover how our versatile tools can help you achieve your goals efficiently and effectively.
        </p>
        <button
          className="flex items-center px-8 py-3 bg-[var(--teal-color)] text-white font-medium rounded-full shadow-md hover:bg-[var(--hover-teal-color)] transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={handleExploreClick}
        >
          <span>Explore Tools</span>
          <i className="fas fa-arrow-circle-right ml-3"></i>
        </button>
      </div>

      {/* Right Content - Image with border */}
      <div className="right md:w-1/2 p-4">
      <div className="relative rounded-lg overflow-hidden transform transition-all duration-300">
      <video
        src={aiInSocial}
        className="w-full h-auto rounded-lg shadow-lg"
        autoPlay
        muted={isMuted}
        loop
      />

{/* Mute/Unmute Button */}
<button
  onClick={toggleMute}
  className="absolute top-4 left-4 bg-gray-100 bg-opacity-75 text-gray-800 rounded-full p-3 hover:bg-gray-100 focus:outline-none transition-all duration-300 flex items-center group"
>
  {/* Icon */}
  
  {isMuted ? <FaVolumeMute className="text-sm md:text-3xl" /> : <FaVolumeUp className="text-sm md:text-3xl" />}

  {/* Expanding Text */}
  <span
    className="ml-2 text-2xl font-bold text-gray-800 overflow-hidden transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:min-w-[6rem] group-hover:opacity-100
    hidden sm:inline-block" // Hide on mobile, show on screens >= sm
  >
    {isMuted ? "Listen" : "Mute"}
  </span>
</button>

    </div>
      </div>
    </div>
  </div>
</section>


      <div className="relative">
        <img src={line2} alt="Line Decoration" className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10" />
        <img src={stats} alt="Stats Image" className="w-full h-48 flex items-center justify-between z-0" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Stats />
        </div>
        <img src={line1} alt="Line Decoration" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10" />
      </div>
      <div className="mt-10 px-9 md:px-14 lg:px-24 mx-auto">
      <BestTool />
      </div>

      <div className="relative mt-12">
        <img src={line2} alt="Line Decoration" className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10" />
        <img src={stats} alt="Stats Image" className="w-full h-60 flex items-center justify-between z-0" />
        <div className="absolute inset-0 flex items-center justify-center z-20">
        <WhoCanUseIt />
        </div>
        <img src={line1} alt="Line Decoration" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10" />
      </div>


      <ToolShowcase />


      <div className=" px-9 md:px-14 lg:px-24 mx-auto">
        <Testimonials />
      </div>
      
      <PricingPlan />
      <FAQ />
  
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <div className="mt-20 px-9 md:px-14 lg:px-24 mx-auto">
        <LandingBlog />
      </div>
      <Features />
      <div className="relative">
        <img src={line2} alt="Top Decoration" className="absolute top-0 left-0" />
        <div className="w-full p-5 md:p-14 flex flex-col-reverse md:flex-row gap-5 md:gap-8 mt-10 bg-gradient-to-r from-indigo-900 via-gray-900 to-indigo-900 text-center md:text-left text-white">
          {/* Left Section: Text Content */}
          <div className="p-5 md:p-10 flex flex-col justify-center">
            <h2 className="text-xl md:text-3xl font-bold mb-4">Get Started with Bigwigmedia.ai</h2>
            <p className="text-lg mb-6">
              Discover powerful AI tools designed to transform your workflow and boost productivity.
            </p>
            <ul className="text-md mb-6 space-y-2">
              <li>🎉 <span className="font-semibold">30 Credits Free</span> </li>
              <li>📅 <span className="font-semibold">7-Day Free Trial</span></li>
              <li>💳 <span className="font-semibold">No Credit Card Required</span></li>
            </ul>
            <button className="bg-[var(--teal-color)] text-white py-3 rounded-full font-semibold hover:bg-white hover:text-[var(--teal-color)] border border-white md:w-1/3" onClick={handleExploreClick}>
              Start Your Free Trial
            </button>
          </div>

          {/* Right Section: Image */}
          <div className="flex justify-center md:justify-end mt-6 md:mt-0">
            <img src={first} alt="Illustrative image" className="w-64 md:w-96 h-auto rounded-lg" />
          </div>
        </div>
        <img src={line1} alt="Bottom Decoration" className="absolute bottom-0 left-0" />
      </div>
      <Footer />

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 bg-[var(--teal-color)] text-white w-12 h-12 rounded-full shadow-lg hover:bg-[var(--hover-teal-color)] transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
>
          ↑
        </button>
      )}
    </div>
  );
};

export default Landing;


