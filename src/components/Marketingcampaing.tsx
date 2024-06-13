import { useState,useRef,useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";


interface CampaignData {
  [key: string]: string | string[];
}

export function MarketingCampaign() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setCampaignData(null)
    e.preventDefault();
    setIsLoading(true);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/marketing?clerkId=${userId}`,
        {
          prompt: text,
        }
      );
      console.log(res)

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
        <textarea
          className="mb-4 h-32 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Enter your product description here...
Examples:
Opening new restaurant FoodZone.
Opening Car rental services Safar.       
          "
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex w-full my-4 items-center justify-end">
          <button
            type="submit"
            className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            disabled={isLoading}
          >
            {isLoading ? "Generating" : "Generate"}
          </button>
        </div>
      </form>

      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 text-gray-300" />
          <p className="text-gray-300 text-center">Data processing in progress. Please bear with us...</p>
        </div>
      )}

      {campaignData && Object.keys(campaignData).map((section) => renderSection(section))}
    </div>
  );
}
