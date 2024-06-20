import { useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Adjust the toast library as per your actual library
// import { BASE_URL } from "@/utils/functions"; // Assuming this path is correct in your project
import { useAuth } from "@clerk/clerk-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/utils/funcitons";

interface SummaryResponse {
  [x: string]: ReactNode;
  summary: string | string[]; // Adjusted to accept string or array of strings
}

export function Summarize() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [outputCount, setOutputCount] = useState(3);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSummaries([]);

    if (!text) {
      toast.error("Please enter the text to generate summary");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post<SummaryResponse>(
        `${BASE_URL}/response/getSummary?clerkId=${userId}`,
        { text, language, output: outputCount }
      );
      console.log(res.data.summary)
      if (res.status === 200) {
        if (typeof res.data.summary === "string") {
          setSummaries([res.data.summary]); // Wrap single summary in an array
        } else if (Array.isArray(res.data.summary)) {
          setSummaries(res.data.summary); // Use as-is if already an array
        } else {
          toast.error("Invalid data format received from the server");
        }
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
    setSummaries([]);
  };

  useEffect(() => {
    if (!isLoading && summaries.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, summaries]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Text to Summarize."
          value={text}
          onChange={handleTextChange}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 border-2 border-gray-300 hover:bg-gray-100 hover:dark:bg-gray-800"
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

              {/* Add more languages as needed */}
            </select>

            <select
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 border-2 border-gray-300 hover:bg-gray-100 hover:dark:bg-gray-800 ml-4"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              {/* Add more options if needed */}
            </select>
          </div>
          <Button
            className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
            variant="ghost"
            onClick={handlePaste}
          >
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Text
          </Button>
        </div>

        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
            <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          summaries.length > 0 && (
            <div ref={resultsRef} className="flex flex-col gap-4 mt-4">
              {summaries.map((summary, index) => (
                <div key={index} className="rounded-lg border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 mb-4">
                  <div className="overflow-y-scroll max-h-40">
                    {summary.split("\n\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <Button
                    className="mt-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    variant="ghost"
                    onClick={() => handleCopy(summary)}
                  >
                    <CopyIcon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                onClick={handleSubmit}
              >
                Regenerate
              </Button>
            </div>
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
