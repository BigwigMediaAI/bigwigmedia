import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { BASE_URL } from "@/utils/funcitons";

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  datePublished: string;
  slug: string;
  tags: string[];
  metaDescription: string;
};

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/viewblog`);
        setBlogPosts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch blog posts');
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <BlogTitle>Our Trending Blogs</BlogTitle>
      <div className='mb-10'>
            <h1 className='text-center text-gray-200'>For insights on how artificial intelligence can enhance your content creation, save time, and boost productivity exponentially, and to learn about the ways Bigwigmedia.AI can assist you, be sure to check out our blogs.</h1>
        </div>
      <Grid>
        {blogPosts.slice(0, 4).map(post => (
          <BookContainer key={post._id} onClick={() => handlePostClick(post.slug)}>
            <Book>
              <BookCover>
                <BookImage src={post.image} alt={post.title} />
                <BookInfo>
                  <Title>{post.title}</Title>
                  <Author>by {post.author}</Author>
                </BookInfo>
              </BookCover>
              <BookSpine />
              <BookBackCover />
            </Book>
          </BookContainer>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;

const Container = styled.div`
  width: 90%;
  margin: auto;
  margin-top:16px;
  @media (prefers-color-scheme: dark) {
    background-color: #1e1e1e;
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

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4,1fr);
  @media (max-width: 968px) {
    grid-template-columns: repeat(2,1fr);
  }
    @media (max-width: 568px) {
    grid-template-columns: repeat(1,1fr); 
  }
`;

const BookContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const Book = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  transition: transform 0.5s;
  transform-style: preserve-3d;

  &:hover {
    transform: rotateY(-30deg);
  }
`;

const BookCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: gray;
  border: 1px solid #000;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  transform-origin: left center;
  z-index: 1;
`;

const BookImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BookInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  opacity: 1; /* Always visible */
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
`;

const Author = styled.p`
  font-size: 0.875rem;
`;

const BookSpine = styled.div`
  position: absolute;
  width: 20px;
  height: 100%;
  background-color: darkgray;
  border: 1px solid #000;
  transform-origin: left center;
  z-index: 0;
`;

const BookBackCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: lightgray;
  border: 1px solid #000;
  border-radius: 0 4px 4px 0;
  transform: rotateY(0deg);
  z-index: -1;
`;