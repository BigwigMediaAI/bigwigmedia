  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
  import { useState, useEffect, useRef } from "react";
  import axios from "axios";
  import { ClipboardCopyIcon, CopyIcon, Download, Loader2, Share2 } from "lucide-react";
  import { toast } from "sonner";
  import { BASE_URL } from "@/utils/funcitons";
  import { useAuth } from "@clerk/clerk-react";
import { validateInput } from "@/utils/validateInput";

  export function NewsSummarize() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [summaries, setSummaries] = useState([]);
    const [outputCount, setOutputCount] = useState(3); // Default number of outputs
    const [languageCode, setLanguageCode] = useState("en"); // Default language code
    const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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
      setSummaries([]); // Clear previous summaries
      if (!text) {
        toast.error("Please enter the news article to generate summary");
        setIsLoading(false);
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      try {
        const res = await axios.post(
          `${BASE_URL}/response/news?clerkId=${userId}`,
          { articleText: text, languageCode, output: outputCount } // Use the selected languageCode and outputCount
        );
        console.log(res.data); // Log the response

        if (res.status === 200) {
          const summaryArray = res.data.summaryText.split('\n').filter(Boolean);
          setSummaries(summaryArray);
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

    const handleTextChange = (e: any) => {
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
          title: 'Generated Summary',
          text: textToShare,
        }).catch((error) => console.error('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(textToShare).then(() => {
          toast.success('Summary copied to clipboard');
        }).catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast.error('Failed to copy summary to clipboard');
        });
      }
    };
  
    const handleDownload = () => {
      const textToDownload = summaries.join('\n');
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'summary.txt';
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
            className="mb-4 h-40 w-full rounded-md border-2  border-gray-300 p-4"
            placeholder="Enter News Article to Summarize."
            value={text}
            onChange={handleTextChange}
          />
          <div className="flex items-center justify-between mb-4">
            <Button
              className="rounded-md px-4 py-2 text-gray-600  hover:bg-gray-100 "
              variant="ghost"
              onClick={handlePaste}
            >
              <ClipboardCopyIcon className="mr-2 h-5 w-5" />
              Paste Text
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4 space-x-4">
          <div className="w-1/2 flex flex-col">
              <label htmlFor="languageCode">Language:</label>
              <select
                id="languageCode"
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="rounded-md border-2 border-gray-300 p-2 dark:bg-[#262626]"
              >
                {[
                  { code: "af", name: "Afrikaans" },
                  { code: "sq", name: "Albanian" },
                  { code: "am", name: "Amharic" },
                  { code: "ar", name: "Arabic" },
                  { code: "hy", name: "Armenian" },
                  { code: "az", name: "Azerbaijani" },
                  { code: "eu", name: "Basque" },
                  { code: "be", name: "Belarusian" },
                  { code: "bn", name: "Bengali" },
                  { code: "bs", name: "Bosnian" },
                  { code: "bg", name: "Bulgarian" },
                  { code: "ca", name: "Catalan" },
                  { code: "ceb", name: "Cebuano" },
                  { code: "ny", name: "Chichewa" },
                  { code: "zh-CN", name: "Chinese (Simplified)" },
                  { code: "zh-TW", name: "Chinese (Traditional)" },
                  { code: "co", name: "Corsican" },
                  { code: "hr", name: "Croatian" },
                  { code: "cs", name: "Czech" },
                  { code: "da", name: "Danish" },
                  { code: "nl", name: "Dutch" },
                  { code: "en", name: "English" },
                  { code: "eo", name: "Esperanto" },
                  { code: "et", name: "Estonian" },
                  { code: "tl", name: "Filipino" },
                  { code: "fi", name: "Finnish" },
                  { code: "fr", name: "French" },
                  { code: "fy", name: "Frisian" },
                  { code: "gl", name: "Galician" },
                  { code: "ka", name: "Georgian" },
                  { code: "de", name: "German" },
                  { code: "el", name: "Greek" },
                  { code: "gu", name: "Gujarati" },
                  { code: "ht", name: "Haitian Creole" },
                  { code: "ha", name: "Hausa" },
                  { code: "haw", name: "Hawaiian" },
                  { code: "he", name: "Hebrew" },
                  { code: "hi", name: "Hindi" },
                  { code: "hmn", name: "Hmong" },
                  { code: "hu", name: "Hungarian" },
                  { code: "is", name: "Icelandic" },
                  { code: "ig", name: "Igbo" },
                  { code: "id", name: "Indonesian" },
                  { code: "ga", name: "Irish" },
                  { code: "it", name: "Italian" },
                  { code: "ja", name: "Japanese" },
                  { code: "jw", name: "Javanese" },
                  { code: "kn", name: "Kannada" },
                  { code: "kk", name: "Kazakh" },
                  { code: "km", name: "Khmer" },
                  { code: "rw", name: "Kinyarwanda" },
                  { code: "ko", name: "Korean" },
                  { code: "ku", name: "Kurdish (Kurmanji)" },
                  { code: "ky", name: "Kyrgyz" },
                  { code: "lo", name: "Lao" },
                  { code: "la", name: "Latin" },
                  { code: "lv", name: "Latvian" },
                  { code: "lt", name: "Lithuanian" },
                  { code: "lb", name: "Luxembourgish" },
                  { code: "mk", name: "Macedonian" },
                  { code: "mg", name: "Malagasy" },
                  { code: "ms", name: "Malay" },
                  { code: "ml", name: "Malayalam" },
                  { code: "mt", name: "Maltese" },
                  { code: "mi", name: "Maori" },
                  { code: "mr", name: "Marathi" },
                  { code: "mn", name: "Mongolian" },
                  { code: "my", name: "Myanmar (Burmese)" },
                  { code: "ne", name: "Nepali" },
                  { code: "no", name: "Norwegian" },
                  { code: "or", name: "Odia (Oriya)" },
                  { code: "ps", name: "Pashto" },
                  { code: "fa", name: "Persian" },
                  { code: "pl", name: "Polish" },
                  { code: "pt", name: "Portuguese" },
                  { code: "pa", name: "Punjabi" },
                  { code: "ro", name: "Romanian" },
                  { code: "ru", name: "Russian" },
                  { code: "sm", name: "Samoan" },
                  { code: "gd", name: "Scots Gaelic" },
                  { code: "sr", name: "Serbian" },
                  { code: "st", name: "Sesotho" },
                  { code: "sn", name: "Shona" },
                  { code: "sd", name: "Sindhi" },
                  { code: "si", name: "Sinhala" },
                  { code: "sk", name: "Slovak" },
                  { code: "sl", name: "Slovenian" },
                  { code: "so", name: "Somali" },
                  { code: "es", name: "Spanish" },
                  { code: "su", name: "Sundanese" },
                  { code: "sw", name: "Swahili" },
                  { code: "sv", name: "Swedish" },
                  { code: "tg", name: "Tajik" },
                  { code: "ta", name: "Tamil" },
                  { code: "tt", name: "Tatar" },
                  { code: "te", name: "Telugu" },
                  { code: "th", name: "Thai" },
                  { code: "tr", name: "Turkish" },
                  { code: "tk", name: "Turkmen" },
                  { code: "uk", name: "Ukrainian" },
                  { code: "ur", name: "Urdu" },
                  { code: "ug", name: "Uyghur" },
                  { code: "uz", name: "Uzbek" },
                  { code: "vi", name: "Vietnamese" },
                  { code: "cy", name: "Welsh" },
                  { code: "xh", name: "Xhosa" },
                  { code: "yi", name: "Yiddish" },
                  { code: "yo", name: "Yoruba" },
                  { code: "zu", name: "Zulu" }
                  
                  // Add more languages as needed
                ].map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2 flex flex-col">
              <label htmlFor="outputCount">Number of Outputs:</label>
              <select
                id="outputCount"
                value={outputCount}
                onChange={(e) => setOutputCount(parseInt(e.target.value))}
                className="rounded-md border-2 border-gray-300 p-2 dark:bg-[#262626]"
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>
            
          </div>
          {isLoading ? (
            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)] " />
              <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            summaries.length > 0 && (
              <>
                <div ref={resultsRef} className="flex flex-col gap-2 mt-4">
                  {summaries.map((summary, index) => (
                    <div key={index} className="h-80 w-full rounded-md border-2 border-gray-300  text-gray-800 p-5 overflow-y-scroll relative">
                      <p className="mt-5">{summary}</p>
                      <Button
                        className="absolute top-2 right-2 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                        variant="ghost"
                        onClick={() => handleCopy(summary)}
                      title="Copy">
                        <CopyIcon className="h-5 w-5" />
                      </Button>
                      <button
                    className="absolute top-2 right-10 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleShare}
                  title="Share">
                   <Share2/>
                  </button>
                  <button
                    className="absolute top-2 right-20 rounded-md px-2 py-1 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleDownload}
                  title="Download">
                    <Download/>
                  </button>
                    </div>
                  ))}
                  <Button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto mt-4"
                    onClick={handleSubmit}
                  >
                    Regenerate
                  </Button>
                </div>
              </>
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
