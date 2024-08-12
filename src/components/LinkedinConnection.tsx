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
  const [language, setLanguage] = useState('');
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
    { value: '', label: 'Select language' },
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Mandarin', label: 'Mandarin' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
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
