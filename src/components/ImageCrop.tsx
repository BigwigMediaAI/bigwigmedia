import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { UploadIcon, RefreshCwIcon, DownloadIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);
  const croppedImageRef = useRef<HTMLDivElement>(null);

  const onCropComplete = (_: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setCroppedAreaPixels(null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    setCroppedAreaPixels(null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getCroppedImage = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        const link = document.createElement("a");
        link.href = croppedImage;
        link.download = "croppedImage.png";
        link.click();
      } catch (e) {
        console.error(e);
        toast.error("Error cropping the image");
      }
    }
  };

  const getCroppedImg = (imageSrc: string, croppedAreaPixels: CroppedAreaPixels): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, "image/png");
      };
      image.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] rounded-lg p-6 flex flex-col items-center justify-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <>
            <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300">Browse</label>
            </div>
            <p className="text-[var(--primary-text-color)] m-4">{selectedFile.name}</p>
            <p className="text-gray-400 mb-4">Drag and drop an image here, or click to browse</p>
            <RefreshCwIcon
              className="w-8 h-8 text-gray-400 mt-2 cursor-pointer"
              onClick={() => setSelectedFile(null)}
            />
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 mb-4">Drag and drop an image here, or click to browse</p>
            <div className="relative">
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300">Browse</label>
            </div>
          </>
        )}
      </div>

      {imageSrc && (
        <div className="relative w-full h-64 mt-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-5"
        onClick={getCroppedImage}
        disabled={!selectedFile}
      >
        Crop & Download
      </Button>
    </div>
  );
}