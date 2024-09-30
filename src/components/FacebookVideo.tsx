import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import CreditLimitModal from "./Model3";
import BigwigLoader from "@/pages/Loader";

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

export function FacebookDownloader() {
  const [postLink, setPostLink] = useState<string>("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<{ [key: string]: string }>({});
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);


  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Reset the error message

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setIsLoading(false)
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/fbinstadownload?clerkId=${userId}`, {
        url: postLink // Pass the URL in the request body
      });

      if (response.data && response.data.downloadUrl && response.data.downloadUrl.data) {
        const firstVideo = response.data.downloadUrl.data[0];
        const videosData = [{
          id: "1",
          title: "Facebook Video", // The title is not provided by the API, so using a default title
          thumbnail: firstVideo.thumbnail,
          formats: response.data.downloadUrl.data.map((video: any) => ({
            url: video.url,
            quality: video.resolution,
            subName: video.resolution.split(' ')[0],
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
    setPostLink(e.target.value);
    setVideos([]); // Clear the videos
    setHasFetched(false); // Reset the fetch status
  };

  useEffect(() => {
    if (!isLoading && videos.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, videos]);

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] rounded-lg">
    <h3 className="text-base mb-2  text-[var(--primary-text-color)]">Copy any video link from Facebook and paste it in the box below :</h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={postLink}
          onChange={handleInputChange}
          placeholder="Paste Facebook Post Link"
          className="w-full px-4 py-2 rounded-md border border-[var(--gray-color)] focus:outline-none focus:border-black"
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
            isLoading || !postLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit'
          }`}
        >
          {isLoading ? 'Getting Video...' : 'Get Videos'}
        </button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
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
                    <video controls className="w-72 h-auto rounded-md">
                      <source src={video.formats[0].url} type={`video/${video.formats[0].extension}`} />
                      Your browser does not support the video tag.
                    </video>
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
                          !selectedFormat[video.id] ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit'
                        }`}
                      title="Download">
                        Download
                      </button>
                      <button
                        onClick={() => handleShareClick(video.id)}
                        disabled={!selectedFormat[video.id]}
                        className={`ml-2 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
                          !selectedFormat[video.id] ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit'
                        }`}
                      title="Share">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <h3 className="text-sm mt-4 italic text-gray-700">Hint - To copy video link from Facebook, click on Three Dot button then click on copy link option.</h3>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
