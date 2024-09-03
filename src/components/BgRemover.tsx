import { useState, useRef,useEffect} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";


// Define the expected structure of the API response
interface BackgroundRemovalResponse {
  downloadUrl: string;
  backgroundRemovedImageUrl: {
    response: {
      image_url: string;
    };
  };
}

export function BackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setOriginalImageUrl(file ? URL.createObjectURL(file) : null);
    setProcessedImageUrl(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    setOriginalImageUrl(file ? URL.createObjectURL(file) : null);
    setProcessedImageUrl(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      toast.error("Please select an image file to process");
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
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post<BackgroundRemovalResponse>(
        `${BASE_URL}/response/removebackground?clerkId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        const { backgroundRemovedImageUrl } = res.data;
        const backgroundRemovedImageUrlStr = backgroundRemovedImageUrl.response.image_url;

        if (backgroundRemovedImageUrlStr) {
          setProcessedImageUrl(backgroundRemovedImageUrlStr);
          toast.success("Background removed successfully");
        } else {
          toast.error("Error processing image");
        }
      } else {
        toast.error("Error removing background");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement("a");
      link.href = processedImageUrl;
      link.setAttribute("download", "background_removed_image.png"); // Name of the file to be downloaded
      document.body.appendChild(link);
      link.click(); // Simulate a click to start the download
      document.body.removeChild(link); // Clean up the DOM
    }
  };

  useEffect(() => {
    if (!isLoading && processedImageUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, processedImageUrl]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <div className="relative mb-4">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer p-2 bg-[var(--white-color)] text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Browse
              </label>
            </div>
            {originalImageUrl && (
              <img src={originalImageUrl} alt="Original" className="w-full max-w-xs mb-4" />
            )}
            <RefreshCwIcon
              className="w-8 h-8 text-gray-400 mt-2 cursor-pointer"
              onClick={handleRefresh}
            />
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop an image here, or click to browse</p>
            <div className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer p-2 bg-[var(--white-color)] text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100 "
              >
                Browse
              </label>
            </div>
          </>
        )}
      </div>
      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
        onClick={handleRemoveBackground}
        disabled={isLoading || !selectedFile || !!processedImageUrl}
      >
        {isLoading ? "Processing" : "Remove Background"}
      </Button>

      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {processedImageUrl && (
        <div ref={resultsRef} className="mt-6 flex flex-col items-center">
          <img src={processedImageUrl} alt="Processed" className="w-full max-w-xs mb-4" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] mt-2"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}