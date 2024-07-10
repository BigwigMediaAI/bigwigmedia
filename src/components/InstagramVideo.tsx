import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import thumbnail from "../assets/video.svg"; // Import default thumbnail image
import { Loader2 } from "lucide-react";
import { FaSyncAlt, FaDownload, FaShareAlt } from "react-icons/fa";

export function InstagramDownloader() {
  const [postLink, setPostLink] = useState<string>("");
  const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thumbnails, setThumbnails] = useState<string[]>([]); // State for thumbnails
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Reset the error message

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const response = await axios.get('https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/', {
        params: { url: postLink },
        headers: {
          'X-RapidAPI-Key': 'f3b1fe477bmsh8883dd78bae0b6bp145d5ejsnbfdf6e9ba144',
          'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader.p.rapidapi.com'
        }
      });

      if (response.data.status) {
        const images = response.data.result.filter((item: any) => item.type === 'video/mp4');
        const imageLinks = images.map((image: any) => image.url);
        setDownloadLinks(imageLinks);

        // Extract thumbnails from the response
        const imageThumbnails = images.map((image: any) => image.thumb || thumbnail); // Use image thumbnail if available, otherwise use default thumbnail
        setThumbnails(imageThumbnails);

        setHasFetched(true); // Indicate that fetching is done
      } else {
        setErrorMessage("API returned no image data: " + JSON.stringify(response.data));
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

  const handleShareClick = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Instagram Video',
        text: 'Check out this video!',
        url: url
      }).catch(console.error);
    } else {
      alert('Sharing is not supported in your browser.');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostLink(e.target.value);
    setDownloadLinks([]); // Clear the download links
    setThumbnails([]); // Clear the thumbnails
    setHasFetched(false); // Reset the fetch status
  };

  useEffect(() => {
    if (!isLoading && downloadLinks.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, downloadLinks]);

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 dark:bg-[#5f5f5f] bg-white p-6 shadow-xl rounded-lg">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={postLink}
          onChange={handleInputChange}
          placeholder="Paste Instagram Image Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !postLink || hasFetched}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !postLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
          }`}
        >
          {isLoading ? 'Getting Videos...' : 'Get All Videos'}
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
            {thumbnails.length > 0 && (
              <div ref={resultsRef} className="flex flex-col gap-4 mt-4">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className="relative flex items-center p-2 border border-gray-300 rounded-md hover:bg-[#757474] transition-colors"
                  >
                    <img src={thumbnail} alt={`Thumbnail ${index + 1}`} className="w-16 h-auto rounded-md mr-4" />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                      <button
                        onClick={() => handleDownloadClick(downloadLinks[index])}
                        className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"
                      title="Download">
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => handleShareClick(downloadLinks[index])}
                        className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
                      title="Share">
                        <FaShareAlt />
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
