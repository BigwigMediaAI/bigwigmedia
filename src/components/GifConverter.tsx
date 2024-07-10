import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download, Upload, Share2 } from "lucide-react";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import 'rc-slider/assets/index.css';

export function GifConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    
    // Clear existing GIF and reset related states
    setGifUrl(null);
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
  };

  const handleConvertClick = async () => {
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      setIsLoading(true);
      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("video", inputRef.files[0]);
      formData.append("start", new Date(startTime * 1000).toISOString().substr(11, 8));
      formData.append("end", new Date(endTime * 1000).toISOString().substr(11, 8));
      
      const response = await axios.post(`${BASE_URL}/response/gif?clerkId=${userId}`, formData, {
        responseType: 'blob' // Important to handle binary data
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setGifUrl(url);
        toast.success("GIF generated successfully.");
      } else {
        toast.error("Error generating GIF. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating GIF:", error);
      toast.error("Error generating GIF. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.setAttribute('download', 'output.gif');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = () => {
    if (navigator.share && gifUrl) {
      fetch(gifUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "generated.gif", { type: "image/gif" });
          navigator
            .share({
              title: "generated gif",
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
    if (!isLoading && gifUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, gifUrl]);

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
              <Upload className="w-12 h-12 text-gray-400" />
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
            {isLoading ? "Generating GIF..." : 'Generate GIF'}
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          gifUrl && (
            <div ref={resultsRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <img src={gifUrl} alt="Generated GIF" className="w-1/2 mb-4 mx-auto" />
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
                  onClick={handleDownloadClick}
                title="Download">
                  Download GIF
                  <Download className="w-6 h-6 text-white" />
                </Button>
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-4"
                  onClick={handleShareClick}
                title="Share">
                  Share GIF
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
