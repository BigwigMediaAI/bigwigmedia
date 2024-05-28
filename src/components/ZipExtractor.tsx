import { useState } from "react";
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
      const res = await axios.get(`${BASE_URL}/response/files?filename=${encodeURIComponent(filename)}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Error downloading file");
    }
  };

  const handleRefresh = () => {
    setSelectedFile(null);
    setExtractedFiles([]);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div
        className="border-4 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <p className="text-gray-300">{selectedFile.name}</p>
            <RefreshCwIcon
              className="w-8 h-8 text-gray-400 mt-4 cursor-pointer"
              onClick={handleRefresh}
            />
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400">Drag and drop a ZIP file here, or click to browse</p>
            <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept=".zip" />
            <label htmlFor="file-upload" className="cursor-pointer mt-4 p-2 bg-white text-gray-700 rounded-md">Browse</label>
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
        <div className="w-full h-full flex flex-col items-center justify-center ">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400 " />
          <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      ) : (
        extractedFiles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Extracted Files</h2>
            <ul>
              {extractedFiles.map((file) => (
                <li key={file.filename} className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">{file.filename}</span>
                  <Button
                    className="bg-green-500 text-white py-1 px-2 rounded-md"
                    onClick={() => handleDownload(file.filename)}
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}