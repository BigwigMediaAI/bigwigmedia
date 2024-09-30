import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Download, UploadIcon } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import BigwigLoader from '@/pages/Loader';

export function AudioRemover() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const trimmedVideoRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null); 
  const { userId } = useAuth();
  const [showLoader, setShowLoader] = useState(false); 
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

    setSelectedFileName(file.name);
    setIsFileSelected(true);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setPreviewUrl(url);
  };

  const refreshConverter = () => {
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
    setSelectedFileName(file.name);
    setIsFileSelected(true);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setPreviewUrl(url);
  };

  const handleConvertClick = async () => {
    try {
      setIsLoading(true);

      // Scroll to loader after a short delay to ensure it's rendered
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

      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append('video', inputRef.files[0]);
      const response = await axios.post(`${BASE_URL}/response/remove-audio?clerkId=${userId}`, formData, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setTrimmedVideoUrl(url);
        toast.success('Audio removed successfully.');
      } else {
        toast.error('Error removing audio. Please try again later.');
      }
    } catch (error) {
      console.error('Error removing audio:', error);
      toast.error('Error removing audio. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!trimmedVideoUrl) return;
    const link = document.createElement('a');
    link.href = trimmedVideoUrl;
    link.setAttribute('download', 'video_without_audio.mp4');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Effect to scroll to the loader section when showLoader changes
  useEffect(() => {
    if (showLoader && loaderRef.current) {
      loaderRef.current.scrollIntoView({ behavior: 'smooth',block:"center" });
    }
  }, [showLoader]);

  useEffect(() => {
    if (!isLoading && trimmedVideoUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, trimmedVideoUrl]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
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
              ref={fileInputRef}
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              className="border border-gray-300 text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Video File
            </Button>
            {selectedFileName && (
              <p className="text-[var(--dark-gray-color)] mt-2">{selectedFileName}</p>
            )}
            <p className="text-gray-400">or drag and drop a video file</p>
          </div>
          <RefreshCw
            className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshConverter}
          />
        </div>
      </div>

      {videoUrl && (
        <div className="flex flex-col items-center mb-5 w-full">
          <ReactPlayer
            url={previewUrl || videoUrl}
            controls
            width="100%"
          />
        </div>
      )}

      <div className="flex justify-center mb-5">
        <Button
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
          onClick={handleConvertClick}
          disabled={!isFileSelected || isLoading}
        >
          {isLoading ? 'Removing Audio...' : 'Remove Audio'}
        </Button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}

      {trimmedVideoUrl && (
        <div ref={resultsRef} className="m-auto w-full max-w-2xl rounded-lg bg-[var(--white-color)] p-6 mt-5 flex flex-col items-center">
          <div className="mt-4 w-full text-center">
            <ReactPlayer
              url={trimmedVideoUrl}
              controls
              width="100%"
            />
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
              onClick={handleDownloadClick}
            title='Download'>
              Download
              <Download className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}