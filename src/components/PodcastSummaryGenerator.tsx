import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, Loader2, Copy, Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

interface TranscriptionResponse {
  bulletPoints: string;
}

export function PodcastSummary() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<string>("en");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setBulletPoints(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    setBulletPoints(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const languages = [
    { value: '', label: 'Select language' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'zh', label: 'Mandarin' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'or', label: 'Odia' },
    { value: 'as', label: 'Assamese' },
    { value: 'ur', label: 'Urdu' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'it', label: 'Italian' },
    { value: 'nl', label: 'Dutch' },
    { value: 'ar', label: 'Arabic' },
    { value: 'tr', label: 'Turkish' },
    { value: 'fa', label: 'Persian' },
    { value: 'sw', label: 'Swahili' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' }
];


  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file to transcribe");
      return;
    }

    if (!language) {
      toast.error("Please select a language");
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("language", language);

    setIsLoading(true);
    try {
      const res = await axios.post<TranscriptionResponse>(
        `${BASE_URL}/response/transcribe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        console.log(res.data.bulletPoints)
        setBulletPoints(res.data.bulletPoints); // Update here to set only bullet points
        toast.success("File transcribed successfully");
      } else {
        toast.error("Error transcribing file");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && bulletPoints) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, bulletPoints]);

  const handleCopy = () => {
    if (bulletPoints) {
      navigator.clipboard.writeText(bulletPoints);
      toast.success('Bullet Point copied to clipboard.');
    }
  };
  
  const handleDownload = () => {
    if (bulletPoints) {
      const element = document.createElement('a');
      const file = new Blob([bulletPoints], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'BulletPoint.txt';
      document.body.appendChild(element);
      element.click();
      toast.success('Bullet Points downloaded.');
    }
  };
  
  const handleShare = async () => {
    if (navigator.share && bulletPoints) {
      try {
        await navigator.share({
          title: 'Bullet Point',
          text: bulletPoints,
        });
        toast.success('bullet points shared.');
      } catch (error) {
        toast.error('Error sharing bullet points.');
      }
    } else {
      toast.error('Web Share API not supported in this browser.');
    }
  };
  

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept="audio/*" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-400">Browse</label>
            </div>
            <p className="text-[var(--primary-text-color)] m-4 text-center">{selectedFile.name}</p>
            <p className="text-[var(--gray-color)] mb-4">Drag and drop an audio file here, or click to browse</p>
            
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-[var(--gray-color)] mb-4">Drag and drop an audio file here, or click to browse</p>
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept="audio/*" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300">Browse</label>
            </div>
          </>
        )}
      </div>
      <div className="mt-5 mb-10">
        <label className="block text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>
      <Button
        className=" text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
        onClick={handleTranscribe}
        disabled={isLoading || !selectedFile}
      >
        {isLoading ? "Transcribing" : "Transcribe"}
      </Button>

      {isLoading ? (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)] " />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      ) : (
        bulletPoints && (
          <div ref={resultsRef} className="mt-6 border border-gray-300 p-4 rounded-lg">
            <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-4">Transcription Results</h2>
            <div className="flex justify-end gap-4 mb-4">
            <button
                  onClick={handleCopy}
                  className="text-gray-700  hover:text-[var(--teal-color)]  cursor-pointer"
                  title="Copy"
                >
                  <Copy />
            </button>
            <button
                  onClick={handleDownload}
                  className="text-gray-700  hover:text-[var(--teal-color)]  cursor-pointer"
                  title="Download"
                >
                  <Download />
            </button>
            <button
                  onClick={handleShare}
                  className="text-gray-700  hover:text-[var(--teal-color)]  cursor-pointer"
                  title="Share"
                >
                  <Share2 />
            </button>
            </div>
            </div>
            <div className="border border-gray-300 p-4 rounded-lg">
              <p className="text-[var(--primary-text-color)]  whitespace-pre-wrap">{bulletPoints}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
