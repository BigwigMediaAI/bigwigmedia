import React, { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";



export function AudioConverter() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const {  userId } = useAuth();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleDownload = async () => {
    if (!videoFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await axios.post(`${BASE_URL}/response/convert?clerkId=${userId}`, formData, {
        responseType: "blob", // Important for downloading binary data
      });

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

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 text-black"
      />
      <button
        onClick={handleDownload}
        disabled={!videoFile || isLoading}
        className={`w-full py-2 text-white font-semibold rounded-md ${
          !videoFile || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Converting...' : 'Convert to MP3'}
      </button>
      <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
              <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            <div className="w-full">
            {audioUrl && (
        <audio controls className="mt-4">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {downloadLink && (
        <button
          onClick={handleDownloadClick}
          className="mt-4 w-full px-4 py-2 text-white font-semibold rounded-md bg-green-500 hover:bg-green-600"
        >
          Download MP3
        </button>
      )}
            </div>
          )}
        </div>
      
    </div>
  );
}
