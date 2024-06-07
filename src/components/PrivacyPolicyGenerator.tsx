import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

export function GeneratePrivacyPolicy() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setPrivacyPolicy('');
    
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generatePolicy?clerkId=${userId}`, {
        companyName,
        address,
        websiteURL,
      });
      console.log(response.data.data)
      if (response.status === 200) {
        setPrivacyPolicy(response.data.data.improvedContent.data.privacyPolicy);
      } else {
        toast.error('Error generating privacy policy. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating privacy policy:', error);
      toast.error('Error generating privacy policy. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(privacyPolicy);
    toast.success('Privacy Policy copied to clipboard!');
  };

  const handleInputChange = () => {
    setPrivacyPolicy('');
    setButtonText('Generate');
  };

  useEffect(() => {
    if (!isLoading && privacyPolicy) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, privacyPolicy]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => { setCompanyName(e.target.value); handleInputChange(); }}
          placeholder="Enter your company name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => { setAddress(e.target.value); handleInputChange(); }}
          placeholder="Enter your company address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Website URL</label>
        <input
          type="text"
          value={websiteURL}
          onChange={(e) => { setWebsiteURL(e.target.value); handleInputChange(); }}
          placeholder="Enter your website URL"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={handleGenerate}
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
          privacyPolicy && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Privacy Policy:</h2>
                <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{privacyPolicy}</pre>
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
