import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from "react";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setVideoPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setVideoPreviewUrl(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setFile(null);
    setVideoPreviewUrl("");
    setDownloadUrl("");
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    setIsLoading(true);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/compressedVideo?clerkId=${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Update progress here if needed
          }
        },
      });

      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        setDownloadUrl(url);
        toast.success("File compressed successfully!");
      } else {
        toast.error("An error occurred while compressing the file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && downloadUrl) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, downloadUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compressed Video',
          files: [new File([await (await fetch(downloadUrl)).blob()], 'compressed_video.mp4', { type: 'video/mp4' })]
        });
        toast.success("Video shared successfully!");
      } catch (error) {
        toast.error("An error occurred while sharing the video.");
      }
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col items-center">
        <div
          className="w-full relative mb-4 p-4 border-4 border-dashed border-[var(--gray-color)] flex flex-col items-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload className="w-12 h-12 text-[var(--gray-color)]" />
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="video-upload" className="mt-4 cursor-pointer bg-gray-200 rounded-md py-2 px-4 text-gray-700">
            {file ? file.name : "Select a video file"}
          </label>
          <div className="mt-2 text-xs text-gray-500">Drag and drop a video file here</div>
          <RefreshCw className="absolute top-4 right-4 w-6 h-6 text-blue-500 hover:text-blue-800 cursor-pointer" onClick={handleReset} />
        </div>
        {videoPreviewUrl && !isLoading && (
          <div className="mt-4 w-full">
            <video className="w-full rounded" controls>
              <source src={videoPreviewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <Button
          className="mt-10 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              
              Compressing...
              <Loader2 className="animate-spin w-5 h-5" />
            </>
          ) : (
            "Compress Video"
          )}
        </Button>

        {isLoading && (
          <div ref={loaderRef} className="w-full mt-4">
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)] " />
              <p className="text-[var(--dark-gray-color)] text-justify">Video processing in progress. Timing depends on file size. Thank you for waiting.</p>
            </div>
          </div>
        )}

        

        {downloadUrl && !isLoading && (
          <div ref={resultsRef} className="w-full mt-4 flex flex-col items-center">
            <a
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]  w-fit mx-auto"
              href={downloadUrl}
              download="compressed_video.mp4"
            title="Download">
              Download
            </a>
            <Button
              className="mt-4 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]  w-fit mx-auto"
              onClick={handleShare}
            title="Share">
              Share Video
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
