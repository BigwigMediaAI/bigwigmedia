import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";

import zip from "../assets/zip.svg";

export function FileToZipConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zipUrl, setZipUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const convertToZip = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please select at least one file.");
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(`${BASE_URL}/response/zip`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        setZipUrl(url);
      } else {
        toast.error("Error converting files to zip. Please try again later.");
      }
    } catch (error) {
      console.error("Error converting files to zip:", error);
      toast.error("Error converting files to zip. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSelection = () => {
    window.location.reload();
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = "converted.zip";
    a.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newFiles = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
<div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div
        className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* File selection area */}
        <div className="flex flex-col items-center w-full relative">
          {/* Browse button */}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            multiple
            style={{ display: "none" }}
          />
          <Button
            className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
          {/* Refresh button */}
          <RefreshCw
            className="absolute top-1 right-1 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection}
          />
        </div>
        {/* Display selected files */}
        <div className="mt-4 w-full text-center">
          {selectedFiles.length > 0 && (
            <ul className="list-none">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-gray-300">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Convert to zip button */}
      {!zipUrl && (
        <div className="mt-5 flex justify-center">
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={convertToZip}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin w-6 h-6 text-black" /> : "Convert to Zip"}
          </Button>
        </div>
      )}
      {/* Download zip button with image */}
      {zipUrl && (
        <div className="mt-5 text-center">
          <img src={zip} alt="Zip file ready" className="mx-auto mb-5 w-48" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={handleDownload}
          >
            Download Zip
          </Button>
        </div>
      )}
    </div>
  );
}