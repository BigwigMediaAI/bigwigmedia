import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, RefreshCw } from 'lucide-react';
import { FaDownload } from "react-icons/fa";
import { BASE_URL } from '@/utils/funcitons';

export function PdfToAudioConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState('');
  const [language, setLanguage] = useState('en'); // Default to English

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    setAudioBlobUrl(''); // Clear previous audio Blob URL
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
    setAudioBlobUrl(''); // Clear previous audio Blob URL
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setAudioBlobUrl(''); // Clear previous audio Blob URL
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const convertPdfToAudio = async () => {
    setIsLoading(true);
    setAudioBlobUrl(''); // Clear previous audio Blob URL

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
      formData.append('language', language); // Add the selected language to the form data

      const response = await axios.post(`${BASE_URL}/response/pdftoaudio`, formData, {
        responseType: 'blob',  // Set the response type to blob to handle binary data
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const blobUrl = URL.createObjectURL(response.data); // Create a Blob URL from the response data
        setAudioBlobUrl(blobUrl);
        toast.success('Audio file generated successfully.');
      } else {
        toast.error('Error converting PDF to audio. Please try again later.');
      }
    } catch (error) {
      console.error('Error converting PDF to audio:', error);
      toast.error('Error converting PDF to audio. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAudio = () => {
    if (audioBlobUrl) {
      const a = document.createElement('a');
      a.href = audioBlobUrl;
      a.download = 'converted-audio.mp3';
      a.click();
    } else {
      toast.error('No audio file available to download.');
    }
  };

  const handleShareClick = () => {
    if (!audioBlobUrl) {
      toast.error('No audio file available to share.');
      return;
    }
  
    fetch(audioBlobUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'converted-audio.mp3', { type: 'audio/mpeg' });
  
        if (navigator.share) {
          navigator.share({
            title: 'Converted Audio',
            text: 'Check out this audio file generated from a PDF!',
            files: [file],
          })
          .then(() => {
            toast.success('Audio file shared successfully.');
          })
          .catch((error) => {
            console.error('Error sharing audio file:', error);
            toast.error('Error sharing audio file.');
          });
        } else {
          toast.error('Your browser does not support the Web Share API.');
        }
      })
      .catch((error) => {
        console.error('Error fetching the audio file for sharing:', error);
        toast.error('Error preparing the audio file for sharing.');
      });
  };
  

  useEffect(() => {
    if (!isLoading && audioBlobUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, audioBlobUrl]);

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
          onClick={convertPdfToAudio}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Converting..." : 'Convert to Audio'}
        </Button>
      </div>

      {isLoading && (
        <div ref={loaderRef} className="w-full mt-10 flex flex-col items-center justify-center m-auto max-w-4xl rounded-b-md">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center mt-4">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {audioBlobUrl && (
        <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Converted Audio:</h2>
          </div>
          <audio controls src={audioBlobUrl} className="w-full mt-4 rounded-md">
            Your browser does not support the audio element.
          </audio>
          <div className="mt-8 flex justify-around">
            <Button onClick={downloadAudio} className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]">
              Download 
            </Button>
          
            <Button onClick={handleShareClick} className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]">
              Share 
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
