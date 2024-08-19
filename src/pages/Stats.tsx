import React from 'react';
import { FaGlobe, FaMedal, FaUsers } from 'react-icons/fa';

const Stats: React.FC = () => {
  return (
    <div className="relative w-11/12 lg:w-10/12 mx-auto">
      <div className="relative rounded-lg">
        <div className="grid p-4 grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaMedal className="text-xl text-[var(--teal-color)]" />
              <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">No.1</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Product</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaGlobe className="text-xl text-[var(--teal-color)]" />
              <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">20+</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Countries</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">1.4M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Happy Users</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">8.5M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Files Converted</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">150+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Online Tools</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-[var(--teal-color)] font-outfit font-bold">12.6M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[var(--dark-gray-color)]">Content Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
