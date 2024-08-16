import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Copy, Download, Loader2, Share2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Element } from "./Generate2";

export function Script({
  groups,
  val,
  setVal,
  output,
  handleSubmit,
  isLoading,
}: {
  groups: any;
  val: any;
  setVal: Function;
  output: any;
  handleSubmit: Function;
  isLoading: boolean;
}) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  console.log(groups);

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
        console.log(outputText);
        navigator.clipboard.writeText(outputText).then(() => {
          toast.success("Copied to Clipboard");
        }).catch(() => {
          toast.error("Failed to copy");
        });
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

  useEffect(() => {
    document.addEventListener('copy', handleCopyEvent);
    return () => {
      document.removeEventListener('copy', handleCopyEvent);
    };
  }, []);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
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
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
              onClick={(e) => void handleSubmit(e)}
            >
              {isLoading}
              Generate
            </Button>
          </div>
        </div>
        <div className="w-full pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
              <p className="text-[var(--dark-gray-color)] text-justify">
                Data processing in progress. Please bear with us...
              </p>
            </div>
          ) : (
            <div ref={resultsRef} className="w-full rounded-md text-gray-800 p-5">
              {!!output?.output && (
                <div className="flex items-end gap-2">
                  <Button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    variant="ghost"
                    onClick={handleCopy}
                    disabled={isLoading}
                    title="Copy"
                  >
                    <Copy className="mr-2 h-5 w-5" />
                  </Button>
                  <Button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    variant="ghost"
                    onClick={handleShare}
                    disabled={isLoading}
                    title="Share"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                  </Button>
                  <Button
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    variant="ghost"
                    onClick={handleDownload}
                    disabled={isLoading}
                    title="Download"
                  >
                    <Download className="mr-2 h-5 w-5" />
                  </Button>
                </div>
              )}
              <p
                className="p-5 text-base md:text-xl font-medium output-div whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: output?.output as string }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
