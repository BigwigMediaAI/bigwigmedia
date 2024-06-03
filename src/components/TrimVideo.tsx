import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState,useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimmedVideoRef = useRef<HTMLDivElement>(null);
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

    // Clear existing trimmed video and reset related states
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

    // Clear existing trimmed video and reset related states
    setTrimmedVideoUrl(null);
    setStartTime(0);
    setEndTime(0);
  };

  const handleConvertClick = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("video", inputRef.files[0]);
      formData.append("startTime", new Date(startTime * 1000).toISOString().substr(11, 8));
      formData.append("endTime", new Date(endTime * 1000).toISOString().substr(11, 8));
      const response = await axios.post(`${BASE_URL}/response/trim-video?clerkId=${userId}`, formData, {
        responseType: 'blob' // Important to handle binary data
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

  const handleVideoDuration = (duration: number) => {
    setVideoDuration(duration);
    setEndTime(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  // Effect to clear trimmed video URL when startTime or endTime changes
  useEffect(() => {
    setTrimmedVideoUrl(null);
  }, [startTime, endTime]);

  // Effect to scroll to the trimmed video section when trimmedVideoUrl changes
  useEffect(() => {
    if (trimmedVideoUrl && trimmedVideoRef.current) {
      trimmedVideoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trimmedVideoUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
        <div
          className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Video File
              </Button>
              {selectedFileName && (
                <p className="text-gray-300 mt-2">{selectedFileName}</p>
              )}
              <p className="text-gray-400">or drag and drop a video file</p>
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
                <label className="mb-2 text-gray-400">Start time</label>
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
                <label className="mb-2 text-gray-400"> End time</label>
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
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Trim Video'}
          </Button>
        </div>
      </div>
      {trimmedVideoUrl && (
        <div ref={trimmedVideoRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
          <div className="mt-4 w-full text-center">
            <ReactPlayer
              url={trimmedVideoUrl}
              controls
              width="100%"
            />
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-5"
              onClick={handleDownloadClick}
            >
              Download
              <Download className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}