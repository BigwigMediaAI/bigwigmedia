import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";



interface NotesSummary {
  [key: string]: string[] | string;
}

interface NotesResponse {
  summary: NotesSummary;
}

export function NotesGenerator() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<NotesSummary | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setSummary(null); // Clear previous summary
    if (!text) {
      toast.error("Please enter the text to generate quick notes");
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/response/getNotesSummary?clerkId=${userId}`,
        { notes: text }
      );
      console.log(res.data); // Log the response

      if (res.status === 200) {
        setSummary(res.data.summary.Key_Points);
        setIsLoading(false);
      } else {
        toast.error("Failed to fetch summary");
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
  
    let formattedText = '';
    
    Object.entries(summary).forEach(([sectionKey, sectionContent]) => {
      formattedText +=`${sectionKey}:\n`;
      if (Array.isArray(sectionContent)) {
        sectionContent.forEach(item => {
          formattedText += `- ${item}\n`;
        });
      } else {
        formattedText += `- ${sectionContent}\n`;
      }
      formattedText += '\n'; // Adding a new line after each section for better readability
    });
  
    try {
      navigator.clipboard.writeText(formattedText.trim());
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };
  

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSummary(null);
  };

  const renderSummary = () => {
    if (!summary) return null;

    const summaryArray = Object.entries(summary);

    return (
      <div className="h-40 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
        {summaryArray.map(([sectionKey, sectionContent], sectionIndex) => (
          <div key={sectionIndex}>
            <strong>{sectionKey}:</strong>
            {Array.isArray(sectionContent) ? (
              sectionContent.map((item, index) => (
                <p key={index}>- {item}</p>
              ))
            ) : (
              <p>- {sectionContent}</p>
            )}
          </div>
        ))}
        <Button
          className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
          variant="ghost"
          onClick={() => handleCopy()}
        >
          <CopyIcon className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Text to Generate Quick Notes."
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
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
            <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          summary && (
            <div className="flex flex-col gap-2 mt-4">
              {renderSummary()}
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                onClick={handleSubmit}
              >
                Regenerate
              </Button>
            </div>
          )
        )}
        {!isLoading && !summary && (
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