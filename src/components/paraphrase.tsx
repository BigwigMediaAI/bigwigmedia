import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";


export function Paraphrase() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedTone, setSelectedTone] = useState("neutral"); // Default tone
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const navigate = useNavigate();

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!text) {
      toast.error("Please enter the text to generate");
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/response/paraphrase?clerkId=${userId}`,
        {
          prompt: text,
          tone: selectedTone,
        }
      );

      if (res.status === 200) {
        setOutput(res.data.data);
        setIsLoading(false);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error:any) {
      toast.error(error.response.data.error);
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="w-full  pr-2">
          <Textarea
            className="mb-4 h-80 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="Enter Text to Paraphrase."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Add label for tone selection */}
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Select Tone:
          </label>
          {/* Move select element here */}
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="rounded-md border-2 border-gray-300 p-2"
          >
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
          <div className="flex w-full my-4 items-center justify-between">
            <Button
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
              variant="ghost"
              onClick={handlePaste}
            >
              <ClipboardCopyIcon className="mr-2 h-5 w-5" />
              Paste Text
            </Button>

            <Button
              className="rounded-md bt-gradient bg-green-500 px-6 py-2 text-white hover:bg-green-600"
              onClick={handleSubmit}
            >
              Generate
            </Button>
          </div>
        </div>
        <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
            </div>
          ) : (
            <div className="h-80 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5  overflow-y-scroll">
              {output.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
          {!!output && (
            <Button
              className="rounded-md self-end mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
              variant="ghost"
              onClick={handleCopy}
            >
              <CopyIcon className="mr-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Define the CopyIcon and ClipboardCopyIcon components here
