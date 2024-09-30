import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, Loader2, Share2, Copy } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

export function GenerateDomainNames() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [length, setLength] = useState('');
  const [count, setCount] = useState('');
  const [domainNames, setDomainNames] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleGenerate = async () => {
    if (!validateInput(companyName)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/response/domain?clerkId=${userId}`, {
        companyName,
        companyType,
        length: parseInt(length) || 0,
        count: parseInt(count) || 0,
      });

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
      navigator.clipboard.writeText(textToShare)
        .then(() => toast.success('Domain names copied to clipboard'))
        .catch((error) => {
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

  const handleCopyAll = () => {
    const textToCopy = domainNames.join('\n');
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success('All domain names copied to clipboard'))
      .catch((error) => {
        console.error('Error copying domain names to clipboard:', error);
        toast.error('Failed to copy domain names to clipboard');
      });
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Company Type</label>
        <input
          type="text"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          placeholder="Enter company type (e.g., tech, innovation)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
        />
      </div>

      <div className="mb-5 flex space-x-4">
        <div className="w-1/2">
          <label className="block text-[var(--primary-text-color)]">Select Length</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Max length of domain name (default: 0)"
            className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Number of domain names (default: 0)"
            className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader styleType="cube" />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          <div>
            {domainNames.length > 0 && (
              <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md p-5">
                <div className="flex justify-between">
                  <h3 className="text-[var(--primary-text-color)]">Generated Domain Names:</h3>
                  <div className="flex space-x-4">
                  <button
                        className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                        onClick={() => handleCopyAll()}
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    <button
                      className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                      onClick={handleShare}
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                      onClick={handleDownload}
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <ul className="list-disc pl-5 mt-2">
                  {domainNames.map((name, index) => (
                    <li key={index} className="text-[var(--primary-text-color)] flex justify-between items-center">
                      {name}
                      
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
