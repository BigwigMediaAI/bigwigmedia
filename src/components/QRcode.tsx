import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { Loader2, Palette,Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "../utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

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

  const handleGenerateQRCode = async () => {
    setIsLoading(true);
    if (!url || !color || !textAboveQR || !textBelowQR) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

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

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            URL
          </label>  
          <input
            type="text"
            placeholder="Enter URL of your choice"
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Text Above QR
          </label>
          <input
            type="text"
            placeholder="Enter the name of your company"
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={textAboveQR}
            onChange={(e) => setTextAboveQR(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Text Below QR
          </label>
          <input
            type="text"
            placeholder="Example: Scan QR to visit site"
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={textBelowQR}
            onChange={(e) => setTextBelowQR(e.target.value)}
          />
        </div>
        <div className="mb-4 flex justify-between items-center">
          <div className="w-1/2 pr-2">
            <label className="block text-white text-sm font-bold mb-2">
              Color 🎨
            </label>
            <div className="relative">
              <div
                className=" rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline cursor-pointer flex items-center"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="mr-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg w-10 h-10 " />
                <span>{color || "Click to select color"}</span>
              </div>
              {showColorPicker && (
                <div ref={colorPickerRef} className="absolute z-10 top-10 left-0">
                  <ChromePicker color={color} onChange={(newColor) => setColor(newColor.hex)} />
                </div>
              )}
            </div>
          </div>
          <div className="w-1/2 pl-2">
            <label className="block text-white text-sm font-bold mb-2">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLogo(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap">
          <button
            onClick={handleGenerateQRCode}
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Generating..." : (qrCode ? 'Regenerate ' : 'Generate')}
          </button>
        </div>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
          <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {qrCode && (
        <div ref={qrCodeRef} className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300">
          <h3 className="text-xl font-semibold mb-4 text-center">Generated QR Code</h3>
          <div className="rounded-md p-4 dark:text-gray-200 relative overflow-x-auto max-w-full">
            <img src={qrCode} alt="QR Code" className="mx-auto" />
            <button
              onClick={handleDownloadQRCode}
              className="mt-4 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            title='Download'>
              Download
            </button>
            <button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-4"
                  onClick={handleShareClick}
                title='Share'>
                  Share
              </button>
          </div>
        </div>
      )}
    </div>
  );
}
