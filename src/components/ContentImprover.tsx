import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

const tones = [
  { value: 'formal', label: 'Formal' },
  { value: 'informal', label: 'Informal' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'informative', label: 'Informative' },
];

export function ContentImprover() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('');
  const [improvedContent, setImprovedContent] = useState('');
  const [buttonText, setButtonText] = useState('Improve');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!improvedContent) {
      setButtonText('Improve');
    } else {
      setButtonText('Re-Improve');
    }
  }, [improvedContent]);

  const handleImprove = async () => {
    setIsLoading(true);
    setImprovedContent('');

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/improve?clerkId=${userId}`, {
        content,
        tone
      });

      if (response.status === 200) {
        setImprovedContent(response.data.data.improvedContent);
      } else {
        toast.error('Error improving content. Please try again later.');
      }
    } catch (error) {
      console.error('Error improving content:', error);
      toast.error('Error improving content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedContent);
    toast.success('Improved content copied to clipboard!');
  };

  const handleInputChange = () => {
    setImprovedContent('');
    setButtonText('Improve');
  };

  useEffect(() => {
    if (!isLoading && improvedContent) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, improvedContent]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Content</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); handleInputChange(); }}
          placeholder="Enter your content here..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4 h-40"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Tone</label>
        <select
          value={tone}
          onChange={(e) => { setTone(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        >
          <option value="">Select Tone</option>
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={buttonText === 'Improve' ? handleImprove : handleImprove}
          disabled={isLoading}
        >
          {isLoading ? 'Improving...' : buttonText}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          improvedContent && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Improved Content:</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{improvedContent}</p>
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