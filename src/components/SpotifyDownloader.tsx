import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Download, Loader2, Share2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import CreditLimitModal from "./Model3";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

export function SpotifyMp3Downloader() {
  const [spotifyLink, setSpotifyLink] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [cover, setCover] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  // Define maximum number of retries
  const MAX_RETRIES = 3;
  let retryCount = 0;

  const handleDownload = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setDownloadLink("");
    setSongTitle("");
    setArtist("");
    setAlbum("");
    setCover("");

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // Create a function that will attempt to fetch the song and handle retries
    const fetchSong = async () => {
      try {
        const response = await axios.get(
          `https://spotify-downloader9.p.rapidapi.com/downloadSong`,
          {
            params: { songId: encodeURIComponent(spotifyLink) },
            headers: {
              "x-rapidapi-key": "b3402da2eemsh9f38aabddad6fabp1be739jsn49f1254bdd37",
              "x-rapidapi-host": "spotify-downloader9.p.rapidapi.com",
            },
          }
        );

        // Check if the response and data are valid before destructuring
        if (response.status === 200 && response.data?.data) {
          const { title, artist, album, cover, downloadLink } = response.data.data;

          // Update the state with the valid data
          setSongTitle(title || "Unknown Title");
          setArtist(artist || "Unknown Artist");
          setAlbum(album || "Unknown Album");
          setCover(cover || "");
          setDownloadLink(downloadLink || "");

        } else {
          throw new Error("Error: Unable to fetch the song download link.");
        }
      } catch (error) {
        if (error instanceof Error) {
          // Retry the fetch if the error occurs and retry count is less than MAX_RETRIES
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.warn(`Retrying... attempt ${retryCount}`);
            fetchSong(); // Retry the fetch
          } else {
            setErrorMessage("Error: " + error.message);
          }
        } else {
          setErrorMessage("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchSong function to start the download process
    fetchSong();
  };

  const handleDownloadClick = () => {
    if (downloadLink) {
      window.open(downloadLink, "_blank");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpotifyLink(e.target.value);
    setDownloadLink("");
    setSongTitle("");
    setArtist("");
    setAlbum("");
    setCover("");
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!isLoading && downloadLink) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, downloadLink]);

  return (
    <div className="m-auto w-full max-w-xl mx-auto mt-8 bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] rounded-lg">
      <h3 className="text-base mb-2 text-[var(--primary-text-color)]">
        Copy any song link from Spotify and paste it in the box below:
      </h3>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={spotifyLink}
          onChange={handleInputChange}
          placeholder="Paste Spotify Song Link"
          className="w-full px-4 py-2 rounded-md border border-[var(--primary-text-color)] focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleDownload} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={isLoading || !spotifyLink}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
            isLoading || !spotifyLink
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit"
          }`}
        >
          {isLoading ? (
            <>
              Downloading...
              <Loader2 className="animate-spin mr-2 inline-block" />
            </>
          ) : (
            "Download MP3"
          )}
        </button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}

      {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

      {downloadLink && (
        <div ref={resultsRef} className="mt-4">
          <div className="flex flex-col items-center">
            {cover && <img src={cover} alt="Album Cover" className="w-40 h-40 rounded-lg" />}
            <p className="mt-2 text-lg font-semibold text-[var(--primary-text-color)]">{songTitle}</p>
            <p className="text-sm text-gray-600">Artist: {artist}</p>
            <p className="text-sm text-gray-600">Album: {album}</p>
          </div>
          <div className="flex items-center justify-center mt-3 gap-3">
            <button
              onClick={handleDownloadClick}
              className="text-white py-3 px-10 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] flex items-center justify-between"
            >
              Download
              <Download />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
