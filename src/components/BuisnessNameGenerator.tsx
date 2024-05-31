import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

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



  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/response/compnay?clerkId=${userId}`, {
        companyType,
        companyMission,
        targetAudience,
        namingStyle,
        competitor,
        languagePreference,
      });
      console.log(response.data.data.data.data.companyNames)
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Type</label>
        <input
          type="text"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          placeholder="Enter the company type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Company Mission</label>
        <input
          type="text"
          value={companyMission}
          onChange={(e) => setCompanyMission(e.target.value)}
          placeholder="Enter the company mission"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Target Audience</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="Enter the target audience"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Naming Style</label>
        <input
          type="text"
          value={namingStyle}
          onChange={(e) => setNamingStyle(e.target.value)}
          placeholder="Enter the naming style"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Competitor</label>
        <input
          type="text"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
          placeholder="Enter competitor names"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language Preference</label>
        <input
          type="text"
          value={languagePreference}
          onChange={(e) => setLanguagePreference(e.target.value)}
          placeholder="Enter language preferences"
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
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Generating business names. Please wait...</p>
          </div>
        ) : (
          <div>
            {businessNames.length > 0 && (
              <div className='border border-gray-300 p-6 rounded-md'>
                <h3 className="text-gray-700 dark:text-gray-300">Generated Business Names:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {businessNames.map((name, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}