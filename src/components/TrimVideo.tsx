import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download,Upload,Share2 } from "lucide-react";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

export function VideoTrimmer() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimmedVideoRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleFileChange = () => {
    const inputRef = fileInputRef.current;
    if (!inputRef) return;

    const file = inputRef.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsFileSelected(true);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setPreviewUrl(url);

    setTrimmedVideoUrl(null);
    setStartTime(0);
    setEndTime(0);
  };

  const refreshConverter = () => {
    window.location.reload();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const inputRef = fileInputRef.current;
    if (!inputRef) return;
    inputRef.files = files;

    const file = files[0];
    setSelectedFileName(file.name);
    setIsFileSelected(true);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setPreviewUrl(url);

    setTrimmedVideoUrl(null);
    setStartTime(0);
    setEndTime(0);
  };

  const handleConvertClick = async () => {
    try {
      setIsLoading(true);
      setShowLoader(true);

      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("video", inputRef.files[0]);
      formData.append("startTime", new Date(startTime * 1000).toISOString().substr(11, 8));
      formData.append("endTime", new Date(endTime * 1000).toISOString().substr(11, 8));
      const response = await axios.post(`${BASE_URL}/response/trim-video?clerkId=${userId}`, formData, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setTrimmedVideoUrl(url);
        toast.success("Video trimmed successfully.");
      } else {
        toast.error("Error trimming video. Please try again later.");
      }
    } catch (error) {
      console.error("Error trimming video:", error);
      toast.error("Error trimming video. Please try again later.");
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const handleDownloadClick = () => {
    if (!trimmedVideoUrl) return;
    const link = document.createElement('a');
    link.href = trimmedVideoUrl;
    link.setAttribute('download', 'trimmed_video.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = () => {
    if (navigator.share && trimmedVideoUrl) {
      fetch(trimmedVideoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "video.mp4", { type: "video/mp4" });
          navigator
            .share({
              title: "trimmed video",
              files: [file],
            })
            .catch((error) => console.error("Error sharing:", error));
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  const handleVideoDuration = (duration: number) => {
    setVideoDuration(duration);
    setEndTime(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    setTrimmedVideoUrl(null);
  }, [startTime, endTime]);

  useEffect(() => {
    if (showLoader && loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [showLoader]);

  useEffect(() => {
    if (trimmedVideoUrl && trimmedVideoRef.current) {
      trimmedVideoRef.current.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [trimmedVideoUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
        <div
          className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
            <Upload className="w-12 h-12 text-[var(--gray-color)]" />
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Video File
              </Button>
              
              <p className="text-gray-400">or drag and drop a video file</p>
              {selectedFileName && (
                <p className="text-[var(--primary-text-color)] text-center mt-2">{selectedFileName}</p>
              )}
            </div>
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshConverter}
            />
          </div>
        </div>

        {videoUrl && (
          <div className="flex flex-col items-center mb-5 w-full">
            <ReactPlayer
              url={previewUrl || videoUrl}
              controls
              width="100%"
              onDuration={handleVideoDuration}
            />
            <div className="w-11/12 mt-4">
              <div className="flex justify-between">
                <div className="w-1/2 mr-2">
                  <label className="mb-2 text-[var(--primary-text-color)]">Start time</label>
                  <Slider
                    min={0}
                    max={videoDuration}
                    step={1}
                    value={startTime}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setStartTime(value);
                        if (value >= endTime) setEndTime(value + 1);
                        setPreviewUrl(null);
                      }
                    }}
                  />
                  <span>{formatTime(startTime)}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="mb-2 text-[var(--primary-text-color)]">End time</label>
                  <Slider
                    min={0}
                    max={videoDuration}
                    step={1}
                    value={endTime}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setEndTime(value);
                        if (value <= startTime) setStartTime(value - 1);
                        setPreviewUrl(null);
                      }
                    }}
                  />
                  <span>{formatTime(endTime)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center mb-5">
          <Button
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected || isLoading}
          >
            {isLoading ? "Snipping..." : 'Snip Video'}
          </Button>
        </div>
        
        {isLoading && (
          <div ref={loaderRef} className="w-full mt-10 flex flex-col items-center justify-center m-auto  max-w-4xl rounded-b-md">
            <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-center mt-4 mb-10">Data processing in progress. Please bear with us...</p>
          </div>
        )}
      
      {trimmedVideoUrl && (
        <div ref={trimmedVideoRef} className="m-auto w-full max-w-2xl rounded-lg bg-white p-6  mt-5 flex flex-col items-center">
          <div className="mt-4 w-full text-center">
            <ReactPlayer
              url={trimmedVideoUrl}
              controls
              width="100%"
            />
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
              onClick={handleDownloadClick}
            title="Download">
              Download
              <Download className="w-6 h-6 text-white" />
            </Button>
            <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                  onClick={handleShareClick}
                title="Share">
                  Share
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
