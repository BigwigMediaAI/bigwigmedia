import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'; // Example: Import arrow icon from react-icons library

interface CategoryBoxProps {
  logo: string;
  name: string;
  toolCount?: number;
  tagLine: string;
  redirectTo: string;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ logo, name, toolCount, tagLine, redirectTo }) => {
  const navigate = useNavigate();

  // const handleClick = () => {
  //   navigate(`/category/${encodeURIComponent(name)}`); // Navigate to dynamic category route
  // };

  const handleArrowClick = () => {
    navigate(redirectTo); // Navigate to the redirectTo path
  };

  return (
    <div className="sm:h-fit bt-gradient p-0.5 rounded-xl hover:scale-105 transition-transform duration-300 ease-in-out">
      <div
        className="bg-white dark:bg-[#262626] border p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-60 w-70 cursor-pointer"
        onClick={handleArrowClick}
      >
        <div className="flex justify-between items-center mb-3">
          <img src={logo} alt={name} className="w-12 h-12 object-contain mr-3" />
          {toolCount?<span className="bg-gray-800 text-gray-300 text-sm font-semibold rounded-full px-3 py-1">
            {toolCount}+ Tools
          </span>:<span></span>}
          
        </div>
        <h2 className="text-sm md:text-lg md:font-semibold mb-1">{name}</h2>
        <div className="flex mt-2 md:mt-5 items-center justify-between">
          <p className="text-xs md:text-medium text-gray-500">{tagLine}</p>
          {/* Arrow Icon */}
          <div
            className="hidden md:block items-center cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-2 hover:bg-gradient-to-r hover:from-blue-700 hover:to-blue-900"
           
          >
            <FiArrowRight className=" text-white text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBox;