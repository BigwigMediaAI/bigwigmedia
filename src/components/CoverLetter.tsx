import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CopyIcon, Share2, Download } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons"; // Ensure the BASE_URL is correct
import { useAuth } from "@clerk/clerk-react";

export function CoverLetterGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [highlights, setHighlights] = useState('');
  const [language, setLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(1);
  const [coverLetters, setCoverLetters] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setCoverLetters([]); // Clear previous cover letters
    if (!jobDescription || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateCoverLetter?clerkId=${userId}`, {
        jobDescription,
        userDetails: {
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress
        },
        highlights,
        language,
        outputCount
      });
        console.log(response.data)
      if (response.status === 200) {
        setCoverLetters(response.data);
      } else {
        toast.error('Error generating cover letter. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Error generating cover letter. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (coverLetter: string) => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast.success('Cover letter copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy cover letter');
    }
  };

  useEffect(() => {
    if (!isLoading && coverLetters.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, coverLetters]);

  const handleShare = () => {
    const textToShare = coverLetters.join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'Generated Domain Names',
        text: textToShare,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(textToShare).then(() => {
        toast.success('Domain names copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy domain names to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const textToDownload = coverLetters.join('\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-names.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Job Description</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description (e.g., We are looking for a skilled software developer with experience in Node.js and React)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter your email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Phone</label>
        <input
          type="text"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Your Address (optional)</label>
        <input
          type="text"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          placeholder="Enter your address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Highlights</label>
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="Enter highlights (e.g., Experience with large-scale applications, strong problem-solving skills, and a passion for technology)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
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

        </select>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Number of Outputs</label>
        <input
          type="number"
          value={outputCount}
          onChange={(e) => setOutputCount(parseInt(e.target.value))}
          placeholder="Enter number of outputs (e.g., 1)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
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
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Generating cover letter. Please wait...</p>
          </div>
        ) : (
          <div>
            {coverLetters.length > 0 && coverLetters.map((letter, index) => (
              <div key={index} ref={resultsRef} className='border border-gray-300 rounded-md p-5 relative mb-5'>
                <h3 className="text-gray-700 dark:text-gray-300">Generated Cover Letter {index + 1}:</h3>
                <div className="mt-2 dark:bg-gray-700 p-4 rounded-md">
                  {letter.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="text-gray-700 dark:text-gray-300">{line}</p>
                  ))}
                </div>
                <div className='flex justify-center items-center mt-4'>
                <button
                  className="absolute top-2 right-2 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:dark:bg-gray-800 dark:text-gray-200"
                  onClick={() => handleCopy(letter)}
                title='Copy'>
                  <CopyIcon className="h-5 w-5" />
                </button>
                <button
                    className="text-white font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-2 rounded-full bt-gradient hover:opacity-80 mr-3"
                    onClick={handleShare}
                  title='Share'>
                   <Share2/>
                  </button>
                  <button
                    className="text-white font-outfit md:text-lg font-semibold flex relative text-base py-2 px-4 justify-center items-center gap-2 rounded-full bt-gradient hover:opacity-80"
                    onClick={handleDownload}
                  title='Download'>
                    <Download/>
                  </button>
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
