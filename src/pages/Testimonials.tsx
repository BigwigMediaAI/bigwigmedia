import React from 'react';
import { Arrow } from 'react-konva';
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
        rating: 5
    },
    {
        name: "Michael Johnson",
        company: "Tech Solutions",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        comment: "The AI algorithms are cutting-edge and delivered tangible results for our business.",
        rating: 5
    },
    {
        name: "Atul Chopra",
        company: "Indus Hospitality",
        avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWRzI2Z1MO95VkHQowijTU1kEv8xcL2IXZ6yCkmA5dnjTDzWbMr=w54-h54-p-rp-mo-br100",
        comment: "Brilliant service. Keep it up.",
        rating: 5
    },
    {
        name: "David Lee",
        company: "Global Enterprises",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        comment: "Using this AI platform has been a game-changer for our data analysis needs.",
        rating: 5
    },
    {
        name: "Varun",
        company: "Melbourne, Australia",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocKNscdwnoaPd1mP5irWpb9bre8dOcRZPR8FQwMpmY5-_osBAw=w54-h54-p-rp-mo-br100",
        comment: `I recently had the opportunity to try this new AI app from Bigwigmedia and I was impressed with its capabilities.
The app is user-friendly and easy to navigate. I was able to quickly get started and create my own AI-generated content. The results were impressive, and I was able to use the content for a variety of purposes.
I'm confident that Bigwigmedia AI app can be a valuable tool for anyone looking to create high-quality content quickly and easily. I highly recommend it to anyone looking for an AI-powered content creation tool.`,
        rating: 5
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
        dots: false,
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
        <div className='mt-24'>
            <BlogTitle>What Our Clients Say</BlogTitle>
            <div className='mb-4'>
                <h1 className='text-center text-gray-600'>#1 Most Recommended & Most Talked-about Generative AI Tools</h1>
            </div>
            <div className="max-w-screen-lg mx-auto">
                <StyledSlider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="testimonial-item p-5">
                            <TestimonialCard>
                                <div className="flex items-center mb-4">
                                    <Avatar src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} />
                                    <div>
                                        <Name>{testimonial.name}</Name>
                                        <Company>{testimonial.company}</Company>
                                    </div>
                                </div>
                                <Comment>{testimonial.comment}</Comment>
                                <Rating>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i}>&#9733;</Star>
                                    ))}
                                </Rating>
                            </TestimonialCard>
                        </div>
                    ))}
                </StyledSlider>
            </div>
        </div>
    );
};

const BlogTitle = styled.h1`
  font-size: 2rem;
  color: var(--Heading);
  text-align: center;
  margin-bottom: 1rem;
`;

const StyledSlider = styled(Slider)`
    .slick-slide {
        padding: 0 10px; /* Adjust the padding here to create space between slides */
    }
    .slick-dots {
        bottom: -30px; /* Adjust the position of dots */
    }
`;

const TestimonialCard = styled.div`
    background-color: var(--white-color);
    border-radius: 0.5rem;
    box-shadow: 0 8px 8px var(--teal-color);
    padding: 1.5rem;
    height: 300px; /* Set a fixed height for uniformity */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden; /* Hide overflow if content exceeds */
`;

const Avatar = styled.img`
    width: 64px; /* Consistent width */
    height: 64px; /* Consistent height */
    border-radius: 50%;
    border: 2px solid #A78BFA; /* Purple border color */
    object-fit: cover;
    margin-right: 1rem;
`;

const Name = styled.h3`
    font-size: 1.125rem;
    color: #4A5568; /* Text color */
`;

const Company = styled.h4`
    font-size: 0.875rem;
    color: #6B7280; /* Text color */
`;

const Comment = styled.p`
    font-size: 1rem;
    color: #4B5563; /* Text color */
    margin: 0;
    overflow: auto; /* Show overflow content */
`;

const Rating = styled.div`
    display: flex;
    justify-content: center;
`;

const Star = styled.span`
    color: #F59E0B; /* Star color */
    font-size: 1.5rem;
`;

export default Testimonials;
