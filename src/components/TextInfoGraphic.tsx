import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipboardCopyIcon, CopyIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import Select, { MultiValue, ActionMeta } from 'react-select';

interface SectionOption {
  value: string;
  label: string;
}

const sectionOptions: SectionOption[] = [
  { value: 'Introduction', label: 'Introduction' },
  { value: 'History', label: 'History' },
  { value: 'Current Trends', label: 'Current Trends' },
  { value: 'Future Outlook', label: 'Future Outlook' },
  { value: 'Challenges', label: 'Challenges' },
  { value: 'Case Studies', label: 'Case Studies' },
  { value: 'Statistics', label: 'Statistics' },
  { value: 'Key Players', label: 'Key Players' },
  { value: 'Technological Advances', label: 'Technological Advances' },
  { value: 'Environmental Impact', label: 'Environmental Impact' },
  { value: 'Market Analysis', label: 'Market Analysis' },
  { value: 'Policy and Regulation', label: 'Policy and Regulation' },
  { value: 'Consumer Behavior', label: 'Consumer Behavior' },
  { value: 'Best Practices', label: 'Best Practices' },
  { value: 'Expert Opinions', label: 'Expert Opinions' },
  { value: 'Comparative Analysis', label: 'Comparative Analysis' },
  { value: 'Geographical Distribution', label: 'Geographical Distribution' },
  { value: 'Future Innovations', label: 'Future Innovations' },
  { value: 'Social Impact', label: 'Social Impact' },
  { value: 'Investment Opportunities', label: 'Investment Opportunities' },
];

const toneOptions = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'informative', label: 'Informative' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
{ value: 'es', label: 'Spanish' },
{ value: 'zh-cn', label: 'Chinese (Simplified)' },
{ value: 'hi', label: 'Hindi' },
{ value: 'ar', label: 'Arabic' },
{ value: 'fr', label: 'French' },
{ value: 'bn', label: 'Bengali' },
{ value: 'ru', label: 'Russian' },
{ value: 'pt', label: 'Portuguese' },
{ value: 'de', label: 'German' },
{ value: 'ja', label: 'Japanese' },
{ value: 'pa', label: 'Punjabi' },
{ value: 'jv', label: 'Javanese' },
{ value: 'ko', label: 'Korean' },
{ value: 'te', label: 'Telugu' },
{ value: 'mr', label: 'Marathi' },
{ value: 'ta', label: 'Tamil' },
{ value: 'vi', label: 'Vietnamese' },
{ value: 'ur', label: 'Urdu' },
{ value: 'it', label: 'Italian' },
{ value: 'tr', label: 'Turkish' },
{ value: 'th', label: 'Thai' },
{ value: 'gu', label: 'Gujarati' },
{ value: 'kn', label: 'Kannada' },
{ value: 'ml', label: 'Malayalam' },
{ value: 'my', label: 'Burmese' },
{ value: 'ne', label: 'Nepali' },
{ value: 'sv', label: 'Swedish' },
{ value: 'pl', label: 'Polish' }

 
];

export function TextInfographic() {
  const [topic, setTopic] = useState("");
  const [selectedSections, setSelectedSections] = useState<SectionOption[]>([]);
  const [tone, setTone] = useState(toneOptions[0]);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [nOutputs, setNOutputs] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [infographicTexts, setInfographicTexts] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setTopic(pastedText);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setInfographicTexts([]);
    if (!topic) {
      toast.error("Please enter the topic");
      setIsLoading(false);
      return;
    }
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      setIsLoading(false);
      return;
    }

    const sections = selectedSections.map(section => section.value);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/infographic?clerkId=${userId}`,
        { topic, sections, tone: tone.value, nOutputs, language: language.value }
      );

      console.log(res.data);

      if (res.status === 200) {
        const texts = res.data.infographicText.split('\n\n').filter((text: string) => text.trim() !== '');
        setInfographicTexts(texts);
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

  const handleTopicChange = (e: any) => {
    setTopic(e.target.value);
    setInfographicTexts([]);
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
    if (!isLoading && infographicTexts.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, infographicTexts]);

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: '#262626',
      borderColor: 'gray',
      color: 'white',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: '#262626',
      color: 'white',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#333333' : '#262626',
      color: 'white',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#333333',
      color: 'white',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'gray',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-20 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter the topic for your infographic"
          value={topic}
          onChange={handleTopicChange}
        />
        <div className="mb-4">
          <Select
            isMulti
            options={sectionOptions}
            value={selectedSections}
            onChange={(newValue: MultiValue<SectionOption>, actionMeta: ActionMeta<SectionOption>) => setSelectedSections(newValue as SectionOption[])}
            placeholder="Select sections to include in the infographic"
            className="mb-4"
            styles={customStyles}
          />
        </div>
        <div className="mb-4">
          <Select
            options={toneOptions}
            value={tone}
            onChange={(newValue:any) => setTone(newValue)}
            placeholder="Select tone"
            className="mb-4"
            styles={customStyles}
          />
        </div>
        <div className="mb-4">
          <Select
            options={languageOptions}
            value={language}
            onChange={(newValue:any) => setLanguage(newValue)}
            placeholder="Select language"
            className="mb-4"
            styles={customStyles}
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            min="1"
            max="10"
            value={nOutputs}
            onChange={(e) => setNOutputs(Number(e.target.value))}
            placeholder="Number of outputs"
            className="w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4 text-white"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button
            className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
            variant="ghost"
            onClick={handlePaste}
          >
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Topic
          </Button>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400 " />
            <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          infographicTexts.length > 0 && (
            <>
              <div ref={resultsRef} className="flex flex-col gap-2 mt-4">
                {infographicTexts.map((text, index) => (
                  <div key={index} className="h-40 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
                    {text.split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    <Button
                      className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                      variant="ghost"
                      onClick={() => handleCopy(text)}
                    title="Copy">
                      <CopyIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                  onClick={handleSubmit}
                >
                  Regenerate
                </Button>
              </div>
            </>
          )
        )}
        {!isLoading && infographicTexts.length === 0 && (
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
