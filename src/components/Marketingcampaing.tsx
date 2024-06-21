import { useState, useRef, useEffect } from "react";
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
  const [language, setLanguage] = useState<string>("English"); // Default language
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setCampaignData(null)
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
          placeholder="Enter your product description here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language:
          </label>
          <select
            id="language"
            name="language"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        </div>

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
