import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Clipboard, Share2, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";

export function SvgConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageGenerated, setIsImageGenerated] = useState(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setImageUrl("");
      setIsImageGenerated(false);
    } else {
      toast.error("Please select a JPG or PNG image.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setSelectedFile(file);
      setImageUrl("");
      setIsImageGenerated(false);
    } else {
      toast.error("Please drop a JPG or PNG image file.");
    }
  };

  const refreshSelection = () => {
    window.location.reload();
  };

  const convertImage = async () => {
    setIsLoading(true);
    setImageUrl("");
    setIsImageGenerated(false);

    // Scroll to loader after a short delay to ensure it's rendered
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
      if (!selectedFile) {
        toast.error("Please select an image.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`${BASE_URL}/response/svgconvert?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "image/svg+xml" });
        const url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        setIsImageGenerated(true);
        toast.success("Conversion successful. Ready to download.");
      } else {
        toast.error("Error converting image. Please try again later.");
      }
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Error converting image. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && imageUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, imageUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Fetch the image from the URL and convert it to a Blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
  
        // Create a file from the Blob
        const file = new File([blob], "converted-image.svg", { type: blob.type });
  
        // Use Web Share API to share the file
        await navigator.share({
          title: "Converted Image",
          text: "Here is the converted SVG image.",
          files: [file], // Ensure the file is passed correctly
        });
  
        toast.success("Image shared successfully.");
      } catch (error) {
        console.error("Error sharing image:", error);
        toast.error("Error sharing image. Please try again later.");
      }
    } else {
      toast.error("Sharing is not supported on this device.");
    }
  };
  

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "converted-image.svg";
    a.click();
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)]  p-6 mb-5 rounded-md w-full flex items-center justify-between"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-full flex flex-col items-center justify-center">
        <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="imageInput"
          />
          <Button
            className="border border-[var(--gray-color)] text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100 w-48 text-ellipsis overflow-hidden whitespace-nowrap"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {selectedFile ? selectedFile.name : "Browse Files"}
          </Button>
          <p className="text-gray-600">or drag and drop an image (JPG or PNG)</p>
        </div>
        
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={convertImage}
          disabled={!selectedFile}
        >
          {isLoading ? "Converting..." : imageUrl ? "Convert Again" : "Convert"}
        </Button>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          imageUrl && (
            <div ref={resultsRef} className="mt-5 text-center">
              <img src={imageUrl} alt="Converted image" className="mx-auto mb-5 w-72" />
              <div className="flex">
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleDownload}
              title="Download">
                Download
              </Button>
              <Button
                className=" text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleShare}
             title="Share" >
                Share
                
              </Button>
              </div>
            </div>
          )
        )}
      </div>
      
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
