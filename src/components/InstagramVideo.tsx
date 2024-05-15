import React, { useState } from "react";
import axios from "axios";

export function InstagramDownloader() {
  const [postLink, setPostLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [postThumbnail, setPostThumbnail] = useState("");
  const [postType, setPostType] = useState("");
  const [postSize, setPostSize] = useState("");

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/', {
        params: { url: postLink },
        headers: {
          'X-RapidAPI-Key': 'f3b1fe477bmsh8883dd78bae0b6bp145d5ejsnbfdf6e9ba144',
          'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader.p.rapidapi.com'
        }
      });
      if (response.data.status) {
        const result = response.data.result[0];
        setDownloadLink(result.url);
        setPostThumbnail(result.thumb);
        setPostType(result.type);
        setPostSize(result.size);
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
        value={postLink}
        onChange={(e) => setPostLink(e.target.value)}
        placeholder="Paste Instagram Post Link"
        className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={handleDownload}
        disabled={isLoading || !postLink}
        className={`w-full py-2 text-white font-semibold rounded-md ${
          isLoading || !postLink ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Downloading...' : 'Download Post'}
      </button>
      {postThumbnail && (
        <div className="mt-4">
          <img src={postThumbnail} alt="Post Thumbnail" className="w-full h-auto rounded-md" />
        </div>
      )}
      {postType && (
        <p className="mt-2 text-lg font-semibold text-gray-600">Type: {postType}</p>
      )}
      
      {downloadLink && (
        <button
          onClick={handleDownloadClick}
          className="mt-4 w-full px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
        >
          Download Post
        </button>
      )}
    </div>
  );
}