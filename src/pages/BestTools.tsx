import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Importing Font Awesome icons
import '../App.css';
import { useNavigate } from 'react-router-dom';

const toolData = [
    {
        name: "YouTube Tools",
        description: "Optimize your video content and manage your channel effectively.",
        logo: "https://www.svgrepo.com/show/475700/youtube-color.svg",
    },
    {
        name: "Facebook Tools",
        description: "Enhance your Facebook marketing strategy with powerful tools.",
        logo: "https://www.svgrepo.com/show/475647/facebook-color.svg",
    },
    {
        name: "Instagram Tools",
        description: "Create stunning visuals and manage your Instagram presence.",
        logo: "https://www.svgrepo.com/show/349410/instagram.svg",
    },
    {
        name: "Linkedin Tools",
        description: "Build your professional network and improve your LinkedIn profile.",
        logo: "https://www.svgrepo.com/show/303299/linkedin-icon-2-logo.svg",
    },
    {
        name: "Image Generator & Image Tools",
        description: "Edit and optimize images for various applications.",
        logo: "https://www.svgrepo.com/show/375830/image.svg",
    },
    {
        name: "Audio Tools",
        description: "Enhance and manipulate audio files effortlessly.",
        logo: "https://www.svgrepo.com/show/490948/audio.svg",
    },
    {
        name: "Video Tools",
        description: "Create, edit, and manage your video content seamlessly.",
        logo: "https://www.svgrepo.com/show/520509/video-courses.svg",
    },
    {
        name: "PDF Tools",
        description: "Convert, edit, and manage your PDF documents efficiently.",
        logo: "https://www.svgrepo.com/show/484943/pdf-file.svg",
    }
];

const BestTool = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        prevArrow: <FaChevronLeft />,
        nextArrow: <FaChevronRight />,
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

    const navigate = useNavigate();

    const handleButtonClick = (toolName: any) => {
        const encodedToolName = encodeURIComponent(toolName);
        navigate(`/tool?selectedButton=${encodedToolName}`);
    };

    return (
        <div>
            <BlogTitle>Explore Our Featured Categories</BlogTitle>
            <div className="max-w-screen-lg mx-auto">
                <StyledSlider {...settings}>
                    {toolData.map((tool, index) => (
                        <div key={index} className="tool-item p-5">
                            <ToolCard>
                                <LogoAndName>
                                    <Logo src={tool.logo} alt={`${tool.name} logo`} />
                                    <ToolName>{tool.name}</ToolName>
                                </LogoAndName>
                                <Description>{tool.description}</Description>
                                <Button onClick={() => handleButtonClick(tool.name)}>Try Now</Button>
                            </ToolCard>
                        </div>
                    ))}
                </StyledSlider>
            </div>
        </div>
    );
};

const BlogTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
    text-align: center;
`;

const StyledSlider = styled(Slider)`
    .slick-list {
        padding: 0 10px;
        pointer-events: auto;
    }
    .slick-dots {
        bottom: -30px;
    }

    .slick-prev, .slick-next {
        background-color: var(--white-color);
        border: none;
        color: var(--teal-color);
        font-size: 2rem;
        z-index: 1;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    .slick-prev {
        left: -40px;
    }

    .slick-next {
        right: -40px;
    }

    /* Hide arrows on mobile screens */
    @media (max-width: 1024px) {
        .slick-prev, .slick-next {
            display: none !important; /* Ensure arrows are hidden */
        }
    }

    /* Ensure arrows are visible on desktop */
    @media (min-width: 1024px) {
        .slick-prev, .slick-next {
            display: block !important; /* Force the arrows to show on desktop */
        }
    }

    /* Add hover effect for the arrows */
    .slick-prev:hover, .slick-next:hover {
        color: var(--blue-color); /* Or any other color you prefer */
    }
`;

const ToolCard = styled.div`
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

const LogoAndName = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 1rem;
`;

const Logo = styled.img`
    width: 36px;
    height: 36px;
`;

const ToolName = styled.h3`
    font-size: 1.125rem;
    color: #4A5568;
`;

const Description = styled.p`
    font-size: 1rem;
    color: #4B5563;
    margin: 0;
    overflow: auto;
`;

const Button = styled.button`
    background-color: white;
    color: var(--teal-color);
    border: solid 1px var(--teal-color);
    border-radius: 5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: var(--teal-color);
        color: white;
    }
`;

export default BestTool;
