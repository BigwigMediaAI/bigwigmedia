import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCopyIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function YouTubeScriptGenerator(){
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateScript = async () => {
    setIsLoading(true);
    if (!topic || !tone || !length) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
      }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/youtubescript?clerkId=${userId}`, {
        topic,
        tone,
        length
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


  useEffect(() => {
    if (!isLoading && script.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [isLoading, script]);

  // Clear the script whenever any content is updated
  useEffect(() => {
    setScript('');
  }, [topic, tone, length]);

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
            <button
              onClick={handleCopyScript}
              className="absolute top-2 right-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            >
              <ClipboardCopyIcon className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};