import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function JPEGtoPDFConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectOptions, setSelectOptions] = useState<number[]>([1]); // Initial select option
  const { userId } = useAuth();
  const [pdfUrl, setPdfUrl] = useState<string>(""); // Change null to an empty string
  const [isPdfGenerated, setIsPdfGenerated] = useState(false);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files || [];
    const newSelectedFiles = Array.from(files).slice(0, 1); // Limit to 1 file per select
    const updatedSelectedFiles = [...selectedFiles];
    updatedSelectedFiles[index - 1] = newSelectedFiles[0];
    setSelectedFiles(updatedSelectedFiles);
  };

  const handleAddSelectOption = () => {
    if (selectOptions.length < 10) {
      setSelectOptions([...selectOptions, selectOptions.length + 1]);
    } else {
      toast.error("Maximum limit of 10 images reached.");
    }
  };

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please select at least one image.");
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images", file); // Ensure the field name is "images"
      });

      const response = await axios.post(`${BASE_URL}/response/jpg2pdf?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      // Create a blob URL from the response data
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Set the blob URL to state
      setPdfUrl(url);

      // Set flag indicating PDF is generated
      setIsPdfGenerated(true);

      // Reset selected files
      setSelectedFiles([]);

      toast.success("PDF generated successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      {selectOptions.map((index) => (
        <div key={`select_${index}`} className="flex items-center justify-start mb-5">
          <div className="flex items-center">
            <input
              type="file"
              id={`fileInput_${index}`}
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              style={{ display: "none" }}
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mr-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById(`fileInput_${index}`)?.click()}
            >
              {selectedFiles[index - 1] ? selectedFiles[index - 1].name : `Select Image ${index}`}
            </Button>
          </div>
          {index === selectOptions.length && (
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddSelectOption}
            >
              +
            </Button>
          )}
        </div>
      ))}
      {isPdfGenerated && (
        <div>
          <iframe src={pdfUrl} width="100%" height="500px"></iframe>
          <Button
            className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 mt-4"
            onClick={() => {
              // Trigger download by creating an anchor element and setting its href to the blob URL
              const a = document.createElement("a");
              a.href = pdfUrl;
              a.download = "converted.pdf";
              a.click();
            }}
          >
            Download PDF
          </Button>
        </div>
      )}
      <div className="mt-5">
        <Button
          className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
          onClick={generatePDF}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
