import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";


 // Make sure to match your backend URL

export function VideoDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<{ audio: string | null, video: string | null }>({ audio: null, video: null });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDownloadUrl({ audio: null, video: null });

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    try {
      const response = await axios.get(`${BASE_URL}/response/ytdl?clerkId=${userId}`, {
        params: { url: videoLink },
      });
      console.log(response.data.data)
      if (response.data.status) {
        setDownloadUrl({
          audio: response.data.data.data.audio,
          video: response.data.data.data.video_hd,
        });
        setThumbnailUrl(response.data.data.data.thumbnail);
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
    setDownloadUrl({ audio: null, video: null });
    setErrorMessage(null);
    setThumbnailUrl(null);
  };

  useEffect(() => {
    if (!isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  const handleDownloadClick = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] rounded-lg">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={videoLink}
          onChange={handleInputChange}
          placeholder="Paste YouTube Video Link"
          className="w-full px-4 py-2 rounded-md border border-[var(--primary-text-color)] focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !videoLink}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5 ${
            isLoading || !videoLink ? "bg-gray-500 cursor-not-allowed" : "bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" />
              Getting Video...
            </>
          ) : (
            "Get Videos"
          )}
        </button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          <>
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            {thumbnailUrl && <img src={thumbnailUrl} alt="Video Thumbnail" className="mt-4 w-full" />}
            {downloadUrl.audio && downloadUrl.video && (
              <div className="flex justfy-between mt-4">
              
                <button onClick={() => handleDownloadClick(downloadUrl.video)} className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto">
                  Download Video
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}