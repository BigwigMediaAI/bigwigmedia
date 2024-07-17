import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { useAuth } from "@clerk/clerk-react";


export function GenerateLinkedInRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [skills, setSkills] = useState('');
  const [accomplishments, setAccomplishments] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedRecommendations, setGeneratedRecommendations] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedRecommendations([]);
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateLinkedInRecommendation?clerkId=${userId}`, {
        name,
        relationship,
        skills,
        accomplishments,
        tone,
        language,
        outputCount,
      });

      if (response.status === 200) {
        setGeneratedRecommendations(response.data);
      } else {
        toast.error('Error generating LinkedIn recommendations. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating LinkedIn recommendations:', error);
      toast.error('Error generating LinkedIn recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedRecommendations.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedRecommendations]);

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

  const handleCopy = (recommendationContent: string) => {
    navigator.clipboard.writeText(recommendationContent);
    toast.success('Recommendation content copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedRecommendations.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "linkedin_recommendations.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Generated LinkedIn Recommendations',
      text: generatedRecommendations.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing LinkedIn recommendations:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-[#262626]">
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., John Doe"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Relationship</label>
        <input
          type="text"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="E.g., Former Manager"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="E.g., Project Management, Leadership"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Accomplishments</label>
        <textarea
          value={accomplishments}
          onChange={(e) => setAccomplishments(e.target.value)}
          placeholder="E.g., Led the team to complete XYZ project successfully"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-300 p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' :(generatedRecommendations.length>0?"Regenerate":'Generate') }
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          generatedRecommendations.length > 0 && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6 p-5 relative">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-gray-700 dark:text-gray-300 ">Generated LinkedIn Recommendations</h1>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    title="Share"
                  >
                    <Share2 />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    title="Download"
                  >
                    <Download />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-4 max-h-[600px] overflow-auto">
              {generatedRecommendations.map((post, index) => (
          <div key={index} className="border border-gray-300 p-4 rounded-lg mb-4 relative ">
            <div className="flex justify-between items-center mb-2">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleCopy(post)}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  title="Copy"
                >
                  <Copy />
                </button>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post}</p>
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

export default GenerateLinkedInRecommendations;
