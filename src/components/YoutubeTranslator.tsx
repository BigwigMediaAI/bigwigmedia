import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Share2 } from "lucide-react"; // Add Share2 icon
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

const VOICE_TONES = ["alloy", "echo", "nova", "shimmer"];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'hindi', label: 'Hindi' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese (Simplified)' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'tr', label: 'Turkish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'sv', label: 'Swedish' },
  { code: 'fi', label: 'Finnish' },
  { code: 'no', label: 'Norwegian' },
  { code: 'da', label: 'Danish' },
  { code: 'el', label: 'Greek' },
  { code: 'cs', label: 'Czech' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'th', label: 'Thai' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ms', label: 'Malay' },
  { code: 'vi', label: 'Vietnamese' },
];

export function YouTubeTranslator() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedVideoUrl, setTranslatedVideoUrl] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('en');
  const [voiceTone, setVoiceTone] = useState<string>(VOICE_TONES[0]);
  const { userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleTranslateClick = async () => {
    if (!youtubeUrl) {
      toast.error("Please enter a valid YouTube URL.");
      return;
    }

    try {
      setTranslatedVideoUrl(null);
      setIsLoading(true);

      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      const response = await axios.post(`${BASE_URL}/response/youtube-translate?clerkId=${userId}`, {
        url: youtubeUrl,
        targetLanguage,
        voiceTone,
      }, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setTranslatedVideoUrl(url);
        toast.success("Video processed successfully.");
      } else {
        toast.error("Error processing video. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("Error processing video. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!translatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = translatedVideoUrl;
    link.setAttribute('download', 'translated_video.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = async () => {
    if (!translatedVideoUrl) return;
  
    try {
      const response = await fetch(translatedVideoUrl);
      const blob = await response.blob();
      const file = new File([blob], "translated_video.mp4", { type: blob.type });
  
      if (navigator.share) {
        navigator.share({
          title: 'Translated Video',
          files: [file],
        }).catch((error) => console.error('Error sharing video:', error));
      } else {
        toast.error("Share functionality is not supported on this browser.");
      }
    } catch (error) {
      console.error("Error sharing video:", error);
      toast.error("Error sharing video. Please try again later.");
    }
  };
  

  useEffect(() => {
    if (!isLoading && translatedVideoUrl) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, translatedVideoUrl]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="text-red-500 text-md mb-2">
        Note: For Hindi translation, videos must be shorter than 2 minutes in length.
      </div>
      <div className="mb-5">
        <label htmlFor="youtubeUrl" className="block text-gray-700">YouTube URL</label>
        <input
          id="youtubeUrl"
          type="text"
          placeholder="eg: https://www.youtube.com/shorts/c5QDJwP1Wuo"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500"
        />
      </div>
      
      {youtubeUrl && (
        <div className="flex justify-center mb-5">
          <ReactPlayer url={youtubeUrl} controls width="100%" />
        </div>
      )}

      <div className="flex  gap-5">
        <div className="w-1/2 mb-5">
          <label htmlFor="targetLanguage" className="block text-gray-700">Target Language</label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div className="w-1/2 mb-5">
          <label htmlFor="voiceTone" className="block text-gray-700">Voice Tone</label>
          <select
            id="voiceTone"
            value={voiceTone}
            onChange={(e) => setVoiceTone(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500"
          >
            {VOICE_TONES.map((tone) => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center mb-5">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={handleTranslateClick}
          disabled={isLoading}
        >
          {isLoading ? "Translating..." : 'Translate'}
        </Button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please wait...</p>
          </div>
        ) : (
          translatedVideoUrl && (
            <div ref={resultRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6  mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <ReactPlayer url={translatedVideoUrl} controls width="100%" />
                <div className="flex justify-center items-center gap-4 mt-5">
                  <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit"
                    onClick={handleDownloadClick}
                  title="Download">
                    Download
                    <Download className="w-6 h-6 text-white" />
                  </Button>
                  <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit"
                    onClick={handleShareClick}
                  title="Share">
                    Share
                    <Share2 className="w-6 h-6 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
