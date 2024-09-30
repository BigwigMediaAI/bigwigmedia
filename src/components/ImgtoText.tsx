import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { ClipboardCopy, Loader2, UploadIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function ImagetoText() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTextGenerated, setIsTextGenerated] = useState(false);
  const { userId } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
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
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error("Please select an image.");
      return;
    }

    setIsLoading(true);
    loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    
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
      formData.append("image", selectedFile);

      const response = await axios.post(`${BASE_URL}/response/upload?clerkId=${userId}`, formData);
      setText(response.data);
      setIsTextGenerated(true);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const handleDownloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareText = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared Extracted Text',
        text: text,

      }).then(() => {
        console.log('Successfully shared.');
      }).catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share extracted text.');
      });
    } else {
      toast.error('Sharing is not supported on this browser.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (isTextGenerated) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, isTextGenerated]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)] relative">
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <Button
            className="border border-[var(--gray-color)] text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {selectedFile ? selectedFile.name : "Select Image"}
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
          <p className="text-red-500 mt-2">NOTE: The file should contain only text, not images.</p>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              Generating...
              <Loader2 className="animate-spin w-5 h-5" />
            </div>
          ) : isTextGenerated ? "Regenerate" : "Generate"}
        </Button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="mt-5 w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {isTextGenerated && !isLoading && (
        <div ref={resultRef} className="relative mt-5">
          <Textarea
            className="mb-4 h-60 w-full rounded-md border-2 border-gray-300 p-4"
            value={text}
            placeholder="Extracted text will appear here."
            readOnly
          />
          <div className=" top-2 right-2 flex gap-2">
            <button
              onClick={handleCopyText}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1"
            title="Copy">
              <ClipboardCopy className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleDownloadText}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1"
            title="Download">
              <FaDownload className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleShareText}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            title="Share">
              <FaShareAlt className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
