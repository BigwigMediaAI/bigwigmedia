import React, { useState } from "react";
import axios from "axios";
import { Loader2, Video } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

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
  duration: string;
  thumbnail: string;
  formats: VideoFormat[];
};

export function FacebookDownloader() {
  const [postLink, setPostLink] = useState<string>("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDownloadButton, setShowDownloadButton] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<{ [key: string]: string }>({});

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Reset the error message
    try {
      const response = await axios.post('https://facebook17.p.rapidapi.com/api/facebook/links/', {
        url: postLink // Pass the URL in the request body
      }, {
        headers: {
          'X-RapidAPI-Key': 'f3b1fe477bmsh8883dd78bae0b6bp145d5ejsnbfdf6e9ba144',
          'X-RapidAPI-Host': 'facebook17.p.rapidapi.com'
        }
      });

      if (response.data && response.data.length > 0) {
        const videosData = response.data.map((video: any) => ({
          id: video.resourceId,
          title: video.meta.title || "Untitled Video",
          duration: video.meta.duration || "Unknown duration",
          thumbnail: video.meta.sourceUrl,
          formats: video.urls.map((url: any) => ({
            url: url.url,
            quality: `${url.subName} (${url.name.toUpperCase()})`,
            subName: url.subName,
            extension: url.extension
          }))
        }));

        setVideos(videosData);
        setShowDownloadButton(false);
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

  return (
    <div className="w-96 mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          placeholder="Paste Facebook Post Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      {showDownloadButton && (
        <button
          onClick={handleDownload}
          disabled={isLoading || !postLink}
          className={`w-full py-2 text-white font-semibold rounded-md ${
            isLoading || !postLink ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Getting Video...' : 'Get Videos'}
        </button>
      )}
      
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
                {videos.map((video, index) => (
                  <div key={video.id} className="flex flex-col items-start mt-4">
                    <video controls className="w-full h-auto rounded-md">
                      <source src={video.formats[0].url} type={`video/${video.formats[0].extension}`} />
                      Your browser does not support the video tag.
                    </video>
                    {/* <p className="font-semibold mt-2">{video.title}</p> */}
                    <p className="text-base text-gray-800 mt-1">Duration: {video.duration}</p>
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