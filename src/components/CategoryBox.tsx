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
        className="bg-[var(--box-bg-color)]  p-5 rounded-lg shadow-md shadow-[var(--teal-color)] hover:shadow-lg transition-shadow duration-200 h-60 w-70 cursor-pointer"
        onClick={handleArrowClick}
      >
        <div className="flex justify-between items-center mb-3">
          <img src={logo} alt={name} className="w-12 h-12 object-contain mr-3" />
          {toolCount && (
            <span className=" text-[var(--teal-color)] text-sm font-semibold px-3 py-1">
              {toolCount}+ Tools
            </span>
          )}
        </div>
        <h2 className="text-sm md:text-lg font-semibold mb-1 text-[var(--primary-text-color)]">{name}</h2>
        <div className="flex mt-2 md:mt-5 items-center justify-between">
          <p className="text-xs md:text-medium text-[var(--gray-color)]">{tagLine}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryBox;
