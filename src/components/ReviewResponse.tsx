import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';

export function ReviewResponse() {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewText, setreviewText] = useState('');
  const [responseTone, setresponseTone] = useState('');
  const [language, setLanguage] = useState('');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedReviewResponse, setgeneratedReviewResponse] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (
      !validateInput(reviewText)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setgeneratedReviewResponse([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateReviewResponse?clerkId=${userId}`, {
        reviewText,
        responseTone,
        language,
        outputCount,
      });

      if (response.status === 200) {
        console.log(response.data);
        setgeneratedReviewResponse(response.data);
      } else {
        toast.error('Error generating review response. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating review response:', error);
      toast.error('Error generating review response. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedReviewResponse.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedReviewResponse]);

  const responseTones = [
    { value: '', label: 'Select responseTone' },
    { value: 'engaging', label: 'Engaging' },
    { value: 'informative', label: 'Informative' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'polite', label: 'Polite' },
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
    const file = new Blob([generatedReviewResponse.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "review_response.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Review response',
      text: generatedReviewResponse.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing review response:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Review Text</label>
        <input
          value={reviewText}
          onChange={(e) => setreviewText(e.target.value)}
          placeholder="E.g, The product was fantastic and exceeded my expectations!"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Response Tone</label>
        <select
          value={responseTone}
          onChange={(e) => setresponseTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {responseTones.map((responseToneOption) => (
            <option key={responseToneOption.value} value={responseToneOption.value}>{responseToneOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedReviewResponse.length > 0 ? "Regenerate" : 'Generate')}
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
        ) : (
            generatedReviewResponse.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-[var(--primary-text-color)] ">Generated Output</h1>
                <div className="flex gap-2">
                    <button
                    onClick={handleShare}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    title="Share"
                    >
                    <Share2 />
                    </button>
                    <button
                    onClick={handleDownload}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    title="Download"
                    >
                    <Download />
                    </button>
                </div>
                </div>
                <div className="flex flex-col gap-4 max-h-[600px] overflow-auto">
              {generatedReviewResponse.map((post, index) => (
          <div key={index} className="border border-[var(--primary-text-color)] p-4 rounded-lg mb-4 relative ">
            <div className="flex justify-between items-center mb-2">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleCopy(post)}
                  className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                  title="Copy"
                >
                  <Copy />
                </button>
              </div>
            </div>
            <p className="text-[var(--primary-text-color)] whitespace-pre-wrap">{post}</p>
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