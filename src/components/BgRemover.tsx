import { useState, useRef,useEffect} from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
      }, 100);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post<BackgroundRemovalResponse>(
        "https://bigwigmedia-backend.onrender.com/api/v1/response/removebackground",
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
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div
        className="border-4 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
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
                className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300"
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
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
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
                className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300"
              >
                Browse
              </label>
            </div>
          </>
        )}
      </div>
      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-5"
        onClick={handleRemoveBackground}
        disabled={isLoading || !selectedFile || !!processedImageUrl}
      >
        {isLoading ? "Processing" : "Remove Background"}
      </Button>

      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
          <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {processedImageUrl && (
        <div ref={resultsRef} className="mt-6 flex flex-col items-center">
          <img src={processedImageUrl} alt="Processed" className="w-full max-w-xs mb-4" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 mt-2"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      )}
    </div>
  );
}