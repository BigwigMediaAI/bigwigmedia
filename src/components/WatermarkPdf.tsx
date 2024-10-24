import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import CreditLimitModal from "./Model3";
import BigwigLoader from "@/pages/Loader";

export function WatermarkPdf() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [watermarkText, setWatermarkText] = useState("");
  const [textColor, setTextColor] = useState("#000000"); // Default color
  const [fontSize, setFontSize] = useState(60); // Default font size
  const [rotation, setRotation] = useState(0); // Default rotation
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkedPdf, setWatermarkedPdf] = useState<Blob | null>(null);
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

  const watermarkPdf = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error("Please select a PDF file.");
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
      formData.append("pdf", selectedFile);
      if (watermarkType === "text") {
        formData.append("watermark", watermarkText);
        formData.append("color", textColor);
        formData.append("fontSize", fontSize.toString());
        formData.append("rotation", rotation.toString());
      } else {
        if (!watermarkImage) {
          toast.error("Please select an image for the watermark.");
          return;
        }
        formData.append("image", watermarkImage);
      }

      const response = await axios.post(`${BASE_URL}/response/watermarkPdf?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        setWatermarkedPdf(blob);
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
    if (!watermarkedPdf) return;
    const url = window.URL.createObjectURL(watermarkedPdf);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked.pdf"; // Download as a PDF
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
    if (!isLoading && watermarkedPdf) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, watermarkedPdf]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        {/* File selection area */}
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          {/* Browse button */}
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
          
        </div>
        {/* Display selected files */}
        <div className="mt-4 w-full text-center">
        {selectedFile && (
            <p className="text-gray-800">{selectedFile.name}</p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--primary-text-color)]">Select Watermark Type:</h2>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="text"
            checked={watermarkType === "text"}
            onChange={handleWatermarkTypeChange}
            className="mr-2"
          />
          <span className="text-gray-800">Text</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="image"
            checked={watermarkType === "image"}
            onChange={handleWatermarkTypeChange}
            className="mr-2"
          />
          <span className="text-gray-800">Image</span>
        </label>
      </div>

      {watermarkType === "text" && (
        <div>
        <div className="flex gap-5 w-full">
          <div className="mb-5 w-4/5">
          <label className="block text-[var(--primary-text-color)]">Enter Watermark Text:</label>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="e.g. Confidential"
            className="w-full mt-1 block rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
          />
          </div>
          <div className="mb-5 w-1/5">
          <label className="block text-[var(--primary-text-color)]">Choose Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="mb-2 w-14 h-14"
          />
          </div>
          </div>
          <div className="flex gap-5">
          <div className="w-1/2 mb-5">
            <label className="block text-[var(--primary-text-color)]">Choose Font Size:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full mt-1 block rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
            >
              <option value={40}>Small</option>
              <option value={60}>Medium</option>
              <option value={80}>Large</option>
              <option value={90}>Extra Large</option>
              <option value={100}>XX-Large</option>
            </select>
          </div>
          <div className="w-1/2 mb-5">
            <label className="block text-[var(--primary-text-color)]">Select Rotation:</label>
            <select
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value))}
              className="w-full mt-1 block rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
            >
              <option value={0}>No Rotation (0°)</option>
              <option value={45}>45°</option>
            </select>
          </div>
          </div>

  </div>
      )}

      {watermarkType === "image" && (
        <div className="mb-5">
        <h3 className="text-md font-semibold text-[var(--primary-text-color)]">Image Watermark Options:</h3>
        <input
          type="file"
          accept="image/png"
          onChange={handleImageChange}
          className="w-full mt-1 block rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
        
        {/* Add a note below the input */}
        <p className="text-sm text-red-500">Note: Only PNG images are accepted for the watermark.</p>
      </div>
      
      )}

<div ref={loaderRef} className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={watermarkPdf}
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
          watermarkedPdf && (
            <div className="mt-5 text-center">
              
              {/* Embed the generated PDF to display it */}
              <div ref={resultsRef} className="border border-gray-300 shadow-lg p-4 rounded-md">
                <embed 
                  src={URL.createObjectURL(watermarkedPdf)} 
                  type="application/pdf" 
                  width="100%" 
                  height="500px" 
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
