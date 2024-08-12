import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { validateInput } from '@/utils/validateInput';

export function GeneratePrivacyPolicy() {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [language, setLanguage] = useState('English'); // default language
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (
      !validateInput(companyName)||
      !validateInput(address)||
      !validateInput(websiteURL)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setPrivacyPolicy('');

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generatePolicy?clerkId=${userId}`, {
        companyName,
        address,
        websiteURL,
        language,
      });
      console.log(response)
      if (response.status === 200) {
        setPrivacyPolicy(response.data.data.improvedContent.data.privacyPolicy);
      } else {
        toast.error('Error generating privacy policy. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating privacy policy:', error);
      toast.error('Error generating privacy policy. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(privacyPolicy);
    toast.success('Privacy Policy copied to clipboard!');
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  const handleInputChange = () => {
    setPrivacyPolicy('');
    setButtonText('Generate');
  };

  useEffect(() => {
    if (!isLoading && privacyPolicy) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, privacyPolicy]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => { setCompanyName(e.target.value); handleInputChange(); }}
          placeholder="Enter your company name"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => { setAddress(e.target.value); handleInputChange(); }}
          placeholder="Enter your company address"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Website URL</label>
        <input
          type="text"
          value={websiteURL}
          onChange={(e) => { setWebsiteURL(e.target.value); handleInputChange(); }}
          placeholder="Enter your website URL"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  p-3 mb-4"
        >
<option value="English">English</option>
<option value="Spanish">Spanish</option>
<option value="French">French</option>
<option value="German">German</option>
<option value="Chinese">Chinese</option>
<option value="Japanese">Japanese</option>
<option value="Korean">Korean</option>
<option value="Portuguese">Portuguese</option>
<option value="Russian">Russian</option>
<option value="Arabic">Arabic</option>
<option value="Hindi">Hindi</option>
<option value="Bengali">Bengali</option>
<option value="Gujarati">Gujarati</option>
<option value="Kannada">Kannada</option>
<option value="Malayalam">Malayalam</option>
<option value="Marathi">Marathi</option>
<option value="Nepali">Nepali</option>
<option value="Odia">Odia</option>
<option value="Punjabi">Punjabi</option>
<option value="Tamil">Tamil</option>
<option value="Telugu">Telugu</option>
<option value="Assamese">Assamese</option>
<option value="Bihari">Bihari</option>
<option value="Kashmiri">Kashmiri</option>
<option value="Konkani">Konkani</option>
<option value="Maithili">Maithili</option>
<option value="Manipuri">Manipuri</option>
<option value="Santali">Santali</option>
<option value="Sindhi">Sindhi</option>
<option value="Urdu">Urdu</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
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
          privacyPolicy && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-[var(--primary-text-color)] mb-4 underline">Generated Privacy Policy:</h2>
                <pre className="text-[var(--primary-text-color)] whitespace-pre-wrap">{privacyPolicy}</pre>
                <button
                  className="absolute top-2 right-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
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
