import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Download, PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";

export function SoundcloudMp3Downloader() {
  const [soundCloudLink, setsoundCloudLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [streamLink, setStreamLink] = useState(""); // Streaming URL
  const [thumbnail, setThumbnail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
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

  const cleanSoundcloudURL = (url: string) => url.split("?")[0];

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDownloadLink("");
    setStreamLink("");
    setThumbnail("");

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    const currentCredits = await getCredits();

    if (currentCredits <= 0) {
      setShowModal3(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/soundcloud?clerkId=${userId}`, {
        url: cleanSoundcloudURL(soundCloudLink),
      });

      const { download_url, stream_url, albumImage } = response.data.downloadURL.data;
      const audioUrl = stream_url.replace("http://", "https://");
      const downloadSong=download_url.replace("http://", "https://")
      console.log(downloadSong)


      if (response.status === 200 && response.data.downloadURL) {
        setDownloadLink(downloadSong);
        setStreamLink(stream_url); // Set stream URL
        setThumbnail(albumImage || "");
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
    if (downloadLink) window.open(downloadLink, "_blank");
  };

  useEffect(() => {
    if (!isLoading && (downloadLink || streamLink)) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, downloadLink, streamLink]);

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h3 className="text-base mb-2">Copy any song link from Soundcloud and paste it below:</h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={soundCloudLink}
          onChange={(e) => setsoundCloudLink(e.target.value)}
          placeholder="Paste Soundcloud Song Link"
          className="w-full px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !soundCloudLink}
          className={`text-white font-semibold py-3 px-10 rounded-full ${
            isLoading || !soundCloudLink ? "bg-gray-500 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"
          }`}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-gray-600 mt-5">Processing your request...</p>
        </div>
      )}

      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

      {(streamLink || downloadLink) && (
        <div ref={resultsRef} className="mt-4 text-center">
          {thumbnail && (
            <div className="flex justify-center mb-4">
              <img src={thumbnail} alt="Song Thumbnail" className="w-40 h-40 rounded-md shadow-md" />
            </div>
          )}

          {streamLink && (
            <div className="mb-4">
              <audio ref={audioRef} controls className="w-full">
                <source src={streamLink} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <button
            onClick={handleDownloadClick}
            className="text-white font-semibold flex items-center justify-center gap-2 py-3 px-10 rounded-full bg-teal-500 hover:bg-teal-600 w-fit mx-auto"
          >
            <Download className="w-5 h-5" /> Download MP3
          </button>
        </div>
      )}

      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
