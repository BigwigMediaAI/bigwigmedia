import React from 'react';
import { useNavigate } from 'react-router-dom';
import paymentGatewayLogo from '../assets/rajorpay.jpg'; // Adjust the path as needed
import styled from 'styled-components';

const PricingPlan = () => {
  const navigate = useNavigate();

  const handleChoosePlan = () => {
    navigate('/plan');
  };

  return (
    <div className='mt-10'>
    <BlogTitle>Pricing Plan</BlogTitle>
    <div className="flex flex-col  items-center py-6 ">
      <div className="flex flex-col md:flex-row gap-20">
      {/* Monthly Plan */}
      <div className="max-w-md bg-green-100 rounded-lg shadow-lg p-6 shadow-violet-700">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Plan</h3>
        <div className="text-4xl font-bold text-gray-900 mb-4">₹1000</div>
        <div className="text-gray-600 mb-4">300 credits for 30 days</div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">Unlimited GPT-3.5 words</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">25,000 GPT-4 words</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">100 image credits</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">20 Audio Transcriptions</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">10,000 characters Text-to-Speech
          </span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">120+ Tools</span>
        </div>
        <div className="flex items-center mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">35+ languages</span>
        </div>
        <button
          className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex  text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
          onClick={handleChoosePlan}
        >
          Choose Plan
        </button>
      </div>

 {/* Yearly Plan */}
 <div className="max-w-md bg-orange-100 rounded-lg shadow-lg p-6 shadow-violet-700">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Yearly Plan</h3>
        <div className="text-4xl font-bold text-gray-900 mb-4">₹10000</div>
        <div className="text-gray-600 mb-4">4000 credits for 365 days</div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">Unlimited GPT-3.5 words</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">25,000 GPT-4 words</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">100 image credits</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">20 Audio Transcriptions</span>
        </div>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">10,000 characters Text-to-Speech
          </span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">120+ Tools</span>
        </div>
        <div className="flex items-center mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V4zm12 0a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0V4zM5 10a1 1 0 0 1-2 0V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v6a1 1 0 1 1-2 0V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6zM9 20a1 1 0 0 1-1-1v-3.585a1 1 0 0 1 .293-.707l6.292-6.293a1 1 0 0 1 1.414 0l3.585 3.585a1 1 0 0 1 0 1.414l-6.292 6.292a1 1 0 0 1-.707.293H9z" />
          </svg>
          <span className="text-gray-600">35+ languages</span>
        </div>
        <button
          className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex  text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
          onClick={handleChoosePlan}
        >
          Choose Plan
        </button>
      </div>
      </div>

      {/* Safe Payment Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-300 mb-4">We ensure safe payment with:</p>
        <img src={paymentGatewayLogo} alt="Payment Gateway Logo" className="mx-auto w-36" />
      </div>
    </div>
    </div>
  );
};

export default PricingPlan;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #777;
  text-shadow: 5px 7px 2px rgba(1.7, 2.3, 2.5, 2.6);
  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for smaller screens */
  }
`;

