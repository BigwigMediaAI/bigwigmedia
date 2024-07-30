import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from '@/utils/funcitons';
import { CopyIcon, Download, Loader2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateInput } from "@/utils/validateInput";

export function Special() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  const [language, setLanguage] = useState("English");
  const [outputCount, setOutputCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { isSignedIn, userId } = useAuth();
  const navigate = useNavigate();

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    if (!isSignedIn) {
      navigate("/login");
      toast.error("Please sign in to continue");
      setIsLoading(false);
      return;
    }

    if (!text) {
      toast.error("Please enter the text to generate");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/response/special?clerkId=${userId}`,
        {
          prompt: text,
          language: language,
          outputCount: outputCount,
        }
      );

      if (res.status === 200) {
        const responseData = res.data.data;
        setOutput(responseData);
      } else {
        toast.error(res.data.error || "Failed to generate notes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(output);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated Text',
        text: output,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(output).then(() => {
        toast.success('Text copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy text to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    if (!isLoading && output) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, output]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Enter Text:</label>
          <div className="relative">
            <Textarea
              className="h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4 pr-12"
              placeholder="Enter text to generate notes..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="absolute right-2 top-2 bg-transparent border-none"
              onClick={handlePaste}
            >
            
            </button>
          </div>
        </div>
        <div className="flex mb-4 justify-between">
          <div className="w-1/2 mr-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Language:</label>
            <select
              className="rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2 w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Hindi">Hindi</option>
              <option value="Arabic">Arabic</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Bengali">Bengali</option>
              <option value="Russian">Russian</option>
              <option value="Japanese">Japanese</option>
              <option value="Lahnda">Lahnda</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Javanese">Javanese</option>
              <option value="Korean">Korean</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Turkish">Turkish</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Italian">Italian</option>
              <option value="Urdu">Urdu</option>
              <option value="Persian">Persian</option>
              <option value="Malay">Malay</option>
              <option value="Thai">Thai</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Kannada">Kannada</option>
              <option value="Polish">Polish</option>
              <option value="Ukrainian">Ukrainian</option>
              <option value="Romanian">Romanian</option>
              {/* Add more languages here */}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Output Count:</label>
            <input
              type="number"
              className="rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2 w-full text-center"
              placeholder="Output Count"
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : (output ? "Regenerate" : "Generate")}
          </Button>
        </div>
        <div className="w-full mt-4 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
              <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            output && (
              <div
                ref={resultsRef}
                className="h-60 md:h-96 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-4 overflow-y-auto"
              >
                {output.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-5">{line}</p>
                ))}
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="rounded-md px-4 py-2 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleCopy}
                    title="Copy"
                  >
                    <CopyIcon />
                  </button>
                  <button
                    className="rounded-md px-4 py-2 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share2 />
                  </button>
                  <button
                    className="rounded-md px-4 py-2 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <Download />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
