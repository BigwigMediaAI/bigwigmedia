import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Download,Upload,Share2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import BigwigLoader from "@/pages/Loader";


export function PdfPageDeleter() {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState<string>("");
  const [modifiedPdfUrl, setModifiedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modifiedPdfRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
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

 

  

  // Scroll to loader after a short delay to ensure it's rendered

 

  const handleDeleteClick = async () => {
    
    setIsLoading(true);
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
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
  

    try {
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

  const handleShareClick = () => {
    if (navigator.share && modifiedPdfUrl) {
      fetch(modifiedPdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "modified.pdf", { type: "application/pdf" });
          navigator
            .share({
              title: "modified pdf",
              files: [file],
            })
            .catch((error) => console.error("Error sharing:", error));
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  useEffect(() => {
    if (modifiedPdfUrl && modifiedPdfRef.current) {
      modifiedPdfRef.current.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [modifiedPdfUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
        <div
          className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
            <Upload className="w-12 h-12 text-[var(--gray-color)]" />
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select PDF File
              </Button>
              {pdfFile && (
                <p className="text-[var(--primary-text-color)] mt-2">{pdfFile.name}</p>
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
            <div className="flex flex-col mb-5 w-full">
              <label className="mb-2 text-[var(--primary-text-color)]">Pages to Delete (comma-separated)</label>
              <input
                type="text"
                className="border border-[var(--primary-text-color)] p-2 rounded-md w-11/12"
                value={pagesToDelete}
                onChange={(e) => setPagesToDelete(e.target.value)}
                placeholder="e.g., 1,3,5"
              />
            </div>
            <div className="flex justify-center mb-5">
              <Button
                className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${pdfFile ? '' : 'opacity-50 cursor-not-allowed'}`}
                onClick={handleDeleteClick}
                disabled={!pdfFile || isLoading}
              >
                {isLoading ? "Deleting Pages..." : 'Delete Pages'}
              </Button>
            </div>
          </>
        )}
      
      <div  className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader styleType="cube" />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          modifiedPdfUrl && (
            <div ref={modifiedPdfRef} className="m-auto w-full max-w-2xl rounded-lg  bg-white p-6 mt-5 flex flex-col items-center">
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
              <div className="flex gap-5 justify-center ">
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                  onClick={handleDownloadClick}
                title="Download">
                  Download
                  <Download className="w-6 h-6 text-white" />
                </Button>
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                  onClick={handleShareClick}
                title="Share">
                  Share
                  <Share2 className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}