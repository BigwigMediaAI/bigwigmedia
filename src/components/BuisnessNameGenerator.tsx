import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2,Share2,Download } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';

export function GenerateBusinessNames() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyType, setCompanyType] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [namingStyle, setNamingStyle] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [languagePreference, setLanguagePreference] = useState('');
  const [businessNames, setBusinessNames] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (
      !validateInput(companyType)||
      !validateInput(companyMission)||
      !validateInput(targetAudience)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setBusinessNames([]);
    
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/companyName?clerkId=${userId}`, {
        companyType,
        companyMission,
        targetAudience,
        namingStyle,
        competitor,
        languagePreference,
      });

      if (response.status === 200) {
        setBusinessNames(response.data.data.data.data.companyNames);
      } else {
        toast.error('Error generating business names. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating business names:', error);
      toast.error('Error generating business names. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && businessNames.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, businessNames]);

  const namingStyles = [
    { value: '', label: 'Select naming style' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'fun', label: 'Fun' },
    { value: 'descriptive', label: 'Descriptive' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'inventive', label: 'Inventive' },
    { value: 'elegant', label: 'Elegant' },
  ];

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([businessNames.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "business_names.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Generated Business Names',
      text: businessNames.join("\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing business names:', err);
    }
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Type</label>
        <input
          type="text"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          placeholder="E.g., Tech Startup, Fashion Brand"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Mission</label>
        <input
          type="text"
          value={companyMission}
          onChange={(e) => setCompanyMission(e.target.value)}
          placeholder="E.g., Innovate and inspire through technology"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Target Audience</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="E.g., Young professionals, Fitness enthusiasts"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Naming Style</label>
        <select
          value={namingStyle}
          onChange={(e) => setNamingStyle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        >
          {namingStyles.map((style) => (
            <option key={style.value} value={style.value}>{style.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Competitor</label>
        <input
          type="text"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
          placeholder="E.g., Apple, Nike, Google"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language Preference</label>
        <input
          type="text"
          value={languagePreference}
          onChange={(e) => setLanguagePreference(e.target.value)}
          placeholder="E.g., English, Spanish, Mandarin"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
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
          <div ref={loaderRef} className="w-full h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Generating business names. Please wait...</p>
          </div>
        ) : (
          businessNames.length > 0 && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Business Names:</h2>
                <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside">
                  {businessNames.map((name, index) => (
                    <li key={index} className="mb-2 list-none">{name}</li>
                  ))}
                </ul>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleShare}
                    className="text-white bg-blue-500 hover:bg-blue-700 text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-6 justify-center items-center gap-2 flex-shrink-0 rounded-full"
                  title='Share'>
                    <Share2/>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-white bg-green-500 hover:bg-green-700 text-center font-outfit md:text-lg font-semibold flex relative text-base py-2 px-6 justify-center items-center gap-2 flex-shrink-0 rounded-full"
                  title='Download'>
                    <Download/>
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
