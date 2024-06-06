import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Download } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { BASE_URL } from '@/utils/funcitons';

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
  const { userId } = useAuth();
  const [showLoader, setShowLoader] = useState(false); 

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

  // Effect to scroll to the trimmed video section when trimmedVideoUrl changes
  useEffect(() => {
    if (trimmedVideoUrl && trimmedVideoRef.current) {
      trimmedVideoRef.current.scrollIntoView({ behavior: 'smooth' ,block:'center'});
    }
  }, [trimmedVideoUrl]);

  return (
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
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Video File
            </Button>
            {selectedFileName && (
              <p className="text-gray-300 mt-2">{selectedFileName}</p>
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
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
          onClick={handleConvertClick}
          disabled={!isFileSelected || isLoading}
        >
          {isLoading ? 'Removing Audio...' : 'Remove Audio'}
        </Button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
          <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {trimmedVideoUrl && (
        <div ref={trimmedVideoRef} className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 flex flex-col items-center">
          <div className="mt-4 w-full text-center">
            <ReactPlayer
              url={trimmedVideoUrl}
              controls
              width="100%"
            />
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-5"
              onClick={handleDownloadClick}
            >
              Download
              <Download className="w-6 h-6 text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}