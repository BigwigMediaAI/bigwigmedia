import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import thumbnail from '../assets/vid.svg'; // Import the fixed thumbnail
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";



// Define the types for video format and video data
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


  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Reset the error message
    try {
      const response = await axios.post(`${BASE_URL}/response/twitterdownload?clerkId=${userId}`, {
        url: tweetLink // Pass the URL in the request body
      });

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

  return (
    <div className="w-96 mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
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
      <button
        onClick={handleDownload}
        disabled={isLoading || !tweetLink || hasFetched}
        className={`w-full py-2 text-white font-semibold rounded-md ${
          isLoading || !tweetLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Getting Video...' : 'Get Videos'}
      </button>
      
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-black" />
            <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="text-red-500 mt-4">
                {errorMessage}
              </div>
            )}
            {videos.length > 0 && (
              <div>
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
                    <button
                      onClick={() => handleDownloadClick(video.id)}
                      disabled={!selectedFormat[video.id]}
                      className={`w-full py-2 mt-2 text-white font-semibold rounded-md ${
                        !selectedFormat[video.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      Download Video
                    </button>
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