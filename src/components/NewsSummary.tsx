  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
  import { useState, useEffect, useRef } from "react";
  import axios from "axios";
  import { ClipboardCopyIcon, CopyIcon, Download, Loader2, Share2 } from "lucide-react";
  import { toast } from "sonner";
  import { BASE_URL } from "@/utils/funcitons";
  import { useAuth } from "@clerk/clerk-react";

  export function NewsSummarize() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [summaries, setSummaries] = useState([]);
    const [outputCount, setOutputCount] = useState(3); // Default number of outputs
    const [languageCode, setLanguageCode] = useState("en"); // Default language code
    const { getToken, isLoaded, isSignedIn, userId } = useAuth();
    const loaderRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const handlePaste = async () => {
      const pastedText = await navigator.clipboard.readText();
      setText(pastedText);
    };

    const handleSubmit = async () => {
      setIsLoading(true);
      setSummaries([]); // Clear previous summaries
      if (!text) {
        toast.error("Please enter the news article to generate summary");
        setIsLoading(false);
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      try {
        const res = await axios.post(
          `${BASE_URL}/response/news?clerkId=${userId}`,
          { articleText: text, languageCode, output: outputCount } // Use the selected languageCode and outputCount
        );
        console.log(res.data); // Log the response

        if (res.status === 200) {
          const summaryArray = res.data.summaryText.split('\n').filter(Boolean);
          setSummaries(summaryArray);
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

    const handleTextChange = (e: any) => {
      setText(e.target.value);
      setSummaries([]);
    };

    useEffect(() => {
      if (!isLoading && summaries.length > 0) {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, [isLoading, summaries]);

    const handleShare = () => {
      const textToShare = summaries.join('\n');
      if (navigator.share) {
        navigator.share({
          title: 'Generated Domain Names',
          text: textToShare,
        }).catch((error) => console.error('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(textToShare).then(() => {
          toast.success('Domain names copied to clipboard');
        }).catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast.error('Failed to copy domain names to clipboard');
        });
      }
    };
  
    const handleDownload = () => {
      const textToDownload = summaries.join('\n');
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'domain-names.txt';
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

    return (
      <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
        <div className="flex flex-col">
          <Textarea
            className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="Enter News Article to Summarize."
            value={text}
            onChange={handleTextChange}
          />
          <div className="flex items-center justify-between mb-4">
            <Button
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
              variant="ghost"
              onClick={handlePaste}
            >
              <ClipboardCopyIcon className="mr-2 h-5 w-5" />
              Paste Text
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4 space-x-4">
            <div className="flex flex-col">
              <label htmlFor="outputCount">Number of Outputs:</label>
              <select
                id="outputCount"
                value={outputCount}
                onChange={(e) => setOutputCount(parseInt(e.target.value))}
                className="rounded-md border-2 border-gray-300 p-2 dark:bg-[#262626]"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="languageCode">Language:</label>
              <select
                id="languageCode"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="rounded-md border-2 border-gray-300 p-2 dark:bg-[#262626]"
              >
                {[
                  { code: "en", name: "English" },
                  { code: "es", name: "Spanish" },
                  { code: "fr", name: "French" },
                  { code: "zh-cn", name: "Chinese (Simplified)" },
                  { code: "zh-tw", name: "Chinese (Traditional)" },
                  { code: "ar", name: "Arabic" },
                  { code: "de", name: "German" },
                  { code: "hi", name: "Hindi" },
                  { code: "it", name: "Italian" },
                  { code: "ja", name: "Japanese" },
                  { code: "ko", name: "Korean" },
                  { code: "pt", name: "Portuguese" },
                  { code: "ru", name: "Russian" },
                  { code: "ur", name: "Urdu" },
                  { code: "bn", name: "Bengali" },
                  { code: "gu", name: "Gujarati" },
                  { code: "kn", name: "Kannada" },
                  { code: "ml", name: "Malayalam" },
                  { code: "mr", name: "Marathi" },
                  { code: "ne", name: "Nepali" },
                  { code: "or", name: "Odia" },
                  { code: "pa", name: "Punjabi" },
                  { code: "ta", name: "Tamil" },
                  { code: "te", name: "Telugu" },
                  { code: "as", name: "Assamese" },
                  { code: "bh", name: "Bihari" },
                  { code: "ks", name: "Kashmiri" },
                  { code: "kok", name: "Konkani" },
                  { code: "mai", name: "Maithili" },
                  { code: "mni", name: "Manipuri" },
                  { code: "sat", name: "Santali" },
                  { code: "sd", name: "Sindhi" },
                  { code: "kok", name: "Konkani" }
                  // Add more languages as needed
                ].map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400 " />
              <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            summaries.length > 0 && (
              <>
                <div ref={resultsRef} className="flex flex-col gap-2 mt-4">
                  {summaries.map((summary, index) => (
                    <div key={index} className="h-44 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
                      <p className="mt-5">{summary}</p>
                      <Button
                        className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                        variant="ghost"
                        onClick={() => handleCopy(summary)}
                      title="Copy">
                        <CopyIcon className="h-5 w-5" />
                      </Button>
                      <button
                    className="absolute top-2 right-10 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleShare}
                  title="Share">
                   <Share2/>
                  </button>
                  <button
                    className="absolute top-2 right-20 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleDownload}
                  title="Download">
                    <Download/>
                  </button>
                    </div>
                  ))}
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
          {!isLoading && summaries.length === 0 && (
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
