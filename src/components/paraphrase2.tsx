import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Element } from "./Generate2";

export function Script
  ({ groups,val,setVal,output,handleSubmit,isLoading }: {
    groups: any, val: any;
    setVal: Function;
    output:any;
    handleSubmit:Function;
    isLoading:boolean;
}) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  console.log(groups)

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleCopy = () => {
    try {
      const outputElement = document.querySelector('.output-div');
      if (outputElement) {
        const outputText = outputElement.textContent || '';
        console.log(outputText)
        navigator.clipboard.writeText(outputText);
        toast.success("Copied to Clipboard");
      } else {
        toast.error("Output element not found");
      }
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    try {
      const outputElement = document.querySelector('.output-div');
      if (outputElement) {
        const outputText = outputElement.textContent || '';
        if (navigator.share) {
          await navigator.share({
            title: 'Generated Response',
            text: outputText,
          });
          toast.success("Shared successfully");
        } else {
          toast.error("Share not supported");
        }
      } else {
        toast.error("Output element not found");
      }
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  const handleDownload = () => {
    try {
      const outputElement = document.querySelector('.output-div');
      if (outputElement) {
        const outputText = outputElement.textContent || '';
        const blob = new Blob([outputText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'response.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Downloaded successfully");
      } else {
        toast.error("Output element not found");
      }
    } catch (error) {
      toast.error("Failed to download");
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-zinc-900 bg-white p-6 shadow-lg">
      <div className="flex flex-col ">
        <div className="w-full pr-2">
          <div className="flex justify-center px-5 max-w-[1084px] w-full mx-auto items-center flex-col gap-8">
            {groups.map((grp: any, index: number) => (
              <div
                key={grp._id}
                className="w-full flex flex-col md:flex-row max-w-[844px] justify-center gap-8 items-center"
              >
                {grp.map((ele: any, i: number) => (
                  <Element key={i} element={ele} val={val} setVal={setVal} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex w-full my-4 items-center justify-center">
            <Button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              onClick={(e) => void handleSubmit(e)}
            >
              {isLoading}
              Generate
            </Button>
          </div>
        </div>
        <div className="w-full pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
              <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            <div ref={resultsRef} className=" w-full rounded-md  dark:text-gray-200 text-gray-800 p-5 ">
              <p
                className="p-5 text-base md:text-xl font-medium output-div"
                dangerouslySetInnerHTML={{ __html: output?.output as string }}
              />
            </div>
          )}
          {!!output?.output && (
            <div className="flex gap-2">
              <Button
                className="rounded-md mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 disabled:opacity-90 opacity-100 flex gap-2 dark:text-gray-200 hover:bg-gray-100"
                variant="ghost"
                onClick={handleCopy}
                disabled={isLoading}
              title="Share">
                <CopyIcon className="mr-2 h-5 w-5" />
                Copy
              </Button>
              <Button
                className="rounded-md mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 disabled:opacity-90 opacity-100 flex gap-2 dark:text-gray-200 hover:bg-gray-100"
                variant="ghost"
                onClick={handleShare}
                disabled={isLoading}
              title="Share">
                <ShareIcon className="mr-2 h-5 w-5" />
                Share
              </Button>
              <Button
                className="rounded-md mb-6 px-4 py-0 text-gray-600 hover:dark:bg-gray-800 disabled:opacity-90 opacity-100 flex gap-2 dark:text-gray-200 hover:bg-gray-100"
                variant="ghost"
                onClick={handleDownload}
                disabled={isLoading}
              title="Download">
                <DownloadIcon className="mr-2 h-5 w-5" />
                Download
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v2a2 2 0 0 0 2 2h3l2 2h-7a4 4 0 0 1-4-4v-2" />
      <path d="M20 8V6a2 2 0 0 0-2-2h-3l-2-2h7a4 4 0 0 1 4 4v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
    </svg>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 17l4 4 4-4" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20 16v-5a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v5" />
    </svg>
  );
}
