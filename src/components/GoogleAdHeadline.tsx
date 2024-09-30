import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import CreditLimitModal from './Model3';
import '../App.css'
import BigwigLoader from '@/pages/Loader';

export function GenerateGoogleAdHeadline() {
  const [isLoading, setIsLoading] = useState(false);
  const [serviceName, setserviceName] = useState('');
  const [keywordsAndHighlights, setkeywordsAndHighlights] = useState('');
  const [adPurpose, setAdPurpose] = useState("")
  const [businessType, setBuissnessType] = useState("")
  const [tone, setTone] = useState('informative');
  const [language, setLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedGoogleAdHeadlines, setgeneratedGoogleAdHeadlines] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleGenerate = async () => {
    if (!validateInput(serviceName)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setgeneratedGoogleAdHeadlines([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/generateGoogleAdsHeadliner?clerkId=${userId}`, {
        serviceName,
        keywordsAndHighlights:keywordsAndHighlights.split(','),
        adPurpose,
        businessType,
        tone,
        language,
        outputCount
      });

      if (response.status === 200) {
        console.log(response.data);
        setgeneratedGoogleAdHeadlines(response.data);
      } else {
        toast.error('Error generating google ad headlines. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating google ad headlines:', error);
      toast.error('Error generating google ad headlines. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedGoogleAdHeadlines.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedGoogleAdHeadlines]);

  const tones = [
    { value: 'informative', label: 'Informative' },
    { value: 'professional', label: 'Professional' },
    { value: 'creative', label: 'Creative' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'informal', label: 'Informal' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'sarcastic', label: 'Sarcastic' },
    { value: 'optimistic', label: 'Optimistic' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
  
  ];

  const languages = [
    { value: 'Afrikaans', label: 'Afrikaans' },
{ value: 'Albanian', label: 'Albanian' },
{ value: 'Amharic', label: 'Amharic' },
{ value: 'Arabic', label: 'Arabic' },
{ value: 'Armenian', label: 'Armenian' },
{ value: 'Azerbaijani', label: 'Azerbaijani' },
{ value: 'Basque', label: 'Basque' },
{ value: 'Belarusian', label: 'Belarusian' },
{ value: 'Bengali', label: 'Bengali' },
{ value: 'Bosnian', label: 'Bosnian' },
{ value: 'Bulgarian', label: 'Bulgarian' },
{ value: 'Catalan', label: 'Catalan' },
{ value: 'Cebuano', label: 'Cebuano' },
{ value: 'Chichewa', label: 'Chichewa' },
{ value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
{ value: 'Chinese (Traditional)', label: 'Chinese (Traditional)' },
{ value: 'Corsican', label: 'Corsican' },
{ value: 'Croatian', label: 'Croatian' },
{ value: 'Czech', label: 'Czech' },
{ value: 'Danish', label: 'Danish' },
{ value: 'Dutch', label: 'Dutch' },
{ value: 'English', label: 'English' },
{ value: 'Esperanto', label: 'Esperanto' },
{ value: 'Estonian', label: 'Estonian' },
{ value: 'Filipino', label: 'Filipino' },
{ value: 'Finnish', label: 'Finnish' },
{ value: 'French', label: 'French' },
{ value: 'Frisian', label: 'Frisian' },
{ value: 'Galician', label: 'Galician' },
{ value: 'Georgian', label: 'Georgian' },
{ value: 'German', label: 'German' },
{ value: 'Greek', label: 'Greek' },
{ value: 'Gujarati', label: 'Gujarati' },
{ value: 'Haitian Creole', label: 'Haitian Creole' },
{ value: 'Hausa', label: 'Hausa' },
{ value: 'Hawaiian', label: 'Hawaiian' },
{ value: 'Hebrew', label: 'Hebrew' },
{ value: 'Hindi', label: 'Hindi' },
{ value: 'Hmong', label: 'Hmong' },
{ value: 'Hungarian', label: 'Hungarian' },
{ value: 'Icelandic', label: 'Icelandic' },
{ value: 'Igbo', label: 'Igbo' },
{ value: 'Indonesian', label: 'Indonesian' },
{ value: 'Irish', label: 'Irish' },
{ value: 'Italian', label: 'Italian' },
{ value: 'Japanese', label: 'Japanese' },
{ value: 'Javanese', label: 'Javanese' },
{ value: 'Kannada', label: 'Kannada' },
{ value: 'Kazakh', label: 'Kazakh' },
{ value: 'Khmer', label: 'Khmer' },
{ value: 'Kinyarwanda', label: 'Kinyarwanda' },
{ value: 'Korean', label: 'Korean' },
{ value: 'Kurdish (Kurmanji)', label: 'Kurdish (Kurmanji)' },
{ value: 'Kyrgyz', label: 'Kyrgyz' },
{ value: 'Lao', label: 'Lao' },
{ value: 'Latin', label: 'Latin' },
{ value: 'Latvian', label: 'Latvian' },
{ value: 'Lithuanian', label: 'Lithuanian' },
{ value: 'Luxembourgish', label: 'Luxembourgish' },
{ value: 'Macedonian', label: 'Macedonian' },
{ value: 'Malagasy', label: 'Malagasy' },
{ value: 'Malay', label: 'Malay' },
{ value: 'Malayalam', label: 'Malayalam' },
{ value: 'Maltese', label: 'Maltese' },
{ value: 'Maori', label: 'Maori' },
{ value: 'Marathi', label: 'Marathi' },
{ value: 'Mongolian', label: 'Mongolian' },
{ value: 'Myanmar (Burmese)', label: 'Myanmar (Burmese)' },
{ value: 'Nepali', label: 'Nepali' },
{ value: 'Norwegian', label: 'Norwegian' },
{ value: 'Odia (Oriya)', label: 'Odia (Oriya)' },
{ value: 'Pashto', label: 'Pashto' },
{ value: 'Persian', label: 'Persian' },
{ value: 'Polish', label: 'Polish' },
{ value: 'Portuguese', label: 'Portuguese' },
{ value: 'Punjabi', label: 'Punjabi' },
{ value: 'Romanian', label: 'Romanian' },
{ value: 'Russian', label: 'Russian' },
{ value: 'Samoan', label: 'Samoan' },
{ value: 'Scots Gaelic', label: 'Scots Gaelic' },
{ value: 'Serbian', label: 'Serbian' },
{ value: 'Sesotho', label: 'Sesotho' },
{ value: 'Shona', label: 'Shona' },
{ value: 'Sindhi', label: 'Sindhi' },
{ value: 'Sinhala', label: 'Sinhala' },
{ value: 'Slovak', label: 'Slovak' },
{ value: 'Slovenian', label: 'Slovenian' },
{ value: 'Somali', label: 'Somali' },
{ value: 'Spanish', label: 'Spanish' },
{ value: 'Sundanese', label: 'Sundanese' },
{ value: 'Swahili', label: 'Swahili' },
{ value: 'Swedish', label: 'Swedish' },
{ value: 'Tajik', label: 'Tajik' },
{ value: 'Tamil', label: 'Tamil' },
{ value: 'Tatar', label: 'Tatar' },
{ value: 'Telugu', label: 'Telugu' },
{ value: 'Thai', label: 'Thai' },
{ value: 'Turkish', label: 'Turkish' },
{ value: 'Turkmen', label: 'Turkmen' },
{ value: 'Ukrainian', label: 'Ukrainian' },
{ value: 'Urdu', label: 'Urdu' },
{ value: 'Uyghur', label: 'Uyghur' },
{ value: 'Uzbek', label: 'Uzbek' },
{ value: 'Vietnamese', label: 'Vietnamese' },
{ value: 'Welsh', label: 'Welsh' },
{ value: 'Xhosa', label: 'Xhosa' },
{ value: 'Yiddish', label: 'Yiddish' },
{ value: 'Yoruba', label: 'Yoruba' },
{ value: 'Zulu', label: 'Zulu' }
  ];

  const outputCounts = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  const handleCopy = (caption:any) => {
    navigator.clipboard.writeText(caption);
    toast.success('Post copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedGoogleAdHeadlines.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "google_ad_headlines.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'google ad headlines',
      text: generatedGoogleAdHeadlines.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing google ad headlines:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-md shadow-[var(--teal-color)]">

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">What’s the Service Name?</label>
        <textarea
          value={serviceName}
          onChange={(e) => setserviceName(e.target.value)}
          placeholder=" Enter the service name (e.g., Digital Marketing)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
          rows={4}
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Enter Important Keywords Related To Your Services.</label>
        <textarea
          value={keywordsAndHighlights}
          onChange={(e) => setkeywordsAndHighlights(e.target.value)}
          placeholder="Enter keywords and features (e.g., SEO, Social Media, Growth)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
          rows={4}
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">What’s the Ad For?</label>
        <input
          value={adPurpose}
          onChange={(e) => setAdPurpose(e.target.value)}
          placeholder="Enter the goal of the ad (e.g., Get more sales, Bring traffic)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">What,s your business type</label>
        <input
          value={businessType}
          onChange={(e) => setBuissnessType(e.target.value)}
          placeholder="Enter your business type (e.g., Online Store, Service)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>
              {languageOption.label}
            </option>
          ))}
        </select>
      </div>

      

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>
              {toneOption.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {outputCounts.map((outputOption) => (
            <option key={outputOption.value} value={outputOption.value}>
              {outputOption.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedGoogleAdHeadlines.length > 0 ? "Regenerate" : 'Generate')}
        </button>
        
      </div>

      <div className="mt-5">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader styleType="cube" />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
            generatedGoogleAdHeadlines.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-[var(--primary-text-color)]  ">Generated Google Ad Headline</h1>
                <div className="flex gap-2">
                    <button
                    onClick={handleShare}
                    className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                    title="Share"
                    >
                    <Share2 />
                    </button>
                    <button
                    onClick={handleDownload}
                    className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                    title="Download"
                    >
                    <Download />
                    </button>
                </div>
                </div>
                <div className="flex flex-col gap-4 max-h-[600px] overflow-auto">
              {generatedGoogleAdHeadlines.map((post, index) => (
          <div key={index} className="border border-[var(--primary-text-color)] p-4 rounded-lg mb-4 relative ">
            <div className="flex justify-between items-center mb-2">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleCopy(post)}
                  className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                  title="Copy"
                >
                  <Copy />
                </button>
              </div>
            </div>
            <p className="text-[var(--primary-text-color)]  whitespace-pre-wrap">{post}</p>
          </div>
        ))}
        </div>
                
            </div>
            )
        )}
      </div>
      
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
