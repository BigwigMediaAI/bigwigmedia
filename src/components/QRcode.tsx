import { useState, useRef } from "react";
import axios from "axios";
import { ChromePicker } from "react-color";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "../utils/funcitons";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [color, setColor] = useState(""); // Initial color
  const [textAboveQR, setTextAboveQR] = useState("");
  const [textBelowQR, setTextBelowQR] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { userId } = useAuth();
  const qrCodeRef = useRef<HTMLImageElement>(null); // Reference to the QR code image element

  const handleGenerateQRCode = async () => {
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
      console.error("Error generating QR code:", error);
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

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            URL
          </label>  
          <input
            type="text"
            placeholder="Enter URL of you choice"
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Color 🎨
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Click here to select color"
              className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline pl-10"
              value={color}
              readOnly
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            {showColorPicker && (
              <div className="absolute z-10 top-10 left-0 text-white">
                <ChromePicker color={color} onChange={(newColor) => setColor(newColor.hex)} />
              </div>
            )}
          </div>
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
        <div className="mb-4">
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
        <div className="flex items-center justify-center flex-wrap">
          <button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
            onClick={handleGenerateQRCode}
          >
            Generate QR Code
          </button>
        </div>
        {/* QR code image */}
        {qrCode && (
          <div className="mt-4" ref={qrCodeRef}>
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
        {/* Download button */}
        {qrCode && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDownloadQRCode}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
