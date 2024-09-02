import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardCopy } from "lucide-react"; // Assuming you have icons for download, copy, and share
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from "@/utils/validateInput";

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
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);


  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Ensure that all inputs are properly validated
    if (
      !validateInput(disclosingParty) ||
      !validateInput(receivingParty) ||
      !validateInput(DateAgreement) // Include other fields as needed
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
  
    // Clear NDA content before generating a new one
    setNdaContent(null);
  
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }
  
    try {
    
      const response = await axios.post(`${BASE_URL}/response/nda?clerkId=${userId}`, {
        disclosingParty,
        receivingParty,
        DateAgreement,
        language,
      });
  
      if (response.status === 200) {
        const cleanContent = response.data.nda.replace(/\*\*/g, ""); // Remove asterisks
        console.log(cleanContent);
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
    <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Disclosing Party:
            </label>
            <input
              type="text"
              id="disclosingParty"
              value={disclosingParty}
              onChange={(e) => setDisclosingParty(e.target.value)}
              placeholder="Disclosing Party"
              className="border border-[var(--primary-text-color)] p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="receivingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Receiving Party:
            </label>
            <input
              type="text"
              id="receivingParty"
              value={receivingParty}
              onChange={(e) => setReceivingParty(e.target.value)}
              placeholder="Receiving Party"
              className="border border-[var(--primary-text-color)] p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="DateAgreement" className="block text-md font-medium text-[var(--primary-text-color)]">
              Date of Agreement:
            </label>
            <input
              type="date"
              id="DateAgreement"
              value={DateAgreement}
              onChange={(e) => setDateAgreement(e.target.value)}
              placeholder="Date of Agreement"
              className="border border-[var(--primary-text-color)] p-2 mb-3 rounded-md w-full"
              required
            />
            <label htmlFor="language" className="block text-md font-medium text-[var(--primary-text-color)]">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-[var(--primary-text-color)] p-2 mb-3 rounded-md w-full"
              required
            >
            <option value="Afrikaans">Afrikaans</option>
            <option value="Albanian">Albanian</option>
            <option value="Amharic">Amharic</option>
            <option value="Arabic">Arabic</option>
            <option value="Armenian">Armenian</option>
            <option value="Azerbaijani">Azerbaijani</option>
            <option value="Basque">Basque</option>
            <option value="Belarusian">Belarusian</option>
            <option value="Bengali">Bengali</option>
            <option value="Bosnian">Bosnian</option>
            <option value="Bulgarian">Bulgarian</option>
            <option value="Catalan">Catalan</option>
            <option value="Cebuano">Cebuano</option>
            <option value="Chichewa">Chichewa</option>
            <option value="Chinese (Simplified)">Chinese (Simplified)</option>
            <option value="Chinese (Traditional)">Chinese (Traditional)</option>
            <option value="Corsican">Corsican</option>
            <option value="Croatian">Croatian</option>
            <option value="Czech">Czech</option>
            <option value="Danish">Danish</option>
            <option value="Dutch">Dutch</option>
            <option value="English">English</option>
            <option value="Esperanto">Esperanto</option>
            <option value="Estonian">Estonian</option>
            <option value="Filipino">Filipino</option>
            <option value="Finnish">Finnish</option>
            <option value="French">French</option>
            <option value="Frisian">Frisian</option>
            <option value="Galician">Galician</option>
            <option value="Georgian">Georgian</option>
            <option value="German">German</option>
            <option value="Greek">Greek</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Haitian Creole">Haitian Creole</option>
            <option value="Hausa">Hausa</option>
            <option value="Hawaiian">Hawaiian</option>
            <option value="Hebrew">Hebrew</option>
            <option value="Hindi">Hindi</option>
            <option value="Hmong">Hmong</option>
            <option value="Hungarian">Hungarian</option>
            <option value="Icelandic">Icelandic</option>
            <option value="Igbo">Igbo</option>
            <option value="Indonesian">Indonesian</option>
            <option value="Irish">Irish</option>
            <option value="Italian">Italian</option>
            <option value="Japanese">Japanese</option>
            <option value="Javanese">Javanese</option>
            <option value="Kannada">Kannada</option>
            <option value="Kazakh">Kazakh</option>
            <option value="Khmer">Khmer</option>
            <option value="Kinyarwanda">Kinyarwanda</option>
            <option value="Korean">Korean</option>
            <option value="Kurdish (Kurmanji)">Kurdish (Kurmanji)</option>
            <option value="Kyrgyz">Kyrgyz</option>
            <option value="Lao">Lao</option>
            <option value="Latin">Latin</option>
            <option value="Latvian">Latvian</option>
            <option value="Lithuanian">Lithuanian</option>
            <option value="Luxembourgish">Luxembourgish</option>
            <option value="Macedonian">Macedonian</option>
            <option value="Malagasy">Malagasy</option>
            <option value="Malay">Malay</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Maltese">Maltese</option>
            <option value="Maori">Maori</option>
            <option value="Marathi">Marathi</option>
            <option value="Mongolian">Mongolian</option>
            <option value="Myanmar (Burmese)">Myanmar (Burmese)</option>
            <option value="Nepali">Nepali</option>
            <option value="Norwegian">Norwegian</option>
            <option value="Odia (Oriya)">Odia (Oriya)</option>
            <option value="Pashto">Pashto</option>
            <option value="Persian">Persian</option>
            <option value="Polish">Polish</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Romanian">Romanian</option>
            <option value="Russian">Russian</option>
            <option value="Samoan">Samoan</option>
            <option value="Scots Gaelic">Scots Gaelic</option>
            <option value="Serbian">Serbian</option>
            <option value="Sesotho">Sesotho</option>
            <option value="Shona">Shona</option>
            <option value="Sindhi">Sindhi</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Slovak">Slovak</option>
            <option value="Slovenian">Slovenian</option>
            <option value="Somali">Somali</option>
            <option value="Spanish">Spanish</option>
            <option value="Sundanese">Sundanese</option>
            <option value="Swahili">Swahili</option>
            <option value="Swedish">Swedish</option>
            <option value="Tajik">Tajik</option>
            <option value="Tamil">Tamil</option>
            <option value="Tatar">Tatar</option>
            <option value="Telugu">Telugu</option>
            <option value="Thai">Thai</option>
            <option value="Turkish">Turkish</option>
            <option value="Turkmen">Turkmen</option>
            <option value="Ukrainian">Ukrainian</option>
            <option value="Urdu">Urdu</option>
            <option value="Uyghur">Uyghur</option>
            <option value="Uzbek">Uzbek</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Welsh">Welsh</option>
            <option value="Xhosa">Xhosa</option>
            <option value="Yiddish">Yiddish</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Zulu">Zulu</option>
              {/* Add other language options as needed */}
            </select>
            <Button
              onClick={handleSubmit}
              className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-6 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
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
          <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-center">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {ndaContent && (
        <div ref={resultsRef} className="relative mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-[var(--primary-text-color)] text-[var(--primary-text-color)]">
          <label className="block text-md font-medium text-[var(--primary-text-color)] mb-2">
            Generated NDA Data:
          </label>
          <pre className="whitespace-pre-wrap break-words">{ndaContent}</pre>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
            title="Copy">
              <ClipboardCopy className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
            title="Download">
              <FaDownload className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1 "
            title="Share">
              <FaShareAlt className="inline-block w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
