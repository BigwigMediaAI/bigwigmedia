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

const headerGradients = [
    "linear-gradient(120deg, #6366f1, #a78bfa)", // Indigo to Purple
    "linear-gradient(120deg, #10b981, #34d399)", // Green gradient
    "linear-gradient(120deg, #f59e0b, #fbbf24)", // Amber gradient
    "linear-gradient(120deg, #ef4444, #f87171)", // Red gradient
    "linear-gradient(120deg, #3b82f6, #60a5fa)", // Blue gradient
    "linear-gradient(120deg, #ec4899, #f472b6)", // Pink gradient
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
        <Container>
            <HeaderSection>
                <Title>What Our Clients Say</Title>
                <Subtitle>#1 Most Recommended & Talked-about AI Tools</Subtitle>
            </HeaderSection>
            <SliderContainer>
                <StyledSlider {...settings}>
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index}>
                            <CardHeader>
                                <Avatar src={testimonial.avatar} alt={`${testimonial.name}'s avatar`} />
                                <div>
                                    <Name>{testimonial.name}</Name>
                                    <Company>{testimonial.company}</Company>
                                </div>
                            </CardHeader>
                            <CommentSection>
                                <Comment>{testimonial.comment}</Comment>
                            </CommentSection>
                            <Rating>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i}>&#9733;</Star>
                                ))}
                            </Rating>
                        </TestimonialCard>
                    ))}
                </StyledSlider>
            </SliderContainer>
        </Container>
    );
};

const Container = styled.div`
    padding: 4rem 0;
    text-align: center;
`;

const HeaderSection = styled.div`
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: #4b5563;
    font-size: 1rem;
`;

const SliderContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const StyledSlider = styled(Slider)`
    .slick-slide {
        padding: 0 15px;
    }
    .slick-dots {
        bottom: -30px;
    }
`;

const TestimonialCard = styled.div`
     background-color: var(--white-color);
    border-radius: 0.5rem;
    box-shadow: 0 8px 8px var(--teal-color);
    padding: 1rem;
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
`;


const CardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(120deg, #6366f1 0%, #a78bfa 100%);
    padding: 1rem;
    border-radius: 0.5rem 0.5rem 0 0;
`;

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #ffffff;
`;

const Name = styled.h3`
    font-size: 1.125rem;
    color: #ffffff;
    margin: 0;
`;

const Company = styled.h4`
    font-size: 0.875rem;
    color: #e5e7eb;
    margin: 0;
`;

const CommentSection = styled.div`
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
    flex-grow: 1;
    overflow-y: auto;
    height: 150px;
`;

const Comment = styled.p`
    font-size: 1rem;
    color: #374151;
    margin: 0;
    text-align: justify;
`;

const Rating = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1rem;
`;

const Star = styled.span`
    color: #fbbf24;
    font-size: 1.25rem;
`;

export default Testimonials;