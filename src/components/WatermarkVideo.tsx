import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "../utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

export function WatermarkVideo() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000'); // Default color
  const [fontSize, setFontSize] = useState(28);  // Default font size
  const [position, setPosition] = useState("bottom-right"); // Default position
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkedVideo, setWatermarkedVideo] = useState<Blob | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWatermarkImage(e.target.files[0]);
    }
  };

  const handleWatermarkTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWatermarkType(e.target.value as "text" | "image");
  };

    const watermarkVideo = async () => {
        setIsLoading(true);
        try {
        if (!selectedFile) {
            toast.error("Please select a video file.");
            return;
        }

        // Scroll to loader after a short delay to ensure it's rendered
        setTimeout(() => {
            loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

        const formData = new FormData();
        formData.append("video", selectedFile);
        formData.append("position", position);
        formData.append("watermarkType", watermarkType);

        if (watermarkType === "text") {
            formData.append("text", text);
            formData.append("textColor", textColor);
            formData.append("fontSize", fontSize.toString());
        } else {
            if (!watermarkImage) {
            toast.error("Please select an image for the watermark.");
            return;
            }
            formData.append("watermark", watermarkImage);
        }

        const response = await axios.post(`${BASE_URL}/response/add-watermark?clerkId=${userId}`, formData, {
            responseType: "blob",
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: "video/mp4" });
            setWatermarkedVideo(blob);
        } else {
            toast.error("Error adding the watermark. Please try again later.");
        }
        } catch (error) {
        console.error("Error adding watermark:", error);
        toast.error("Error adding the watermark. Please try again later.");
        } finally {
        setIsLoading(false);
        }
    };

  const handleDownload = () => {
    if (!watermarkedVideo) return;
    const url = window.URL.createObjectURL(watermarkedVideo);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked_video.mp4";
    a.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      setSelectedFile(files[0]);
    }
  };

  useEffect(() => {
    if (!isLoading && watermarkedVideo) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, watermarkedVideo]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center" 
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <div className="flex flex-col items-center w-full">
          <UploadIcon className="w-12 h-12 text-gray-400 mb-4" />
          <input
            type="file"
            id="fileInput"
            accept="video/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Video
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
        </div>
        {selectedFile && (
          <p className="text-gray-800 mt-2">{selectedFile.name}</p>
        )}
      </div>

      <div className="mb-5">
        <h2 className=" font-semibold">Select Watermark Type:</h2>
        <div className="flex gap-5">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="text"
            checked={watermarkType === "text"}
            onChange={handleWatermarkTypeChange}
            className="mr-2 size-4"
          />
          <span>Text</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="image"
            checked={watermarkType === "image"}
            onChange={handleWatermarkTypeChange}
            className="mr-2 size-4"
          />
          <span>Image</span>
        </label>
        </div>
        
      </div>

      {watermarkType === "text" ? (
        <div>
        <label className="block font-bold">Enter Watermark Text:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Confidential"
            className="w-full p-3 border border-[var(--primary-text-color)] rounded mb-4"
          />
        
          <div className="flex gap-5">
          <div className="flex-col w-1/2">
            <label className="block font-bold">Font Size:</label>
            <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full p-3 border border-[var(--primary-text-color)] rounded mb-4"
            >
                <option value={20}>20px</option>
                <option value={28}>28px</option>
                <option value={32}>32px</option>
                <option value={36}>36px</option>
                <option value={40}>40px</option>
                <option value={44}>44px</option>
                <option value={48}>48px</option>
                <option value={50}>50px</option>
            </select>
        </div>
            <div className="w-1/2 flex-col">
          <label className="block font-bold">Choose Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="mb-4 w-12 h-12"
          />
          </div>
          
          
        </div>
        </div>
      ) : (
        <div className="mb-5">
          <label className="block font-bold">Select Watermark Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-[var(--primary-text-color)] rounded mb-4"
          />
        </div>
      )}

      <div className="mb-5">
        <label className="block font-bold">Watermark Position:</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-3 border border-[var(--primary-text-color)] rounded mb-4"
        >
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>

      <div ref={loaderRef} className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={watermarkVideo}
          disabled={!selectedFile|| isLoading}
        >
          {isLoading ? "Adding..." : "Add Watermark"}
        </Button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          watermarkedVideo && (
            <div className="mt-5 text-center">
              
              {/* Embed the generated PDF to display it */}
              <div ref={resultsRef} className=" p-4 rounded-md">
                <video 
                  src={URL.createObjectURL(watermarkedVideo)} 
                  controls
                  className="mx-auto"
                />
              </div>
              <Button
                className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
