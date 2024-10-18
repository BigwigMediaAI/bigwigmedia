import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

export function AIBackground() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const [extractedImages, setExtractedImages] = useState<[]>([]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleImageCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumberOfImages(parseInt(e.target.value));
  };

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleImageUpload = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please select a JPG or PNG image.");
        return;
      }

      const currentCredits = await getCredits();
      if (currentCredits <= 0) {
        setShowModal3(true);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("image", file));
      formData.append("prompt", prompt);
      formData.append("n", numberOfImages.toString());

      const response = await axios.post(`${BASE_URL}/response/background?clerkId=${userId}`, formData, {
        responseType: "json",
      });

      setExtractedImages(response.data.imageUrls);
      toast.success("Images edited successfully!");

    } catch (error) {
      console.error("Error editing images:", error);
      toast.error("Error editing images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newFiles = Array.from(files).filter((file) =>
      file.type === "image/jpeg" || file.type === "image/png"
    );

    if (newFiles.length < files.length) {
      toast.error("Please select only JPG or PNG format files.");
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 10));
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center w-full relative">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
          <input
            type="file"
            id="fileInput"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                setSelectedFiles((prevFiles) => [...prevFiles, ...files].slice(0, 10));
              }
            }}
          />
          <Button
            className="border border-[var(--gray-color)] text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100 w-48 text-ellipsis overflow-hidden whitespace-nowrap"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse Files
          </Button>
          <p className="text-gray-400">or drag and drop files</p>
        </div>
        <div className="mt-4 w-full text-center">
          {selectedFiles.length > 0 && (
            <ul className="list-none">
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-[var(--primary-text-color)]">
                  <span className="mr-5">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-[var(--primary-text-color)] hover:text-[var(--teal-color)]">
                    &#x2715;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Enter prompt for image editing"
          value={prompt}
          onChange={handlePromptChange}
          className="border border-[var(--gray-color)] p-2 rounded-md w-full"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-gray-600">Number of Images:</label>
        <select
          value={numberOfImages}
          onChange={handleImageCountChange}
          className="border border-[var(--gray-color)] p-2 rounded-md w-full"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-medium text-start mt-4 italic text-red-500">Note: The image must be a PNG file, under 4MB, and have transparency for editing.

</h3>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleImageUpload}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? "Generating..." :(extractedImages.length>0?"Regenerate":"Generate") }
        </Button>

      </div>
        

      <div className="mt-5">
  {isLoading ? (
    <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
      <BigwigLoader />
      <p className="text-[var(--dark-gray-color)] text-center mt-5">
        Processing your data. Please bear with us as we edit your images.
      </p>
    </div>
  ) : (
    extractedImages.length > 0 && (
      <div ref={resultsRef} className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Edited Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Use a grid layout */}
    {extractedImages.map((imageUrl, index) => (
      <div key={index} className="flex flex-col items-center">
        <img src={imageUrl} alt={`Edited Image ${index + 1}`} className="max-w-full h-auto rounded-md" />
        <a
          href={imageUrl}
          download={`edited_image_${index + 1}.png`}
          target="_blank"  // Opens the link in a new tab
          rel="noopener noreferrer"  // Security best practice
          className="mt-2 text-[var(--teal-color)] underline"
        >
          Download 
        </a>
      </div>
    ))}

  </div>
      </div>
    )
  )}
</div>


      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
