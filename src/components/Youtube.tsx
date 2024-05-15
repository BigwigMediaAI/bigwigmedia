import React, { useState } from "react";
import axios from "axios";

export function VideoDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [downloadLinks, setDownloadLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [videoThumb, setVideoThumb] = useState<string>("");

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
      const response = await axios.get(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, {
        headers: {
          'X-RapidAPI-Key': 'b3402da2eemsh9f38aabddad6fabp1be739jsn49f1254bdd37',
          'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
        }
      });
      if (response.data.status === "ok") {
        setVideoTitle(response.data.title);
        setVideoThumb(response.data.thumb);
        const links = Object.entries(response.data.link).map(([key, value]: [string, any]) => ({
          url: value[0],
          quality: value[3]
        }));
        setDownloadLinks(links);
      } else {
        console.error("API Error:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = (url: string) => {
    window.open(url, '_blank');
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
        {isLoading ? 'Downloading...' : 'Download'}
      </button>
      {videoTitle && (
        <div className="mt-4 flex-col items-center">
          <img src={videoThumb} alt={videoTitle} className="w-full h-auto rounded-md" />
          <p className="mt-2 text-lg font-semibold text-gray-600">{videoTitle}</p>
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
            <button
              onClick={() => handleDownloadClick(selectedQuality)}
              className="mt-4 px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
            >
              Download
            </button>
          )}
        </div>
      )}
    </div>
  );
}
