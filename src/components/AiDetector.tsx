import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons"; // Adjust import as per your project structure
import { useAuth } from "@clerk/clerk-react"; // Assuming you are using Clerk for authentication

export function AIDetector() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiLikelihood, setAILikelihood] = useState("");
  const { userId } = useAuth(); // Assuming you need userId for API call
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setAILikelihood(""); // Clear previous result
     // Scroll to loader after a short delay to ensure it's rendered
     setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/detector?clerkId=${userId}`,
        { text }
      );

      if (res.status === 200) {
        setAILikelihood(res.data.result);
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (textToCopy: string) => {
    try {
      navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setAILikelihood("");
  };

  useEffect(() => {
    if (!isLoading && aiLikelihood) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, aiLikelihood]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Text to Detect AI Content"
          value={text}
          onChange={handleTextChange}
        />
        <div className="flex items-center justify-between ">
          <Button
            className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
            variant="ghost"
            onClick={handlePaste}
          >
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Text
          </Button>
        </div>

        <div className="flex flex-col gap-2 mt-4">
        <Button
            className="mb-8 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={handleSubmit}
          >
            {isLoading ? (
              "Detecting AI..."
            ) : (
              "Detect AI"
            )}
          </Button>
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 text-gray-400" />
              <p className="text-gray-400 text-justify">Detecting AI content. Please wait...</p>
            </div>
          ) : (
            aiLikelihood !== "" && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-bold text-center text-blue-500">
                  {`AI Likelihood: ${aiLikelihood}`}
                </div>
                <Button
                  className="rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                  variant="ghost"
                  onClick={() => handleCopy(`${aiLikelihood}`)}
                >
                </Button>
              </div>
            )
          )}
          
        </div>
      </div>
    </div>
  );
}
