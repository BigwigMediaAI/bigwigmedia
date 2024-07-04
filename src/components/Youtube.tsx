import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "../utils/funcitons";

export function VideoDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDownloadUrl(null);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.post(`${BASE_URL}/response/ytdl?clerkId=${userId}`, { url: videoLink });

      if (response.data.downloadUrl) {
        setDownloadUrl(response.data.downloadUrl);
      } else {
        throw new Error("Failed to get the download URL.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage("Error: " + error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setDownloadUrl(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  const handleDownloadClick = () => {
    if (downloadUrl) {
      // Trigger download
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 dark:bg-[#5f5f5f] bg-white p-6 shadow-xl rounded-lg">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={videoLink}
          onChange={handleInputChange}
          placeholder="Paste YouTube Video Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={downloadUrl ? handleDownloadClick : handleDownload}
          disabled={isLoading || !videoLink}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-5 ${
            isLoading || !videoLink ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-80'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" />
              Getting Video...
            </>
          ) : downloadUrl ? (
            'Download Video'
          ) : (
            'Get Videos'
          )}
        </button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="text-red-500 mt-4">
                {errorMessage}
              </div>
            )}
            
          </>
        )}
      </div>
    </div>
  );
}
