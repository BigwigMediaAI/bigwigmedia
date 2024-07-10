import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, ClipboardCopy } from 'lucide-react'; // Assuming 'Download' and 'Share' icons are available
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from 'react-icons/fa'; 

export function BusinessPlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [language, setLanguage] = useState('English'); // Default language
  const [businessPlan, setBusinessPlan] = useState('');
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!businessPlan) {
      setButtonText('Generate');
    } else {
      setButtonText('Regenerate');
    }
  }, [businessPlan]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setBusinessPlan('');

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/businessPlan?clerkId=${userId}`, {
        businessType,
        industry,
        targetMarket,
        language // Include language in request
      });

      if (response.status === 200) {
        setBusinessPlan(response.data.businessPlan);
      } else {
        toast.error('Error generating business plan. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating business plan:', error);
      toast.error('Error generating business plan. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(businessPlan);
    toast.success('Business plan copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([businessPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_business_plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Generated Business Plan',
          text: businessPlan
        });
        console.log('Shared successfully.');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share generated business plan.');
      }
    } else {
      toast.error('Sharing is not supported on this browser.');
    }
  };

  const handleInputChange = () => {
    setBusinessPlan('');
    setButtonText('Generate');
  };

  useEffect(() => {
    if (!isLoading && businessPlan) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, businessPlan]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#262626]">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Business Type</label>
        <input
          type="text"
          value={businessType}
          onChange={(e) => { setBusinessType(e.target.value); handleInputChange(); }}
          placeholder="E.g., Online Retail Store, Restaurant, Consulting Firm"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Industry</label>
        <input
          type="text"
          value={industry}
          onChange={(e) => { setIndustry(e.target.value); handleInputChange(); }}
          placeholder="E.g., E-commerce, Food and Beverage, Professional Services"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Target Market</label>
        <input
          type="text"
          value={targetMarket}
          onChange={(e) => { setTargetMarket(e.target.value); handleInputChange(); }}
          placeholder="E.g., Young Adults, Small Businesses, Health-Conscious Consumers"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
          <option value="Korean">Korean</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Russian">Russian</option>
          <option value="Arabic">Arabic</option>
          <option value="Hindi">Hindi</option>
          <option value="Bengali">Bengali</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Kannada">Kannada</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Marathi">Marathi</option>
          <option value="Nepali">Nepali</option>
          <option value="Odia">Odia</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Assamese">Assamese</option>
          <option value="Bihari">Bihari</option>
          <option value="Kashmiri">Kashmiri</option>
          <option value="Konkani">Konkani</option>
          <option value="Maithili">Maithili</option>
          <option value="Manipuri">Manipuri</option>
          <option value="Santali">Santali</option>
          <option value="Sindhi">Sindhi</option>
          <option value="Urdu">Urdu</option>
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleGenerate : handleGenerate}
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
          businessPlan && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6 max-h-96 overflow-y-auto relative">
              <div className="border p-4 rounded-lg">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Business Plan:</h2>
                <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{businessPlan}</pre>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  >
                    <ClipboardCopy className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  >
                    <FaDownload className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  >
                    <FaShareAlt className="inline-block w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
