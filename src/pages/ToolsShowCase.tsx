import React, { useRef, useEffect, useState } from 'react';
import prompt from "../assets/Prompt image website.mp4"
import jpg2png from '../assets/JPG to PNG website.mp4'
import video2gif from '../assets/Video to GIF.mp4'
import article from "../assets/Article generator.mp4"
import instaCaption from "../assets/Instagram post caption generator website.mp4"
import letterhead from '../assets/Letterhead gen.mp4'
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Tool interface
interface Tool {
  name: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  reverse: boolean;
}

// ToolCard Component to represent each tool
const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => {
  const { name, description, imageUrl, buttonText, reverse } = tool;
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false); // Reset when out of view to re-trigger animation
          }
        });
      },
      { threshold: 0.3 } // Adjust this threshold as needed
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleRedirect = (url: string) => {
    if (isSignedIn) {
      // User is logged in, proceed to the tool page
      navigate(url);
    } else {
      // User is not logged in, redirect to login and then redirect to the tool page after login
      navigate(`/login?redirect=${url}`);
    }
  };

  // URL mapping based on tool names
  const toolUrls: { [key: string]: string } = {
    "Prompt To Image Creator": "/generate?id=66ea8e2238ee5d49df349ce4",
    "JPG To PNG Converter": "/generate?id=664b1d0e1986743386a46100",
    "Video to Gif Converter": "/generate?id=6654398ae82896c09bbc52dd",
    "Article Generator": "/generate?id=65c92d368f7cafdd6d4f3d16",
    "Instagram Post Caption Generator": "/generate?id=65cb1c6c4378133a722cbb2f",
    "Letterhead Generator": "/generate?id=66f1425e0ab136750d271d36",
  };

  return (
    <div
      ref={cardRef}
      className={`flex flex-col md:flex-row justify-center mb-10 md:mb-20 rounded-lg mx-auto max-w-9xl ${
        reverse ? 'md:flex-row-reverse' : ''
      } ${isVisible ? 'animate-slide-in' : ''}`}
    >
      {/* Left Side: Tool Name and Description */}
      <div className={`md:w-1/2 bg-white py-8 px-4 md:px-16 prounded-lg relative ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>


        <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center md:gap-2">
          <span className="text-teal-600">🚀 </span> {name}
        </h3>
        
        <p className="text-gray-700 mb-4 text-justify">
          {description}
        </p>

        {/* Tag Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">High Quality</span>
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded-full">Fast</span>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded-full">Free</span>
        </div>

        <button
          onClick={() => handleRedirect(toolUrls[name])}
          className="bg-[var(--teal-color)] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--hover-teal-color)] transition-transform transform hover:scale-105 duration-300"
        >
          {buttonText}
        </button>
      </div>

      {/* Right Side: Image Section */}
      <div className={`md:w-1/2 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
        <div className="relative flex justify-center items-center mx-auto mt-4 md:mt-6">
          <div className="laptop-frame bg-gray-800 w-4/5 md:w-3/4 rounded-t-xl shadow-2xl border-gray-500 border-4">
            {/* Screen Area */}
            <div className="laptop-screen bg-black p-2 rounded-t-lg">
              <video 
                src={imageUrl} 
                loop
                muted
                autoPlay
                className="w-full h-auto rounded-md"
              />
            </div>
            {/* Bottom Bar */}
            <div className="bg-gray-900 h-6 w-full rounded-b-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};



// Main ToolShowcase Component
const ToolShowcase = () => {
  const tools = [
    {
      name: "Prompt To Image Creator",
      description: "Transform your ideas into stunning images with our Prompt To Image Creator. Simply fill in the details of the image you envision, and our tool will generate multiple well-structured prompts tailored to your description. You can select any of the generated prompts, make edits as needed, and then create high-definition images that bring your vision to life!",
      imageUrl: prompt,
      buttonText: "Try Now",
      reverse: false,
    },
    {
      name: "JPG To PNG Converter",
      description: "Effortlessly convert your JPG images to PNG format with our JPG To PNG Converter. Upload one or multiple JPG images, and our tool will convert them all into high-quality PNG files in no time. Enjoy the benefits of PNG's superior quality and transparency features for your images!",
      imageUrl: jpg2png,
      buttonText: "Try Now",
      reverse: true,
    },
    {
      name: "Video to Gif Converter",
      description: "Transform your videos into captivating GIFs with our Video to GIF Converter. Simply upload your video, select the desired start and end times, and generate a high-quality GIF in just a few clicks. Download your GIF and share it effortlessly across social media or with friends!",
      imageUrl: video2gif,
      buttonText: "Try Now",
      reverse: false,
    },
    {
      name: "Article Generator",
      description: "Create well-structured articles effortlessly with our Article Generator. Fill in the provided fields with your ideas, and let the AI craft a comprehensive article tailored to your needs. Additionally, if you want a visual element to accompany your writing, you can generate a relevant image using our AI technology with just a click!",
      imageUrl: article,
      buttonText: "Try Now",
      reverse: true,
    },
    {
      name: "Instagram Post Caption Generator",
      description: "Craft engaging and creative Instagram captions with ease using our Instagram Post Caption Generator. Simply input your ideas, and our AI will generate captivating captions tailored to your style and message. Perfect for boosting your social media presence and connecting with your audience effectively.",
      imageUrl: instaCaption,
      buttonText: "Try Now",
      reverse: false,
    },
    {
      name: "Letterhead Generator",
      description: "Design professional letterheads effortlessly with our Letterhead Generator. Input your business details, select your preferred style, and let our AI create a polished letterhead that reflects your brand’s identity. Perfect for making your documents stand out with a personalized and professional touch.",
      imageUrl: letterhead,
      buttonText: "Try Now",
      reverse: true,
    },
  ];

  return (
    <section className="tools-showcase mt-10">
      <h2 className="text-3xl mb-6 font-bold text-center">Explore Our Tools</h2>
      <div className="container">
        
        {tools.map((tool, index) => (
          <ToolCard key={index} tool={tool} />
        ))}
      </div>
    </section>
  );
};

// Adding Tailwind custom styles for animations
const styleElement = document.createElement("style");
styleElement.textContent = `
  @keyframes slideInLeft {
    0% { opacity: 0; transform: translateX(-50px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    0% { opacity: 0; transform: translateX(50px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-in-left {
    animation: slideInLeft 1s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 1s ease-out forwards;
  }
`;
document.head.appendChild(styleElement);

export default ToolShowcase;