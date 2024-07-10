import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import thumbnail from '../assets/vid.svg'; // Import the fixed thumbnail
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

type VideoFormat = {
  url: string;
  quality: string;
  subName: string;
  extension: string;
};

type VideoData = {
  id: string;
  title: string;
  thumbnail: string;
  formats: VideoFormat[];
};

export function TwitterDownloader() {
  const [tweetLink, setTweetLink] = useState<string>("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<{ [key: string]: string }>({});
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const convertTwitterUrl = (inputUrl: string) => {
    const twitterStatusRegex = /https?:\/\/(?:www\.)?twitter\.com\/([^/]+)\/status\/(\d+)/;
    const xStatusRegex = /https?:\/\/x\.com\/([^/]+)\/status\/(\d+)/;

    let match = inputUrl.match(twitterStatusRegex);
    if (match && match.length === 3) {
      const username = match[1];
      const statusId = match[2];
      return `https://twitter.com/${username}/status/${statusId}`;
    }

    match = inputUrl.match(xStatusRegex);
    if (match && match.length === 3) {
      const statusId = match[2];
      return `https://twitter.com/i/status/${statusId}`;
    }

    return null;
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Reset the error message

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const convertedUrl = convertTwitterUrl(tweetLink);
    if (!convertedUrl) {
      setErrorMessage("Unsupported URL format");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/response/twitterdownload?clerkId=${userId}`, {
        url: convertedUrl // Pass the converted URL in the request body
      });
      console.log(response);
      if (response.data && response.data.downloadUrl && response.data.downloadUrl.data) {
        const videoData = response.data.downloadUrl.data;
        const videosData = [{
          id: "1",
          title: "Twitter Video", // The title is not provided by the API, so using a default title
          thumbnail: thumbnail, // Use the fixed thumbnail
          formats: Object.keys(videoData).map((key) => ({
            url: videoData[key],
            quality: key,
            subName: key,
            extension: "mp4" // Assuming the extension is mp4
          }))
        }];

        setVideos(videosData);
        setHasFetched(true);
      } else {
        setErrorMessage("API returned no video data: " + JSON.stringify(response.data));
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

  const handleDownloadClick = (videoId: string) => {
    const format = videos.find(video => video.id === videoId)?.formats.find(f => f.subName === selectedFormat[videoId]);
    if (format) {
      window.open(format.url, '_blank');
    }
  };

  const handleShareClick = async (videoId: string) => {
    const format = videos.find(video => video.id === videoId)?.formats.find(f => f.subName === selectedFormat[videoId]);
    if (format && navigator.share) {
      try {
        await navigator.share({
          title: 'Facebook Video',
          text: 'Check out this video I downloaded from Facebook!',
          url: format.url
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    }
  };


  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFormatChange = (videoId: string, subName: string) => {
    setSelectedFormat(prev => ({ ...prev, [videoId]: subName }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTweetLink(e.target.value);
    setVideos([]); // Clear the videos
    setHasFetched(false); // Reset the fetch status
  };

  useEffect(() => {
    if (!isLoading && videos.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, videos]);

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 dark:bg-[#5f5f5f] bg-white p-6 shadow-xl rounded-lg">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={tweetLink}
          onChange={handleInputChange}
          placeholder="Paste Twitter Video Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !tweetLink || hasFetched}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !tweetLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
          }`}
        >
          {isLoading ? 'Getting Video...' : 'Get Videos'}
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
            {videos.length > 0 && (
              <div ref={resultsRef}>
                {videos.map((video) => (
                  <div key={video.id} className="flex flex-col items-center mt-4">
                    <img src={video.thumbnail} alt="Video Thumbnail" className="w-48 h-auto rounded-md" />
                    <p className="font-semibold mt-2">{video.title}</p>
                    <select
                      value={selectedFormat[video.id] || ""}
                      onChange={(e) => handleFormatChange(video.id, e.target.value)}
                      className="mt-2 w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>Select Video Quality</option>
                      {video.formats.map((format, formatIndex) => (
                        <option key={formatIndex} value={format.subName}>
                          {format.quality}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-center mt-3">
                      <button
                        onClick={() => handleDownloadClick(video.id)}
                        disabled={!selectedFormat[video.id]}
                        className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
                          !selectedFormat[video.id] ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
                        }`}
                      title="Download">
                        Download Video
                      </button>
                      <button
                        onClick={() => handleShareClick(video.id)}
                        disabled={!selectedFormat[video.id]}
                        className={`ml-2 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
                          !selectedFormat[video.id] ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
                        }`}
                      title="Share">
                        Share Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
