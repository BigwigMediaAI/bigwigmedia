import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FaShareAlt } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '@clerk/clerk-react';
import { emails } from '@/utils/email'; // List of admin emails
import { BASE_URL } from "@/utils/funcitons";


const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']
];

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
  slug: string;
  status: string;
  metaDescription: string;
  datePublished: string;
  lastUpdated: string;
};

type SuggestedPost = {
  _id: string;
  title: string;
  slug: string;
  image: string; // Assuming your suggested posts have an image
};

const BlogPostDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [title,setTitle]=useState<string | null>(null)
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedPosts, setSuggestedPosts] = useState<SuggestedPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const isAdmin = emails.includes(userEmail);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/${slug}`);
        setBlogPost(response.data);
        setTitle(response.data.title)
        setEditedContent(response.data.content);
        setLoading(false);
        fetchSuggestedPosts(response.data.tags);
      } catch (error) {
        setError('Failed to fetch blog post');
        setLoading(false);
      }
    };

    const fetchSuggestedPosts = async (tags: string[]) => {
      try {
        const response = await axios.get(`${BASE_URL}/blog/tags/${tags[0]}`); // Adjust endpoint if needed
        setSuggestedPosts(response.data.slice(0, 4)); // Limit to 4 suggested posts
      } catch (error) {
        console.error('Failed to fetch suggested posts:', error);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.excerpt,
        url: window.location.href,
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Something went wrong sharing the blog post', error));
    } else {
      console.log('Web Share API is not supported in your browser.');
    }
  };

  const handleSave = async () => {
    if (blogPost) {
      try {
        await axios.put(`${BASE_URL}/blog/${blogPost.slug}`, {
          ...blogPost,
          content: editedContent
        });
        setBlogPost(prev => prev ? { ...prev, content: editedContent } : null);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save edited content:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blogPost) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <div className="p-4 sm:p-8 md:p-10 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">{blogPost.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">{blogPost.excerpt}</p>
          <div className="w-full flex justify-center items-center mb-6">
            <div className="h-96 w-full overflow-hidden flex justify-center items-center">
              <img src={blogPost.image} alt={blogPost.title} className="object-cover h-full" />
            </div>
          </div>
          
          {isAdmin && isEditing ? (
            <div>
              <ReactQuill
                value={editedContent}
                onChange={setEditedContent}
                modules={{ toolbar: toolbarOptions }}
              />
              <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              {isAdmin && (
                <button onClick={() => setIsEditing(true)} className=" px-4 py-2 bg-blue-500 text-white rounded mb-5">
                  Edit
                </button>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap mb-6">
            {blogPost.tags.map(tag => (
              <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                Published on: {new Date(blogPost.datePublished).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300">by {blogPost.author}</p>
              <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date(blogPost.lastUpdated).toLocaleDateString()}</p>
            </div>
            <button onClick={handleShare} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <FaShareAlt className="mr-2" />
              Share
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Status: {blogPost.status}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-5">
        <h2 className="text-2xl font-bold mb-6 sm:mb-10 md:mb-12 lg:mb-16">Related Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {suggestedPosts.map(post => (
            <div key={post._id} className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
              <img src={post.image} alt={post.title} className="object-cover h-56 w-full" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                <a href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">Read more</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostDetails;
