import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";

export function SpotifyMp3Downloader() {
  const [spotifyLink, setSpotifyLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // Store song thumbnail
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
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

  const cleanSpotifyURL = (url: string) => {
    return url.split("?")[0]; // Removes everything after "?"
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDownloadLink("");
    setThumbnail("");


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
      const cleanedURL = cleanSpotifyURL(spotifyLink); // Clean the URL

      const response = await axios.post(`${BASE_URL}/response/sportifydown?clerkId=${userId}`, {
        url: cleanedURL,
      });
      console.log(response.data.downloadURL.data)
      
      const data=response.data.downloadURL.data.download_url
      const AudioThumbnail=response.data.downloadURL.data.albumImage

      if (response.status === 200 && response.data.downloadURL) {
        setDownloadLink(data);
        setThumbnail(AudioThumbnail || ""); // Set thumbnail if available

      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      setErrorMessage("Error: Failed to fetch download link.");
      console.error("Download error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloadLink) {
      window.open(downloadLink, "_blank");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpotifyLink(e.target.value);
    setDownloadLink("");
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!isLoading && downloadLink) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, downloadLink]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <h3 className="text-base mb-2">Copy any song link from Spotify and paste it below:</h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={spotifyLink}
          onChange={handleInputChange}
          placeholder="Paste Spotify Song Link"
          className="w-full px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !spotifyLink}
          className={`text-white font-semibold py-3 px-10 rounded-full ${
            isLoading || !spotifyLink ? "bg-gray-500 cursor-not-allowed" : "text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          }`}
        >
          {isLoading ? (
            <>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-gray-600 mt-5">Processing your request...</p>
        </div>
      )}

      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

      {downloadLink && (
        <div ref={resultsRef} className="mt-4 text-center">
          {thumbnail && (
            <div className="flex justify-center mb-4">
              <img src={thumbnail} alt="Song Thumbnail" className="w-40 h-40 rounded-md shadow-md" />
            </div>
          )}
          <button
            onClick={handleDownloadClick}
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          >
            <Download className="w-5 h-5 mr-2" /> Download MP3
          </button>
        </div>
      )}

{showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}

    </div>
  );
}
