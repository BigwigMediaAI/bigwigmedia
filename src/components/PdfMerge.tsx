import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, UploadIcon } from "lucide-react";

export function PDFMerger() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { userId } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isPdfGenerated, setIsPdfGenerated] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    const newFiles = Array.from(files).filter((file) => file.type === "application/pdf");
    if (newFiles.length < files.length) {
      toast.error("Please select only PDF format files.");
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 10));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newFiles = Array.from(files).filter((file) => file.type === "application/pdf");
    if (newFiles.length < files.length) {
      toast.error("Please select only PDF format files.");
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 10));
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length < 2) {
        toast.error("Please select at least two PDF files.");
        return;
      }

      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });

      const response = await axios.post(`${BASE_URL}/response/mergePDF?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      setPdfUrl(url);
      setIsPdfGenerated(true);

      toast.success("PDF merged successfully.");
    } catch (error) {
      console.error("Error merging PDF:", error);
      toast.error("Error merging PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && pdfUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, pdfUrl]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Button
            className="border bg-white  border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
        </div>
        <div className="mt-4 w-full text-center">
          {selectedFiles.length > 0 && (
            <ul className="list-none">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-[var(--primary-text-color)]">
                  <span className="mr-5">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-[var(--primary-text-color)] hover:text-[var(--teal-color)]">
                    &#x2715;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={generatePDF}
          disabled={isLoading || selectedFiles.length < 2}
        >
          {isPdfGenerated ? "Re-Merge PDFs" : isLoading ? "Merging..." : "Merge PDFs"}
        </Button>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          pdfUrl && (
            <div ref={resultsRef} className="mt-5 text-center">
              <iframe src={pdfUrl} width="100%" height="500px"></iframe>
              <Button
                className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = pdfUrl;
                  a.download = "merged.pdf";
                  a.click();
                }}
              title="Download">
                Download
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
