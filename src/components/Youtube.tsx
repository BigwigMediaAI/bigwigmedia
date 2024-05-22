import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";


export function VideoDownloader() {
  const [videoLink, setVideoLink] = useState<string>("");
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoThumb, setVideoThumb] = useState<string>("");
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const videoId = extractVideoId(videoLink);
      if (!videoId) {
        throw new Error("Invalid YouTube video link");
      }
      const response = await axios.get(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': 'b3402da2eemsh9f38aabddad6fabp1be739jsn49f1254bdd37',
          'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
        }
      });
      if (response.data.status === "ok") {
        setVideoTitle(response.data.title);
        setVideoThumb(response.data.thumb);
        const links = Object.entries(response.data.link)
          .map(([key, value]: [string, any]) => ({
            url: value[0],
            quality: value[3]
          }))
          .filter(link => link.quality === "360p" || link.quality === "720p");
        setDownloadLinks(links);
        setHasFetched(true);
      } else {
        setErrorMessage("API Error: " + JSON.stringify(response.data));
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

  const handleDownloadClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setDownloadLinks([]);
    setVideoTitle("");
    setVideoThumb("");
    setHasFetched(false);
    setSelectedQuality("");
    setErrorMessage(null);
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
          onClick={handleDownload}
          disabled={isLoading || !videoLink || hasFetched}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !videoLink || hasFetched ? 'bg-gray-500 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" />
              Getting Video...
            </>
          ) : (
            'Get Videos'
          )}
        </button>
      </div>
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
            {videoTitle && (
              <div className="mt-4 flex-col items-center">
                <img src={videoThumb} alt={videoTitle} className="w-full h-auto rounded-md" />
                <p className="mt-2 text-lg font-semibold text-white">{videoTitle}</p>
              </div>
            )}
            {downloadLinks.length > 0 && (
              <div className="mt-4">
                <p>Select Quality:</p>
                <div className="flex flex-wrap">
                  {downloadLinks.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuality(link.url)}
                      className={`px-4 py-2 mr-2 mb-2 text-white font-semibold rounded-md ${
                        selectedQuality === link.url ? 'bg-blue-500' : 'bg-gray-400 hover:bg-blue-500'
                      }`}
                    >
                      {link.quality}
                    </button>
                  ))}
                </div>
                {selectedQuality && (
                  <div className="flex items-center justify-center mt-3">
                  <button
                    onClick={() => handleDownloadClick(selectedQuality)}
                    className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
                  >
                    Download Video
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

