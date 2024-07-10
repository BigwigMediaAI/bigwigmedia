import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Copy, RefreshCw,Upload} from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function PdfTranslate() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<{ label: string; value: string } | null>(null);
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslationDone, setIsTranslationDone] = useState(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ru', label: 'Russian' },
    { value: 'ar', label: 'Arabic' },
    { value: 'bn', label: 'Bengali' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'ur', label: 'Urdu' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'it', label: 'Italian' },
    { value: 'tr', label: 'Turkish' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'pl', label: 'Polish' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'ro', label: 'Romanian' },
    { value: 'nl', label: 'Dutch' },
    { value: 'el', label: 'Greek' },
    { value: 'he', label: 'Hebrew' },
    { value: 'sv', label: 'Swedish' },
    { value: 'fi', label: 'Finnish' },
    { value: 'no', label: 'Norwegian' },
    { value: 'da', label: 'Danish' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'cs', label: 'Czech' },
    { value: 'sk', label: 'Slovak' },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'hr', label: 'Croatian' },
    { value: 'sr', label: 'Serbian' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'lv', label: 'Latvian' },
    { value: 'et', label: 'Estonian' },
    { value: 'th', label: 'Thai' },
    { value: 'id', label: 'Indonesian' },
    { value: 'ms', label: 'Malay' },
    { value: 'tl', label: 'Tagalog' },
    { value: 'fa', label: 'Persian' },
    { value: 'sw', label: 'Swahili' },
    { value: 'am', label: 'Amharic' },
    { value: 'af', label: 'Afrikaans' },
    { value: 'sq', label: 'Albanian' },
    { value: 'hy', label: 'Armenian' },
    { value: 'az', label: 'Azerbaijani' },
    { value: 'eu', label: 'Basque' },
    { value: 'be', label: 'Belarusian' },
    { value: 'bs', label: 'Bosnian' },
    { value: 'ca', label: 'Catalan' },
    { value: 'eo', label: 'Esperanto' },
    { value: 'ga', label: 'Irish' },
    { value: 'is', label: 'Icelandic' },
    { value: 'kn', label: 'Kannada' },
    { value: 'kk', label: 'Kazakh' },
    { value: 'ky', label: 'Kyrgyz' },
    { value: 'lo', label: 'Lao' },
    { value: 'mk', label: 'Macedonian' },
    { value: 'mn', label: 'Mongolian' },
    { value: 'ne', label: 'Nepali' },
    { value: 'si', label: 'Sinhala' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'su', label: 'Sundanese' },
    { value: 'ta', label: 'Tamil' },
    { value: 'uz', label: 'Uzbek' },
    { value: 'xh', label: 'Xhosa' },
    { value: 'yo', label: 'Yoruba' },
    { value: 'zu', label: 'Zulu' },
    // Add more languages as needed
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setSelectedLanguage(null);
    setIsTranslationDone(false);
    setTranslatedText('');
  };

  const translatePdf = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile || !selectedLanguage) {
        toast.error('Please select a PDF file and target language.');
        setIsLoading(false);
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('language', selectedLanguage.value);

      const response = await axios.post(`${BASE_URL}/response/translate?clerkId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setTranslatedText(response.data.translatedText);
        setIsTranslationDone(true);
        toast.success('PDF translated successfully.');
      } else {
        toast.error('Error translating PDF. Please try again later.');
      }
    } catch (error) {
      console.error('Error translating PDF:', error);
      toast.error('Error translating PDF. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    toast.success('Translated text copied to clipboard.');
  };
  

  const downloadText = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast.error('Share not supported on this device.');
      return;
    }

    try {
      await navigator.share({
        title: 'Extracted Text',
        text: translatedText,
      });

      toast.success('Text shared successfully!');
    } catch (error: any) {
      console.error('Error during sharing:', error);
      toast.error('Failed to share text. ' + error.message);
    }
  };


  useEffect(() => {
    if (!isLoading && isTranslationDone) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [isLoading, isTranslationDone]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div 
        className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
          setSelectedFile(file);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center w-full">
          <Upload className="w-12 h-12 text-gray-400" />
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse Files
            </Button>
            <p className="text-gray-400">or drag and drop PDF file</p>
          </div>
          <RefreshCw 
            className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection} 
          />
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-gray-300">{selectedFile.name}</p>
          </div>
        )}
      </div>
      <div className="flex justify-center mb-5 w-full">
      <Select
          options={languages}
          onChange={setSelectedLanguage}
          value={selectedLanguage}
          placeholder="Select target language"
          isSearchable
          className="w-full text-black"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: 'transparent',
              color: 'white',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'white',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#3f3e3e',
              color: 'white',
            }),
          }}
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
          onClick={translatePdf}
          disabled={!selectedFile || !selectedLanguage || isLoading}
        >
          {isLoading ? "Translating..." : 'Translate PDF'}
        </Button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          isTranslationDone && (
            <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Translated Text:</h2>
                <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Copy'>
                <Copy className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={downloadText}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Download'>
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Share'>
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
            </div>
              </div>
              <pre className="p-4 border border-gray-300 rounded-md shadow-inner  whitespace-pre-wrap max-h-64 overflow-y-auto">
                {translatedText}
              </pre>
            </div>
          )
        )}
      </div>

    </div>
  );
}