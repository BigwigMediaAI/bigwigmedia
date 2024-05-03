import { useState } from "react";
import axios from "axios";
import { ChromePicker } from "react-color";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#000000"); // Initial color
  const [textAboveQR, setTextAboveQR] = useState("");
  const [textBelowQR, setTextBelowQR] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { userId } = useAuth();


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
            className="appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Color
          </label>
          <div className="relative">
            <input
              type="text"
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
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleGenerateQRCode}
          >
            Generate QR Code
          </button>
          {qrCode && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDownloadQRCode}
            >
              Download QR Code
            </button>
          )}
        </div>
        {qrCode && (
          <div className="mt-4">
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
