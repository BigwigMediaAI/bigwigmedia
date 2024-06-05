import React from 'react';

const Stats: React.FC = () => {
  return (
    <div className="relative w-11/12 lg:w-10/12 p-1 mx-auto rounded-lg">
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg"></div>
      
      {/* Inner Content */}
      <div className="relative p-4 bg-[#313131] rounded-lg">
        <div className="flex flex-wrap justify-around items-center space-x-2 sm:space-x-4">
          <div className="text-center p-2 sm:p-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">500</p>
            <p className="text-md sm:text-xl text-gray-300">Active Users</p>
          </div>
          <div className="text-center p-2 sm:p-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">1000+</p>
            <p className="text-md sm:text-xl text-gray-300">Files Converted</p>
          </div>
          <div className="text-center p-2 sm:p-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">100+</p>
            <p className="text-md sm:text-xl text-gray-300">Online Tools</p>
          </div>
          <div className="text-center p-2 sm:p-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold">500k</p>
            <p className="text-md sm:text-xl text-gray-300">Files Created</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
