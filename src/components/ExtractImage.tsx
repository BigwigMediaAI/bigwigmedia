import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Upload } from 'lucide-react';
import zipIcon from '../assets/zip.svg'; // Ensure you have this image in the correct path
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from '@/pages/Loader';

export function ExtractImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zipUrl, setZipUrl] = useState<string>('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setSelectedFiles([newFile]);
      setZipUrl(''); // Reset zipUrl when a new file is selected
    } else {
      setSelectedFiles([]);
      setZipUrl('');
    }
  };

  const convertToZip = async () => {
    setIsLoading(true);
   
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
      if (selectedFiles.length === 0) {
        toast.error('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('pdf', selectedFiles[0]);

      const response = await axios.post(`${BASE_URL}/response/extract?clerkId=${userId}`, formData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        setZipUrl(url);
      } else {
        toast.error('Error converting files to zip. Please try again later.');
      }
    } catch (error) {
      console.error('Error converting files to zip:', error);
      toast.error('Error converting files to zip. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSelection = () => {
    window.location.reload();
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'converted.zip';
    a.click();
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newFile = files[0];
      setSelectedFiles([newFile]);
    }
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && zipUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, zipUrl]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className=" border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center w-full relative">
          <Upload className="w-12 h-12 text-[var(--gray-color)]" />
          <input
            type="file"
            accept="application/pdf"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            Browse File
          </button>
          <p className="text-gray-400">or drag and drop a file</p>
          <RefreshCw
            className="absolute top-1 right-1 w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection}
          />
        </div>
        <div className="mt-4 w-full text-center">
          {selectedFiles.length > 0 && (
            <ul className="list-none">
              <li key={selectedFiles[0].name} className="text-[var(--gray-color)]">
                <span className="mr-5">{selectedFiles[0].name}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
      {!zipUrl && (
        <div className="mt-5 flex justify-center">
          <button
            className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            onClick={convertToZip}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? 'Extracting...' : 'Extract'}
          </button>
        </div>
      )}
      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          zipUrl && (
            <div ref={resultsRef} className="mt-5 text-center">
              <img src={zipIcon} alt="Zip file ready" className="mx-auto mb-5 w-48" />
              <button
                className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleDownload}
              title='Download'>
                Download Zip
              </button>
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
