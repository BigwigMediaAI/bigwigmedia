import React from 'react';
import styled from 'styled-components';

const features = [
  {
    title: 'Effective',
    description: 'Consolidated AI Tools. Why spend more on individual AI tools when you can access everything in a single platform.',
    icon: 'https://www.svgrepo.com/show/273656/tools-and-utensils-microchip.svg', // replace with your icon path
  },
  {
    title: 'Easy to Use',
    description: 'Streamline your activities with user-friendly interfaces and minimal efforts for your tasks.',
    icon: 'https://www.svgrepo.com/show/477058/internet.svg', // replace with your icon path
  },
  {
    title: 'Security',
    description: 'We safeguard your information using comprehensive security protocols. Ensuring your privacy and confidentiality is our highest priority.',
    icon: 'https://www.svgrepo.com/show/485059/security-shield.svg', // replace with your icon path
  },
  {
    title: 'Reliability',
    description: 'Become part of millions of happy trusted users who depend on our services for their everyday activities.',
    icon: 'https://www.svgrepo.com/show/271589/social-media-like.svg', // replace with your icon path
  },
];

const Features = () => {
  return (
    <div className='mt-20'>
      <BlogTitle>Significant Benefits</BlogTitle>
    <div className="max-w-unit-80 md:max-w-screen-lg mx-auto mt-6">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8 ">
        {features.map((feature, index) => (
          <div key={index} className="rounded-lg p-6  text-center shadow-lg shadow-teal-500 ">
            <img src={feature.icon} alt={feature.title} className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
            <p className="mt-2 text-xs text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Features;


const BlogTitle = styled.h1`
  font-size: 2.5rem;
  color: #4A5568;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;