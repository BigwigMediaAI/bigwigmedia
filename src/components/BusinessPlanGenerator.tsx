import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, ClipboardCopy, Share2, Download, Copy } from 'lucide-react'; // Assuming 'Download' and 'Share' icons are available
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from 'react-icons/fa'; 
import { validateInput } from '@/utils/validateInput';

export function BusinessPlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [language, setLanguage] = useState('English'); // Default language
  const [outputCount, setOutputCount] = useState(1);
  const [businessPlan, setBusinessPlan] = useState([]);
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!businessPlan) {
      setButtonText('Generate');
    } else {
      setButtonText('Regenerate');
    }
  }, [businessPlan]);

  const handleGenerate = async () => {
    if (
      !validateInput(businessType) ||
      !validateInput(industry) ||
      !validateInput(targetMarket)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setBusinessPlan([]);
  
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: "center" });
    }, 100);
  
    try {
      const response = await axios.post(`${BASE_URL}/response/businessPlan?clerkId=${userId}`, {
        businessType,
        industry,
        targetMarket,
        language,
        outputCount, // Include outputCount in the request
      });
  
      if (response.status === 200) {
        setBusinessPlan(response.data.businessPlan);
      } else {
        toast.error('Error generating business plan. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating business plan:', error);
      toast.error('Error generating business plan. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCopy = (titleContent: string) => {
    navigator.clipboard.writeText(titleContent);
    toast.success(' content copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([businessPlan.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "business_plan.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: ' Business Plan',
      text: businessPlan.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing business plan:', err);
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

  const handleInputChange = () => {
    setBusinessPlan([]);
    setButtonText('Generate');
  };

  useEffect(() => {
    if (!isLoading && businessPlan) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, businessPlan]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Business Type</label>
        <input
          type="text"
          value={businessType}
          onChange={(e) => { setBusinessType(e.target.value); handleInputChange(); }}
          placeholder="E.g., Online Retail Store, Restaurant, Consulting Firm"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Industry</label>
        <input
          type="text"
          value={industry}
          onChange={(e) => { setIndustry(e.target.value); handleInputChange(); }}
          placeholder="E.g., E-commerce, Food and Beverage, Professional Services"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Target Market</label>
        <input
          type="text"
          value={targetMarket}
          onChange={(e) => { setTargetMarket(e.target.value); handleInputChange(); }}
          placeholder="E.g., Young Adults, Small Businesses, Health-Conscious Consumers"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => { setLanguage(e.target.value); handleInputChange(); }}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
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
        </select>
      </div>
      <div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">Number of Outputs</label>
  <select
    value={outputCount}
    onChange={(e) => setOutputCount(parseInt(e.target.value))}
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
  >
    {[...Array(5).keys()].map((_, index) => (
      <option key={index} value={index + 1}>
        {index + 1}
      </option>
    ))}
  </select>
</div>


      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={buttonText === 'Generate' ? handleGenerate : handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (businessPlan.length>0?"Regenerate":"Generate")}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
        ) : (
            businessPlan.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-[var(--primary-text-color)] ">Generated Business Plan</h1>
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
              {businessPlan.map((post, index) => (
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
