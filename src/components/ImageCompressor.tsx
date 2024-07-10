import { Button } from "@/components/ui/button"; // Replace with your button component
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Share2, UploadIcon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

export function ImageCompressor() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageGenerated, setIsImageGenerated] = useState(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.includes("image/")) {
      setSelectedFile(file);
      // Clear previously compressed image
      if (imageUrl) {
        setImageUrl("");
        setIsImageGenerated(false);
      }
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes("image/")) {
      setSelectedFile(file);
      // Clear previously compressed image
      if (imageUrl) {
        setImageUrl("");
        setIsImageGenerated(false);
      }
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setImageUrl("");
    setIsImageGenerated(false);
  };

  const compressImage = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error("Please select an image.");
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`${BASE_URL}/response/compressImage?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "image/jpeg" });
        const url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        setIsImageGenerated(true);
        toast.success("Image compressed successfully. Ready to download.");

        // Scroll to results after compression
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      } else {
        toast.error("Error compressing image. Please try again later.");
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Error compressing image. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Converted Image",
          text: "Here is the converted PNG image.",
          files: [new File([await fetch(imageUrl).then(r => r.blob())], "converted-image.png", { type: "image/png" })],
        });
        toast.success("Image shared successfully.");
      } catch (error) {
        toast.error("Error sharing image. Please try again later.");
      }
    } else {
      toast.error("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div
        className="border border-gray-300 p-6 mb-5 rounded-md w-full flex items-center justify-between"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="imageInput"
          />
          <Button
            className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {selectedFile ? selectedFile.name : "Browse Files"}
          </Button>
          <p className="text-gray-600">or drag and drop an image file</p>
        </div>
        <RefreshCw
          className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
          onClick={refreshSelection}
        />
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
        <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
      </div>
      )}
      {isImageGenerated && (
        <div className="flex flex-col items-center mt-5" ref={resultsRef}>
          <img src={imageUrl} alt="Compressed image" className="w-40 h-40 mb-4" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
            onClick={() => {
              const a = document.createElement("a");
              a.href = imageUrl;
              a.download = "compressed-image.jpg";
              a.click();
            }}
          >
            Download
          </Button>
          <Button
                className="mt-3 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                onClick={handleShare}
              >
                Share Image
                <Share2/>
              </Button>
        </div>
      )}
      {!isImageGenerated && (
        <div className="mt-5 flex justify-center">
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
            onClick={compressImage}
            disabled={!selectedFile || isLoading}
          >
            Compress Image
          </Button>
        </div>
      )}
    </div>
  );
}
