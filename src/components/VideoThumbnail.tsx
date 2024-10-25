import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download, Upload, Share2 } from "lucide-react";
import ReactPlayer from "react-player";
import Slider from "rc-slider";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import 'rc-slider/assets/index.css';
import BigwigLoader from "@/pages/Loader";

export function VideoThumbnail() {
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailUrl, setthumbnailUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [time, settime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const [textOverlay, setTextOverlay] = useState("");
  const [textColor, setTextColor] = useState("black");
  const [textSize, setTextSize] = useState(30);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 20, y: 40 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setTextPosition({ x, y });
    }
  };


  const drawCanvas = useCallback(() => {
    if (!thumbnailUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const img = new Image();
    img.src = thumbnailUrl;
    img.onload = () => {
      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      // Draw the image
      context.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw the text overlay
      context.font = `${isBold ? "bold" : "normal"} ${isItalic ? "italic" : "normal"} ${textSize}px Arial`;
      context.fillStyle = textColor;
      context.fillText(textOverlay, textPosition.x, textPosition.y);

      // Generate download URL
      setDownloadUrl(canvas.toDataURL("image/png"));
    };
  }, [thumbnailUrl, textOverlay, textColor, textSize, isBold, isItalic, textPosition]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);


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
    setVideoUrl(url);
    setPreviewUrl(url);
    
    // Clear existing GIF and reset related states
    setthumbnailUrl(null);
    settime(0);
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
    setIsLoading(true);


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
      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("video", inputRef.files[0]);
      formData.append("time", new Date(time * 1000).toISOString().substr(11, 8));
      
      const response = await axios.post(`${BASE_URL}/response/video-thumbnail?clerkId=${userId}`, formData, {
        responseType: 'blob' // Important to handle binary data
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setthumbnailUrl(url);
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

  const handleVideoDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  useEffect(() => {
    if (!isLoading && thumbnailUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, thumbnailUrl]);

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
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md bg-white hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Video File
              </Button>
              {selectedFileName && (
                <p className="text-[var(--primary-text-color)] mt-2">{selectedFileName}</p>
              )}
              <p className="text-gray-400">or drag and drop a video file</p>
            </div>

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
            <div className="w-11/12 mt-4 text-[var(--primary-text-color)]">
                <div className="w-full mr-2">
                  <label className="mb-2 text-[var(--primary-text-color)]">Select Time</label>
                  <Slider
                    min={0}
                    max={videoDuration}
                    step={1}
                    value={time}
                    onChange={(value) => {
                      if (typeof value === "number") {
                        settime(value);
                        setPreviewUrl(null);
                      }
                    }}
                  />
                  <span>{formatTime(time)}</span>
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
            {isLoading ? "Generating ..." : 'Generate Thumbnail'}
          </Button>
        </div>
      

      <div className="mt-5">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
            thumbnailUrl && (
                <div ref={resultsRef} className="m-auto w-full max-w-2xl rounded-lg bg-white p-6 mt-5 flex flex-col items-center">
                  <div className="mt-4 w-full text-center">
                    
                    <input
                      type="text"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      placeholder="Enter text"
                      className="border p-2 rounded mb-4 w-full"
                    />
                    <div className="flex justify-between mb-4 w-full">
                      <label>
                        Color: 
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="ml-2"
                        />
                      </label>
                      <label>
                        Size: 
                        <input
                          type="number"
                          value={textSize}
                          onChange={(e) => setTextSize(Number(e.target.value))}
                          min="10"
                          max="100"
                          className="ml-2"
                        />
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={isBold}
                          onChange={() => setIsBold(!isBold)}
                        /> Bold
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={isItalic}
                          onChange={() => setIsItalic(!isItalic)}
                        /> Italic
                      </label>
                    </div>
                    <canvas
                      ref={canvasRef}
                      className="w-full mb-4 cursor-crosshair" // Add cursor style for better UX
                      width={400}
                      height={300}
                      onMouseDown={handleMouseDown}
                      onMouseUp={handleMouseUp}
                      onMouseMove={handleMouseMove}
                    />
                    {downloadUrl && (
                      <Button
                        className="mt-2"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = downloadUrl;
                          link.setAttribute("download", "thumbnail_with_text.png");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        Download Image
                      </Button>
                    )}
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
