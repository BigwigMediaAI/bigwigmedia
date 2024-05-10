import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";


export function Rephrase() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");

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
      const res = await axios.post(`${BASE_URL}/response/rephrase`, { prompt: text });

      if (res.status === 200 && res.data && res.data.status === "OK") {
        setOutput(res.data.data.data);
        setIsLoading(false);
      } else {
        toast.error("Failed to retrieve rephrased text");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
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
          <textarea
            className="mb-4 h-80 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="Enter your text here.
Our tool will not only rephrase it in a more human-like manner but also perform a plagiarism check against top online sources, ensuring originality and integrity.
            "
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex w-full my-4 items-center justify-between">
            <button
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
              onClick={handlePaste}
            >
              Paste Text
            </button>

            <button
              className="rounded-md bt-gradient bg-green-500 px-6 py-2 text-white hover:bg-green-600"
              onClick={handleSubmit}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
              <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            <div className="h-80 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 text-justify tracking-wide	 overflow-y-scroll">
                {output.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>
          )}
          {!!output && (
            <button
              className="rounded-md self-end mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
              onClick={handleCopy}
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}