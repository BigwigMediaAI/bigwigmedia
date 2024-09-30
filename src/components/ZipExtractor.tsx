import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

// Define the type for the extracted files
interface ExtractedFile {
  filename: string;
  url: string;
}

export function ZipExtractor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null); // State to track hovered file
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
    setExtractedFiles([]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    setExtractedFiles([]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleExtract = async () => {
    if (!selectedFile) {
      toast.error("Please select a ZIP file to extract");
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

    const formData = new FormData();
    formData.append("zipfile", selectedFile);

    setIsLoading(true);

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
      const res = await axios.post<{ files: ExtractedFile[] }>(
        `${BASE_URL}/response/files?clerkId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setExtractedFiles(res.data.files);
        toast.success("File extracted successfully");
      } else {
        toast.error("Error extracting file");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "An error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/response/files?filename=${encodeURIComponent(filename)}&clerkId=${userId}`, {
        responseType: "blob",
      });
  
      // Create a blob URL for the file
      const blob = new Blob([res.data]);
      const blobURL = URL.createObjectURL(blob);
  
      // Create an anchor element and set its href to the blob URL
      const link = document.createElement("a");
      link.href = blobURL;
      link.setAttribute("download", filename);
  
      // Append the anchor element to the document body and click it programmatically
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
    } catch (error) {
      toast.error("Error downloading file");
    }
  };
  
  
  const handleRefresh = () => {
    setSelectedFile(null);
    setExtractedFiles([]);
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && extractedFiles.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, extractedFiles]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept=".zip" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100">Browse</label>
            </div>
            <p className="text-text-[var(--primary-text-color)] m-4">{selectedFile.name}</p>
            <p className="text-gray-400 mb-4">Drag and drop a ZIP file here, or click to browse</p>
            
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop a ZIP file here, or click to browse</p>
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept=".zip" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-100">Browse</label>
            </div>
          </>
        )}
      </div>
      <p className="text-red-600 mt-4 text-sm">
       Note: Please ensure that the ZIP file contains only files and not any folders.
      </p>
      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
        onClick={handleExtract}
        disabled={isLoading || !selectedFile || extractedFiles.length > 0}
      >
        {isLoading ? "Extracting" : "Extract"}
      </Button>

      {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader styleType="cube" />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      ) : (
        extractedFiles.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Extracted Files</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {extractedFiles.map((file) => (
                <div 
                  key={file.filename} 
                  className={`border border-[var(--primary-text-color)] p-4 rounded-md relative cursor-pointer ${hoveredFile === file.filename ? 'bg-gray-400 text-black' : ''}`}
                  onMouseEnter={() =>setHoveredFile(file.filename)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <span className="inline-block w-full truncate text-[var(--primary-text-color)]">{file.filename}</span>
                  {hoveredFile === file.filename && (
                    <button
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-gray-400 text-white"
                      onClick={() => handleDownload(file.filename)}
                    title="Download" >
                      <DownloadIcon className="w-6 h-6 mr-1 inline-block" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}

