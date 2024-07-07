import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import { emails } from "@/utils/email";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import debounce from 'lodash.debounce';
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
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', excerpt: '', image: '', tags: '', slug: '', status: 'published', metaDescription: '' });
  const [showAddModal, setShowAddModal] = useState(false); // State for showing/hiding the add modal
  const [showEditModal, setShowEditModal] = useState(false); // State for showing/hiding the edit modal
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null); // State to hold the current post being edited
  const navigate = useNavigate();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const isAdmin = emails.includes(userEmail);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDelete = async (slug: string) => {
    try {
      await axios.delete(`${BASE_URL}/blog/${slug}`);
      setBlogPosts(blogPosts.filter(post => post.slug !== slug));
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    }
  };

  const handleUpdate = (post: BlogPost) => {
    setCurrentPost(post);
    setShowEditModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const tagsArray = newPost.tags.split(',').map(tag => tag.trim()); // Split tags by comma and trim whitespace
      const postData = { ...newPost, tags: tagsArray };
      await axios.post(`${BASE_URL}/blog/add`, postData);
      const response = await axios.get(`${BASE_URL}/blog/viewblog`);
      setBlogPosts(response.data);
      setShowAddModal(false); // Close the modal after successful creation
      setNewPost({ title: '', content: '', author: '', excerpt: '', image: '', tags: '', slug: '', status: 'published', metaDescription: '' }); // Reset form fields
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Failed to create blog post:', error.response.data.msg);
      } else {
        console.error('Failed to create blog post:', error);
      }
    }
  };

  const handleUpdateSubmit = async () => {
    if (!currentPost) return;

    try {
      await axios.put(`${BASE_URL}/blog/${currentPost.slug}`, currentPost);
      const updatedPosts = await axios.get(`${BASE_URL}/blog/viewblog`);
      setBlogPosts(updatedPosts.data);
      setShowEditModal(false); // Close the edit modal after successful update
    } catch (error) {
      console.error('Failed to update blog post:', error);
    }
  };

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/search/${query}`);
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Failed to search blog posts:', error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchSearchResults(query);
    }, 500), // 500ms delay
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      // Fetch all blog posts if search query is empty
      fetchSearchResults('');
    }
  }, [searchQuery, debouncedSearch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blog/search/${searchQuery}`);
      console.log(response.data)
      setBlogPosts(response.data);
    } catch (error) {
      console.error('Failed to search blog posts:', error);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      
      <div className="p-10 w-5/6 m-auto">
        <div className="text-center mb-10">
        <h1 className=" bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold mb-4">
          BigWigMedia Blogs
        </h1>

 
        </div>

        

        <div className="w-full md:w-2/5 m-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="border border-gray-300 rounded-full pl-4 pr-10 py-2 w-full mb-10 md:mb-0"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-600 cursor-pointer" size={20} onClick={handleSearch} />
          </div>
        </div>

        <div className='flex justify-end mb-4 mt-5'>
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="text-white font-outfit md:text-lg font-semibold  text-base py-3 px-3  rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"><FaPlus /></button>
          )}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <div className='bt-gradient p-0.5 rounded-lg h-fit'>
              <div key={post._id} className="h-fit relative bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105" onClick={() => handlePostClick(post.slug)}>
                <div className="w-full h-72 object-cover relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover absolute top-0 left-0" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-black bg-opacity-50 text-white">
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-sm">by {post.author}</p>
                    <p className="text-sm">{new Date(post.datePublished).toLocaleDateString()}</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="absolute top-2 right-2">
                    <FaEdit onClick={(e) => { e.stopPropagation(); handleUpdate(post); }} className="text-blue-500 cursor-pointer inline-block mr-2" />
                    <FaTrashAlt onClick={(e) => { e.stopPropagation(); handleDelete(post.slug); }} className="text-red-500 cursor-pointer inline-block" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Blog Modal */}
         {/* Add Blog Modal */}
         {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-filter backdrop-blur-sm overflow-y-auto">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl text-center font-bold mb-4">Create New Blog Post</h2><hr/><br />
                <label className="block mb-2">
                  Title
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter the title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Content
                  <textarea
                    name="content"
                    placeholder="Enter the content of the post"
                    value={newPost.content}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  ></textarea>
                </label>
                <label className="block mb-2">
                  Author
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter the author's name"
                    value={newPost.author}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Excerpt
                  <input
                    type="text"
                    name="excerpt"
                    placeholder="Enter a short excerpt"
                    value={newPost.excerpt}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Image URL
                  <input
                    type="text"
                    name="image"
                    placeholder="Enter the URL of the image"
                    value={newPost.image}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Tags (comma separated)
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g., technology, education"
                    value={newPost.tags}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Slug
                  <input
                    type="text"
                    name="slug"
                    placeholder="Enter a URL-friendly slug"
                    value={newPost.slug}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Meta Description
                  <input
                    type="text"
                    name="metaDescription"
                    placeholder="Enter a meta description for SEO"
                    value={newPost.metaDescription}
                    onChange={handleInputChange}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowAddModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:opacity-60">
                    Cancel
                  </button>
                  <button onClick={handleCreate} className="text-white bt-gradient hover:opacity-60 px-4 py-2 rounded">
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Edit Blog Modal */}
        {showEditModal && currentPost && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-filter backdrop-blur-sm overflow-y-auto">
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-300">
                <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog Post</h2><hr /><br />
                <label className="block mb-2">
                  Title
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter the title"
                    value={currentPost.title}
                    onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Content
                  <textarea
                    name="content"
                    placeholder="Enter the content of the post"
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  ></textarea>
                </label>
                <label className="block mb-2">
                  Author
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter the author's name"
                    value={currentPost.author}
                    onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Excerpt
                  <input
                    type="text"
                    name="excerpt"
                    placeholder="Enter a short excerpt"
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Image URL
                  <input
                    type="text"
                    name="image"
                    placeholder="Enter the URL of the image"
                    value={currentPost.image}
                    onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Tags (comma separated)
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g., technology, education"
                    value={currentPost.tags.join(', ')}
                    onChange={(e) => setCurrentPost({ ...currentPost, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Slug
                  <input
                    type="text"
                    name="slug"
                    placeholder="Enter a URL-friendly slug"
                    value={currentPost.slug}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <label className="block mb-2">
                  Meta Description
                  <input
                    type="text"
                    name="metaDescription"
                    placeholder="Enter a meta description for SEO"
                    value={currentPost.metaDescription}
                    onChange={(e) => setCurrentPost({ ...currentPost, metaDescription: e.target.value })}
                    className="mb-2 p-2 w-full border border-gray-300 rounded"
                  />
                </label>
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowEditModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">
                    Cancel
                  </button>
                  <button onClick={handleUpdateSubmit} className="bt-gradient text-white px-4 py-2 rounded">
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

      </div>
      <Footer />
    </div>
  );
};

export default Blog;
