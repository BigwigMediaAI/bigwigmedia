import React from 'react';
import { FaGlobe, FaMedal, FaUsers } from 'react-icons/fa';

const Stats: React.FC = () => {
  return (
    <div className="relative w-11/12 lg:w-10/12 p-1 mx-auto rounded-lg">
      {/* Gradient Border */}
      <div className="absolute inset-0 rounded-lg"></div>
      
      {/* Inner Content */}
      <div className="relative p-4 rounded-lg">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <div className=" text-center p-4 flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaMedal className="text-2xl bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
              <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">No.1</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Product</p>
          </div>
          <div className="text-center p-4 flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaGlobe className="text-2xl bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
              <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">20+</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Countries</p>
          </div>
          <div className=" text-center p-4 flex flex-col justify-center items-center">
            <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">1.4M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Happy Users</p>
          </div>
          <div className=" text-center p-4 flex flex-col justify-center items-center">
            <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">4.5M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Files Converted</p>
          </div>
          <div className=" text-center p-4 flex flex-col justify-center items-center">
            <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">100+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Online Tools</p>
          </div>
          <div className=" text-center p-4 flex flex-col justify-center items-center">
            <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">10.6M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Files Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
