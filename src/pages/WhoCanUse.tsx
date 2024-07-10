import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const usersData = [
    "Freelancers",
    "Product Managers",
    "Designers",
    "Engineers",
    "Marketers",
    "Digital Marketers",
    "Agencies",
    "Startups",
    "Solo Entrepreneurs",
    "Business Enterprises"
];

const WhoCanUseIt = () => {
    const settings = {
        dots: false,
        arrows: false, // Remove side buttons
        infinite: true,
        speed: 5000,
        slidesToShow: 5, // Show 5 items at a time
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div>
            <BlogTitle>Who Can Use It</BlogTitle>
            <div className="max-w-screen-lg mx-auto">
                <StyledSlider {...settings}>
                    {usersData.map((user, index) => (
                        <div key={index} className="user-item px-2 py-2 md:px-5 md:py-5">
                            <div className="text-center">
                                <h3 className="text-lg text-gray-200 font-semibold">{user}</h3>
                            </div>
                        </div>
                    ))}
                </StyledSlider>
            </div>
        </div>
    );
};

const StyledSlider = styled(Slider)`
    .slick-track {
        display: flex;
        align-items: center;
    }
    .slick-slide {
        padding: 0 5px; /* Adjust the padding here to create space between slides */
    }
`;

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

export default WhoCanUseIt;
