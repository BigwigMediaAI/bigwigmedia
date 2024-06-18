import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons"; // Ensure BASE_URL is correctly imported
import { useAuth } from "@clerk/clerk-react";

export function SWOTGenerator() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [swotAnalysis, setSwotAnalysis] = useState("");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSwotAnalysis("");  // Clear previous SWOT analysis
    if (!topic) {
      toast.error("Please enter a topic for SWOT analysis");
      setIsLoading(false);
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/generateSWOT?clerkId=${userId}`,
        { topic }
      );
      console.log(res.data); // Log the response

      if (res.status === 200) {
        setSwotAnalysis(res.data.swotAnalysis);
        setIsLoading(false);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
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
    setTopic(e.target.value);
    setSwotAnalysis("");
  };

  useEffect(() => {
    if (!isLoading && swotAnalysis) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, swotAnalysis]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
      <Textarea
        className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
        placeholder="Enter the topic for SWOT analysis (e.g., Starting a grocery business)"
        value={topic}
        onChange={handleTextChange}
        />
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400 " />
            <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          swotAnalysis && (
            <>
              <div ref={resultsRef} className="flex flex-col gap-2 mt-4">
                <div className="h-96 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
                  {swotAnalysis.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                  <Button
                    className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    variant="ghost"
                    onClick={() => handleCopy(swotAnalysis)}
                  >
                    <CopyIcon className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                  onClick={handleSubmit}
                >
                  Regenerate
                </Button>
              </div>
            </>
          )
        )}
        {!isLoading && !swotAnalysis && (
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              "Generate"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
