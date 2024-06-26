import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Copy, RefreshCw } from 'lucide-react';
import { BASE_URL } from '@/utils/funcitons';
import { useAuth } from '@clerk/clerk-react';

export function VideoToTextConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isTextExtracted, setIsTextExtracted] = useState(false);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isLoading && isTextExtracted) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }
  }, [isLoading, isTextExtracted]);

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
              accept="video/*"
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
            <p className="text-gray-400">or drag and drop video file</p>
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
          onClick={extractText}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Extracting...' : 'Extract'}
        </Button>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          isTextExtracted && (
            <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Extracted Text:</h2>
                <Copy 
                  className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800" 
                  onClick={copyToClipboard} 
                />
              </div>
              <pre className="whitespace-pre-wrap p-4 border border-gray-300 rounded-md shadow-inner">
                {extractedText}
              </pre>
            </div>
          )
        )}
      </div>
    </div>
  );
}
