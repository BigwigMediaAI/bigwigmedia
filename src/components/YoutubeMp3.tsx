import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export function Mp3Downloader() {
  const [videoLink, setVideoLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDownload = async () => {
    setIsLoading(true);
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
      } else {
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    window.open(downloadLink, '_blank');
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="text"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        placeholder="Paste YouTube Video Link"
        className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleDownload}
        disabled={isLoading || !videoLink}
        className={`w-full py-2 text-white font-semibold rounded-md ${
          isLoading || !videoLink ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Downloading...' : 'Download MP3'}
      </button>


      <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
              <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            <div className="w-full">
              {thumbUrl && (
        <div className="mt-4">
          <img src={thumbUrl} alt="Video Thumbnail" className="w-full h-auto rounded-md" />
        </div>
      )}
      {videoTitle && (
        <p className="mt-2 text-lg font-semibold text-gray-600">{videoTitle}</p>
      )}
      {downloadLink && (
        <button
          onClick={handleDownloadClick}
          className="mt-4 w-full px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
        >
          Download MP3
        </button>
      )}

            </div>
          )}
        </div>


          </div>
  );
}
