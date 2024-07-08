import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "../utils/funcitons";
import { Loader2, RefreshCw, Download, UploadIcon, Share2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

export function TwitterImageTool() {
  const [image, setImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const { userId } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Define resize options for Twitter image types
  const resizeOptions: Record<string, { width: number; height: number }> = {
    profilePicture: { width: 400, height: 400 },
    headerPhoto: { width: 1500, height: 500 },
    sharedImage: { width: 1200, height: 675 },
  };

  const imageTypes = Object.keys(resizeOptions); // Get image type options

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageType(e.target.value);
  };

  const handleSubmit = async () => {
    if (!image || !imageType) {
      toast.error("Please select an image and image type.");
      return;
    }

    setIsLoading(true);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("platform", "twitter");
      formData.append("type", imageType);

      const response = await axios.post(`${BASE_URL}/response/resize?clerkId=${userId}`, formData, {
        responseType: "arraybuffer",
      });

      const data = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(data);
      setResizedImage(imageUrl);
    } catch (error:any) {
      console.error("Error resizing image:", error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resizedImage) {
      const link = document.createElement("a");
      link.href = resizedImage;
      link.download = "resized_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (resizedImage) {
      try {
        const response = await fetch(resizedImage);
        const blob = await response.blob();
        const file = new File([blob], "resized_image.jpg", { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Resized Image",
            text: "Check out this resized image!",
            files: [file],
          });
        } else {
          toast.error("Sharing not supported on this device.");
        }
      } catch (error) {
        console.error("Error sharing image:", error);
        toast.error("Failed to share image.");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Please select an image file.");
    }
  };

  const refreshSelection = () => {
    setImage(null);
    setImageType("");
    setResizedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <div
            className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {image ? image.name : "Select Image File"}
            </Button>
            <p className="text-gray-400">or drag and drop files</p>
            <RefreshCw
              className="absolute top-1 right-1 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshSelection}
            />
          
          {image && (
            <div className="mt-4 w-full text-center">
              <ul className="list-none">
                <li key={0} className="text-gray-300">
                  <span className="mr-5">{image.name}</span>
                  <button onClick={removeFile} className="text-gray-300 hover:text-gray-500">
                    &#x2715;
                  </button>
                </li>
              </ul>
            </div>
          )}
          </div>
          <select
            className="mb-4 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            value={imageType}
            onChange={handleImageTypeChange}
          >
            <option value="">Select Image Type</option>
            {imageTypes.map((imageTypeOption) => (
              <option key={imageTypeOption} value={imageTypeOption}>
                {imageTypeOption}
              </option>
            ))}
          </select>
          <div className="flex w-full my-4 items-center justify-between">
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              onClick={handleSubmit}
              disabled={!imageType || isLoading}
            >
              {isLoading ? "Generating..." : resizedImage ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Resizing image. Please wait...</p>
          </div>
        ) : resizedImage ? (
          <div ref={resultsRef} className="w-full">
            <img src={resizedImage} alt="Resized" className="w-full" />
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-5"
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              className="mt-5 text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              onClick={handleShare}
            >
              <Share2 className="inline-block w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
