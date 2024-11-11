import React from 'react';
import { useNavigate } from 'react-router-dom';
import line1 from '../assets/line1.png'; // Adjust the path as needed
import styled from 'styled-components';

const PricingPlan = () => {
  const navigate = useNavigate();

  const handleChoosePlan = () => {
    navigate('/plan');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <div className='relative mt-10 bg-gradient-to-r from-indigo-900 via-gray-900 to-indigo-900 pt-5'>
      <BlogTitle>Pricing Plans</BlogTitle>
      <div className='px-5 mb-4'>
        <h1 className='text-center text-white'>Why pay separately for each AI tool when you can access them all on a single platform?</h1>
        <h1 className='text-center text-white'>Experience immediate results with our all-inclusive pricing. Try it for <span className='text-lg sm:text-md lg:text-xl text-[var(--green)] font-bold bg-white py-1 px-2 rounded-sm'>FREE NOW!</span></h1>
      </div>
      <div className="flex flex-col items-center py-6  ">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Free Plan */}
          <div className="max-w-sm rounded-lg  p-6 bg-gradient-to-r from-sky-100 to-sky-200 shadow-md shadow-[var(--teal-color)] ">
            <h3 className="text-xl font-semibold text-[var(--primary-text-color)]  mb-4">Free Plan</h3>
            <div className="text-2xl font-bold text-[var(--teal-color)] mb-4">₹0</div>
            <div className="text-[var(--gray-color)] mb-4">30 credits or 7 days</div>
            <div className="text-[var(--gray-color)] mb-4">Whichever is exhausted earlier</div>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-color)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
              </svg>
              <span className="text-[var(--gray-color)]">Email Support</span>
            </div>
            <button
              className="mt-5 bg-sky-400 text-[var(--teal-color)] border border-[var(--teal-color)] text-center font-bold py-2 px-6 rounded-full hover:bg-sky-600 hover:text-[var(--white-color)]"
              onClick={handleChoosePlan}
            >
              Choose Plan
            </button>
          </div>
          {/* Monthly Plan */}
          <div className="max-w-sm rounded-lg shadow-md p-6 bg-gradient-to-r from-pink-100 to-pink-200 shadow-[var(--teal-color)]">
            <h3 className="text-xl font-semibold text-[var(--primary-text-color)] mb-4">Monthly Plan</h3>
            <div className="text-2xl font-bold text-[var(--teal-color)] mb-4">₹499</div>
            <div className="text-[var(--gray-color)] mb-4">1000 credits or 30 days</div>
            <div className="text-[var(--gray-color)] mb-4">Whichever is exhausted earlier</div>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-color)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
              </svg>
              <span className="text-[var(--gray-color)]">Email Support</span>
            </div>
            <button
              className="mt-5 bg-pink-400 text-[var(--teal-color)] border border-[var(--teal-color)] text-center font-bold py-2 px-6 rounded-full hover:bg-pink-600 hover:text-[var(--white-color)]"
              onClick={handleChoosePlan}
            >
              Choose Plan
            </button>
          </div>

          {/* Yearly Plan */}
          <div className="max-w-sm rounded-lg shadow-md p-6 bg-gradient-to-r from-purple-100 to-purple-200 shadow-[var(--teal-color)]">
            <h3 className="text-xl font-semibold text-[var(--primary-text-color)] mb-4" >Yearly Plan</h3>
            <div className="text-2xl font-bold text-[var(--teal-color)] mb-4">₹5999</div>
            <div className="text-[var(--gray-color)] mb-4">14000 credits or 365 days</div>
            <div className="text-[var(--gray-color)] mb-4">Whichever is exhausted earlier</div>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-color)] mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
              </svg>
              <span className="text-[var(--gray-color)]">Dedicated Account Manager</span>
            </div>
            <button
              className="mt-5 bg-purple-400 text-[var(--teal-color)] border border-[var(--teal-color)] text-center font-bold py-2 px-6 rounded-full hover:bg-purple-600 hover:text-[var(--white-color)]"
              onClick={handleChoosePlan}
            >
              Choose Plan
            </button>
          </div>

           {/* Custom plan */}

           <div className="max-w-sm rounded-lg shadow-md p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-[var(--teal-color)] ">
        <h3 className="text-xl font-semibold text-[var(--primary-text-color)] mb-4">Enterprise Plan</h3>
        <div className="text-2xl font-bold text-[var(--teal-color)] mb-4">Custom AI Credit</div><br />
        
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-color)] mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-[var(--gray-color)] ">Email Support</span>
        </div>
        
        
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-color)] mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-[var(--gray-color)] mb-4">Dedicated Account Manager</span>
        </div>
        <br />
        <button
          className="mt-5 bg-yellow-400 text-[var(--teal-color)] border border-[var(--teal-color)] text-center font-bold py-2 px-6 rounded-full hover:bg-yellow-600 hover:text-[var(--white-color)]"
          onClick={handleContact}
        >
          Contact us
        </button>
      </div>

        </div>
         {/* Safe Payment Section */}
      <div className="mt-8 text-center">
        <p className="  text-gray-400 mb-2  ">🔒 Payments are securely processed by RAZORPAY.
        </p>
        <p className="text-gray-400 mb-4">🌏 Bigwigmedia.AI contributes 1% from your purchases to remove CO₂ by planting trees.
        </p>
      </div>
      </div>
    </div>
  );
};

const BlogTitle = styled.h1`
  font-size: 2rem;
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
`;

export default PricingPlan;
