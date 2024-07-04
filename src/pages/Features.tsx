import React from 'react';

const features = [
  {
    title: 'Effective',
    description: 'Save time and effort with our automation tools for social media, video editing, and file conversion.',
    icon: 'https://www.svgrepo.com/show/273656/tools-and-utensils-microchip.svg', // replace with your icon path
  },
  {
    title: 'Simple',
    description: 'Simplify your tasks with intuitive interfaces and minimal setup for starting campaigns and managing media.',
    icon: 'https://www.svgrepo.com/show/477058/internet.svg', // replace with your icon path
  },
  {
    title: 'Secure',
    description: 'Protect your data with robust security measures. We prioritize your privacy and confidentiality.',
    icon: 'https://www.svgrepo.com/show/485059/security-shield.svg', // replace with your icon path
  },
  {
    title: 'Trusted',
    description: 'Join thousands of satisfied users who rely on us for their social media, video, audio, and file management needs.',
    icon: 'https://www.svgrepo.com/show/271589/social-media-like.svg', // replace with your icon path
  },
];

const Features = () => {
  return (
    <div className="max-w-screen-xl mx-auto mt-20">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 ">
        {features.map((feature, index) => (
          <div key={index} className="px-10 text-center mb-8 ">
            <img src={feature.icon} alt={feature.title} className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-200">{feature.title}</h3>
            <p className="mt-2 text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
