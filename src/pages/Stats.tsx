import React from 'react';
import { FaGlobe, FaMedal, FaUsers } from 'react-icons/fa';

const Stats: React.FC = () => {
  return (
    <div className=" relative w-11/12 lg:w-10/12 mx-auto rounded-lg">
      {/* Gradient Border */}
      <div className=" absolute inset-0 rounded-lg"></div>
      
      {/* Inner Content */}
      <div className="relative rounded-lg">
        <div className="grid p-4 grid-cols-3 lg:grid-cols-6 gap-2">
          <div className=" text-center  flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaMedal className="text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
              <p className="text-lg sm:text-md lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">No.1</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Product</p>
          </div>
          <div className="text-center  flex flex-col justify-center items-center">
            <div className="flex items-center gap-2">
              <FaGlobe className="text-xl bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500" />
              <p className="text-lg sm:text-md lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">20+</p>
            </div>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Countries</p>
          </div>
          <div className=" text-center  flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">1.4M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Happy Users</p>
          </div>
          <div className=" text-center  flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">8.5M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Files Converted</p>
          </div>
          <div className=" text-center  flex flex-col justify-center items-center">
            <p className="text-lg sm:text-xmd lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">150+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Online Tools</p>
          </div>
          <div className=" text-center  flex flex-col justify-center items-center">
            <p className="text-lg sm:text-md lg:text-xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">12.6M+</p>
            <p className="text-sm sm:text-md lg:text-lg text-gray-300">Content Generated</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
