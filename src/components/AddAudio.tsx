import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download,Share2 } from "lucide-react";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import { BASE_URL } from "@/utils/funcitons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";


export function VideoAudioTrimmer() {
  const [isLoading, setIsLoading] = useState(false);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [videoStart, setVideoStart] = useState(0);
  const [videoEnd, setVideoEnd] = useState(0);
  const [audioStart, setAudioStart] = useState(0);
  const [audioEnd, setAudioEnd] = useState(0);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setOutputVideoUrl(null); // Reset the output video URL
      setVideoStart(0);
      setVideoEnd(0);
    }
  };
  

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setOutputVideoUrl(null); // Reset the output video URL
      setAudioStart(0);
      setAudioEnd(0);
    }
  };
  

  const refreshConverter = () => {
    window.location.reload();
  };

  const handleConvertClick = async () => {
    if (!selectedVideoFile || !selectedAudioFile) {
      toast.error("Please select both video and audio files.");
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      setIsLoading(true);
      setShowLoader(true);
      

      const formData = new FormData();
      formData.append("video", selectedVideoFile);
      formData.append("audio", selectedAudioFile);
      formData.append("videoStart", videoStart.toString());
      formData.append("videoEnd", videoEnd.toString());
      formData.append("audioStart", audioStart.toString());
      formData.append("audioEnd", audioEnd.toString());

      const response = await axios.post(`${BASE_URL}/response/addAudio?clerkId=${userId}`, formData, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setOutputVideoUrl(url);
        toast.success("Video created successfully.");
      } else {
        toast.error("Error creating video. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error("Error creating video. Please try again later.");
    } finally {
      setIsLoading(false);
      setShowLoader(false);
    }
  };

  const handleDownloadClick = () => {
    if (!outputVideoUrl) return;
    const link = document.createElement('a');
    link.href = outputVideoUrl;
    link.setAttribute('download', 'output.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = () => {
    if (navigator.share && outputVideoUrl) {
      fetch(outputVideoUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "video.mp4", { type: "video/mp4" });
          navigator
            .share({
              title: "Add audio into video",
              files: [file],
            })
            .catch((error) => console.error("Error sharing:", error));
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  

  useEffect(() => {
    if (!isLoading && outputVideoUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, outputVideoUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
        <div className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center">
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                ref={videoInputRef}
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleVideoChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => videoInputRef.current?.click()}
              >
                Select Video File
              </Button>
              {selectedVideoFile && (
                <p className="text-gray-300 mt-2">{selectedVideoFile.name}</p>
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
              url={videoUrl}
              controls
              onDuration={setVideoDuration}
              style={{ width: '100%' }}
            />
            <div className="w-11/12 mt-4">
              <div className="flex justify-between">
                <div className="w-1/2 mr-2">
                  <label className="mb-2 text-gray-400">Video Start Time</label>
                  <Slider
                    min={0}
                    max={videoDuration}
                    step={1}
                    value={videoStart}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setVideoStart(value);
                        if (value >= videoEnd) setVideoEnd(value + 1);
                      }
                    }}
                  />
                  <span>{formatTime(videoStart)}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="mb-2 text-gray-400">Video End Time</label>
                  <Slider
                    min={0}
                    max={videoDuration}
                    step={1}
                    value={videoEnd}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setVideoEnd(value);
                        if (value <= videoStart) setVideoStart(value - 1);
                      }
                    }}
                  />
                  <span>{formatTime(videoEnd)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center">
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                ref={audioInputRef}
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleAudioChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => audioInputRef.current?.click()}
              >
                Select Audio File
              </Button>
              {selectedAudioFile && (
                <p className="text-gray-300 mt-2">{selectedAudioFile.name}</p>
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
              onLoadedMetadata={(e: any) => setAudioDuration(e.currentTarget.duration)}
              style={{ width: '100%' }}
            />
            <div className="w-11/12 mt-4">
              <div className="flex justify-between">
                <div className="w-1/2 mr-2">
                  <label className="mb-2 text-gray-400">Audio Start Time</label>
                  <Slider
                    min={0}
                    max={audioDuration}
                    step={1}
                    value={audioStart}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setAudioStart(value);
                        if (value >= audioEnd) setAudioEnd(value + 1);
                      }
                    }}
                  />
                  <span>{formatTime(audioStart)}</span>
                </div>
                <div className="w-1/2 ml-2">
                  <label className="mb-2 text-gray-400">Audio End Time</label>
                  <Slider
                    min={0}
                    max={audioDuration}
                    step={1}
                    value={audioEnd}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        setAudioEnd(value);
                        if (value <= audioStart) setAudioStart(value - 1);
                      }
                    }}
                  />
                  <span>{formatTime(audioEnd)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className=" flex justify-start">
          <p className=" text-base text-gray-400 mt-2">
        👉 Audio and Video length should be same
        </p>
          </div>
        <div className="flex justify-center mt-10 mb-5">
        
          <Button
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${selectedVideoFile && selectedAudioFile ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!selectedVideoFile || !selectedAudioFile || isLoading}
          >
            {isLoading ? "Processing..." : 'Combine Video and Audio'}
          </Button>
        </div>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {showLoader && (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        )}
        {outputVideoUrl && (
          <div ref={resultsRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
            
            <div className="mt-4 w-full text-center">
              <ReactPlayer url={outputVideoUrl} controls className="w-full mb-4" />
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
                onClick={handleDownloadClick}
              title="Download">
                Download
                <Download className="w-6 h-6 text-white" />
              </Button>
              <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-4"
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