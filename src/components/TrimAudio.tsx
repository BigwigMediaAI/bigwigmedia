import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download, Upload, Share2 } from "lucide-react";
import ReactAudioPlayer from "react-audio-player";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import BigwigLoader from "@/pages/Loader";

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
      const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
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

  const handleShareClick = async () => {
    if (!trimmedAudioUrl) return;
    try {
      const blob = await fetch(trimmedAudioUrl).then(res => res.blob());
      const file = new File([blob], 'trimmed-audio.mp3', { type: blob.type });
      if (navigator.share) {
        await navigator.share({
          title: 'Trimmed Audio',
          files: [file],
        });
        toast.success("Audio shared successfully.");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing audio:", error);
      toast.error("Error sharing audio. Please try again later.");
    }
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
      audioRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [trimmedAudioUrl]);

  useEffect(() => {
    if (showLoader && loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showLoader]);

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
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Audio File
              </Button>
              
              <p className="text-gray-400">or drag and drop an audio file</p>
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
                  <label className="mb-2 text-[var(--primary-text-color)]">Start time</label>
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
                  <label className="mb-2 text-[var(--primary-text-color)]">End time</label>
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
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected || isLoading}
          >
            {isLoading ? "Snipping..." : 'Snip Audio'}
          </Button>
        </div>
      

        <div className="w-full pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
          ) : (
            trimmedAudioUrl && (
              <div ref={audioRef} className="m-auto w-full max-w-2xl rounded-lg bg-white p-6  mt-5 flex flex-col items-center">
                <div className="mt-4 w-full text-center">
                  <ReactAudioPlayer src={trimmedAudioUrl} controls className="w-full mb-4" />
                  <div className="flex justify-center gap-4">
                    <Button
                      className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                      onClick={handleDownloadClick}
                      title="Download"
                    >
                      Download
                      <Download className="w-6 h-6 text-white" />
                    </Button>
                    <Button
                      className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                      onClick={handleShareClick}
                      title="Share"
                    >
                      Share
                      <Share2 className="w-6 h-6 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
