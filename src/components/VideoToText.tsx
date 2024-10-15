import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ClipboardList, RefreshCw,UploadIcon } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from '@clerk/clerk-react';
import { FaDownload, FaShareAlt } from "react-icons/fa";
import BigwigLoader from '@/pages/Loader';

export function VideoToTextConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const { userId } = useAuth();
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
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setIsTextExtracted(false);
    setExtractedText('');
  };

  const extractText = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error('Please select a video file.');
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
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

      const formData = new FormData();
      formData.append('video', selectedFile);

      const response = await axios.post(`${BASE_URL}/response/video2text?clerkId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setExtractedText(response.data.transcription);
        setIsTextExtracted(true);
        toast.success('Text extracted successfully.');
      } else {
        toast.error('Error extracting text. Please try again later.');
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error('Error extracting text. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success('Text copied to clipboard.');
  };

  const downloadText = () => {
    // Create a blob with the extracted text
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const shareText = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shared Extracted Text',
        text: extractedText,
      }).then(() => {
        console.log('Share successful');
      }).catch((error) => {
        console.error('Share failed:', error);
        toast.error('Share failed.');
      });
    } else {
      toast.error('Sharing not supported on this browser.');
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
    if (!isLoading && isTextExtracted) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [isLoading, isTextExtracted]);



  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div 
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex justify-between w-full">
        
          <div className="flex flex-col items-center w-full">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <Button
              className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse Files
            </Button>
            <p className="text-gray-400">or drag and drop video file</p>
          </div>
          
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-[var(--primary-text-color)]">{selectedFile.name}</p>
          </div>
        )}
       
      </div>
      <p className="text-red-600 mb-4 text-md">
      Note: Response time varies with file size; larger files may take longer to process.
      </p>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={extractText}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Extracting...' : 'Extract'}
        </Button>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          isTextExtracted && (
            <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-unit-9xl overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Extracted Text:</h2>
                <div className="flex gap-2 items-center">
                <button
                onClick={copyToClipboard}
                className=" text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
              title='Copy'>
                <ClipboardList className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={downloadText}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
              title='Download'>
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={shareText}
                className=" text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
             title='Share' >
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap p-4 border border-gray-300 rounded-md shadow-inner">
                {extractedText}
              </pre>
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
