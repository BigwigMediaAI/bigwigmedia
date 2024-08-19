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
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  return (
    <Container>
      <BlogTitle>Our Trending Blogs</BlogTitle>
      <Description>
      Discover how AI can boost your content creation, save time, and enhance productivity. Learn more about Bigwigmedia.AI in our blogs.
      </Description>
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
  margin-top: 16px;
  padding: 20px;
  border-radius: 0.5rem;
  @media (prefers-color-scheme: dark) {
    background-color: #1e1e1e;
  }
`;

const BlogTitle = styled.h1`
  font-size: 2rem;
  color: var(--Heading);
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Description = styled.h1`
  text-align: center;
  color: #4A5568; /* Description text color */
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 568px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const BookContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  cursor: pointer;
`;

const Book = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow color matching your theme */

  &:hover {
    transform: rotateY(-30deg);
  }
`;

const BookCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FFFFFF; /* Light background color matching your theme */
  border: 1px solid #D1D5DB; /* Border color matching your theme */
  border-radius: 0.5rem;
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
  color: #FFFFFF;
  padding: 10px;
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
  background-color: #D1D5DB; /* Spine color matching your theme */
  border: 1px solid #E5E7EB; /* Border color matching your theme */
  transform-origin: left center;
  z-index: 0;
`;

const BookBackCover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #F3F4F6; /* Back cover color matching your theme */
  border: 1px solid #D1D5DB; /* Border color matching your theme */
  border-radius: 0 0.5rem 0.5rem 0;
  transform: rotateY(0deg);
  z-index: -1;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #4A5568;
`;

const Error = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #F56565; /* Error color */
`;
