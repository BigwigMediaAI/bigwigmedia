import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState,useEffect,useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Download, Loader2, Copy, Share2 } from "lucide-react"; // Assuming Copy icon from lucide-react
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import BigwigLoader from "@/pages/Loader";

export function CodeConverter() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
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

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  useEffect(() => {
    if (!isLoading && convertedCode) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, convertedCode]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
        <label className="block text-[var(--primary-text-color)]">Write or Paste the code</label>
          <Textarea
            className="mb-5 h-40 border border-[var(--primary-text-color)]"
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
            className="mb-4 w-full rounded-md border border-[var(--primary-text-color)] p-4"
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
              className={`text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)]  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--hover-teal-color)]'}`}
              onClick={handleSubmit}
            >
              {isLoading ? "Generating..." : convertedCode ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader styleType="cube" />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : convertedCode ? (
          <div ref={resultsRef} className="w-full">
            <div className="flex justify-between items-center mb-4">
              
              <h1 className="text-lg font-semibold">Converted Code</h1>
              <div className="flex gap-4">
              <Copy className="cursor-pointer text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]" onClick={handleCopyCode} />
              <Download
                className="w-6 h-6  cursor-pointer text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                onClick={downloadAsText}
              />
              <Share2
                className="w-6 h-6  cursor-pointer text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                onClick={handleShare}
              />
              </div>
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
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
