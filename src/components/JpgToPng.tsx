import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

export function JPGtoPNGConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isImageGenerated, setIsImageGenerated] = useState(false);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type === "image/jpeg") {
      setSelectedFile(file);
    } else {
      toast.error("Please select a JPG image.");
    }
  };

  const refreshSelection = () => {
    window.location.reload();
  };

  const convertJPG = async () => {
    setIsLoading(true);
    try {
      if (!selectedFile) {
        toast.error("Please select a JPG image.");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`https://bigwigmedia-backend.onrender.com/api/v1/response/jpgtopng`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "image/png" });
        const url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        setIsImageGenerated(true);
        toast.success("Conversion successful. Ready to download.");
      } else {
        toast.error("Error converting image. Please try again later.");
      }
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Error converting image. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex items-center justify-center mb-5 space-x-2">
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="imageInput"
        />
        <Button
          className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100 w-48"
          onClick={() => document.getElementById("imageInput")?.click()}
        >
          {selectedFile ? selectedFile.name : "Select JPG"}
        </Button>
        <RefreshCw 
          className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800" 
          onClick={refreshSelection} 
        />
      </div>
      {isLoading && (
        <div className="flex flex-col items-center mt-5">
          <p className="text-gray-600">Converting...</p>
          <Loader2 className="animate-spin w-10 h-10 text-black mt-3" />
        </div>
      )}
      {isImageGenerated && (
        <div className="flex flex-col items-center mt-5">
          <img src={imageUrl} alt="Converted image" className="w-40 h-40 mb-4" />
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit"
            onClick={() => {
              const a = document.createElement("a");
              a.href = imageUrl;
              a.download = "converted-image.png";
              a.click();
            }}
          >
            Download PNG
          </Button>
        </div>
      )}
      <div className="mt-5 flex justify-center">
        {!isImageGenerated && (
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
            onClick={convertJPG}
            disabled={!selectedFile || isLoading}
          >
            Convert JPG
          </Button>
        )}
      </div>
    </div>
  );
}