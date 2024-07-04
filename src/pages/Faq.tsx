import React, { useState } from 'react';
import styled from 'styled-components';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is the duration of the free trial?',
    answer: 'New users can enjoy a 7-day free trial of our AI tools.',
  },
  {
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time.',
  },
  {
    question: 'How are credits used on the platform?',
    answer: 'Credits are deducted based on the usage of different AI tools. Each tool specifies the number of credits required for its use.',
  },
  {
    question: 'Can I upgrade my plan before it expires?',
    answer: 'Yes, you can upgrade your plan at any time. The new plan will be activated immediately, and the remaining credits from your current plan will be added to your account.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, there are no hidden fees. You just pay the monthly subscription fee.',
  },
  {
    question: 'How do I make payments on the website?',
    answer: 'We use Razorpay as our secure payment gateway, ensuring safe and seamless transactions.',
  },
  {
    question: 'Do you offer any kind of support?',
    answer: 'Yes, we offer email and live chat support for all of our customers.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Absolutely. Razorpay is a highly secure payment gateway, and we ensure that all your payment information is protected and encrypted.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className='mt-10'><BlogTitle>Frequently Asked Questions</BlogTitle>
    <div className="lg:max-w-screen-lg mx-auto p-8 rounded-lg shadow-xl shadow-purple-600">
      
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="bg-#1e1e1e rounded-lg p-4  border ">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleAnswer(index)}>
              <h3 className="text-lg text-gray-300 font-semibold">{item.question}</h3>
              <span className="text-gray-400">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && (
              <p className="text-gray-400 mt-2">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FAQ;

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
