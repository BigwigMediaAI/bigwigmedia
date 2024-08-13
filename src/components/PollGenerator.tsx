import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { Loader2, Clipboard, Share, Download } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { saveAs } from 'file-saver';
import { validateInput } from '@/utils/validateInput';

export function PollGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Initialize with four empty options
  const [generatedPoll, setGeneratedPoll] = useState('');
  const [buttonText, setButtonText] = useState('Generate Poll');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!generatedPoll) {
      setButtonText('Generate Poll');
    } else {
      setButtonText('Re-Generate Poll');
    }
  }, [generatedPoll]);

  const handleGeneratePoll = async () => {
    if (!validateInput(question)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
  
    for (const option of options) {
      if (!validateInput(option)) {
        toast.error('One or more of your options contain prohibited words. Please remove them and try again.');
        return;
      }
    }
  
    setIsLoading(true);
    setGeneratedPoll('');
  
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      const response = await axios.post(`${BASE_URL}/response/generatePoll?clerkId=${userId}`, {
        question,
        options,
      });
  
      if (response.status === 200) {
        setGeneratedPoll(response.data.data.poll);
      } else {
        toast.error('Error generating poll. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating poll:', error);
      toast.error('Error generating poll. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPoll);
    toast.success('Generated poll copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated Poll',
        text: generatedPoll
      }).then(() => {
        toast.success('Poll shared successfully!');
      }).catch((error) => {
        console.error('Error sharing poll:', error);
        toast.error('Error sharing poll. Please try again later.');
      });
    } else {
      toast.error('Web Share API is not supported in your browser.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPoll], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'generated_poll.txt');
    toast.success('Poll downloaded successfully!');
  };

  const handleInputChange = () => {
    setGeneratedPoll('');
    setButtonText('Generate Poll');
  };

  const handleOptionChange = (index:any, value:any) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    handleInputChange();
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  useEffect(() => {
    if (!isLoading && generatedPoll) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedPoll]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Question</label>
        <textarea
          value={question}
          onChange={(e) => { setQuestion(e.target.value); handleInputChange(); }}
          placeholder="Enter your poll question here..."
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4 h-20"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Options</label>
        {options.map((option, index) => (
          <input
            key={index}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-2"
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGeneratePoll}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : buttonText}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          generatedPoll && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-[var(--primary-text-color)] mb-4 underline">Generated Poll:</h2>
                <p className="text-[var(--primary-text-color)] whitespace-pre-line">{generatedPoll}</p>
                <button
                  className="absolute top-2 right-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                  onClick={handleCopy}
                title='Copy'>
                  <Clipboard className="w-5 h-5" />
                </button>
                <button
                  className="absolute top-2 right-12 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                  onClick={handleShare}
                title='Share'>
                  <FaShareAlt className="w-5 h-5" />
                </button>
                <button
                  className="absolute top-2 right-20 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                  onClick={handleDownload}
                title='Download'>
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
