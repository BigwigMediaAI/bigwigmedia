import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import BigwigLoader from "@/pages/Loader";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import CreditLimitModal from "./Model3";

export function AddLogoTool() {
  const [image, setImage] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPosition, setLogoPosition] = useState<string>("top-left");
  const [logoSize, setLogoSize] = useState<number>(200);
  const [border, setBorder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [showModal3, setShowModal3] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
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

  const positions = [
    "top-left",
    "top-right",
    "top-middle",
    "bottom-left",
    "bottom-right",
    "bottom-middle",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "logo") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "image") setImage(e.target.files[0]);
      else if (type === "logo") setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image || !logo) {
      toast.error("Please upload both an image and a logo.");
      return;
    }

    setIsLoading(true);

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
      formData.append("image", image);
      formData.append("logo", logo);
      formData.append("logoPosition", logoPosition);
      formData.append("logoSize", logoSize.toString());

      const response = await axios.post(`${BASE_URL}/response/overlayImage?clerkId=${userId}`, formData, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (error: any) {
      console.error("Error overlaying logo:", error);
      toast.error(error.response?.data?.error || "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = "image_with_logo.png";
      link.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    } else {
      toast.error("Please select an image file.");
    }
  };

  useEffect(() => {
    if (!isLoading && resultImage) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, resultImage]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col gap-6">
        {/* Image Upload */}
        <div
            className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <Button
              className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              Select Image File
            </Button>
            {image && (
                <p className="text-[var(--primary-text-color)] mt-2 text-center">{image.name}</p>
              )}
            <p className="text-gray-400">or drag and drop files</p>          
          </div>

        {/* Logo Upload */}
        <div>
          <label className="block font-medium mb-2">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            ref={logoInputRef}
            onChange={(e) => handleFileChange(e, "logo")}
            className="file-input border border-black p-2 w-full rounded-sm"
          />
        </div>

        <div className="flex gap-5">
            {/* Logo Position */}
        <div className="w-1/2">
          <label className="block font-medium mb-2">Logo Position</label>
          <select
            value={logoPosition}
            onChange={(e) => setLogoPosition(e.target.value)}
            className="select-input border border-black p-2 w-full rounded-sm"
          >
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
            <label className="block font-medium mb-2">Logo Size (px)</label>
            <select
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="border border-black p-2 w-full rounded-sm"
            >
                {/* Add your desired size options */}
                <option value={50}>50px</option>
                <option value={100}>100px</option>
                <option value={150}>150px</option>
                <option value={200}>200px</option>
                <option value={250}>250px</option>
                <option value={300}>300px</option>
                <option value={350}>350px</option>
                <option value={400}>400px</option>
            </select>
            </div>


        </div>
        

        {/* Actions */}
        <div className="flex w-full my-4 items-center justify-between">
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
              onClick={handleSubmit}
              disabled={!image || !logo || !logoSize || !logoPosition || isLoading}
            >
              {isLoading ? "Generating..." : resultImage ? "Regenerate" : "Generate"}
            </Button>
          </div>

          <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
            resultImage && (
                <div ref={resultsRef} className=" text-center">
                  <img src={resultImage} alt="Result" className="max-w-full mx-auto" />
                  <Button onClick={handleDownload} className="mt-5 text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto">
                    Download Image
                  </Button>
                </div>
              )
        )}
      </div>
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
