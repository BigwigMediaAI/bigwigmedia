import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { CopyIcon, Download, Loader2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateInput } from "@/utils/validateInput";

export function Special() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string>("");

  const [language, setLanguage] = useState("English");
  const [outputCount, setOutputCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const { isSignedIn, userId } = useAuth();
  const navigate = useNavigate();

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
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
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

    if (!isSignedIn) {
      navigate("/login");
      toast.error("Please sign in to continue");
      setIsLoading(false);
      return;
    }

    if (!text) {
      toast.error("Please enter the text to generate");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/response/special?clerkId=${userId}`,
        {
          prompt: text,
          language: language,
          outputCount: outputCount,
        }
      );

      if (res.status === 200) {
        const responseData = res.data.data;
        setOutput(responseData);
      } else {
        toast.error(res.data.error || "Failed to generate notes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(output);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Generated Text',
        text: output,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(output).then(() => {
        toast.success('Text copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy text to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  useEffect(() => {
    if (!isLoading && output) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, output]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col">
        <div className="mb-4">
          <label className="block text-[var(--primary-text-color)] mb-2">Enter Text:</label>
          <div className="relative">
            <Textarea
              className="h-40 w-full rounded-md border border-[var(--primary-text-color)] p-4 pr-12"
              placeholder="Enter text to generate notes..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="absolute right-2 top-2 bg-transparent border-none"
              onClick={handlePaste}
            >
            
            </button>
          </div>
        </div>
        <div className="flex mb-4 justify-between">
          <div className="w-1/2 mr-4">
            <label className="block text-[var(--primary-text-color)] mb-2">Select Language:</label>
            <select
              className="rounded-md border border-[var(--primary-text-color)] p-2 w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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

              {/* Add more languages here */}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-[var(--primary-text-color)] mb-2">Select Output Count:</label>
            <input
              type="number"
              className="rounded-md border border-[var(--primary-text-color)] p-2 w-full"
              placeholder="Output Count"
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : (output ? "Regenerate" : "Generate")}
          </Button>
        </div>
        <div className="w-full mt-4 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
              <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            output && (
              <div
                ref={resultsRef}
                className="h-60 md:h-96 w-full rounded-md border border-gray-300 text-gray-800 p-4 overflow-y-auto"
              >
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="rounded-md px-4 py-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleCopy}
                    title="Copy"
                  >
                    <CopyIcon />
                  </button>
                  <button
                    className="rounded-md px-4 py-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share2 />
                  </button>
                  <button
                    className="rounded-md px-4 py-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <Download />
                  </button>
                </div>
                {output.split("\n").map((line, idx) => (
                  <p key={idx} className="mb-5">{line}</p>
                ))}
                
              </div>
            )
          )}
        </div>
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
