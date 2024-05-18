import React, { useState } from "react";
import axios from "axios";
import thumbnail from "../assets/InstaTumb.jpg"; // Import default thumbnail image
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

export function InstagramImageDownloader() {
  const [postLink, setPostLink] = useState("");
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]); // State for thumbnails
  const [showDownloadButton, setShowDownloadButton] = useState(true); // State to control visibility of download button

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

      console.log(response.data)
      if (response.data.status) {
        const videos = response.data.result.filter((item:any )=> item.type === 'image/jpeg' || item.type === 'image/jpg');
        const videoLinks = videos.map((video:any) => video.url);
        setDownloadLinks(videoLinks);

        // Extract thumbnails from the response
        const videoThumbnails = videos.map((video:any) => video.thumb || thumbnail); // Use video thumbnail if available, otherwise use default thumbnail
        setThumbnails(videoThumbnails);

        setShowDownloadButton(false); // Hide download button when videos are fetched
        setIsLoading(false); // Set isLoading to false after fetching
      } else {
        console.error("API Error:", response.data);
        setIsLoading(false); // Set isLoading to false if there's an API error
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false); // Set isLoading to false if there's an error
    }
  };

  const handleDownloadClick = (url:any) => {
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <div className="w-96 mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          placeholder="Paste Instagram image Link"
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
          {isLoading ? 'Getting Images...' : 'Get All Images'}
        </button>
      )}
      
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center ">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
            <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : thumbnails.length > 0 && (
          <div>
            {thumbnails.map((thumbnail, index) => (
              <div key={index} className="flex items-center mt-4">
                <img src={thumbnail} alt={`Thumbnail ${index + 1}`} className="w-16 h-auto rounded-md mr-4" />
                <button
                  onClick={() => handleDownloadClick(downloadLinks[index])}
                  className="px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
                >
                  Download Image
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}