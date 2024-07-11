import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from "react-icons/fa";

interface CampaignData {
  [key: string]: string | string[];
}

export function MarketingCampaign() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [language, setLanguage] = useState<string>("English"); // Default language
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (campaignData) {
      const campaignText = Object.keys(campaignData)
        .map(section => `${section}:\n${(campaignData[section] as string[]).join("\n")}`)
        .join("\n\n");
      navigator.clipboard.writeText(campaignText);
      toast.success("Copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (campaignData) {
      const campaignText = Object.keys(campaignData)
        .map(section => `${section}:\n${(campaignData[section] as string[]).join("\n")}`)
        .join("\n\n");
      const blob = new Blob([campaignText], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "campaign.txt";
      link.click();
    }
  };

  const handleShare = async () => {
    if (campaignData) {
      const campaignText = Object.keys(campaignData)
        .map(section => `${section}:\n${(campaignData[section] as string[]).join("\n")}`)
        .join("\n\n");

      if (navigator.share) {
        try {
          await navigator.share({
            title: "Marketing Campaign",
            text: campaignText
          });
          toast.success("Shared successfully!");
        } catch (error) {
          toast.error("Failed to share");
        }
      } else {
        toast.error("Share not supported on this device");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setCampaignData(null);
    e.preventDefault();
    setIsLoading(true);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/marketing?clerkId=${userId}`,
        {
          prompt: text,
          language: language // Pass selected language to backend
        }
      );

      if (res.status === 200) {
        setCampaignData(res.data.data);
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
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

  const renderCategory = (category: string | string[]) => {
    if (Array.isArray(category)) {
      return category.map((subCategory, index) => (
        <li key={index}>{subCategory}</li>
      ));
    } else {
      return <li>{category}</li>;
    }
  };

  useEffect(() => {
    if (!isLoading && campaignData) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, campaignData]);

  const renderSection = (section: string) => {
    const className = section.replace(/\s+/g, '-').toLowerCase();
    return (
      <div key={section} className={`mt-8 text-white ${className}`}>
        <h2 className="text-2xl font-semibold mb-4">{section}:</h2>
        {campaignData && Array.isArray(campaignData[section]) && (
          <ul className="list-disc pl-6">
            {(campaignData[section] as string[]).map((item: string | string[], index: number) => {
              if (Array.isArray(item)) {
                const [category, content] = item;
                return (
                  <li key={index}>
                    <strong>{category}</strong>: {content.includes("**") ? <strong>{content}</strong> : content}
                  </li>
                );
              } else {
                return <li key={index}>{item}</li>;
              }
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <form onSubmit={handleSubmit}>
        <label htmlFor="product-description" className="block text-md font-medium text-gray-300 mb-2">
          Enter Product Description:
        </label>
        <textarea
          id="product-description"
          className="mb-4 h-32 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Enter your product description here, e.g., A revolutionary new smartphone with cutting-edge features..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mb-4">
          <label htmlFor="language" className="block text-md font-medium text-gray-300">
            Language:
          </label>
          <select
            id="language"
            name="language"
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

            {/* Add more options as needed */}
          </select>
          <p className="text-base text-gray-400 mt-2">
        👉 Try a few combinations to generate the best result for your needs.
        </p>
        </div>

        <div className="flex w-full my-4 items-center justify-end">
          <button
            type="submit"
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            disabled={isLoading}
          >
           {isLoading ? "Generating..." : campaignData ? "Regenerate" : "Generate"}

          </button>
        </div>
      </form>

      {isLoading && (
        <div ref={loaderRef} className="mt-5 w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 text-gray-300" />
          <p className="text-gray-300 text-center">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {campaignData && (
        <div ref={resultsRef} className="relative mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300 dark:bg-[#3f3e3e] text-white">
          <label className="block text-md font-medium text-white mb-2">
            Generated Campaign Data:
          </label>
          {Object.keys(campaignData).map((section) => renderSection(section))}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            title="Copy">
              <ClipboardCopy className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            title="Download">
              <FaDownload className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
           title="Share" >
              <FaShareAlt className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
