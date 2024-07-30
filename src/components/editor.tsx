import React, { useRef, useState } from 'react';
import { Stage, Layer, Image, Text } from 'react-konva';
import useImage from 'use-image';
import { Button } from "@/components/ui/button";
import { UploadIcon, DownloadIcon } from "lucide-react";
import { validateInput } from '@/utils/validateInput';
import { toast } from 'sonner';

const WatermarkEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [image] = useImage(imageURL || '');
  const [text, setText] = useState<string>('Your Watermark');
  const [textColor, setTextColor] = useState<string>('white');
  const [fontSize, setFontSize] = useState<number>(30);
  const [rotation, setRotation] = useState<number>(0);
  const stageRef = useRef<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement('a');
      link.download = 'watermarked-image.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    if (validateInput(newText)) {
      setText(newText);
    } else {
      toast.error('Watermark text contains prohibited words. Please remove them and try again.');
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      {/* Image upload section */}
      <div className="border-4 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center relative">
        <UploadIcon className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-400 mb-4">Drag and drop an image here, or click to browse</p>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
          onChange={handleImageUpload}
          accept="image/*"
        />
        <label htmlFor="file-upload" className="cursor-pointer p-2 bg-white text-gray-700 rounded-md border border-gray-300 z-10">
          Browse
        </label>
      </div>

      {/* Options for text customization */}
      {imageURL && (
        <div className="mt-6">
          <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <label className="block mb-2">Watermark Text:</label>
              <input
                type="text"
                value={text}
                onChange={handleTextChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block mb-2">Text Color:</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="block mb-2">Font Size:</label>
              <button onClick={() => setFontSize(prev => Math.max(prev - 5, 10))}>-</button>
              <span>{fontSize}</span>
              <button onClick={() => setFontSize(prev => Math.min(prev + 5, 100))}>+</button>
            </div>
            <div className="flex items-center gap-2">
              <label className="block mb-2">Rotation:</label>
              <button onClick={() => setRotation(prev => prev - 5)}>Left</button>
              <span>{rotation}°</span>
              <button onClick={() => setRotation(prev => prev + 5)}>Right</button>
            </div>
          </div>

          {/* Canvas with selected image and watermark text */}
           <div className=" w-full flex justify-center">
            <div className="w-full max-w-[500px] h-[500px]">
              <Stage width={500} height={500} ref={stageRef} className="w-full h-full">
                <Layer>
                  {image && (
                    <Image image={image} width={500} height={500} />
                  )}
                  <Text
                    text={text}
                    x={20}
                    y={20}
                    fontSize={fontSize}
                    fill={textColor}
                    rotation={rotation}
                    draggable
                  />
                </Layer>
              </Stage>
            </div>
            </div>
            {/* Download button */}
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-4 px-6 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-5"
              onClick={handleDownload}
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        
      )}
    </div>
  );
};

export default WatermarkEditor;
