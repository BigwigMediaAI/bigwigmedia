import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

export function Mp3Downloader() {
  const [videoLink, setVideoLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setHasFetched(false);
    setDownloadLink("");
    setVideoTitle("");
    setThumbUrl("");

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      const videoId = extractVideoId(videoLink);
      if (!videoId) {
        throw new Error("Invalid YouTube video link");
      }
      const response = await axios.get(`https://youtube-mp3-download1.p.rapidapi.com/dl`, {
        params: { id: videoId },
        headers: {
          'X-RapidAPI-Key': 'b3402da2eemsh9f38aabddad6fabp1be739jsn49f1254bdd37',
          'X-RapidAPI-Host': 'youtube-mp3-download1.p.rapidapi.com'
        }
      });
      if (response.data.status === "ok") {
        setVideoTitle(response.data.title);
        setDownloadLink(response.data.link);
        setThumbUrl(response.data.thumb);
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

  const handleDownloadClick = () => {
    window.open(downloadLink, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setDownloadLink("");
    setVideoTitle("");
    setThumbUrl("");
    setHasFetched(false);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!isLoading && hasFetched) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [isLoading, hasFetched]);

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
            isLoading || !videoLink || hasFetched ? 'bg-gray-500 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
          }`}
        >
          {isLoading ? (
            <>
              
              Downloading...
              <Loader2 className="animate-spin mr-2 inline-block" />
            </>
          ) : (
            'Download MP3'
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
            {thumbUrl && (
              <div className="mt-4 flex-col items-center">
                <img src={thumbUrl} alt="Video Thumbnail" className="w-full h-auto rounded-md" />
                <p className="mt-2 text-lg font-semibold text-white">{videoTitle}</p>
              </div>
            )}
            {downloadLink && (
              <div ref={resultsRef} className="flex items-center justify-center mt-3">
                <button
                  onClick={handleDownloadClick}
                  className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
                title="Download">
                  Download MP3
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
