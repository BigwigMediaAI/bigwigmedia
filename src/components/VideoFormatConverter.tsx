import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadIcon } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from './Model3';
import { useAuth } from '@clerk/clerk-react';
import BigwigLoader from '@/pages/Loader';

export function VideoFormatConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setformat] = useState('');
  const [convertedVideoUrl, setConvertedVideoUrl] = useState('');
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const [uploadedFileType, setUploadedFileType] = useState('');

  const formatOptions = [
    { value: 'flv', label: 'FLV' },
    { value: 'avi', label: 'AVI' },
    { value: 'mp4', label: 'MP4' },
    { value: 'mov', label: 'MOV' },
    { value: 'm4v', label: 'M4V' },
  ];

  const getCredits = async () => {
    try {
      const response = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (response.status === 200) {
        setCredits(response.data.data.currentLimit);
        return response.data.data.currentLimit;
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      setUploadedFileType(fileType || '');
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      setUploadedFileType(fileType || '');
      setSelectedFile(file);
    }
  };

  const filteredFormatOptions = formatOptions.filter(
    (option) => option.value !== uploadedFileType
  );

  const changeFormat = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error('Please select a video file.');
        return;
      }

      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      const currentCredits = await getCredits();
      if (currentCredits <= 0) {
        setShowCreditModal(true);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('format', format);

      const response = await axios.post(`${BASE_URL}/response/videoConvertion?clerkId=${userId}`, formData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const videoUrl = URL.createObjectURL(response.data);
        setConvertedVideoUrl(videoUrl);
        toast.success('Video format changed successfully.');
      } else {
        toast.error('Error converting video. Please try again later.');
      }
    } catch (error) {
      console.error('Error converting video:', error);
      toast.error('Error converting video. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && convertedVideoUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, convertedVideoUrl]);

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

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Format:</label>
        <select
          value={format}
          onChange={(e) => setformat(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
          disabled={filteredFormatOptions.length === 0}
        >
          <option value="">Select Format</option>
          {filteredFormatOptions.length > 0 ? (
            filteredFormatOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          ) : (
            <option value="">No other formats available</option>
          )}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={changeFormat}
          disabled={!selectedFile || isLoading || !format}
        >
          {isLoading ? 'Converting...' : 'Convert'}
        </Button>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">
              Processing your data. Please bear with us as we ensure the best results for you...
            </p>
          </div>
        ) : (
          convertedVideoUrl && (
            <div ref={resultsRef} className="flex justify-center mt-5 p-4">
              <button className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-7 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]">
                <a href={convertedVideoUrl} download={`converted-video.${format}`}>
                  Download
                </a>
              </button>
            </div>
          )
        )}
      </div>

      {showCreditModal && <CreditLimitModal isOpen={showCreditModal} onClose={() => setShowCreditModal(false)} />}
    </div>
  );
}
