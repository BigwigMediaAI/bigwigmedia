import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

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
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div
        className="border-4 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
          <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
          <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept=".zip" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300">Browse</label>
            </div>
            <p className="text-gray-300 m-4">{selectedFile.name}</p>
            <p className="text-gray-400 mb-4">Drag and drop a ZIP file here, or click to browse</p>
            <RefreshCwIcon
              className="w-8 h-8 text-gray-400 mt-2 cursor-pointer"
              onClick={handleRefresh}
            />
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop a ZIP file here, or click to browse</p>
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept=".zip" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300">Browse</label>
            </div>
          </>
        )}
      </div>
      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-5"
        onClick={handleExtract}
        disabled={isLoading || !selectedFile || extractedFiles.length > 0}
      >
        {isLoading ? "Extracting" : "Extract"}
      </Button>

      {isLoading ? (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400 " />
          <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      ) : (
        extractedFiles.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Extracted Files</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {extractedFiles.map((file) => (
                <div 
                  key={file.filename} 
                  className={`border border-gray-300 p-4 rounded-md relative cursor-pointer ${hoveredFile === file.filename ? 'bg-gray-400 text-black' : ''}`}
                  onMouseEnter={() =>setHoveredFile(file.filename)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <span className="text-gray-300">{file.filename}</span>
                  {hoveredFile === file.filename && (
                    <button
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-gray-400 text-white"
                      onClick={() => handleDownload(file.filename)}
                    >
                      <DownloadIcon className="w-4 h-4 mr-1 inline-block" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

