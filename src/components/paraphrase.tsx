import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ClipboardCopyIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from "@/utils/validateInput";

export function Paraphrase() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [outputs, setOutputs] = useState<string[]>([]);
    const [selectedTone, setSelectedTone] = useState("neutral");
    const [language, setLanguage] = useState("en"); // Default language
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const { userId } = useAuth();
    const navigate = useNavigate();
    const loaderRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setText(text);
        } catch (error) {
            toast.error("Failed to paste text from clipboard");
        }
    };

    const handleSubmit = async () => {
        if (
            !validateInput(text)
          ) {
            toast.error('Your input contains prohibited words. Please remove them and try again.');
            return;
          }
        setOutputs([]);
        setIsLoading(true);
        if (!text) {
            toast.error("Please enter the text to generate");
            setIsLoading(false);
            return;
        }
        setTimeout(() => {
            loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        try {
            console.log("Submitting request with userId:", userId);
            const res = await axios.post(
                `${BASE_URL}/response/paraphrase?clerkId=${userId}`,
                {
                    prompt: text,
                    tone: selectedTone,
                    language: language,
                    outputCount: outputCount,
                }
            );

            if (res.status === 200) {
                setOutputs(res.data.data);
            } else {
                toast.error(res.data.error);
            }
        } catch (error: any) {
            console.error("Error submitting request:", error.response?.data?.error || error.message);
            toast.error(error.response?.data?.error || "Failed to generate paraphrases");
        } finally {
            setIsLoading(false);
        }
    };



    const handleCopy = async (output: string) => {
        try {
            await navigator.clipboard.writeText(output);
            toast.success("Copied to Clipboard");
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const handleDownload = () => {
        const blob = new Blob([outputs.join("\n\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "paraphrases.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Shared Paraphrases",
                text: outputs.join("\n\n"),
            }).then(() => {
                console.log("Share successful");
            }).catch((error) => {
                console.error("Share failed:", error);
            });
        } else {
            toast.error("Sharing not supported on this browser");
        }
    };

    

    useEffect(() => {
        if (!isLoading && outputs.length > 0) {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, outputs]);

    const handleCopyEvent = (e: ClipboardEvent) => {
        const selectedText = window.getSelection()?.toString() || '';
        if (selectedText) {
            e.clipboardData?.setData('text/plain', selectedText);
            e.preventDefault();
        }
    };

    document.addEventListener('copy', handleCopyEvent);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
            <div className="flex flex-col items-start">
                <div className="w-full pr-2 flex-1">
                    <Textarea
                        className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
                        placeholder="Enter Text to Paraphrase."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button
                        className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
                        variant="ghost"
                        onClick={handlePaste}
                    >
                        <ClipboardCopyIcon className="mr-2 h-5 w-5" />
                        Paste Text
                    </Button>
                </div>

                <div className="flex justify-between w-full gap-3">
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Select Tone:
                        </label>
                        <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="rounded-md border-2 border-gray-300 p-2 mb-4 w-full"
                        >
                            <option value="neutral">Neutral</option>
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Select Language:
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border-2 border-gray-300 p-2 mb-4 w-full"
                        >
                            {/* Added language options */}
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                            <option value="hi">Hindi</option>
                            <option value="ar">Arabic</option>
                            <option value="pt">Portuguese</option>
                            <option value="bn">Bengali</option>
                            <option value="ru">Russian</option>
                            <option value="ja">Japanese</option>
                            <option value="lah">Lahnda</option>
                            <option value="pa">Punjabi</option>
                            <option value="jv">Javanese</option>
                            <option value="ko">Korean</option>
                            <option value="te">Telugu</option>
                            <option value="mr">Marathi</option>
                            <option value="ta">Tamil</option>
                            <option value="tr">Turkish</option>
                            <option value="vi">Vietnamese</option>
                            <option value="it">Italian</option>
                            <option value="ur">Urdu</option>
                            <option value="fa">Persian</option>
                            <option value="ms">Malay</option>
                            <option value="th">Thai</option>
                            <option value="gu">Gujarati</option>
                            <option value="kn">Kannada</option>
                            <option value="pl">Polish</option>
                            <option value="uk">Ukrainian</option>
                            <option value="ml">Malayalam</option>
                            <option value="or">Odia</option>
                            <option value="my">Burmese</option>
                        </select>
                    </div>
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Select Output Count:
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={outputCount}
                            onChange={(e) => setOutputCount(parseInt(e.target.value))}
                            className="rounded-md border-2 border-gray-300 p-2 mb-4 w-full"
                        />
                    </div>
                </div>

                <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate
                </Button>
            </div>

            {outputs.length > 0 && (
                <div className="w-full mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2 items-center">
                            <h3 className="text-lg font-semibold">Generated Outputs</h3>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Button
                                className="rounded-md px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                                onClick={handleDownload}
                                title="Download"
                            >
                                <FaDownload className="mr-1 h-4 w-4" />
                            </Button>
                            <Button
                                className="rounded-md px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                                onClick={handleShare}
                                title="Share"
                            >
                                <FaShareAlt className="mr-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div ref={resultsRef} className="space-y-4">
                        {outputs.map((output, index) => (
                            <div key={index} className="border border-gray-300 rounded-md p-4 flex justify-between items-center">
                                <p className="flex-1">{output}</p>
                                <Button
                                    className="rounded-md px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                                    onClick={() => handleCopy(output)}
                                    title="Copy"
                                >
                                    <ClipboardCopyIcon className="mr-1 h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isLoading && (
                <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
                    <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
                </div>
            )}
        </div>
    );
}
