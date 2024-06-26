import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from '@/utils/funcitons';
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Special() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  const [language, setLanguage] = useState("");
  const [outputCount, setOutputCount] = useState(1);

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
    setIsLoading(true);

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
        setOutput(res.data.data);
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
      navigator.clipboard.writeText(output.join("\n"));
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <Textarea
            className="mb-4 h-60 md:h-auto w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="Enter text to generate notes..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex w-full my-4 items-center justify-between">
            <select
              className="rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
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

              {/* Add other language options */}
            </select>
            <input
              type="number"
              className="rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2 w-24 text-center"
              placeholder="Output Count"
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
            />
            <Button
              className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
              variant="ghost"
              onClick={handlePaste}
            >
              Paste
            </Button>
            <Button
              className="text-white font-semibold px-6 py-2 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : "Generate"}
            </Button>
          </div>
        </div>
        <div className="w-full pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
              <p className="text-black text-justify">Processing data...</p>
            </div>
          ) : (
            output.map((item, index) => (
              <div
                key={index}
                className="h-60 md:h-96 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-4 overflow-y-auto"
              >
                {item.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            ))
          )}
          {!!output.length && (
            <Button
              className="rounded-md self-end mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
              variant="ghost"
              onClick={handleCopy}
            >
              Copy All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
