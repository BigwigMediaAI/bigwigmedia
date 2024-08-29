import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';

export function GenerateLinkedInConnection(){
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedConnections, setGeneratedConnections] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (
      !validateInput(name)||
      !validateInput(reason)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setGeneratedConnections([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateConnectionRequest?clerkId=${userId}`, {
        name,
        reason,
        tone,
        language,
        outputCount,
      });

      if (response.status === 200) {
        console.log(response.data);
        setGeneratedConnections(response.data);
      } else {
        toast.error('Error generating LinkedIn bio. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating LinkedIn bio:', error);
      toast.error('Error generating LinkedIn bio. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedConnections.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedConnections]);

  const tones = [
    { value: '', label: 'Select tone' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'enthusiastic', label: 'Enthusiastic' },
    { value: 'informative', label: 'Informative' },
    { value: 'friendly', label: 'Friendly' },
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
    
  ];

  const outputCounts = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  const handleCopy = (bioContent: string) => {
    navigator.clipboard.writeText(bioContent);
    toast.success('Bio content copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedConnections.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "linkedin_bios.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Generated LinkedIn Bios',
      text: generatedConnections.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing LinkedIn bios:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., John Doe"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Reason</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="E.g., We met at the recent Tech Conference and I'd like to connect to discuss potential collaboration opportunities."
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedConnections.length>0?"Regenerate":'Generate')}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          generatedConnections.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-[var(--primary-text-color)] ">Generated LinkedIn Connection Request</h1>
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
              {generatedConnections.map((post, index) => (
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
