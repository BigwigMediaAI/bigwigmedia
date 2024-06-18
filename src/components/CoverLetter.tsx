import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CopyIcon } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons"; // Ensure the BASE_URL is correct
import { useAuth } from "@clerk/clerk-react";

export function CoverLetterGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [highlights, setHighlights] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCoverLetter(""); // Clear previous cover letter
    if (!jobDescription || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateCoverLetter?clerkId=${userId}`, {
        jobDescription,
        userDetails: {
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress
        },
        highlights
      });

      

      if (response.status === 200) {
        setCoverLetter(response.data.coverLetter);
      } else {
        toast.error('Error generating cover letter. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Error generating cover letter. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast.success('Cover letter copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy cover letter');
    }
  };

  useEffect(() => {
    if (!isLoading && coverLetter) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, coverLetter]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description (e.g., We are looking for a skilled software developer with experience in Node.js and React)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Phone</label>
        <input
          type="text"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Address (optional)</label>
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="Enter your address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Highlights</label>
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Enter highlights (e.g., Experience with large-scale applications, strong problem-solving skills, and a passion for technology)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Generating cover letter. Please wait...</p>
          </div>
        ) : (
          <div>
            {coverLetter && (
              <div ref={resultsRef} className='border border-gray-300 rounded-md p-5 relative'>
                <h3 className="text-gray-700 dark:text-gray-300">Generated Cover Letter:</h3>
                <div className="mt-2 dark:bg-gray-700 p-4 rounded-md">
                  {coverLetter.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300">{line}</p>
                  ))}
                </div>
                <button
                  className="absolute top-2 right-2 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-gray-200"
                  onClick={handleCopy}
                >
                  <CopyIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
