import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Clipboard, Share2, Download } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";;
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
  { value: 'Zulu', label: 'Zulu' }
  
  // Add more languages as needed
];

export function ContentImprover() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('English');
  const [output, setOutput] = useState(3); // Default number of outputs
  const [improvedContents, setImprovedContents] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState('Generate');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

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

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }
  
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
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
