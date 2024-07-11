import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardCopy } from "lucide-react"; // Assuming you have icons for download, copy, and share
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from "react-icons/fa";

export function NDAForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ndaContent, setNdaContent] = useState<string | null>(null);
  const [disclosingParty, setDisclosingParty] = useState("");
  const [receivingParty, setReceivingParty] = useState("");
  const [DateAgreement, setDateAgreement] = useState("");
  const [language, setLanguage] = useState("English");
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();
    setNdaContent('')
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/response/nda?clerkId=${userId}`, {
        disclosingParty,
        receivingParty,
        DateAgreement,
        language,
      });

      if (response.status === 200) {
        const cleanContent = response.data.nda.replace(/\*\*/g, ""); // Remove asterisks
        console.log(cleanContent)
        setNdaContent(cleanContent);
        toast.success("NDA generated successfully.");
      } else {
        toast.error("Error generating NDA. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating NDA:", error);
      toast.error("Error generating NDA. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (ndaContent) {
      navigator.clipboard.writeText(ndaContent);
      toast.success("NDA copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (ndaContent) {
      const blob = new Blob([ndaContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "NDA.txt";
      link.click();
    }
  };

  const handleShare = async () => {
    if (ndaContent) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Non-Disclosure Agreement",
            text: ndaContent,
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

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  const refreshForm = () => {
    setDisclosingParty("");
    setReceivingParty("");
    setDateAgreement("");
    setLanguage("English");
    setNdaContent(null);
  };

  useEffect(() => {
    if (!isLoading && ndaContent) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, ndaContent]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="disclosingParty" className="block text-md font-medium text-gray-300">
              Disclosing Party:
            </label>
            <input
              type="text"
              id="disclosingParty"
              value={disclosingParty}
              onChange={(e) => setDisclosingParty(e.target.value)}
              placeholder="Disclosing Party"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="receivingParty" className="block text-md font-medium text-gray-300">
              Receiving Party:
            </label>
            <input
              type="text"
              id="receivingParty"
              value={receivingParty}
              onChange={(e) => setReceivingParty(e.target.value)}
              placeholder="Receiving Party"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="DateAgreement" className="block text-md font-medium text-gray-300">
              Date of Agreement:
            </label>
            <input
              type="date"
              id="DateAgreement"
              value={DateAgreement}
              onChange={(e) => setDateAgreement(e.target.value)}
              placeholder="Date of Agreement"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="language" className="block text-md font-medium text-gray-300">
              Language:
            </label>
            <select
              id="language"
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
              {/* Add other language options as needed */}
            </select>
            <Button
              onClick={handleSubmit}
              className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-6 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Generating...
                </>
              ) : ndaContent ? (
                "Regenerate"
              ) : (
                "Generate NDA"
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
      {ndaContent && (
        <div ref={resultsRef} className="relative mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300 dark:bg-[#3f3e3e] text-white">
          <label className="block text-md font-medium text-white mb-2">
            Generated NDA Data:
          </label>
          <pre className="whitespace-pre-wrap break-words">{ndaContent}</pre>
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
            title="Share">
              <FaShareAlt className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
