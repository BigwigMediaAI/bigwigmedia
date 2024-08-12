import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import videoPlaceholder from "../assets/vid.svg";
import { Loader2 } from "lucide-react";
import { FaSyncAlt, FaDownload } from "react-icons/fa";

export function TikTokDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [hovered, setHovered] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(""); // Reset error state
    try {
      const response = await axios.post(
        'https://tiktok-video-downloader-download-without-watermark.p.rapidapi.com/tiktok/v1/download-without-watermark',
        { url: videoLink },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'f3b1fe477bmsh8883dd78bae0b6bp145d5ejsnbfdf6e9ba144',
            'X-RapidAPI-Host': 'tiktok-video-downloader-download-without-watermark.p.rapidapi.com'
          }
        }
      );

      if (response.data.success) {
        setDownloadLink(response.data.data.url);
        setHasFetched(true);
      } else {
        console.error("API Error:", response.data);
        setError("Failed to fetch the video. Please check the URL and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching the video. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    window.open(downloadLink, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setDownloadLink(""); // Clear the download link
    setHasFetched(false); // Reset the fetch status
  };

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] rounded-lg">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={videoLink}
          onChange={handleInputChange}
          placeholder="Paste TikTok Video Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !videoLink || hasFetched}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !videoLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
          }`}
        >
          {isLoading ? 'Getting Video...' : 'Get Video'}
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
            {error && (
              <div className="text-red-500 mt-4">
                {error}
              </div>
            )}
            {downloadLink && (
              <div className="mt-4 flex flex-col justify-center items-center relative border border-gray-300 rounded-md">
                <img
                  src={videoPlaceholder}
                  alt="Video Thumbnail"
                  className="w-52 h-auto rounded-md"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                />
                {hovered && (
                  <div className="absolute inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 rounded-md">
                    <button
                      onClick={handleDownloadClick}
                      className="px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600 flex items-center"
                    title="Download">
                      <FaDownload className="mr-2" /> Download Video
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
