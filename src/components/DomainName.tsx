import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function GenerateDomainNames() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [length, setLength] = useState('');
  const [count, setCount] = useState('');
  const [domainNames, setDomainNames] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    try {
      const response = await axios.post(`${BASE_URL}/response/domain?clerkId=${userId}`, {
        companyName,
        companyType,
        length: parseInt(length) || 0,
        count: parseInt(count) || 0
      });

      // Scroll to loader after a short delay to ensure it's rendered
      

      if (response.status === 200) {
        setDomainNames(response.data.data);
      } else {
        toast.error('Error generating domain names. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating domain names:', error);
      toast.error('Error generating domain names. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && domainNames.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, domainNames]);

  const handleShare = () => {
    const textToShare = domainNames.join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'Generated Domain Names',
        text: textToShare,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(textToShare).then(() => {
        toast.success('Domain names copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy domain names to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const textToDownload = domainNames.join('\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-names.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Type</label>
        <input
          type="text"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          placeholder="Enter company type (e.g., tech, innovation)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5 flex space-x-4">
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300">Length</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Max length of domain name (default: 0)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-gray-700 dark:text-gray-300">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Number of domain names (default: 0)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
          />
        </div>
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
            <p className="text-gray-300 text-justify">Generating domain names. Please wait...</p>
          </div>
        ) : (
          <div>
            {domainNames.length > 0 && (
              <div ref={resultsRef} className='border border-gray-300 rounded-md p-5'>
                <h3 className="text-gray-700 dark:text-gray-300">Generated Domain Names:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {domainNames.map((name, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{name}</li>
                  ))}
                </ul>
                <div className="mt-5 flex space-x-4">
                  <button
                    className="text-white font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-2 rounded-full bt-gradient hover:opacity-80"
                    onClick={handleShare}
                  title='Share'>
                    Share
                  </button>
                  <button
                    className="text-white font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-2 rounded-full bt-gradient hover:opacity-80"
                    onClick={handleDownload}
                  title='Download'>
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
