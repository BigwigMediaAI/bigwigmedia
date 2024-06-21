import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons"; // Ensure BASE_URL is correctly imported
import { useAuth } from "@clerk/clerk-react";

const popularLanguages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic', 'Portuguese', 'Bengali', 'Russian', 'Japanese', 'Lahnda', 'Punjabi', 'Javanese', 'Korean', 'Telugu', 'Marathi', 'Tamil', 'Turkish', 'Vietnamese', 'Italian', 'Urdu', 'Persian', 'Malay', 'Thai', 'Gujarati', 'Kannada', 'Polish', 'Ukrainian', 'Romanian'];;

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
                setIsLoading(false);
            } else {
                toast.error(res.data.error);
                setIsLoading(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "An error occurred");
            setIsLoading(false);
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
                <Textarea
                    className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
                    placeholder="Enter the topic for SWOT analysis (e.g., Starting a grocery business)"
                    value={topic}
                    onChange={handleTextChange}
                />
                <div className="flex mb-4 gap-4">
                    <select
                        className="w-1/2 rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {popularLanguages.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="w-1/2 rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
                        placeholder="Output Count"
                        value={outputCount}
                        onChange={(e) => setOutputCount(parseInt(e.target.value))}
                    />
                </div>
                {isLoading ? (
                    <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
                        <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
                    </div>
                ) : (
                    swotAnalyses.length > 0 ? (
                        swotAnalyses.map((analysis, index) => (
                            <div key={index} className="flex flex-col gap-2 mt-4">
                                <div className="h-96 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
                                    {analysis.split("\n").map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                    <Button
                                        className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                                        variant="ghost"
                                        onClick={() => handleCopy(analysis)}
                                    >
                                        <CopyIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )
                )}
                {!isLoading && swotAnalyses.length === 0 && (
                    <Button
                        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                        onClick={handleSubmit}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-6 h-6" />
                        ) : (
                            "Generate"
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
