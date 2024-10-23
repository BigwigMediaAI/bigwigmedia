import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";

import zip from "../assets/zip.svg";
import BigwigLoader from "@/pages/Loader";

export function PdfSplit() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitFiles, setSplitFiles] = useState<Blob | null>(null);
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

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const splitPdf = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error("Please select a PDF file.");
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      formData.append("pdf", selectedFile);

      const response = await axios.post(`${BASE_URL}/response/split?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/zip" });
        setSplitFiles(blob);
      } else {
        toast.error("Error splitting the PDF. Please try again later.");
      }
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast.error("Error splitting the PDF. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };



  const handleDownload = () => {
    if (!splitFiles) return;
    const url = window.URL.createObjectURL(splitFiles);
    const a = document.createElement("a");
    a.href = url;
    a.download = "split-pdfs.zip";  // Download as a zip of split pages
    a.click();
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      setSelectedFile(files[0]);
    }
  };


  useEffect(() => {
    if (!isLoading && splitFiles) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, splitFiles]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        {/* File selection area */}
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          {/* Browse button */}
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
          
        </div>
        {/* Display selected files */}
        <div className="mt-4 w-full text-center">
        {selectedFile && (
            <p className="text-gray-800">{selectedFile.name}</p>
          )}
        </div>
      </div>
      {/* Convert to zip button */}
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={splitPdf}
          disabled={!selectedFile|| isLoading}
        >
          {isLoading ? "Splitting..." : splitFiles ? "Split Again" : "Split PDF"}
        </Button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          splitFiles && (
            <div ref={resultsRef} className="mt-5 text-center">
              <img src={zip} alt="Zip file ready" className="mx-auto mb-5 w-48" />
              <div className="flex justify-center">
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={handleDownload}
                  title="Download"
                >
                  Download
                </Button>
              </div>
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
