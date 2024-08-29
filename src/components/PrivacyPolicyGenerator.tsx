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
          <option value="Afrikaans">Afrikaans</option>
          <option value="Albanian">Albanian</option>
          <option value="Amharic">Amharic</option>
          <option value="Arabic">Arabic</option>
          <option value="Armenian">Armenian</option>
          <option value="Azerbaijani">Azerbaijani</option>
          <option value="Basque">Basque</option>
          <option value="Belarusian">Belarusian</option>
          <option value="Bengali">Bengali</option>
          <option value="Bosnian">Bosnian</option>
          <option value="Bulgarian">Bulgarian</option>
          <option value="Catalan">Catalan</option>
          <option value="Cebuano">Cebuano</option>
          <option value="Chichewa">Chichewa</option>
          <option value="Chinese (Simplified)">Chinese (Simplified)</option>
          <option value="Chinese (Traditional)">Chinese (Traditional)</option>
          <option value="Corsican">Corsican</option>
          <option value="Croatian">Croatian</option>
          <option value="Czech">Czech</option>
          <option value="Danish">Danish</option>
          <option value="Dutch">Dutch</option>
          <option value="English">English</option>
          <option value="Esperanto">Esperanto</option>
          <option value="Estonian">Estonian</option>
          <option value="Filipino">Filipino</option>
          <option value="Finnish">Finnish</option>
          <option value="French">French</option>
          <option value="Frisian">Frisian</option>
          <option value="Galician">Galician</option>
          <option value="Georgian">Georgian</option>
          <option value="German">German</option>
          <option value="Greek">Greek</option>
          <option value="Gujarati">Gujarati</option>
          <option value="Haitian Creole">Haitian Creole</option>
          <option value="Hausa">Hausa</option>
          <option value="Hawaiian">Hawaiian</option>
          <option value="Hebrew">Hebrew</option>
          <option value="Hindi">Hindi</option>
          <option value="Hmong">Hmong</option>
          <option value="Hungarian">Hungarian</option>
          <option value="Icelandic">Icelandic</option>
          <option value="Igbo">Igbo</option>
          <option value="Indonesian">Indonesian</option>
          <option value="Irish">Irish</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Javanese">Javanese</option>
          <option value="Kannada">Kannada</option>
          <option value="Kazakh">Kazakh</option>
          <option value="Khmer">Khmer</option>
          <option value="Kinyarwanda">Kinyarwanda</option>
          <option value="Korean">Korean</option>
          <option value="Kurdish (Kurmanji)">Kurdish (Kurmanji)</option>
          <option value="Kyrgyz">Kyrgyz</option>
          <option value="Lao">Lao</option>
          <option value="Latin">Latin</option>
          <option value="Latvian">Latvian</option>
          <option value="Lithuanian">Lithuanian</option>
          <option value="Luxembourgish">Luxembourgish</option>
          <option value="Macedonian">Macedonian</option>
          <option value="Malagasy">Malagasy</option>
          <option value="Malay">Malay</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Maltese">Maltese</option>
          <option value="Maori">Maori</option>
          <option value="Marathi">Marathi</option>
          <option value="Mongolian">Mongolian</option>
          <option value="Myanmar (Burmese)">Myanmar (Burmese)</option>
          <option value="Nepali">Nepali</option>
          <option value="Norwegian">Norwegian</option>
          <option value="Odia (Oriya)">Odia (Oriya)</option>
          <option value="Pashto">Pashto</option>
          <option value="Persian">Persian</option>
          <option value="Polish">Polish</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Romanian">Romanian</option>
          <option value="Russian">Russian</option>
          <option value="Samoan">Samoan</option>
          <option value="Scots Gaelic">Scots Gaelic</option>
          <option value="Serbian">Serbian</option>
          <option value="Sesotho">Sesotho</option>
          <option value="Shona">Shona</option>
          <option value="Sindhi">Sindhi</option>
          <option value="Sinhala">Sinhala</option>
          <option value="Slovak">Slovak</option>
          <option value="Slovenian">Slovenian</option>
          <option value="Somali">Somali</option>
          <option value="Spanish">Spanish</option>
          <option value="Sundanese">Sundanese</option>
          <option value="Swahili">Swahili</option>
          <option value="Swedish">Swedish</option>
          <option value="Tajik">Tajik</option>
          <option value="Tamil">Tamil</option>
          <option value="Tatar">Tatar</option>
          <option value="Telugu">Telugu</option>
          <option value="Thai">Thai</option>
          <option value="Turkish">Turkish</option>
          <option value="Turkmen">Turkmen</option>
          <option value="Ukrainian">Ukrainian</option>
          <option value="Urdu">Urdu</option>
          <option value="Uyghur">Uyghur</option>
          <option value="Uzbek">Uzbek</option>
          <option value="Vietnamese">Vietnamese</option>
          <option value="Welsh">Welsh</option>
          <option value="Xhosa">Xhosa</option>
          <option value="Yiddish">Yiddish</option>
          <option value="Yoruba">Yoruba</option>
          <option value="Zulu">Zulu</option>
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
