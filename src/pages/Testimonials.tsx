import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

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

const Testimonials = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 testimonials at a time
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div className='mt-14 mb-14'>
            <BlogTitle>Testimonials</BlogTitle>
            
            <div className="max-w-screen-lg mx-auto ">
                <StyledSlider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="testimonial-item p-5">
                            <div className="p-6 rounded-lg  bg-zinc-800 shadow-md  shadow-violet-500 ">
                                <div className="flex items-center mb-4">
                                    <img src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} className="w-12 h-12 rounded-full mr-4" />
                                    <div>
                                        <h3 className="text-lg text-gray-200 font-semibold">{testimonial.name}</h3>
                                        <h4 className="text-sm text-gray-400">{testimonial.company}</h4>
                                    </div>
                                </div>
                                <p className="text-base text-gray-300 mb-4 h-20 overflow-hidden">{testimonial.comment}</p>
                                <div className="flex justify-center">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-500 text-xl">&#9733;</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </StyledSlider>
            </div>
            
        </div>
    );
};

const BlogTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #777;
    text-shadow: 5px 7px 2px rgba(1.7, 2.3, 2.5, 2.6);
    @media (max-width: 768px) {
        font-size: 2rem; /* Adjust font size for smaller screens */
    }
`;

const StyledSlider = styled(Slider)`
    .slick-slide {
        padding: 0 10px; /* Adjust the padding here to create space between slides */
    }
`;
const Underline = styled.div`
    width: 100%;
    height: 1px;
    background-color: white; /* Choose your underline color */
    margin-top: 20px; /* Adjust margin as needed */
`;

export default Testimonials;
