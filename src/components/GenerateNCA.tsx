import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, RefreshCw, Download,ClipboardCopy } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function NCAForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ncaContent, setNcaContent] = useState<string | null>(null);
  const [employer, setEmployer] = useState('');
  const [employee, setEmployee] = useState('');
  const [restrictedActivities, setRestrictedActivities] = useState('');
  const [restrictedDuration, setRestrictedDuration] = useState('');
  const [restrictedTerritory, setRestrictedTerritory] = useState('');
  const [language, setLanguage] = useState('English');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNcaContent('')
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/response/nca?clerkId=${userId}`, {
        employer,
        employee,
        restrictedActivities,
        restrictedDuration,
        restrictedTerritory,
        language,
      });
      console.log(response)
      if (response.status === 200) {
        const cleanContent = response.data.nda.replace(/\*\*/g, ''); // Remove asterisks
        setNcaContent(cleanContent);
        toast.success("NCA generated successfully.");
      } else {
        toast.error("Error generating NCA. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating NCA:", error);
      toast.error("Error generating NCA. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (ncaContent) {
      navigator.clipboard.writeText(ncaContent);
      toast.success("NDA copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (ncaContent) {
      const blob = new Blob([ncaContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "NDA.txt";
      link.click();
    }
  };

  const handleShare = async () => {
    if (ncaContent) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Non-Disclosure Agreement",
            text: ncaContent,
          });
          toast.success("NDA shared successfully!");
        } catch (error) {
          toast.error("Failed to share NDA.");
        }
      } else {
        toast.error("Share not supported on this device.");
      }
    }
  };

  const refreshForm = () => {
    setEmployer('');
    setEmployee('');
    setRestrictedActivities('');
    setRestrictedDuration('');
    setRestrictedTerritory('');
    setLanguage('English');
    setNcaContent(null);
  };

  useEffect(() => {
    if (!isLoading && ncaContent) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, ncaContent]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className=" p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-full">
          <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Employer:
            </label>
            <input
              type="text"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder="Employer"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Employee:
            </label>
            <input
              type="text"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Employee"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Restricted Activities:
            </label>
            <input
              type="text"
              value={restrictedActivities}
              onChange={(e) => setRestrictedActivities(e.target.value)}
              placeholder="Restricted Activities"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Restricted Duration:
            </label>
            <input
              type="text"
              value={restrictedDuration}
              onChange={(e) => setRestrictedDuration(e.target.value)}
              placeholder="Restricted Duration"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Restricted Territory:
            </label>
            <input
              type="text"
              value={restrictedTerritory}
              onChange={(e) => setRestrictedTerritory(e.target.value)}
              placeholder="Restricted Territory"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
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

            </select>
            <Button
              className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-6 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Generating...
                </>
              ) : ncaContent ? (
                "Regenerate"
              ) : (
                "Generate NCA"
              )}
            </Button>
           
          </div>
        </div>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="mt-5 w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 text-gray-300" />
          <p className="text-gray-300 text-center">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {ncaContent && (
        <div ref={resultsRef} className="relative mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300 dark:bg-[#3f3e3e] text-white">
          <label className="block text-md font-medium text-white mb-2">
            Generated NCA Data:
          </label>
          <pre className="whitespace-pre-wrap break-words">{ncaContent}</pre>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            >
              <ClipboardCopy className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            >
              <FaDownload className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
            >
              <FaShareAlt className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
