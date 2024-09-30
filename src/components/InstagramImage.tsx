import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2, Download } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

export function InstagramImageDownloader() {
  const [postLink, setPostLink] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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
    setErrorMessage(null);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      const response = await axios.post(`${BASE_URL}/response/instadownloader?clerkId=${userId}`, {
        url: postLink,
      });

      const results = response.data.url_list || [];
      const imageLinks = results.filter((url: string) => url.includes(".jpg"));

      if (imageLinks.length > 0) {
        setImageUrls(imageLinks);
      } else {
        setErrorMessage("No images found in the provided Instagram link.");
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
    setImageUrls([]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!isLoading && imageUrls.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, imageUrls]);

  const handleImageDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    link.click();
  };

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
          {isLoading ? "Getting Media..." : "Get Images"}
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
            {imageUrls.length > 0 && (
              <div ref={resultsRef}>
                {imageUrls.map((url, index) => (
                  <div key={index} className="mb-4 flex items-center justify-between">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full">
                      <h3>Image {index + 1}</h3>
                      <Download className="w-6 h-6 ml-2 text-blue-500 hover:text-blue-700" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <h3 className="text-sm text-center mt-4 italic text-gray-700">Click on the image name or the download icon to download the image.</h3>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
