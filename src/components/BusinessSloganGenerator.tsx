import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCopyIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function BusinessSloganGenerator(){
  const [businessName, setBusinessName] = useState('');
  const [whatItDoes, setWhatItDoes] = useState('');
  const [numberOfSlogans, setNumberOfSlogans] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [slogans, setSlogans] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateSlogans = async () => {
    setIsLoading(true);
    setSlogans([]);  // Clear previous slogans
    if (!businessName || !whatItDoes || !numberOfSlogans) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/slogan?clerkId=${userId}`, {
        businessName,
        whatItDoes,
        numberOfSlogans
      });
      if (res.status === 200) {
        setSlogans(res.data.slogan);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySlogan = (slogan: string) => {
    try {
      navigator.clipboard.writeText(slogan);
      toast.success('Slogan copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy slogan');
    }
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && slogans.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, slogans]);

  // Clear the slogans whenever any content is updated
  useEffect(() => {
    setSlogans([]);
  }, [businessName, whatItDoes, numberOfSlogans]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        />
        <input
          type="text"
          placeholder="Describe what the business does"
          value={whatItDoes}
          onChange={(e) => setWhatItDoes(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Number of slogans"
          value={numberOfSlogans}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberOfSlogans(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        />
        <button
          onClick={handleGenerateSlogans}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? "Generating..." : 'Generate'}
        </button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
          <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {slogans.length > 0 && (
        <div ref={resultsRef} className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300">
          <h3 className="text-xl font-semibold mb-4">Generated Slogans</h3>
          <div className="space-y-4">
            {slogans.map((slogan, index) => (
              <div key={index} className="border border-gray-300 rounded-md p-4 dark:text-gray-200 relative">
                <pre className="whitespace-pre-wrap">{slogan}</pre>
                <button
                  onClick={() => handleCopySlogan(slogan)}
                  className="absolute top-2 right-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                >
                  <ClipboardCopyIcon className="inline-block w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};