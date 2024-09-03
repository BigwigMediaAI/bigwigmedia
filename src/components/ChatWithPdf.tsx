import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardCopy, Upload, RefreshCw} from 'lucide-react';
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function PdfChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
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
    setAnswer(''); // Clear previous answer
  };

  const askQuestion = async () => {
    setAnswer('');
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error('Please select a PDF file.');
        return;
      }

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
      formData.append('pdf', selectedFile);
      formData.append('question', question);

      const response = await axios.post(`${BASE_URL}/response/pdf-chat?clerkId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setAnswer(response.data.answer);
        toast.success('Question answered successfully.');
      } else {
        toast.error('Error answering question. Please try again later.');
      }
    } catch (error) {
      console.error('Error answering question:', error);
      toast.error('Error answering question. Please try again later.');
    } finally {
      setIsLoading(false);
      // Scroll to loader or result
      if (isLoading && !answer) {
        loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (!isLoading && answer) {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    setSelectedFile(file);
    setAnswer(''); // Clear previous answer
  };

  const refreshSelection = () => {
    setSelectedFile(null);
    setAnswer(''); // Clear previous answer
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    toast.success('Answer copied to clipboard.');
  };

  const downloadAnswer = () => {
    const element = document.createElement('a');
    const file = new Blob([answer], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'answer.txt';
    document.body.appendChild(element);
    element.click();
    toast.success('Answer downloaded.');
  };

  const shareAnswer = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Answer from PDF Chat',
          text: answer,
        });
        toast.success('Answer shared.');
      } catch (error) {
        toast.error('Error sharing answer.');
      }
    } else {
      toast.error('Web Share API not supported in this browser.');
    }
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  useEffect(() => {
    if (!isLoading && answer) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, answer]);

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
              className="border border-gray-300 text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse Files
            </Button>
            <p className="text-[var(--gray-color)]">or drag and drop PDF file</p>
          </div>
          <RefreshCw 
            className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={refreshSelection} 
          />
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-[var(--dark-gray-color)]">{selectedFile.name}</p>
          </div>
        )}
      </div>
      {selectedFile && (
        <div className="w-full mb-5">
          <textarea
            className="w-full p-3 border border-[var(--dark-gray-color)] rounded-md"
            placeholder="Ask your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
        </div>
      )}
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full disabled:opacity-60 bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)]"
          onClick={askQuestion}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Generating..." : 'Ask Question'}
        </Button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="mt-5 w-full flex flex-col items-center justify-center dark:bg-[#3f3e3e] m-auto  max-w-4xl rounded-b-md">
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center mt-4">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {answer && (
        <div ref={resultRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Answer:</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
              title='Copy'>
                <ClipboardCopy className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={downloadAnswer}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
              title='Download'>
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={shareAnswer}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
              title='Share'>
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
            </div>
          </div>
          <pre className="p-4 border border-gray-300 rounded-md shadow-inner whitespace-pre-line">{answer}</pre>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
