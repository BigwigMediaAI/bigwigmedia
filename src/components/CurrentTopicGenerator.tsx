import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'politics', label: 'Politics' },
  { value: 'science', label: 'Science' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'environment', label: 'Environment' },
  { value: 'history', label: 'History' },
  { value: 'art', label: 'Art' },
  { value: 'culture', label: 'Culture' },
  { value: 'finance', label: 'Finance' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'music', label: 'Music' },
  { value: 'literature', label: 'Literature' },
  { value: 'philosophy', label: 'Philosophy' },
  { value: 'religion', label: 'Religion' },
  { value: 'photography', label: 'Photography' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'personal-development', label: 'Personal Development' },
  { value: 'home-garden', label: 'Home & Garden' },
  { value: 'parenting', label: 'Parenting' },
  { value: 'animals', label: 'Animals' },
];

export function GenerateCurrentTopics() {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [numTopics, setNumTopics] = useState('');
  const [topics, setTopics] = useState([]);
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topics.length === 0) {
      setButtonText('Generate');
    } else {
      setButtonText('Regenerate');
    }
  }, [topics]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setTopics([]);
    
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/current-topics?clerkId=${userId}`, {
        category,
        keywords,
        numTopics: parseInt(numTopics),
      });

      if (response.status === 200) {
        setTopics(response.data.data.topics);
      } else {
        toast.error('Error generating topics. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating topics:', error);
      toast.error('Error generating topics. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const topicsText = topics.join('\n');
    navigator.clipboard.writeText(topicsText);
    toast.success('Topics copied to clipboard!');
  };

  const handleRegenerate = () => {
    setTopics([]);
    setIsLoading(true);
    handleGenerate();
  };

  const handleInputChange = () => {
    setTopics([]);
    setButtonText('Generate');
  };

  useEffect(() => {
    if (!isLoading && topics.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' ,block:'center'});
    }
  }, [isLoading, topics]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Category</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Keywords</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => { setKeywords(e.target.value); handleInputChange(); }}
          placeholder="e.g., AI, pandemic, elections"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Number of Topics</label>
        <input
          type="number"
          value={numTopics}
          onChange={(e) => { setNumTopics(e.target.value); handleInputChange(); }}
          placeholder="Enter the number of topics"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleGenerate : handleRegenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : buttonText}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          topics.length > 0 && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Topics:</h2>
                <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside">
                  {topics.map((topic, index) => (
                    <li key={index} className="mb-2 list-none">{topic}</li>
                  ))}
                </ul>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCopy}
                >
                  <Clipboard className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}