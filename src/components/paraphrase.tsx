import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ClipboardCopyIcon, CopyIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function Paraphrase() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [outputs, setOutputs] = useState<string[]>([]);
    const [selectedTone, setSelectedTone] = useState("neutral");
    const [language, setLanguage] = useState("en"); // Default language
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const { userId } = useAuth();
    const navigate = useNavigate();

    const handlePaste = async () => {
        const text = await navigator.clipboard.readText();
        setText(text);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!text) {
            toast.error("Please enter the text to generate");
            setIsLoading(false);
            return;
        }

        try {
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
                setIsLoading(false);
            } else {
                toast.error(res.data.error);
                setIsLoading(false);
            }
        } catch (error: any) { // Explicitly typing 'error' as 'any'
            toast.error(error.response?.data?.error || "Failed to generate paraphrases");
            setIsLoading(false);
        }
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to Clipboard");
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
            <div className="flex flex-col md:flex-col items-start">
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

                            {/* Add more languages as needed */}
                        </select>
                    </div>
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                            Number of Outputs:
                        </label>
                        <input
                            type="number"
                            value={outputCount}
                            onChange={(e) => setOutputCount(parseInt(e.target.value))}
                            className="rounded-md border-2 border-gray-300 p-2 mb-4 w-full"
                        />
                    </div>
                </div>
                <div className="flex w-full my-4 items-center justify-center">
                    <Button
                        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                        onClick={handleSubmit}
                    >
                        Generate
                    </Button>
                </div>
            </div>

            {outputs.length > 0 && (
                <div className="w-full mt-4 flex flex-col gap-4">
                    <div className=" w-full rounded-md  dark:text-gray-200 text-gray-800 p-5">
                        {outputs.map((output, index) => (
                            <div key={index} className="border border-gray-400 p-4 mb-4 rounded-md">
                                <p>{output}</p>
                                <Button
                                    className="mt-2 rounded-md px-4 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    onClick={() => handleCopy(output)}
                                >
                                    Copy
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="animate-spin w-20 h-20 mt-20" />
                </div>
            )}
        </div>
    );
}
