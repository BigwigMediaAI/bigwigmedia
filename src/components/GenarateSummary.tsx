import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Download, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner"; // Adjust the toast library as per your actual library
import { useAuth } from "@clerk/clerk-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/utils/funcitons";
import { validateInput } from "@/utils/validateInput";

interface SummaryResponse {
  summary: string | string[];
}

export function Summarize() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [language, setLanguage] = useState("English");
  const [outputCount, setOutputCount] = useState(3);
  const { userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

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
    setSummaries([]);
  
    if (!text) {
      toast.error("Please enter the text to generate summary");
      setIsLoading(false);
      return;
    }
  
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      const res = await axios.post<SummaryResponse>(
        `${BASE_URL}/response/getSummary?clerkId=${userId}`,
        { text, language, outputCount },
        { headers: { Authorization: `Bearer ${userId}` } }
      );
  
      if (res.status === 200) {
        const { data } = res;
        if (Array.isArray(data)) {
          setSummaries(data);
        } else {
          toast.error("Invalid data format received from the server");
        }
      } else {
        toast.error("Failed to get summaries");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "An error occurred");
    } finally {
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
    setText(e.target.value);
    setSummaries([]);
  };

  useEffect(() => {
    if (!isLoading && summaries.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, summaries]);

  const handleShare = () => {
    const textToShare = summaries.join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'Generated Domain Names',
        text: textToShare,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(textToShare).then(() => {
        toast.success('Domain names copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy domain names to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const textToDownload = summaries.join('\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domain-names.txt';
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md bg-white border-2 border-gray-300 p-4 text-[var(--primary-text-color)]"
          placeholder="Enter Text to Summarize."
          value={text}
          onChange={handleTextChange}
        />
        <Button
            className="w-fit mb-4 rounded-md px-4 py-2 text-black bg-gray-100 hover:bg-white hover:text-black"
            variant="ghost"
            onClick={handlePaste}
          >
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Text
          </Button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex w-full">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className=" w-1/2 rounded-md px-4 py-2 text-gray-600 bg-white  border-2 border-gray-300 hover:bg-gray-200"
            >
              <option value="English">English</option>
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

            <select
              value={outputCount}
              onChange={(e) => setOutputCount(parseInt(e.target.value))}
              className="w-1/2 rounded-md px-4 py-2 text-gray-600 bg-white  border-2 border-gray-300 hover:bg-gray-200  ml-4"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          
        </div>

        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          summaries.length > 0 && (
            <div ref={resultsRef} className="flex flex-col gap-4 mt-4">
              {summaries.map((summary, index) => (
                <div key={index} className="rounded-lg border-2 border-gray-300 text-[var(--primary-text-color)] p-5 mb-4">
                  <div className="overflow-y-scroll max-h-40">
                    {summary.split("\n\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                  <div className='flex'>
                  <Button
                    className="mt-2 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    variant="ghost"
                    onClick={() => handleCopy(summary)}
                  title="Copy">
                    <CopyIcon className="h-5 w-5" />
                  </Button>
                  <button
                    className="mt-2 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    onClick={handleShare}
                  title="Share">
                   <Share2/>
                  </button>
                  <button
                    className="mt-2 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    onClick={handleDownload}
                  title="Download">
                    <Download/>
                  </button>
                  </div>
                </div>
              ))}
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                onClick={handleSubmit}
              >
                Regenerate
              </Button>
            </div>
          )
        )}

        {!isLoading && summaries.length === 0 && (
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
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
