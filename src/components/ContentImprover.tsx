import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard, Share2, Download } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { saveAs } from 'file-saver';
import { validateInput } from '@/utils/validateInput';

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

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'bn', label: 'Bengali' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'jw', label: 'Javanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'te', label: 'Telugu' },
  { value: 'mr', label: 'Marathi' },
  { value: 'ta', label: 'Tamil' },
  { value: 'tr', label: 'Turkish' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'it', label: 'Italian' },
  { value: 'ur', label: 'Urdu' },
  { value: 'fa', label: 'Persian' },
  { value: 'ms', label: 'Malay' },
  { value: 'th', label: 'Thai' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'kn', label: 'Kannada' },
  { value: 'pl', label: 'Polish' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'ro', label: 'Romanian' },
  { value: 'la', label: 'Lahnda' }
  // Add more languages as needed
];

export function ContentImprover() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('');
  const [output, setOutput] = useState(3); // Default number of outputs
  const [improvedContents, setImprovedContents] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleImprove = async () => {
    if (
      !validateInput(content)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setImprovedContents([]);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      const response = await axios.post(`${BASE_URL}/response/improve?clerkId=${userId}`, {
        content,
        tone,
        language,
        output,
      });
  
      if (response.status === 200) {
        const improvedContentArray = response.data.data.improvedContent.split("\n\n");
        setImprovedContents(improvedContentArray);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Improved content copied to clipboard!');
  };

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Improved Content',
          text,
        });
        toast.success('Content shared successfully!');
      } catch (error) {
        console.error('Error sharing content:', error);
        toast.error('Error sharing content. Please try again later.');
      }
    } else {
      toast.error('Share API not supported in this browser.');
    }
  };

  const handleDownload = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'improved-content.txt');
    toast.success('Content downloaded successfully!');
  };

  const handleInputChange = () => {
    setImprovedContents([]);
    setButtonText('Improve');
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
    if (!isLoading && improvedContents.length > 0) {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, improvedContents]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Content</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); handleInputChange(); }}
          placeholder="Enter your content here..."
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500   p-3 mb-4 h-40"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Tone</label>
        <select
          value={tone}
          onChange={(e) => { setTone(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500   p-3 mb-4"
        >
          <option value="">Select Tone</option>
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        >
          <option value="">Select Language</option>
          {languages.map((langOption) => (
            <option key={langOption.value} value={langOption.value}>{langOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Number of Outputs</label>
        <input
          type="number"
          value={output}
          onChange={(e) => { setOutput(parseInt(e.target.value)); handleInputChange(); }}
          min={1}
          max={10} // Adjust max number of outputs as needed
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleImprove : handleImprove}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' :(improvedContents.length>0?"Regenerate":"Generate") }
        </button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {improvedContents.length > 0 && (
        <div ref={resultsRef} className="mt-6">
          <h2 className="text-2xl text-[var(--primary-text-color)] mb-4 underline">Improved Content:</h2>
          {improvedContents.map((content, index) => (
            <div key={index} className="border border-[var(--primary-text-color)] rounded-md mb-4">
              <div className="border p-4 rounded-lg relative">
                <p className="text-[var(--primary-text-color)] whitespace-pre-line mt-5 justify-center">{content}</p>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={() => handleCopy(content)}
                  title='Copy'>
                    <Clipboard className="w-5 h-5" />
                  </button>
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={() => handleShare(content)}
                  title='Share'>
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={() => handleDownload(content)}
                  title='Download'>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
