import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState,useEffect,useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Download, Loader2, Copy, Share2 } from "lucide-react"; // Assuming Copy icon from lucide-react

import { BASE_URL } from "../utils/funcitons";

export function CodeConverter() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const languages = ["C", "C++", "Java", "JavaScript", "Python"];

  const handleCodeChange = (e:any) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e:any) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSubmit = async () => {
    setConvertedCode("");
    if (!code || !selectedLanguage) {
      toast.error("Please enter code and select a target language.");
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/response/code?clerkId=${userId}`,
        {
          sourceCode: code,
          targetLanguage: selectedLanguage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setConvertedCode(response.data.convertedCode);
    } catch (error:any) {
      console.error("Error converting code:", error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(convertedCode);
    toast.success("Converted code copied to clipboard!");
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([convertedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "extracted_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Extracted Text',
          text: convertedCode,
        });
      } else {
        toast.error('Web Share API not supported in this browser.');
      }
    } catch (error) {
      console.error('Error sharing text:', error);
      toast.error('Error sharing text.');
    }
  };

  useEffect(() => {
    if (!isLoading && convertedCode) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, convertedCode]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <Textarea
            className="mb-5 h-40"
            placeholder="Example:
function add(a, b) {
  return a + b;
}
const data = add(5, 5);
console.log(data);
            "
            value={code}
            onChange={handleCodeChange}
          />
          <select
            className="mb-4 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="">Select Target Language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <div className="flex w-full my-4 items-center justify-center">
            <Button
              className={`text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
              onClick={handleSubmit}
            >
              {isLoading ? "Generating..." : convertedCode ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Converting code. Please wait...</p>
          </div>
        ) : convertedCode ? (
          <div ref={resultsRef} className="w-full">
            <div className="flex justify-evenly items-center mb-4">
              <h3 className="text-lg font-semibold">Converted Code</h3>
              <Copy className="cursor-pointer hover:text-blue-800" onClick={handleCopyCode} />
              <Download
                className="w-6 h-6  cursor-pointer hover:text-blue-800"
                onClick={downloadAsText}
              />
              <Share2
                className="w-6 h-6  cursor-pointer hover:text-blue-800"
                onClick={handleShare}
              />
            </div>
            <Textarea
              className="w-full mb-4 h-40"
              placeholder="Converted code will be displayed here..."
              value={convertedCode}
              readOnly
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
