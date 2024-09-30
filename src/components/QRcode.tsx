import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { Loader2, Palette,Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from '@/pages/Loader';

export function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [color, setColor] = useState(""); // Initial color
  const [textAboveQR, setTextAboveQR] = useState("");
  const [textBelowQR, setTextBelowQR] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
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

  const handleGenerateQRCode = async () => {
    setIsLoading(true);
    if (!url || !color || !textAboveQR || !textBelowQR) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }
    setQRCode("")

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
      const formData = new FormData();
      formData.append("url", url);
      formData.append("color", color);
      formData.append("textAboveQR", textAboveQR);
      formData.append("textBelowQR", textBelowQR);
      if (logo) {
        formData.append("logo", logo);
      }

      const response = await axios.post(`${BASE_URL}/response/generate?clerkId=${userId}`, formData, {
        responseType: "blob",
      });
      
      setQRCode(URL.createObjectURL(response.data));

      // Scroll to the QR code image after setting the QR code state
      if (qrCodeRef.current) {
        qrCodeRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      toast.error('Error generating QR code');
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (qrCode) {
      const a = document.createElement("a");
      a.href = qrCode;
      a.download = "qr_code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  const handleShareClick = () => {
    if (navigator.share && qrCode) {
      fetch(qrCode)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "qr.jpeg", { type: "image/jpeg" });
          navigator
            .share({
              title: "QR code",
              files: [file],
            })
            .catch((error) => console.error("Error sharing:", error));
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };

  useEffect(() => {
    if (!isLoading && qrCode) {
      qrCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, qrCode]);

  // Clear the QR code whenever any content is updated
  useEffect(() => {
    setQRCode(null);
  }, [url, color, textAboveQR, textBelowQR]);

  // Handle outside click to hide color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        !event.composedPath().includes(colorPickerRef.current)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [websiteError, setWebsiteError] = useState(false);

const handleWebsiteChange = (value:any) => {
  setUrl(value);

  // Regex for validating website URL format
  const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  if (!websiteRegex.test(value)) {
    setWebsiteError(true);  // Set error if URL is invalid
  } else {
    setWebsiteError(false);  // Clear error if URL is valid
  }
};



  return (
    <div className="m-auto w-full max-w-2xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-[var(--primary-text-color)] text-sm font-bold mb-2">
            Enter or Paste Your Url
          </label>  
          <input
            type="text"
            placeholder="Enter URL of your choice"
            className="`block w-full p-3 border rounded-md focus:outline-none ${websiteError ? 'border-red-500' : 'focus:border-blue-500'}`"
            value={url}
            onChange={(e) => handleWebsiteChange(e.target.value)}
          />
          {websiteError && (
    <span className="text-red-500 text-sm mt-2">
      Please enter a valid website URL.
    </span>
  )}
        </div>
        <div className="mb-4">
          <label className="block text-[var(--primary-text-color)] text-sm font-bold mb-2">
            Enter The Text Above QR
          </label>
          <input
            type="text"
            placeholder="Enter the name of your company"
            className="appearance-none border rounded w-full py-2 px-3 text-[var(--primary-text-color)] leading-tight focus:outline-none focus:shadow-outline"
            value={textAboveQR}
            onChange={(e) => setTextAboveQR(e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="mb-4">
          <label className="block text-[var(--primary-text-color)] text-sm font-bold mb-2">
            Enter The Text Below QR
          </label>
          <input
            type="text"
            placeholder="Example: Scan QR to visit site"
            className="appearance-none border rounded w-full py-2 px-3 text-[var(--primary-text-color)] leading-tight focus:outline-none focus:shadow-outline"
            value={textBelowQR}
            onChange={(e) => setTextBelowQR(e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="mb-4 flex justify-between items-center">
  <div className="w-1/2 pr-2">
    <label className="block text-[var(--primary-text-color)] text-sm font-bold mb-2">
      Select QR Color 🎨
    </label>
    <div className="relative">
      {/* Preset Colors */}
      <div className="flex space-x-2">
        {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFD700"].map((presetColor) => (
          <div
            key={presetColor}
            onClick={() => setColor(presetColor)}
            className="w-8 h-8 rounded-full cursor-pointer border-2"
            style={{
              backgroundColor: presetColor,
              borderColor: color === presetColor ? "black" : "transparent",
            }}
          />
        ))}
      </div>

      {/* Button to trigger ChromePicker */}
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="mt-2 text-sm text-[var(--primary-text-color)] underline"
      >
        {showColorPicker ? "Close Custom Picker" : "Choose Custom Color"}
      </button>

      {/* ChromePicker for custom colors */}
      {showColorPicker && (
        <div ref={colorPickerRef} className="absolute z-10 top-10 left-0">
          <ChromePicker
            color={color}
            onChange={(newColor) => setColor(newColor.hex)}
          />
        </div>
      )}
    </div>
  </div>

  <div className="w-1/2 pl-2">
    <label className="block text-[var(--primary-text-color)] text-sm font-bold mb-2">
      Upload Logo
    </label>
    <input
      type="file"
      accept="image/*"
      className="appearance-none border rounded w-full py-2 px-3 text-[var(--primary-text-color)] leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setLogo(e.target.files ? e.target.files[0] : null)
      }
    />
  </div>
</div>

        <div className="flex items-center justify-center flex-wrap">
          <button
            onClick={handleGenerateQRCode}
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Generating..." : (qrCode ? 'Regenerate ' : 'Generate')}
          </button>
        </div>
      </div>
      {isLoading && (
       <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
       <BigwigLoader />
       <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}
      {qrCode && (
        <div ref={qrCodeRef} className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-center">Generated QR Code</h3>
          <div className="rounded-md p-4  relative overflow-x-auto max-w-full">
            <img src={qrCode} alt="QR Code" className="mx-auto" />
            <div className='flex justify-center'>
            <button
              onClick={handleDownloadQRCode}
              className="mt-4 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            title='Download'>
              Download
            </button>
            <button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)]  hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                  onClick={handleShareClick}
                title='Share'>
                  Share
              </button>
            </div>
            
          </div>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
