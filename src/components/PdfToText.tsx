import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardCopy, RefreshCw, Upload } from 'lucide-react';
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function PdfToTextConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    setExtractedText(''); // Clear previous extracted text
    setIsTextExtracted(false); // Reset the flag
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
    setExtractedText(''); // Clear previous extracted text
    setIsTextExtracted(false); // Reset the flag
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setExtractedText(''); // Clear previous extracted text
    setIsTextExtracted(false); // Reset the flag
  };

  const extractText = async () => {
    setIsLoading(true);
    setExtractedText(''); // Clear previous extracted text
    setIsTextExtracted(false); // Reset the flag

    
        setTimeout(() => {
            loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    try {
      if (!selectedFile) {
        toast.error('Please select a PDF file.');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await axios.post(`${BASE_URL}/response/pdf2text?clerkId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setExtractedText(response.data.text);
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
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast.error('Share not supported on this device.');
      return;
    }

    try {
      await navigator.share({
        title: 'Extracted Text',
        text: extractedText,
      });

      toast.success('Text shared successfully!');
    } catch (error: any) {
      console.error('Error during sharing:', error);
      toast.error('Failed to share text. ' + error.message);
    }
  };

  useEffect(() => {
    if (!isLoading && extractedText) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, extractedText]);

  return (
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
              accept="application/pdf"
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
            <p className="text-gray-400">or drag and drop PDF file</p>
          </div>
          <RefreshCw 
            className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection} 
          />
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-[var(--primary-text-color)]">{selectedFile.name}</p>
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={extractText}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Extracting..." : 'Extract Text'}
        </Button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center m-auto  max-w-4xl rounded-b-md">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center mt-4">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {isTextExtracted && (
        <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Extracted Text:</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className=" text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Copy'>
                <ClipboardCopy className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={downloadText}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Download'>
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
              title='Share'>
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
            </div>
          </div>
          <pre className="p-4 border border-gray-300 rounded-md shadow-inner">{extractedText}</pre>
        </div>
      )}
    </div>
  );
}
