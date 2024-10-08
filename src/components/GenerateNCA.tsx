import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, RefreshCw, Download,ClipboardCopy } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from "@/utils/validateInput";
import BigwigLoader from "@/pages/Loader";

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

    if (
      !validateInput(employer) ||
      !validateInput(employee) ||
      !validateInput(restrictedActivities) ||
      !validateInput(restrictedDuration) ||
      !validateInput(restrictedTerritory)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
  
    setNcaContent(''); // Clear previous content
  
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
      const response = await axios.post(`${BASE_URL}/response/nca?clerkId=${userId}`, {
        employer,
        employee,
        restrictedActivities,
        restrictedDuration,
        restrictedTerritory,
        language,
      });
  
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

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

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
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className=" p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col w-full">
          <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Employer:
            </label>
            <input
              type="text"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder="Employer"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Employee:
            </label>
            <input
              type="text"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Employee"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Restricted Activities:
            </label>
            <input
              type="text"
              value={restrictedActivities}
              onChange={(e) => setRestrictedActivities(e.target.value)}
              placeholder="Restricted Activities"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Restricted Duration:
            </label>
            <input
              type="text"
              value={restrictedDuration}
              onChange={(e) => setRestrictedDuration(e.target.value)}
              placeholder="Restricted Duration"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
              Restricted Territory:
            </label>
            <input
              type="text"
              value={restrictedTerritory}
              onChange={(e) => setRestrictedTerritory(e.target.value)}
              placeholder="Restricted Territory"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
              required
            />
            <label htmlFor="disclosingParty" className="block text-md font-medium text-[var(--primary-text-color)]">
            Select Language:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 p-2 mb-3 rounded-md w-full bg-[var(--white-color)] text-[var(--primary-text-color)]"
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

            </select>
            <Button
              className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-6 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
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
       <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
       <BigwigLoader />
       <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}
      {ncaContent && (
        <div ref={resultsRef} className="relative mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-gray-300 text-[var(--primary-text-color)]">
          <label className="block text-md font-medium text-[var(--primary-text-color)] mb-2">
            Generated NCA Data:
          </label>
          <pre className="whitespace-pre-wrap break-words">{ncaContent}</pre>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleCopy}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
            title="Download">
              <ClipboardCopy className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
            title="Download">
              <FaDownload className="inline-block w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
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
