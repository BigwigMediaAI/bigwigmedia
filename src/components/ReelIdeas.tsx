import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function ReelIdeasGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedReelIdeas, setgeneratedReelIdeas] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setgeneratedReelIdeas([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateReelIdeas?clerkId=${userId}`, {
        topic,
        tone,
        language,
        outputCount,
      });

      if (response.status === 200) {
        console.log(response.data);
        setgeneratedReelIdeas(response.data);
      } else {
        toast.error('Error generating reel script. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating reel script:', error);
      toast.error('Error generating reel script. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedReelIdeas.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedReelIdeas]);

  const tones = [
    { value: '', label: 'Select tone' },
    { value: 'engaging', label: 'Engaging' },
    { value: 'informative', label: 'Informative' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
  ];

  const languages = [
    { value: '', label: 'Select language' },
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Mandarin', label: 'Mandarin' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Punjabi', label: 'Punjabi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Kannada', label: 'Kannada' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Odia', label: 'Odia' },
    { value: 'Assamese', label: 'Assamese' },
    { value: 'Urdu', label: 'Urdu' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'Persian', label: 'Persian' },
    { value: 'Swahili', label: 'Swahili' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Vietnamese', label: 'Vietnamese' }
  ];

  const outputCounts = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  const handleCopy = (titleContent: string) => {
    navigator.clipboard.writeText(titleContent);
    toast.success('Title content copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedReelIdeas.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "youtube_titles.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Youtube Titles',
      text: generatedReelIdeas.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing youtube titles:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#262626]">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="E.g., Travel Tips"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedReelIdeas.length > 0 ? "Regenerate" : 'Generate')}
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
            </div>
        ) : (
            generatedReelIdeas.length > 0 && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6 p-5 relative">
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 ">Generated Reel Script</h1>
                <div className="flex gap-2">
                    <button
                    onClick={handleShare}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    title="Share"
                    >
                    <Share2 />
                    </button>
                    <button
                    onClick={handleDownload}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    title="Download"
                    >
                    <Download />
                    </button>
                </div>
                </div>
                <div className="flex flex-col gap-4 max-h-[600px] overflow-auto">
              {generatedReelIdeas.map((post, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4 relative ">
            <div className="flex justify-between items-center mb-2">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleCopy(post)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  title="Copy"
                >
                  <Copy />
                </button>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post}</p>
          </div>
        ))}
        </div>
                
            </div>
            )
        )}
      </div>

    </div>
  );
}
