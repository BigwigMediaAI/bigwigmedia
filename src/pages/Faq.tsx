import React from 'react';
import styled from 'styled-components';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time.',
  },
  {
    question: 'Is there a discount for annual subscriptions?',
    answer: 'Yes, we offer a 40% discount if you choose the annual plan.',
  },
  {
    question: 'When will I be billed?',
    answer: 'You will be billed at the start of your subscription.',
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'If you don\'t find Easy-Peasy.AI meets your needs, we guarantee a full refund of your payment within 30 days of purchase—no questions asked.',
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, there are no hidden fees. You just pay the monthly subscription fee.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can easily cancel your subscription at any time by going to your account settings.',
  },
  {
    question: 'Do you offer any kind of support?',
    answer: 'Yes, we offer email and live chat support for all of our customers.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We support all major credit cards and debit cards. Your payment method is secured by Stripe for your privacy and protection.',
  },
];

const FAQ: React.FC = () => {
  return (
    <div className='mt-10'><BlogTitle>Frequently Asked Quesitons</BlogTitle>
    
    <div className="lg:max-w-screen-xl mx-auto mt-5 p-8  rounded-lg shadow-xl shadow-purple-600">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqData.map((item, index) => (
          <div key={index} className="space-y-2 text-justify">
            <h3 className="text-2xl text-gray-300 font-outfit font-semibold">{item.question}</h3>
            <p className="text-gray-400 text-lg ">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default FAQ;


const BlogTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #777;
  text-shadow: 5px 7px 2px rgba(1.7, 2.3, 2.5, 2.6);
  @media (max-width: 768px) {
    font-size: 2rem; /* Adjust font size for smaller screens */
  }
`;