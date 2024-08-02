import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface CategoryBoxProps {
  logo: string;
  name: string;
  toolCount?: number;
  tagLine: string;
  redirectTo: string;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ logo, name, toolCount, tagLine, redirectTo }) => {
  const navigate = useNavigate();

  const handleArrowClick = () => {
    navigate(redirectTo);
  };

  return (
    <div className="sm:h-fit p-0.5 rounded-xl hover:scale-105 transition-transform duration-300 ease-in-out">
      <div
        className="bg-[#f5fafa] border border-teal-400 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-60 w-70 cursor-pointer"
        onClick={handleArrowClick}
      >
        <div className="flex justify-between items-center mb-3">
          <img src={logo} alt={name} className="w-12 h-12 object-contain mr-3" />
          {toolCount && (
            <span className="bg-[#daecfc] text-[#1E3A8A] text-sm font-semibold rounded-full px-3 py-1">
              {toolCount}+ Tools
            </span>
          )}
        </div>
        <h2 className="text-sm md:text-lg font-semibold mb-1 text-[#1F2937]">{name}</h2>
        <div className="flex mt-2 md:mt-5 items-center justify-between">
          <p className="text-xs md:text-medium text-[#4B5563]">{tagLine}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBox;
