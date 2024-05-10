import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

export function ImagetoText() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTextGenerated, setIsTextGenerated] = useState(false);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Extract the selected file or set to null if no file selected
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      toast.error("Please select an image.");
      return;
    }
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post(`${BASE_URL}/response/upload?clerkId=${userId}`, formData);
      setText(response.data);
      setIsTextGenerated(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Error uploading image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Text copied to clipboard"))
      .catch(() => toast.error("Failed to copy text"));
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the file input
      />
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <div className="flex items-center justify-between">
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-5 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {selectedFile ? selectedFile.name : "Select Image"}
            </Button>
          </div>
          <Textarea
            className="mb-4 h-60 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            value={text}
            placeholder="Select an image containing text to extract the text."
            readOnly
          />
          <div className="flex w-full my-4 items-center justify-between">
            {isTextGenerated && (
              <Button
                className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                onClick={handleCopyText}
              >
              <CopyIcon className="mr-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        <div className="w-full pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
              <p className="dark:text-white text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : null}
          <Button
            className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={handleGenerate} // Trigger text generation when "Generate" button is clicked
            disabled={!selectedFile || isLoading || isTextGenerated}
          >
            {isTextGenerated ? "Text Generated" : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
