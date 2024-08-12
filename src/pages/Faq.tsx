import React, { useState } from 'react';
import styled from 'styled-components';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What are Credits?',
    answer: 'Credits are what you use to download each content that you generate on BigwigMedia.ai. Depending on the package you select, you will have a set number of credits available to you each month. These credits renew every month and can be used to download your generated content.',
  },
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
  }
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
    <div className='mt-14 px-5'>
      <BlogTitle>Frequently Asked Questions</BlogTitle>
      <div className="lg:max-w-screen-lg mx-auto p-8 bg-[var(--white-color)] rounded-lg shadow-lg">
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-gray-100 rounded-lg border border-gray-300">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 transition duration-300"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-lg font-semibold text-[var(--primary-text-color)]">{item.question}</h3>
                <span className="text-[var(--gray-color)] text-xl">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="p-4">
                  <p className="text-[var(--dark-gray-color)]">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--Heading);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

export default FAQ;
