import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, RefreshCw, Share2 } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { BASE_URL } from '@/utils/funcitons';
import { useAuth } from "@clerk/clerk-react";
import docfile from "../assets/docfile.svg";

export function DocxToTextExtractor() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('en'); // Default to English
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null); // Store the generated file URL
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

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
    setExtractedText(null);
    setFileUrl(null);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const extractAndTranslateText = async () => {
    setIsLoading(true);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      if (!selectedFile) {
        toast.error('Please select a DOCX file.');
        return;
      }

      const formData = new FormData();
      formData.append('docs', selectedFile);
      formData.append('language', language);

      const response = await axios.post(`${BASE_URL}/response/extractText?clerkId=${userId}`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const blobUrl = URL.createObjectURL(response.data);
        setFileUrl(blobUrl);
        setExtractedText('Text extracted and translated successfully.');
        toast.success('Text extracted successfully. You can now download the translated DOCX file.');
      } else {
        toast.error('Error extracting and translating text. Please try again later.');
      }
    } catch (error) {
      console.error('Error extracting and translating text:', error);
      toast.error('Error extracting and translating text. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = async () => {
    if (!fileUrl) return;
  
    try {
      // Fetch the file as a Blob
      const response = await fetch(fileUrl);
      const blob = await response.blob();
  
      // Create a new File from the Blob
      const file = new File([blob], "translated.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: "Translated DOCX File",
            text: "Here is the translated DOCX file.",
          });
          toast.success("File shared successfully!");
        } catch (error) {
          console.error("Error sharing file:", error);
          toast.error("Error sharing file. Please try again later.");
        }
      } else {
        toast.error("Web Share API not supported in your browser.");
      }
    } catch (error) {
      console.error("Error fetching file for sharing:", error);
      toast.error("Error preparing file for sharing. Please try again later.");
    }
  };
  

  useEffect(() => {
    if (!isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

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
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
            <p className="text-gray-400">or drag and drop DOCX file</p>
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
      
      <div className="mb-5">
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">Select Language:</label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="ru">Russian</option>
          <option value="pt">Portuguese</option>
          <option value="hi">Hindi</option>
          {/* Add more languages as needed */}
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={extractAndTranslateText}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Processing..." : 'Extract & Translate'}
        </Button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full mt-10 flex flex-col items-center justify-center m-auto max-w-4xl rounded-b-md">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center mt-4">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {extractedText && (
        <div className="mt-10 w-full flex flex-col items-center justify-center">
          <img src={docfile} alt="Extracted Document" className="w-48 h-48 mb-4" />
          <div className="mt-8 flex justify-around gap-4">
            <Button
              className="mt-4 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
              onClick={() => {
                const a = document.createElement('a');
                a.href = fileUrl!;
                a.download = 'translated.docx';
                a.click();
              }}
            >
              Download 
            </Button>
            {/* <Button 
              onClick={handleShareClick} 
              className="mt-4 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
            >Share
            </Button> */}
          </div>
        </div>
      )}

    </div>
  );
}
