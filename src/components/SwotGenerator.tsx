import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopy, Loader2} from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons"; // Ensure BASE_URL is correctly imported
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { validateInput } from "@/utils/validateInput";

const popularLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic', 'Portuguese', 'Bengali', 'Russian', 'Japanese', 'Lahnda', 'Punjabi', 'Javanese', 'Korean', 'Telugu', 'Marathi', 'Tamil', 'Turkish', 'Vietnamese', 'Italian', 'Urdu', 'Persian', 'Malay', 'Thai', 'Gujarati', 'Kannada', 'Polish', 'Ukrainian', 'Romanian'];

export function SWOTGenerator() {
    const [topic, setTopic] = useState("");
    const [language, setLanguage] = useState("English"); // Default language
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const [isLoading, setIsLoading] = useState(false);
    const [swotAnalyses, setSwotAnalyses] = useState<string[]>([]);
    const { userId } = useAuth(); // Assuming you are using useAuth to get userId
    const loaderRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

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
        <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
            <div className="flex flex-col">
                <label htmlFor="topic" className="block text-md font-medium text-gray-300">
                    Describe Your Business:
                </label>
                <Textarea
                    id="topic"
                    className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
                    placeholder="Enter the topic for SWOT analysis (e.g., Starting a grocery business)"
                    value={topic}
                    onChange={handleTextChange}
                />
                <div className="flex mb-4 gap-4">
                    <div className="w-1/2">
                        <label htmlFor="language" className="block text-md font-medium text-gray-300">
                            Language
                        </label>
                        <select
                            id="language"
                            className="w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
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
                        <label htmlFor="outputCount" className="block text-md font-medium text-gray-300">
                            Output Count
                        </label>
                        <input
                            id="outputCount"
                            type="number"
                            className="w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
                            placeholder="Enter the number of outputs"
                            value={outputCount}
                            onChange={(e) => setOutputCount(parseInt(e.target.value))}
                        />
                    </div>
                </div>
                <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
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
                        <Loader2 className="animate-spin w-20 h-20 text-gray-400" />
                        <p className="text-gray-400 text-justify mt-2">Data processing in progress. Please bear with us...</p>
                    </div>
                )}
                {swotAnalyses.length > 0 && (
                    <div className="mt-4">
                        {swotAnalyses.map((analysis, index) => (
                            <div key={index} className="flex flex-col gap-2 m-3">
                                <div className="h-96 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
                                    {analysis.split("\n").map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button
                                            className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                                            variant="ghost"
                                            onClick={() => handleCopy(analysis)}
                                        title="Copy">
                                            <ClipboardCopy className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                                            variant="ghost"
                                            onClick={() => handleShare(analysis)}
                                        title="Share">
                                            <FaShareAlt className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
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
        </div>
    );
}
