                                // parapharse tool
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ClipboardCopyIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from "@/utils/validateInput";
import BigwigLoader from "@/pages/Loader";

export function Paraphrase() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [outputs, setOutputs] = useState<string[]>([]);
    const [selectedTone, setSelectedTone] = useState("neutral");
    const [language, setLanguage] = useState("English"); // Default language
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const { userId } = useAuth();
    const navigate = useNavigate();
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
        <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
            <div className="flex flex-col items-start">
                <div className="w-full pr-2 flex-1">
                <label className="block text-[var(--primary-text-color)]">Write or Paste the Text</label>
                    <Textarea
                        className="mb-4 h-40 w-full rounded-md border-2  border-gray-300 p-4"
                        placeholder="Enter Text to Paraphrase."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button
                        className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100 "
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
                            <option value="informative">Informative</option>
                            <option value="professional">Professional</option>
                            <option value="creative">Creative</option>
                            <option value="humorous">Humorous</option>
                            <option value="minimal">Minimal</option>
                            <option value="informal">Informal</option>
                            <option value="persuasive">Persuasive</option>
                            <option value="emotional">Emotional</option>
                            <option value="conversational">Conversational</option>
                            <option value="authoritative">Authoritative</option>
                            <option value="analytical">Analytical</option>
                            <option value="sarcastic">Sarcastic</option>
                            <option value="optimistic">Optimistic</option>
                            <option value="urgent">Urgent</option>
                            <option value="motivational">Motivational</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="formal">Formal</option>

                        </select>
                    </div>
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Language:
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border-2 border-gray-300 p-2 mb-4 w-full"
                        >
                            {/* Added language options */}
                            <option value="">Select language</option>
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
                    </div>
                    <div className="flex-col w-1/3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Output Count:
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
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] disabled:opacity-60  w-fit mx-auto mt-4"
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
                                className="rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                                onClick={handleDownload}
                                title="Download"
                            >
                                <FaDownload className="mr-1 h-4 w-4" />
                            </Button>
                            <Button
                                className="rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
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
                                    className="rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
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
                <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
                <BigwigLoader />
                <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
              </div>
            )}
            {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
        </div>
    );
}
