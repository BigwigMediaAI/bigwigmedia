import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Clipboard, Share2 } from "lucide-react";
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
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)]  p-6 mb-5 rounded-md w-full flex items-center justify-between"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="w-full flex flex-col items-center justify-center">
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="imageInput"
          />
          <Button
            className="border border-[var(--gray-color)] text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {selectedFile ? selectedFile.name : "Browse Files"}
          </Button>
          <p className="text-gray-600">or drag and drop an image (JPG or PNG)</p>
        </div>
        <RefreshCw
          className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
          onClick={refreshSelection}
        />
      </div>
      {isLoading && (
        <div ref={loaderRef} className="flex flex-col items-center mt-5">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)] mt-10" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {isImageGenerated && (
        <div ref={resultsRef} className="flex flex-col items-center mt-5">
          <img src={imageUrl} alt="Converted image" className="w-40 h-40 mb-4" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit"
            onClick={() => {
              const a = document.createElement("a");
              a.href = imageUrl;
              a.download = "converted-image.svg";
              a.click();
            }}
          title="Download">
            Download
          </Button>
          <Button
                className="mt-3 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleShare}
              title="Share">
                Share
                
              </Button>
        </div>
      )}
      {!isImageGenerated && (
        <div className="mt-5 flex justify-center">
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
            onClick={convertImage}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Converting..." : "Convert Image"}
          </Button>
         
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
