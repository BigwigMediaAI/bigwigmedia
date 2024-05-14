import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function PDFMerger() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { userId } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isPdfGenerated, setIsPdfGenerated] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(true);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    if (selectedFiles.length < 10) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files).slice(0, 10 - prevFiles.length)]);
      if (selectedFiles.length + files.length >= 10) {
        setShowPlusButton(false);
      }
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setShowPlusButton(true);
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length < 2) {
        toast.error("Please select at least two PDF files.");
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("pdfFiles", file);
      });

      const response = await axios.post(`${BASE_URL}/response/mergePDF`, formData, {
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <input
        type="file"
        id="fileInput"
        multiple
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="mb-5">
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="bg-white text-gray-500  py-1 px-2 rounded mr-2">{file.name}</span>
            {index === selectedFiles.length - 1 && (
              <Button
                className="text-gray-500 hover:text-gray-700 mr-2"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Change
              </Button>
            )}
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => removeFile(index)}
            >
              -
            </Button>
          </div>
        ))}
        {showPlusButton && (
          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            + Add PDF
          </Button>
        )}
      </div>
      {isPdfGenerated && (
        <div>
          <iframe src={pdfUrl} width="100%" height="500px"></iframe>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 mt-4"
            onClick={() => {
              const a = document.createElement("a");
              a.href = pdfUrl;
              a.download = "merged.pdf";
              a.click();
            }}
          >
            Download Merged PDF
          </Button>
        </div>
      )}
      <div className="mt-5">
        <Button
          className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={generatePDF}
          disabled={isLoading || selectedFiles.length < 2}
        >
          {isLoading ? "Merging..." : isPdfGenerated ? "Re-Merge PDFs" : "Merge PDFs"}
        </Button>
      </div>
    </div>
  );
}
