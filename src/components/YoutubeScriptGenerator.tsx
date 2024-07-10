import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCopyIcon, DownloadIcon, ShareIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function YouTubeScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [language, setLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateScript = async () => {
    setIsLoading(true);
    if (!topic || !tone || !length || !language) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/youtubescript?clerkId=${userId}`, {
        topic,
        tone,
        length,
        language
      });
      if (res.status === 200) {
        setScript(res.data.script);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    try {
      navigator.clipboard.writeText(script);
      toast.success('Script copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy script');
    }
  };

  const handleShareScript = () => {
    if (navigator.share) {
      navigator.share({
        title: 'YouTube Script',
        text: script
      }).then(() => {
        toast.success('Script shared successfully');
      }).catch((error) => {
        toast.error('Failed to share script');
      });
    } else {
      toast.error('Share feature is not supported in this browser');
    }
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "YouTubeScript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Script downloaded');
  };

  useEffect(() => {
    if (!isLoading && script.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, script]);

  useEffect(() => {
    setScript('');
  }, [topic, tone, length, language]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter topic (e.g., How to bake a cake)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        />
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        >
          <option value="">Select tone</option>
          <option value="Informative and Friendly">Informative and Friendly</option>
          <option value="Professional and Authoritative">Professional and Authoritative</option>
          <option value="Casual and Conversational">Casual and Conversational</option>
          <option value="Energetic and Exciting">Energetic and Exciting</option>
          <option value="Serious and Formal">Serious and Formal</option>
        </select>
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        >
          <option value="">Select length</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 rounded-md p-3 dark:text-gray-200"
        >
          <option value="">Select language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
          <option value="Hindi">Hindi</option>
          <option value="Bengali">Bengali</option>
          <option value="Telugu">Telugu</option>
          <option value="Marathi">Marathi</option>
          <option value="Tamil">Tamil</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Kannada">Kannada</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Punjabi">Punjabi</option>
        </select>
        <p className="text-base text-gray-400 mt-2">
        👉 Try a few combinations to generate the best script for your needs.
        </p>
        <button
          onClick={handleGenerateScript}
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
      {script && (
        <div ref={resultsRef} className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300">
          <h3 className="text-xl font-semibold mb-4">Generated Script</h3>
          <div className="border border-gray-300 rounded-md p-4 dark:text-gray-200 relative overflow-x-auto max-w-full">
            <pre className="whitespace-pre-wrap">{script}</pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleCopyScript}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Copy'>
                <ClipboardCopyIcon className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadScript}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Download' >
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleShareScript}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Share'>
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
