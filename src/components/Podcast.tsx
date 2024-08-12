import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardCopy } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from "@/utils/validateInput";

interface QAPair {
  question: string;
  answer: string;
}

export function Seopodcast() {
  const [topic, setTopic] = useState("");
  const [guest, setGuest] = useState("");
  const [background, setBackground] = useState("");
  const [interests, setInterests] = useState("");
  const [tone, setTone] = useState("Formal");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (
      !validateInput(topic)||
      !validateInput(guest)||
      !validateInput(background)||
      !validateInput(interests)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setQAPairs([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios.post(`${BASE_URL}/response/podcast?clerkId=${userId}`, {
          prompt: "Please provide questions and answers for the podcast.",
          topic,
          guest,
          background,
          interests,
          tone,
          language
        });

        const data = response.data.data.data;
        console.log("Response data:", data);
        if (data && Array.isArray(data.qaPairs) && data.qaPairs.length > 0) {
          setQAPairs(data.qaPairs);
          break;
        } else {
          setQAPairs([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      }
      attempt++;
    }

    if (attempt === maxRetries) {
      toast.error("Failed to fetch data after multiple attempts.");
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    const qaText = qaPairs.map(pair => `${pair.question}\n${pair.answer}`).join('\n\n');
    navigator.clipboard.writeText(qaText);
    toast.success('Q&A pairs copied to clipboard!');
  };

  const handleDownload = () => {
    const qaText = qaPairs.map(pair => `${pair.question}\n${pair.answer}`).join('\n\n');
    const blob = new Blob([qaText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'QAPairs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      const qaText = qaPairs.map(pair => `${pair.question}\n${pair.answer}`).join('\n\n');
      navigator.share({
        title: 'Shared Q&A Pairs',
        text: qaText,

      }).then(() => {
        console.log('Successfully shared.');
      }).catch((error) => {
        console.error('Error sharing:', error);
        toast.error('Failed to share Q&A pairs.');
      });
    } else {
      toast.error('Sharing is not supported on this browser.');
    }
  };

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

  const handleInputChange = () => {
    setQAPairs([]);
  };

  useEffect(() => {
    if (!isLoading && qaPairs.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, qaPairs]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <textarea
          disabled
          value="Please provide questions and answers for the podcast."
          className="w-full p-2 rounded text-[#3f3e3e]"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); handleInputChange(); }}
          placeholder="Example: The Future of Artificial Intelligence"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Guest</label>
        <input
          type="text"
          value={guest}
          onChange={(e) => { setGuest(e.target.value); handleInputChange(); }}
          placeholder="Example: Dr. Jane Smith"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Background Information</label>
        <input
          type="text"
          value={background}
          onChange={(e) => { setBackground(e.target.value); handleInputChange(); }}
          placeholder="Example: Expert in machine learning with 10 years of experience"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Guest's Interests</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => { setInterests(e.target.value); handleInputChange(); }}
          placeholder="Example: AI ethics, robotics, deep learning"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select the tone for the podcast:</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
        >
          <option value="Formal">Formal</option>
          <option value="Informative">Informative</option>
          <option value="Analytical">Analytical</option>
          <option value="Educational">Educational</option>
          <option value="Technical">Technical</option>
          <option value="Insightful">Insightful</option>
          <option value="Engaging">Engaging</option>
          <option value="Thoughtful">Thoughtful</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select the language for the podcast:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-300 p-3 mb-4"
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
        </select>
      </div>

      <div className="mt-5 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
        >
          {isLoading ? "Generating..." : qaPairs.length > 0 ? "Regenerate" : "Generate"}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          qaPairs.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-[var(--primary-text-color)] mb-4 underline">Generated Q&A Pairs:</h2>
                <ul className="text-[var(--primary-text-color)] list-disc list-inside">
                  {qaPairs.map((pair, index) => (
                    <li key={index} className="mb-2 list-none">
                      <p className="font-semibold">{pair.question}</p>
                      <p className="mt-1">{pair.answer}</p>
                    </li>
                  ))}
                </ul>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  title="Copy">
                    <ClipboardCopy className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  title="Download">
                    <FaDownload className="inline-block w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]rounded-md px-3 py-1 dark:bg-gray-600 dark:text-gray-200"
                  title="Share">
                    <FaShareAlt className="inline-block w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
