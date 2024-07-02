import React, { useState, useEffect } from 'react';

interface Testimonial {
    name: string;
    company: string;
    avatar: string;
    comment: string;
    rating: number;
}

// Define sample testimonial data
const testimonialsData = [
    {
        name: "John Doe",
        company: "ABC Inc.",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment: "Great experience with this AI service! It helped us optimize our processes significantly.",
        rating: 5
    },
    {
        name: "Jane Smith",
        company: "XYZ Corp.",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        comment: "Impressive AI capabilities that transformed how we approach customer service.",
        rating: 4
    },
    {
        name: "Michael Johnson",
        company: "Tech Solutions",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        comment: "The AI algorithms are cutting-edge and delivered tangible results for our business.",
        rating: 5
    },
    {
        name: "Emily Brown",
        company: "Digital Innovations",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        comment: "Highly recommend this AI service for its reliability and performance.",
        rating: 4
    },
    {
        name: "David Lee",
        company: "Global Enterprises",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        comment: "Using this AI platform has been a game-changer for our data analysis needs.",
        rating: 5
    },
    {
        name: "Sarah Wilson",
        company: "Tech Startups",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
        comment: "Incredible AI features that helped us innovate faster and smarter.",
        rating: 4
    },
    {
        name: "Alex Clark",
        company: "Innovative Tech",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
        comment: "The AI solutions provided here exceeded our expectations in every way.",
        rating: 5
    }
];

// Testimonial card component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-2">
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <h4 className="text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.company}</p>
                </div>
            </div>
            <p className="text-gray-700 mb-6">{testimonial.comment}</p>
            <div className="flex items-center">
                {/* Rating stars or any other rating indicator */}
                {Array.from({ length: testimonial.rating }, (_, index) => (
                    <img key={index} src="/star.svg" alt="Star" className="w-4 h-4 mr-1 text-yellow-500" />
                ))}
            </div>
        </div>
    </div>
);

// Testimonials slider component
const TestimonialsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
        }, 5000); // Adjust interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {[testimonialsData[testimonialsData.length - 1], ...testimonialsData, testimonialsData[0]].map((testimonial, index) => (
                    <TestimonialCard key={index} testimonial={testimonial} />
                ))}
            </div>
        </div>
    );
};

export default TestimonialsSlider;
