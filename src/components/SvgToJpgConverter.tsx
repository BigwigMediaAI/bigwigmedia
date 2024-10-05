import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

export function SvgToJpgConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
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
    if (e.target.files) {
      const file = e.target.files[0];
      if (file && file.type === "image/svg+xml") {
        setSelectedFiles([file]);
      } else {
        toast.error("Please select an SVG image.");
      }
    }
  };

  const convertSVGToJPEG = async () => {
    setIsLoading(true);

    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100); 

    try {
      if (selectedFiles.length === 0) {
        toast.error("Please select an SVG image.");
        return;
      }

      await getCredits();

      const formData = new FormData();
      formData.append("svg", selectedFiles[0]);

      const response = await axios.post(`${BASE_URL}/response/convertsvgtojpg?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "image/jpeg" }); // Change to JPEG
        const url = window.URL.createObjectURL(blob);
        setImageUrl(url);
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

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "converted-image.jpg"; // Update extension to .jpg
    a.click();
  };

  const handleShare = async () => {
    // Check if the Web Share API is available
    if (navigator.share) {
      try {
        // Fetch the blob for the image URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create a File object from the blob
        const file = new File([blob], "converted-image.jpg", { type: "image/jpeg" }); // Change to JPEG

        // Share the image file
        await navigator.share({
          title: "Converted Image",
          text: "Here is the converted SVG image.",
          files: [file],
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type === "image/svg+xml") {
            setSelectedFiles([file]);
          } else {
            toast.error("Please select an SVG image.");
          }
        }}
      >
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <input
            type="file"
            id="fileInput"
            accept="image/svg+xml"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <Button
            className="border border-[var(--gray-color)] text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100 w-48 text-ellipsis overflow-hidden whitespace-nowrap"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {selectedFiles.length > 0 ? selectedFiles[0].name : "Select SVG Image"}
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={convertSVGToJPEG}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? "Converting..." : imageUrl ? "Convert Again" : "Convert SVG"}
        </Button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          imageUrl && (
            <div ref={resultsRef} className="mt-5 text-center">
              <img src={imageUrl} alt="Converted image" className="mx-auto mb-5 w-72" />
              <div className="flex">
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={handleDownload}
                  title="Download"
                >
                  Download
                </Button>
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={handleShare}
                  title="Share"
                >
                  Share
                </Button>
              </div>
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
