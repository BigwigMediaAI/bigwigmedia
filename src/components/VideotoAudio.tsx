import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, RefreshCw, UploadIcon,Share2 } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

export function AudioConverter() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const { userId } = useAuth();
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits]=useState(0);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideoFile(event.target.files[0]);
      setVideoPreviewUrl(URL.createObjectURL(event.target.files[0])); // Set video preview URL
    }
  };

  const handleDownload = async () => {
    if (!videoFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

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
      const response = await axios.post(
        `${BASE_URL}/response/convert?clerkId=${userId}`,
        formData,
        {
          responseType: "blob", // Important for downloading binary data
        }
      );

      // Create a URL for the blob object
      const audioUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Set download link
      setDownloadLink(audioUrl);

      // Set audio URL for playback
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloadLink) {
      // Trigger download
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = "audio.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadLink);
    }
  };

  const handleShare = async () => {
    if (downloadLink) {
      try {
        const response = await fetch(downloadLink);
        const blob = await response.blob();
        const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

        if (navigator.share) {
          await navigator.share({
            title: "Converted Audio",
            text: "Check out this converted audio file!",
            files: [file],
          });
        } else {
          alert("Sharing is not supported in this browser.");
        }
      } catch (error) {
        console.error("Error sharing file:", error);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && audioUrl) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, audioUrl]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setVideoFile(files[0]);
      setVideoPreviewUrl(URL.createObjectURL(files[0])); // Set video preview URL
    }
  };

  const removeFile = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
  };

  const refreshSelection = () => {
    window.location.reload();
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        ref={dropZoneRef}
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* File selection area */}
        <div className="flex flex-col items-center w-full relative">
          {/* Browse button */}
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <input
            type="file"
            id="fileInput"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </button>
          <p className="text-gray-400">or drag and drop files</p>
          {/* Refresh button */}
          <RefreshCw
            className="absolute top-1 right-1 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection}
          />
        </div>
        {/* Display selected file */}
        <div className="mt-4 w-full text-center">
          {videoFile && (
            <div className="text-[var(--primary-text-color)]">
              <span>{videoFile.name}</span>
              <button onClick={removeFile} className="text-[var(--primary-text-color)] ml-5 hover:text-gray-500">
                &#x2715;
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Video preview section */}
      {videoPreviewUrl && (
        <div className="mt-5 flex justify-center items-center">
          <video controls className="max-w-full" style={{ maxHeight: '300px' }}>
            <source src={videoPreviewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {/* Convert to MP3 button */}
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleDownload}
          disabled={!videoFile || isLoading}
        >
          {isLoading ? "Converting..." : audioUrl ? "Convert Again" : "Convert to MP3"}
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          audioUrl && (
            <div ref={resultsRef} className="mt-5 text-center w-full m-auto">
              <audio controls className="mb-5 w-96 m-auto">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="flex gap-5">
              <button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleDownloadClick}
              title="Download">
                Download
              </button>
              <button
                className=" text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleShare}
             title="Share" >
                Share
              </button>
              </div>
              
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
