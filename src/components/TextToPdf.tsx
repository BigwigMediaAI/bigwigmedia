import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";



export function TextToPdfConverter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(true);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const handleConvert = async () => {
    setIsLoading(true);
    setError(""); // Reset error state
    setShowConvertButton(false); // Hide convert button
    try {
      const response = await axios.post(
        `${BASE_URL}/response/text2pdf?clerkId=${userId}`, 
        { text }, 
        { responseType: 'blob' } // Set response type to blob
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

      setTimeout(() => {
        setShowPdf(true);
        setIsLoading(false);
      }, 2500); // Delay of 2.5 seconds
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while creating the PDF. Please try again later.");
      setIsLoading(false);
      setShowConvertButton(true); // Show convert button again if there's an error
    }
  };

  const handleRefresh = () => {
    setText("");
    setPdfUrl(null); // Reset the PDF URL
    setError(""); // Clear any errors
    setShowPdf(false); // Reset the PDF display
    setShowConvertButton(true); // Reset the convert button visibility
  };

  useEffect(() => {
    if (text) {
      setPdfUrl(null); // Reset the PDF URL when text is changed
      setShowPdf(false); // Reset the PDF display when text is changed
      setShowConvertButton(true); // Show the convert button when text is changed
    }
  }, [text]);

  const handleDownloadClick = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'output.pdf';
      link.click();
    }
  };

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex items-center mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to PDF"
          rows={6}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
          <FaSyncAlt />
        </button>
      </div>
      {pdfUrl && showPdf && (
        <div className="mt-4 mb-4">
          <embed src={pdfUrl} type="application/pdf" width="100%" height="300px" />
        </div>
      )}
      <div className="flex justify-center">
        {showConvertButton && !isLoading && (
          <button
            onClick={handleConvert}
            disabled={!text}
            className={`py-2 px-4 text-white ${
              !text ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit'
            }`}
          >
            Convert to PDF
          </button>
        )}
        {isLoading && (
          <button
            disabled
            className="py-2 px-4 text-white font-semibold rounded-md bg-gray-400 cursor-not-allowed"
          >
            <Loader2 className="animate-spin mr-2 inline-block" />
            Converting...
          </button>
        )}
        {pdfUrl && showPdf && !isLoading && (
          <button
            onClick={handleDownloadClick}
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
          >
            Download PDF
          </button>
        )}
      </div>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}