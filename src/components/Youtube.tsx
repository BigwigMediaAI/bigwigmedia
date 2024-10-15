import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { toast } from "sonner";
import BigwigLoader from "@/pages/Loader";

export function VideoDownloader() {
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<{ audio: string | null, video: string | null }>({ audio: null, video: null });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

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
    setDownloadUrl({ audio: null, video: null });

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      const response = await axios.get(`${BASE_URL}/response/ytdl?clerkId=${userId}`, {
        params: { url: videoLink },
      });

      if (response.data.status) {
        setDownloadUrl({
          audio: response.data.data.data.audio,
          video: response.data.data.data.video_hd,
        });
        setThumbnailUrl(response.data.data.data.thumbnail);
      } else {
        throw new Error("Failed to get the download URL.");
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

  const handleRefresh = () => {
    setVideoLink('')
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setDownloadUrl({ audio: null, video: null });
    setErrorMessage(null);
    setThumbnailUrl(null);
  };

  useEffect(() => {
    if (!isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  const handleDownloadClick = (url: string | null) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
          <h3 className="text-base mb-2  text-[var(--primary-text-color)]">Copy any video link from Youtube and paste it in the box below :</h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={videoLink}
          onChange={handleInputChange}
          placeholder="Paste YouTube Video Link"
          className="w-full px-4 py-2 rounded-md border border-[var(--primary-text-color)] focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !videoLink}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5 ${
            isLoading || !videoLink ? "bg-gray-500 cursor-not-allowed" : "bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 inline-block" />
              Getting Video...
            </>
          ) : (
            "Get Video"
          )}
        </button>
      </div>
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          <>
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            {thumbnailUrl && <img src={thumbnailUrl} alt="Video Thumbnail" className="mt-4 w-full" />}
            {downloadUrl.video && (
              <div className="flex flex-col items-center mt-4">
                <video controls className="w-full max-w-xl rounded-lg" src={downloadUrl.video} />
              </div>
            )}
          </>
        )}
      </div>
      <h3 className="text-sm mt-4 italic text-gray-700">Hint - To Download video click on <span className="inline-flex items-center"><PiDotsThreeOutlineVerticalBold /></span> button then click on Download option.</h3>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
