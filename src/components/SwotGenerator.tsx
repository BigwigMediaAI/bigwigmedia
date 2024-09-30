import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopy, Loader2} from "lucide-react";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3"; // Ensure BASE_URL is correctly imported
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { validateInput } from "@/utils/validateInput";

const popularLanguages = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Catalan",
    "Cebuano",
    "Chichewa",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Corsican",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Esperanto",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Frisian",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hawaiian",
    "Hebrew",
    "Hindi",
    "Hmong",
    "Hungarian",
    "Icelandic",
    "Igbo",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Javanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Kinyarwanda",
    "Korean",
    "Kurdish (Kurmanji)",
    "Kyrgyz",
    "Lao",
    "Latin",
    "Latvian",
    "Lithuanian",
    "Luxembourgish",
    "Macedonian",
    "Malagasy",
    "Malay",
    "Malayalam",
    "Maltese",
    "Maori",
    "Marathi",
    "Mongolian",
    "Myanmar (Burmese)",
    "Nepali",
    "Norwegian",
    "Odia (Oriya)",
    "Pashto",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Samoan",
    "Scots Gaelic",
    "Serbian",
    "Sesotho",
    "Shona",
    "Sindhi",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Sundanese",
    "Swahili",
    "Swedish",
    "Tajik",
    "Tamil",
    "Tatar",
    "Telugu",
    "Thai",
    "Turkish",
    "Turkmen",
    "Ukrainian",
    "Urdu",
    "Uyghur",
    "Uzbek",
    "Vietnamese",
    "Welsh",
    "Xhosa",
    "Yiddish",
    "Yoruba",
    "Zulu"
  ]
  ;

export function SWOTGenerator() {
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState("English"); // Default language
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const [isLoading, setIsLoading] = useState(false);
    const [swotAnalyses, setSwotAnalyses] = useState<string[]>([]);
    const { userId } = useAuth(); // Assuming you are using useAuth to get userId
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

    const handleSubmit = async () => {
        if (
            !validateInput(topic)
          ) {
            toast.error('Your input contains prohibited words. Please remove them and try again.');
            return;
          }
        setIsLoading(true);
        setSwotAnalyses([]);  // Clear previous SWOT analyses
        if (!topic) {
            toast.error("Please enter a topic for SWOT analysis");
            setIsLoading(false);
            return;
        }

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
            const res = await axios.post(
                `${BASE_URL}/response/generateSWOT?clerkId=${userId}`,
                { topic, language, outputCount }
            );

            console.log(res.data); // Log the response

            if (res.status === 200) {
                setSwotAnalyses(res.data); // Assuming response directly returns an array of strings
            } else {
                toast.error(res.data.error);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "An error occurred");
        } finally {
            setIsLoading(false); // Reset isLoading regardless of success or failure
        }
    };

    const handleCopy = (textToCopy: string) => {
        try {
            navigator.clipboard.writeText(textToCopy);
            toast.success("Copied to Clipboard");
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const handleShare = async (textToShare:any) => {
        try {
            await navigator.share({
                title: 'SWOT Analysis',
                text: textToShare,
            });
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share');
        }
    };

    

const handleDownload = (textToDownload:any) => {
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'swot_analysis.txt');
};

const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTopic(e.target.value);
        setSwotAnalyses([]);
    };

    useEffect(() => {
        if (!isLoading && swotAnalyses.length > 0) {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, swotAnalyses]);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
            <div className="flex flex-col">
                <label htmlFor="topic" className="block text-md font-medium text-[var(--primary-text-color)]">
                    Describe Your Business:
                </label>
                <Textarea
                    id="topic"
                    className="mb-4 h-40 w-full rounded-md border border-[var(--primary-text-color)] p-4"
                    placeholder="Enter the topic for SWOT analysis (e.g., Starting a grocery business)"
                    value={topic}
                    onChange={handleTextChange}
                />
                <div className="flex mb-4 gap-4">
                    <div className="w-1/2">
                        <label htmlFor="language" className="block text-md font-medium text-[var(--primary-text-color)]">
                            Select Language
                        </label>
                        <select
                            id="language"
                            className="w-full rounded-md border border-[var(--primary-text-color)] p-2"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            {popularLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="outputCount" className="block text-md font-medium text-[var(--primary-text-color)]">
                            Select Output Count
                        </label>
                        <input
                            id="outputCount"
                            type="number"
                            className="w-full rounded-md border border-[var(--primary-text-color)] p-2"
                            placeholder="Enter the number of outputs"
                            value={outputCount}
                            onChange={(e) => setOutputCount(parseInt(e.target.value))}
                        />
                    </div>
                </div>
                <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        "Generating..."
                    ) : (
                        swotAnalyses.length > 0 ? "Regenerate" : "Generate"
                    )}
                </Button>
                {isLoading && (
                    <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center mt-4">
                        <Loader2 className="animate-spin w-20 h-20 text-[var(--dark-gray-color)]" />
                        <p className="text-[var(--dark-gray-color)] text-justify mt-2">Data processing in progress. Please bear with us...</p>
                    </div>
                )}
                {swotAnalyses.length > 0 && (
                    <div className="mt-4">
                        {swotAnalyses.map((analysis, index) => (
                            <div key={index} className="flex flex-col gap-2 m-3">
                                <div className="h-96 w-full rounded-md border-2 border-gray-300  text-gray-800 p-5 overflow-y-scroll relative">
                                    {analysis.split("\n").map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
                                            variant="ghost"
                                            onClick={() => handleCopy(analysis)}
                                        title="Copy">
                                            <ClipboardCopy className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
                                            variant="ghost"
                                            onClick={() => handleShare(analysis)}
                                        title="Share">
                                            <FaShareAlt className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
                                            variant="ghost"
                                            onClick={() => handleDownload(analysis)}
                                        title="Download">
                                            <FaDownload className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
        </div>
    );
}
