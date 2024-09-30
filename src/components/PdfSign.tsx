import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, RefreshCw } from 'lucide-react';
import { FaDownload } from "react-icons/fa";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from '@/pages/Loader';

export function PdfSignTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState('');
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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
    setSignedPdfUrl(''); // Clear previous signed PDF URL
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
    setSignedPdfUrl(''); // Clear previous signed PDF URL
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setSignedPdfUrl(''); // Clear previous signed PDF URL
  };

  const signPdf = async () => {
    setIsLoading(true);
    setSignedPdfUrl(''); // Clear previous signed PDF URL

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      if (!selectedFile) {
        toast.error('Please select a PDF file.');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await axios.post(`${BASE_URL}/response/sign?clerkId=${userId}`, formData, {
        responseType: 'blob',  // Set the response type to blob to handle binary data
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const blobUrl = URL.createObjectURL(response.data); // Create a Blob URL from the response data
        setSignedPdfUrl(blobUrl);
        toast.success('PDF signed successfully.');
      } else {
        toast.error('Error signing PDF. Please try again later.');
      }
    } catch (error) {
      console.error('Error signing PDF:', error);
      toast.error('Error signing PDF. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSignedPdf = () => {
    if (signedPdfUrl) {
      const a = document.createElement('a');
      a.href = signedPdfUrl;
      a.download = 'signed-pdf.pdf';
      a.click();
    } else {
      toast.error('No signed PDF available to download.');
    }
  };

  const handleShareClick = async () => {
    if (!signedPdfUrl) {
      toast.error('No signed PDF available to share.');
      return;
    }
  
    try {
      const response = await fetch(signedPdfUrl);
      const blob = await response.blob();
      const file = new File([blob], 'signed-pdf.pdf', { type: 'application/pdf' });
  
      if (navigator.share) {
        await navigator.share({
          title: 'Signed PDF',
          text: 'Here is the signed PDF document.',
          files: [file],
        });
        toast.success('PDF shared successfully.');
      } else {
        toast.error('Sharing is not supported on this device.');
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      toast.error('Error sharing PDF. Please try again later.');
    }
  };
  

  useEffect(() => {
    if (!isLoading && signedPdfUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, signedPdfUrl]);

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
          
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-[var(--primary-text-color)]">{selectedFile.name}</p>
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={signPdf}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Signing..." : 'Sign PDF'}
        </Button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader styleType="cube" />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}
      {signedPdfUrl && (
        <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Signed PDF:</h2>
            
          </div>
          <iframe src={signedPdfUrl} className="w-full mt-4 rounded-md h-96" title="Signed PDF Preview" />
          <div className='flex gap-2'>
          <Button
          className="mx-auto mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={downloadSignedPdf}
        >Download</Button>
        <button
                onClick={handleShareClick}
                className="mx-auto mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-1 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
                title='Download'
              >
                Share
              </button>
              </div>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
