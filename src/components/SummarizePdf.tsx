import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, Copy, RefreshCw, Upload } from 'lucide-react';

export function PdfSummarizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    setSummary(''); // Clear previous summary
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
    setSummary(''); // Clear previous summary
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setSummary(''); // Clear previous summary
  };

  const summarizePdf = async () => {
    setSummary('')
    setIsLoading(true);
    setSummary(''); // Clear previous summary
    try {
      if (!selectedFile) {
        toast.error('Please select a PDF file.');
        return;
      }

      setIsLoading(true);
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await axios.post(`${BASE_URL}/response/pdf-summarize?clerkId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSummary(response.data.summary);
        toast.success('PDF summarized successfully.');
      } else {
        toast.error('Error summarizing PDF. Please try again later.');
      }
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      toast.error('Error summarizing PDF. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!isLoading && summary) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, summary]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div 
        className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center w-full">
            <Upload className="w-12 h-12 text-gray-400" />
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
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
            <p className="text-gray-300">{selectedFile.name}</p>
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
          onClick={summarizePdf}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Summarizing..." : 'Summarize PDF'}
        </Button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="mt-5 w-full flex flex-col items-center justify-center dark:bg-[#3f3e3e] m-auto  max-w-4xl rounded-b-md">
          <Loader2 className="animate-spin w-20 h-20 text-gray-300" />
          <p className="text-gray-300 text-center mt-4">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {summary && (
        <div ref={resultRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Summary:</h2>
            <Copy 
                className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800" 
                onClick={() => navigator.clipboard.writeText(summary)} 
            />
            </div>
            <pre className="p-4 border border-gray-300 rounded-md shadow-inner whitespace-pre-line">{summary}</pre>
        </div>
      )}
    </div>
  );
}
