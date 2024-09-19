import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { Loader2, RefreshCw, Download, UploadIcon, Share2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

export function FacebookImageTool() {
  const [image, setImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Define resize options for Facebook image types
  const resizeOptions: Record<string, { width: number; height: number }> = {
    "Facebook Profile Picture": { width: 180, height: 180 },
    "Facebook Cover Photo": { width: 820, height: 312 },
    "Facebook Shared Image": { width: 1200, height: 630 },
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
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
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
      formData.append("image", image);
      formData.append("platform", "facebook");
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
    if (file) {
      setImage(file);
    }
  };

  const refreshSelection = () => {
    setImage(null);
    setImageType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!isLoading && resizedImage) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, resizedImage]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <div
            className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <Button
              className="border border-gray-300 text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Image File
            </Button>
            {image && (
                <p className="text-[var(--primary-text-color)] mt-2 text-center">{image.name}</p>
              )}
            <p className="text-gray-400">or drag and drop an image here</p>
            <Button
              className="absolute top-1 right-1 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshSelection}
            >
              &#x21bb;
            </Button>
          </div>
          <select
            className="mb-4 w-full rounded-md border border-[var(--primary-text-color)] p-4"
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
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
              onClick={handleSubmit}
              disabled={!image || !imageType}
            >
              {isLoading ? "Generating..." : resizedImage ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Resizing image. Please wait...</p>
          </div>
        ) : resizedImage ? (
          <div ref={resultsRef} className="w-full">
            <img src={resizedImage} alt="Resized" className="w-48 m-auto" />
            <div className="flex gap-5">
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
              onClick={handleDownload}
            title="Download">
              Download
            </Button>
            <Button
              className="mt-5 text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
              onClick={handleShare}
            title="Share">
              <Share2 className="inline-block w-4 h-4 mr-2" />
              Share
            </Button>
            </div>
          </div>
        ) : null}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
