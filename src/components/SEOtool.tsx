import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader2, Share2, Download, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { saveAs } from 'file-saver';
import { BASE_URL } from "@/utils/funcitons";

export function Seotool() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ keywords: { keyword: string; searchVolume: number }[], title: string }[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const navigate = useNavigate();

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    await submitWithRetry(3);
    setIsLoading(false);
  };

  const submitWithRetry = async (retries: number) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/response/getseo?clerkId=${userId}`,
        {
          prompt: text,
        }
      );

      if (res.status === 200 && res.data.data.data.length > 0) {
        setData(res.data.data.data);
      } else if (retries > 0) {
        await submitWithRetry(retries - 1);
      } else {
        toast.error(res.data.error || "Failed to get a valid response after multiple attempts.");
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.error || "Unknown error");
    }
  };

  const handleShare = () => {
    // Construct the content you want to share
    let shareText = "Check out this SEO data:\n\n";
    data.forEach((item) => {
      shareText += `Title: ${item.title}\n`;
      item.keywords.forEach((keyword) => {
        shareText += `Keyword: ${keyword.keyword}, Search Volume: ${keyword.searchVolume}\n`;
      });
      shareText += "\n";
    });

    if (navigator.share) {
      navigator.share({
        title: 'SEO Tool Data',
        text: shareText,
      })
        .then(() => {
          toast.success("Data shared successfully.");
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          toast.error("Error sharing data. Please try again.");
        });
    } else {
      toast.info("Share functionality is not supported in this browser.");
    }
  };

  const handleDownload = () => {
    const formattedData = data.map(item => `${item.title}: ${item.keywords.map(keyword => `${keyword.keyword} (${keyword.searchVolume})`).join(', ')}`).join('\n');
    const blob = new Blob([formattedData], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'seo_data.txt');
  };

  const handleCopy = () => {
    const formattedData = data.map(item => `${item.title}: ${item.keywords.map(keyword => `${keyword.keyword} (${keyword.searchVolume})`).join(', ')}`).join('\n');
    navigator.clipboard.writeText(formattedData)
      .then(() => {
        toast.success("Data copied to clipboard.");
      })
      .catch((error) => {
        console.error('Error copying:', error);
        toast.error("Error copying data to clipboard. Please try again.");
      });
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
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex flex-col md:flex-col">
        <div className="w-full  pr-2">
          <Textarea
            className="mb-4 h-20 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="For example...
Mobile phones
Share marketing
Digital media"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex w-full my-4 items-center justify-center">
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit "
              onClick={handleSubmit}
            >
              Generate
            </Button>
          </div>
        </div>
        <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
              <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : data.length > 0 ? (
            <div className="w-full">
              <div className="flex justify-end mb-4">
                <Button
                  className="bg-gray-200 mr-4 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  onClick={handleShare}
                title="Share">
                  <Share2 />
                </Button>
                <Button
                  className="bg-gray-200 mr-4 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  onClick={handleDownload}
                title="Download">
                  <Download />
                </Button>
                <Button
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  onClick={handleCopy}
                title="Copy">
                  <Copy />
                </Button>
              </div>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-200 text-black p-2" style={{ width: '30%' }}>Title</th>
                    <th className="border border-gray-200 text-black p-2">Keywords</th>
                    <th className="border border-gray-200 text-black p-2" style={{ width: '30%' }}>Search Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    item.keywords.map((keyword: any, keywordIndex: any) => {
                      const { title } = item;
                      const { keyword: keywordText, searchVolume } = keyword;
                      return (
                        <tr key={`${index}-${keywordIndex}`}>
                          <td className="border border-gray-200 text-white p-2 text-center text-small">{title}</td>
                          <td className="border border-gray-200 text-white p-2 text-center">{keywordText}</td>
                          <td className="border border-gray-200 text-white p-2 text-center">{searchVolume}</td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No data available. Please generate data first.</p>
          )}
        </div>
      </div>
    </div>
  );
}
