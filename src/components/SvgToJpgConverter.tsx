import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";

interface ExtractedImage {
  filename: string;
  url: string;
}

export function SvgToJpgConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [zipUrl, setZipUrl] = useState<string>(""); // To hold the zip file URL
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]); // Correctly typed array
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);

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
      console.error("Error fetching credits:", error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  useEffect(() => {
    return () => {
      if (zipUrl) {
        window.URL.revokeObjectURL(zipUrl);
      }
    };
  }, [zipUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    const newFiles = Array.from(files).filter((file) => file.type === "image/svg+xml");
    if (newFiles.length < files.length) {
      toast.error("Please select only svg format files.");
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 10));
  };

  const convertSVGToJPG = async () => {
    setIsLoading(true);
    try {
      if (selectedFiles.length === 0) {
        toast.error("Please select an SVG image.");
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

      const currentCredits = await getCredits();
      if (currentCredits <= 0) {
        setShowModal3(true);
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("svgs", file));

      // Convert SVG to PNG and get ZIP
      const response = await axios.post(`${BASE_URL}/response/convertsvgtojpg?clerkId=${userId}`, formData, {
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        setZipUrl(url); // Store ZIP URL
        toast.success("Conversion successful. Extracting files...");

        // Automatically extract the ZIP file
        await extractZip(response.data);
      } else {
        toast.error("Error converting images. Please try again later.");
      }
    } catch (error) {
      console.error("Error converting images:", error);
      toast.error("Error converting images. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractZip = async (zipFileBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("zipfile", zipFileBlob);

      const response = await axios.post(`${BASE_URL}/response/files?clerkId=${userId}`, formData);
      
      if (response.status === 200) {
        // Extract filenames and URLs from the response data
        const imagesData: ExtractedImage[] = response.data.files.map((file: any) => ({
          filename: file.filename,
          url: file.url,
        }));
        
        // Update state with the extracted image data
        setExtractedImages(imagesData);
        console.log(imagesData)
        toast.success("Files extracted successfully.");
      } else {
        toast.error("Error extracting files.");
      }
    } catch (error) {
      console.error("Error extracting ZIP:", error);
      toast.error("Error extracting ZIP. Please try again later.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const newFiles = Array.from(files).filter((file) => file.type === "image/svg+xml");
    if (newFiles.length < files.length) {
      toast.error("Please select only svg format files.");
    }
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles].slice(0, 10));
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleDownload = async (filename: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/response/files?filename=${encodeURIComponent(filename)}&clerkId=${userId}`, {
        responseType: "blob",
      });
  
      // Create a blob URL for the file
      const blob = new Blob([res.data]);
      const blobURL = URL.createObjectURL(blob);
  
      // Create an anchor element and set its href to the blob URL
      const link = document.createElement("a");
      link.href = blobURL;
      link.setAttribute("download", filename);
  
      // Append the anchor element to the document body and click it programmatically
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
    } catch (error) {
      toast.error("Error downloading file");
    }
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
            accept="image/svg+xml"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
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
      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-9 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={convertSVGToJPG}
          disabled={selectedFiles.length === 0 || isLoading}
        >
          {isLoading ? "Converting..." : zipUrl ? "Convert Again" : "Convert SVG"}
        </Button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">
              Processing your data. Please bear with us as we convert your images.
            </p>
          </div>
        ) : (
            extractedImages.length > 0 && (
          <div ref={resultsRef} className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Converted Files</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              {extractedImages.map((file) => (
                <div 
                  key={file.filename} 
                  className={`border border-[var(--primary-text-color)] p-4 rounded-md relative cursor-pointer ${hoveredFile === file.filename ? 'bg-gray-200 text-black' : ''}`}
                  onMouseEnter={() =>setHoveredFile(file.filename)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <span className="inline-block w-full truncate text-[var(--primary-text-color)]">{file.filename}</span>
                  {hoveredFile === file.filename && (
                    <button
                      className=" rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 py-2 bg-transparent bg-white text-[var(--teal-color)]"
                      onClick={() => handleDownload(file.filename)}
                    title="Download" >
                      <DownloadIcon className=" mr-1 inline-block " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

        )}
      </div>

      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
