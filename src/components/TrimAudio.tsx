import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download } from "lucide-react";
import ReactAudioPlayer from "react-audio-player";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

export function AudioTrimmer() {
  const [isLoading, setIsLoading] = useState(false);
  const [trimmedAudioUrl, setTrimmedAudioUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
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
    setAudioUrl(url);

    setTrimmedAudioUrl(null);
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
    setAudioUrl(url);
  };

  const handleConvertClick = async () => {
    try {
      setIsLoading(true);
      setShowLoader(true);

      if (loaderRef.current) {
        loaderRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("audio", inputRef.files[0]);
      formData.append("startTime", new Date(startTime * 1000).toISOString().substr(11, 8));
      formData.append("endTime", new Date(endTime * 1000).toISOString().substr(11, 8));
      const response = await axios.post(`${BASE_URL}/response/trim-audio?clerkId=${userId}`, formData, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setTrimmedAudioUrl(url);
        toast.success("Audio trimmed successfully.");
      } else {
        toast.error("Error trimming audio. Please try again later.");
      }
    } catch (error) {
      console.error("Error trimming audio:", error);
      toast.error("Error trimming audio. Please try again later.");
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const handleDownloadClick = () => {
    if (!trimmedAudioUrl) return;
    const link = document.createElement('a');
    link.href = trimmedAudioUrl;
    link.setAttribute('download', 'output.mp3');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAudioDuration = (duration: number) => {
    setAudioDuration(duration);
    setEndTime(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    setTrimmedAudioUrl(null);
  }, [startTime, endTime]);

  useEffect(() => {
    if (trimmedAudioUrl && audioRef.current) {
      audioRef.current.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [trimmedAudioUrl]);

  useEffect(() => {
    if (showLoader && loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [showLoader]);

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
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Audio File
              </Button>
              {selectedFileName && (
                <p className="text-gray-300 mt-2">{selectedFileName}</p>
              )}
              <p className="text-gray-400">or drag and drop an audio file</p>
            </div>
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshConverter}
            />
          </div>
        </div>
        {audioUrl && (
          <div className="flex flex-col items-center mb-5 w-full">
            <ReactAudioPlayer
              src={audioUrl}
              controls
              onLoadedMetadata={(e: any) => handleAudioDuration(e.currentTarget.duration)}
              style={{ width: '100%' }}
            />
            <div className="w-11/12 mt-4">
              <div className="flex justify-between">
                <div className="w-1/2 mr-2">
                  <label className="mb-2 text-gray-400">Start time</label>
                  <Slider
                    min={0}
                    max={audioDuration}
                    step={1}
                    value={startTime}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setStartTime(value);
                        if (value >= endTime) setEndTime(value + 1);
                      }
                    }}
                  />
                  <span>{formatTime(startTime)}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="mb-2 text-gray-400">End time</label>
                  <Slider
                    min={0}
                    max={audioDuration}
                    step={1}
                    value={endTime}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setEndTime(value);
                        if (value <= startTime) setStartTime(value - 1);
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
            {isLoading ? "Snipping..." : 'Snip Audio'}
          </Button>
        </div>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 text-gray-300" />
            <p className="text-gray-300 text-center mt-4">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          trimmedAudioUrl && (
            <div ref={audioRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <ReactAudioPlayer src={trimmedAudioUrl} controls className="w-full mb-4" />
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
                  onClick={handleDownloadClick}
                title="Download">
                  Download
                  <Download className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
