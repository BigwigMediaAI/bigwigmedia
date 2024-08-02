import React from 'react';
import { FaGlobe, FaMedal, FaUsers } from 'react-icons/fa';

const Stats: React.FC = () => {
  return (
    <div className="relative w-11/12 lg:w-10/12 mx-auto">
      <div className="relative rounded-lg">
        <div className="grid p-4 grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaMedal className="text-xl text-teal-400" />
              <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">No.1</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Product</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaGlobe className="text-xl text-teal-400" />
              <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">20+</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Countries</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">1.4M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Happy Users</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">8.5M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Files Converted</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">150+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Online Tools</p>
          </div>
          <div className="text-center flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl text-teal-400 font-outfit font-semibold">12.6M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-[#4B5563]">Content Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
