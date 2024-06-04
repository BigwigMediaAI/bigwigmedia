import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";


export function PdfPageDeleter() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState<string>("");
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modifiedPdfRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleFileChange = () => {
    const inputRef = fileInputRef.current;
    if (!inputRef) return;

    const file = inputRef.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setModifiedPdfUrl(null);
  };

  const refreshDeleter = () => {
    window.location.reload();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const inputRef = fileInputRef.current;
    if (!inputRef) return;
    inputRef.files = files;

    const file = files[0];
    setPdfFile(file);
    setModifiedPdfUrl(null);
  };

  const handleDeleteClick = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (!pdfFile) return;
      formData.append("pdf", pdfFile);
      formData.append("pagesToDelete", pagesToDelete);
      const response = await axios.post(`${BASE_URL}/response/delete-pages?clerkId=${userId}`, formData, {
        responseType: 'blob' // Important to handle binary data
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
        setModifiedPdfUrl(url);
        toast.success("PDF pages deleted successfully.");
        // Scroll to the modified PDF preview
        if (modifiedPdfRef.current) {
          modifiedPdfRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        toast.error("Error deleting PDF pages. Please try again later.");
      }
    } catch (error) {
      console.error("Error deleting PDF pages:", error);
      toast.error("Error deleting PDF pages. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!modifiedPdfUrl) return;
    const link = document.createElement('a');
    link.href = modifiedPdfUrl;
    link.setAttribute('download', 'modified.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (modifiedPdfUrl && modifiedPdfRef.current) {
      modifiedPdfRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [modifiedPdfUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
        <div
          className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select PDF File
              </Button>
              {pdfFile && (
                <p className="text-gray-300 mt-2">{pdfFile.name}</p>
              )}
              <p className="text-gray-400">or drag and drop a PDF file</p>
            </div>
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshDeleter}
            />
          </div>
        </div>
        {pdfFile && (
          <>
            <div className="mb-5 w-full flex justify-center">
              <object
                data={URL.createObjectURL(pdfFile)}
                type="application/pdf"
                width="80%"
                height="400px"
              >
                <p>It appears you don't have a PDF plugin for this browser. No biggie... you can <a href={URL.createObjectURL(pdfFile)}>click here to download the PDF file.</a></p>
              </object>
            </div>
            <div className="flex flex-col items-center mb-5 w-full">
              <label className="mb-2 text-gray-400">Pages to Delete (comma-separated)</label>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md w-11/12"
                value={pagesToDelete}
                onChange={(e) => setPagesToDelete(e.target.value)}
                placeholder="e.g., 1,3,5"
              />
            </div>
            <div className="flex justify-center mb-5">
              <Button
                className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${pdfFile ? '' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleDeleteClick}
                disabled={!pdfFile || isLoading}
              >
                {isLoading ? "Deleting Pages..." : 'Delete Pages'}
              </Button>
            </div>
          </>
        )}
      </div>
      <div ref={modifiedPdfRef} className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          modifiedPdfUrl && (
            <div  className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
              <div className="mt-4 w-full flex justify-center">
                <object
                  data={modifiedPdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                >
                  <p>It appears you don't have a PDF plugin for this browser. No biggie... you can <a href={modifiedPdfUrl}>click here to download the PDF file.</a></p>
                </object>
              </div>
              <div className="mt-4 w-full text-center">
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-5"
                  onClick={handleDownloadClick}
                >
                  Download
                  <Download className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}