import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, BASE_URL2 } from '@/utils/funcitons';
import Nav from '../components/Nav';
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import LoginModal from "../components/Model2";
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { FiArrowLeft } from 'react-icons/fi';
import Model3 from '../components/Model3'

interface Tool {
  _id: string;
  name: string;
  description: string;
  logo: string;
  tagLine: string;
  isBookmarked: boolean;
}

const CategoryTools: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const { user, isSignedIn } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showModel3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(Number)

  const fetchTools = async () => {
    try {
      let response;
      if (categoryName === 'My Tools') {
        if (isSignedIn && user) {
          response = await axios.get(`${BASE_URL}/bookmarks?clerkId=${user.id}`);
        } else {
          setShowLoginModal(true);
          setIsLoading(false);
          return;
        }
      } else {
        response = await axios.get(`${BASE_URL2}/objects/getObjectByLabel/${encodeURIComponent(categoryName || '')}`);
      }

      const responseData = categoryName === 'My Tools' ? response.data.data : response.data.message;

      const toolsData = responseData.map((tool: Tool) => ({
        ...tool,
        isBookmarked: categoryName === 'My Tools' ? true : false
      }));
      setTools(toolsData);
      setFilteredTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0);
    fetchTools();
  }, [categoryName, isSignedIn, user]);

  useEffect(() => {
    setFilteredTools(
      tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tools]);

  const handleBookmarkClick = async (toolId: string) => {
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/bookmarks/add-remove/${toolId}?clerkId=${user.id}`); 
      if (response.status === 200) {
        toast.success('Bookmark status updated successfully!');
        // Refetch tools after bookmark update
        fetchTools();
      } else {
        throw new Error('Failed to update bookmark status');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('An error occurred while updating the bookmark status.');
    }
  };

  const getCredits = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL2}/plans/current?clerkId=${user!.id}`
      );
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };
  getCredits();

  const handleGenerateClick = (toolId: string) => {
    if (!isSignedIn) {
      setTimeout(() => {
        setShowLoginModal(true);
      }, 0);
      return;
    } else {
      if(credits===0){

        setTimeout(() => {
          setShowModal3(true);
        }, 0);
      }
      else{
        const newPath = `/generate?id=${toolId}`;
      window.open(newPath, "_blank");
      }
      
    }
  };


  const handleBackClick = () => {
    navigate('/');
  };

  const handleSearch = () => {
    setFilteredTools(
      tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className='bg-[var(--background-color)]'>
      <Nav />
      
      <div className="max-w-7xl mx-auto px-6 md:px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-[var(--teal-color)] text-2xl cursor-pointer hover:[var(--hover-teal-color)]"
          onClick={handleBackClick}
        />
      </div>
      <div className="container mx-auto px-4 py-4 w-5/6">
        <h1 className="text-2xl font-bold text-center flex-grow">{decodeURIComponent(categoryName || '')}</h1>
        <div className="flex justify-center my-8">
          <div className="w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] relative flex flex-col justify-center items-center h-fit">
            <div className="z-10 w-full max-w-[637px] mx-auto p-[4px] md:p-2 bg-white-color shadow-md border border-[var(--teal-color)] rounded-full">
              <div className="flex justify-between items-center">
                <input
                  placeholder="Find Your Tool.."
                  className="w-full border-none focus-visible:placeholder:text-transparent z-50 rounded-l-full outline-none px-4 py-1 placeholder:text-[var(--gray-color)] text-[var(--primary-text-color)] bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="text-[var(--white-color)] text-center font-outfit md:text-lg font-semibold flex relative text-xs p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] transition-all duration-300 ease-in-out">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : filteredTools.length === 0 && categoryName === 'My Tools' ? (
          <div className="flex items-center justify-center ">
            <h1 className='text-5xl text-[var(--gray-color)]'>No Bookmarks</h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <div key={tool._id} className="p-0.5 w-[325px] h-[255px] rounded-xl bg-[var(--white-color)] ">
                <div className="flex flex-col justify-between gap-5 px-3 py-4 text-[var(--dark-gray-color)] shadow-md shadow-[var(--teal-color)]  rounded-xl w-[320px] h-[250px] bg-white">
                  {/* Logo and Name */}
                  <div className="flex gap-8 items-center">
                    <img src={tool.logo} alt={tool.name} className="w-12 h-12 object-contain mr-3" />
                    <div>
                      <h2 className="text-xl text-[var(--primary-text-color)]  font-outfit font-semibold">{tool.name}</h2>
                    </div>
                  </div>
                  {/* Tagline */}
                  <p className="line-clamp-3 text-center text-sm  font-normal">{tool.tagLine}</p>
                  <div className="flex gap-5 items-center justify-between">
                    {/* Generate Button */}
                    <button className=" text-[var(--teal-color)] bg-[var(--white-color)] border-1 border-[var(--teal-color)]  flex w-full p-2 justify-center my-auto hover:bg-[var(--hover-teal-color)] rounded-full hover:text-[var(--white-color)] font-outfit text-base font-medium" onClick={() => handleGenerateClick(tool._id)}>
                      Generate
                    </button>
                    {/* Bookmark Icon */}
                    <div className="flex w-fit p-2 my-auto hover:invert h-fit bg-[var(--white-color)] justify-center items-center cursor-pointer rounded-full border border-[var(--primary-text-color)]" onClick={() => handleBookmarkClick(tool._id)}>
                      {tool.isBookmarked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--gray-color)] [var(--primary-text-color)]" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2l7-3 7 3a2 2 0 002-2V5a2 2 0 00-2-2H5z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--gray-color)] [var(--primary-text-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2l7-3 7 3a2 2 0 002-2V5a2 2 0 00-2-2H5z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showLoginModal && <LoginModal isOpen={true} onClose={() => setShowLoginModal(false)} />}
      {showModel3 && <Model3 isOpen={true} onClose={() => setShowModal3(false)} />}
      <Footer />
    </div>
  );
};

export default CategoryTools;
