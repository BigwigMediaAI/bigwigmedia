import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { Loader2, Share2 } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { validateInput } from "@/utils/validateInput";
import BigwigLoader from "@/pages/Loader";

export function TextToPdfConverter() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(true);
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

  const handleConvert = async () => {
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setError(""); // Reset error state
    setShowConvertButton(false); // Hide convert button

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
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const sharePDF = () => {
    if (navigator.share && pdfUrl) {
      fetch(pdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "converted.pdf", { type: "application/pdf" });
          navigator
            .share({
              title: "Generated PDF",
              files: [file],
            })
            .catch((error) => console.error("Error sharing:", error));
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className=" items-center mb-4">
      <label className="block text-[var(--primary-text-color)]">Write or Paste the Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to PDF"
          rows={6}
          className="w-full px-4 py-2 rounded-md border border-[var(--primary-text-color)] focus:outline-none focus:border-blue-500"
        />
        
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
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
              !text ? 'bg-gray-400 cursor-not-allowed' : 'text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit'
            }`}
          >
            Convert to PDF
          </button>
        )}
        {isLoading && (
          <button
            disabled
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit  cursor-not-allowed"
          >
            
            Converting...
            <Loader2 className="animate-spin mr-2 inline-block" />
          </button>
        )}
        {pdfUrl && showPdf && !isLoading && (
          <div>
          <button
            onClick={handleDownloadClick}
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit"
         title="Download" >
            Download
          </button>
          <button
                  className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={sharePDF}
                  disabled={!navigator.share}
                title="Share">
                  Share
                </button>
          </div>
        )}
      </div>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {isLoading && (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader styleType="cube" />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
