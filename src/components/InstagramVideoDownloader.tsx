import React, { useState,useEffect, useRef  } from "react";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import BigwigLoader from "@/pages/Loader";

export function InstagramVidDownloader() {
  const [postLink, setPostLink] = useState<string>("");
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


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
      return 0;
    }
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/instadownloader?clerkId=${userId}`, {
        url: postLink,
      });

      const results = response.data.url_list || [];
      const videoLinks = results.filter((url: string) => url.includes(".mp4"));

      if (videoLinks.length > 0) {
        setVideoUrls(videoLinks);
      } else {
        setErrorMessage("No video found in the provided Instagram link.");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostLink(e.target.value);
    setVideoUrls([]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };


  useEffect(() => {
        if (!isLoading && videoUrls.length > 0) {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, [isLoading, videoUrls]);


  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] rounded-lg">
      <h3 className="text-base mb-2 text-gray-700">
        Copy any Instagram post link and paste it in the box below:
      </h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={postLink}
          onChange={handleInputChange}
          placeholder="Paste Instagram Post Link"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-black"
        />
        <button
          onClick={handleRefresh}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !postLink}
          className={`text-white text-center font-medium flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !postLink
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
          }`}
        >
          {isLoading ? "Getting Media..." : "Get Video"}
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
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            {videoUrls.length > 0 && (
              <div ref={resultsRef}>
                {videoUrls.map((url, index) => (
                  <div key={index} className="mb-4 ">
                    <video
                      src={url}
                      controls
                      className="w-full h-96 rounded-md mt-5"
                    >
                      Your browser does not support the video tag.
                    </video>
                    
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <h3 className="text-sm text-center mt-4 italic text-gray-700">Hint - To Download video click on <span className="inline-flex items-center"><PiDotsThreeOutlineVerticalBold /></span> button then click on Download option.</h3>
      <h3 className="text-sm text-center mt-4 italic text-red-500">Note:Only public Instagram account videos are downloadable. Private videos are not accessible yet.we're working on it!






</h3>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
