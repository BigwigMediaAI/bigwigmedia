import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, ClipboardCopyIcon, CopyIcon, Share2Icon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { validateInput } from "@/utils/validateInput";

export function Rephrase() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("neutral");
  const [outputCount, setOutputCount] = useState(4); // Default output count
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

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async () => {
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setOutput([]); // Clear previous output
    if (!text) {
      toast.error("Please enter the text to generate");
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
      const res = await axios.post(`${BASE_URL}/response/rephrase?clerkId=${userId}`, {
        prompt: text,
        language,
        tone,
        outputCount
      });

      if (res.status === 200 && res.data && res.data.status === "OK") {
        setOutput(res.data.data.data);
        setIsLoading(false);
      } else {
        toast.error("Failed to retrieve rephrased text");
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

  const handleShare = (textToShare: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Rephrased Text',
        text: textToShare,
      })
        .then(() => toast.success("Shared successfully"))
        .catch((error) => toast.error("Failed to share"));
    } else {
      toast.error("Sharing is not supported in this browser");
    }
  };

  const handleDownload = (textToDownload: string) => {
    const blob = new Blob([textToDownload], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "rephrased_text.txt");
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);


  const handleTextChange = (e: any) => {
    setText(e.target.value);
    setOutput([]);
  };

  useEffect(() => {
    if (!isLoading && output.length) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, output]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Enter Text to Rephrase."
          value={text}
          onChange={handleTextChange}
        />
        <div className="flex items-center justify-between mb-4">
          <Button
            className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100 "
            variant="ghost"
            onClick={handlePaste}
          >
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Text
          </Button>
          <div className="flex gap-4">
            <select
              className="rounded-md px-2 py-1 text-gray-600  border-2 border-gray-300"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
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
            <select
              className="rounded-md px-2 py-1 text-gray-600  border-2 border-gray-300"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
            <input
              type="number"
              className="rounded-md px-2 py-1 text-gray-600  border-2 border-gray-300 w-20"
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
              min={1}
              max={10} // Adjust max number of outputs as needed
            />
          </div>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          output.length > 0 && (
            <>
              <div ref={resultsRef} className="flex flex-col gap-4 mt-4">
                {output.map((item, index) => (
                  <div key={index} className="relative h-40 w-full rounded-md border-2 border-gray-300  text-gray-800 p-5 overflow-y-scroll">
                    <p className="mt-6 text-justify">{item}</p>
                    <Button
                      className="absolute top-2 right-2 rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                      variant="ghost"
                      onClick={() => handleCopy(item)}
                    title="Share">
                      <CopyIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      className="absolute top-2 right-12 rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                      variant="ghost"
                      onClick={() => handleShare(item)}
                    title="Share">
                      <Share2Icon className="h-5 w-5" />
                    </Button>
                    <Button
                      className="absolute top-2 right-20 rounded-md px-2 py-1 bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                      variant="ghost"
                      onClick={() => handleDownload(item)}
                    title="Download">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] disabled:opacity-60 w-fit mx-auto mt-4"
                onClick={handleSubmit}
              >
                Regenerate
              </Button>
            </>
          )
        )}
        {!isLoading && output.length === 0 && (
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] disabled:opacity-60  w-fit mx-auto"
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
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
