import React, { useState } from "react";
import axios from "axios";
import videoPlaceholder from "../assets/vid.svg";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

export function TikTokDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

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
    <div className="w-96 mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
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
      <button
        onClick={handleDownload}
        disabled={isLoading || !videoLink || hasFetched}
        className={`w-full py-2 text-white font-semibold rounded-md ${
          isLoading || !videoLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Getting Video...' : 'Get Video'}
      </button>
      {isLoading && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-black" />
          <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {downloadLink && (
        <div className="mt-4 flex flex-col justify-center items-center">
          <img src={videoPlaceholder} alt="Video Thumbnail" className="w-52 h-auto rounded-md" />
          <button
            onClick={handleDownloadClick}
            className="mt-2 w-full px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
          >
            Download Video
          </button>
        </div>
      )}
    </div>
  );
}