import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCopyIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from 'react-icons/fa'; // Import download and share icons from react-icons
import { validateInput } from '@/utils/validateInput';

export function BusinessSloganGenerator(){
  const [businessName, setBusinessName] = useState('');
  const [whatItDoes, setWhatItDoes] = useState('');
  const [numberOfSlogans, setNumberOfSlogans] = useState(1);
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [slogans, setSlogans] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateSlogans = async () => {
    setIsLoading(true);
    setSlogans([]);
    if (!businessName || !whatItDoes || !numberOfSlogans || !language) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }
    if (
      !validateInput(businessName)||
      !validateInput(whatItDoes)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/slogan?clerkId=${userId}`, {
        businessName,
        whatItDoes,
        numberOfSlogans,
        language
      });
      if (res.status === 200) {
        setSlogans(res.data.slogan);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySlogan = (slogan:any) => {
    try {
      navigator.clipboard.writeText(slogan);
      toast.success('Slogan copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy slogan');
    }
  };

  const handleDownloadSlogans = () => {
    const blob = new Blob([slogans.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_slogans.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareSlogans = async () => {
    const slogansText = slogans.join("\n");
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared Generated Slogans",
          text: slogansText
        });
        console.log("Successfully shared.");
        toast.success("Slogans shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Failed to share slogans.");
      }
    } else {
      toast.error("Sharing is not supported on this browser.");
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
  

  useEffect(() => {
    if (!isLoading && slogans.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, slogans]);

  useEffect(() => {
    setSlogans([]);
  }, [businessName, whatItDoes, numberOfSlogans, language]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col">
      <div className="mb-1">
      <label className="block text-[var(--primary-text-color)] ">Company Name</label>
        <input
          type="text"
          placeholder="Enter Company name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4 "
        />
        </div>
        <div className="mb-1">
        <label className="block text-[var(--primary-text-color)] ">About Company</label>
        <textarea
          placeholder="Describe what the business does"
          value={whatItDoes}
          onChange={(e) => setWhatItDoes(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        />
        </div>
        <div className="mb-1">
      <label className="block text-[var(--primary-text-color)] ">Output Count</label>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Number of slogans"
          value={numberOfSlogans}
          onChange={(e) => setNumberOfSlogans(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        />
        </div>
        <div className="mb-1">
      <label className="block text-[var(--primary-text-color)] ">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4 "
        >
          <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Hindi">Hindi</option>
            <option value="Arabic">Arabic</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Bengali">Bengali</option>
            <option value="Russian">Russian</option>
            <option value="Japanese">Japanese</option>
            <option value="Lahnda">Lahnda</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Javanese">Javanese</option>
            <option value="Korean">Korean</option>
            <option value="Telugu">Telugu</option>
            <option value="Marathi">Marathi</option>
            <option value="Tamil">Tamil</option>
            <option value="Turkish">Turkish</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Italian">Italian</option>
            <option value="Urdu">Urdu</option>
            <option value="Persian">Persian</option>
            <option value="Malay">Malay</option>
            <option value="Thai">Thai</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Kannada">Kannada</option>
            <option value="Polish">Polish</option>
            <option value="Ukrainian">Ukrainian</option>
            <option value="Romanian">Romanian</option>
          {/* Add more language options as needed */}
        </select>
        </div>
        <p className="text-base text-gray-400 mt-2 mb-5">
        👉 Try a few combinations to generate the best result for your needs.
        </p>
        <button
          onClick={handleGenerateSlogans}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? "Generating..." : 'Generate'}
        </button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {slogans.length > 0 && (
        <div className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-[var(--primary-text-color)]">
          <div className='flex justify-between mb-3 items-center'>
          <h3 className="text-xl font-semibold">Generated Slogans</h3>
          <div className="flex justify-end  space-x-4">
            <button
              onClick={handleDownloadSlogans}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
            title='Download'>
              <FaDownload className="text-lg" />
              
            </button>
            <button
              onClick={handleShareSlogans}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
            title='Share'>
              <FaShareAlt className="text-lg" />
             
            </button>
          </div>
          </div>
          <div className="space-y-4">
            {slogans.map((slogan, index) => (
              <div key={index} className="border border-[var(--primary-text-color)] rounded-md p-4  relative">
                <pre className="whitespace-pre-wrap">{slogan}</pre>
                <button
                  onClick={() => handleCopySlogan(slogan)}
                  className="absolute top-2 right-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
                title='Copy'>
                  <ClipboardCopyIcon className="inline-block w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
}
