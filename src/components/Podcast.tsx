import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, Clipboard } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";

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
  const [isLoading, setIsLoading] = useState(false);
  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setQAPairs([]);

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const maxRetries = 3; // Maximum number of retries
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
        });

        const data = response.data.data.data;
        console.log("Response data:", data);
        if (data && Array.isArray(data.qaPairs) && data.qaPairs.length > 0) {
          setQAPairs(data.qaPairs);
          break; // Exit loop if valid data is received
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

  const handleInputChange = () => {
    setQAPairs([]);
  };

  useEffect(() => {
    if (!isLoading && qaPairs.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, qaPairs]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="mb-5">
        <textarea
          disabled
          value="Please provide questions and answers for the podcast."
          className="w-full p-2 border rounded bg-black text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => { setTopic(e.target.value); handleInputChange(); }}
          placeholder="Example: The Future of Artificial Intelligence"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Guest</label>
        <input
          type="text"
          value={guest}
          onChange={(e) => { setGuest(e.target.value); handleInputChange(); }}
          placeholder="Example: Dr. Jane Smith"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Background Information</label>
        <input
          type="text"
          value={background}
          onChange={(e) => { setBackground(e.target.value); handleInputChange(); }}
          placeholder="Example: Expert in machine learning with 10 years of experience"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Guest's Interests</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => { setInterests(e.target.value); handleInputChange(); }}
          placeholder="Example: AI ethics, robotics, deep learning"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300">Select the tone for the podcast:</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
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

      <div className="mt-5 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
        >
          {isLoading ? "Generating..." : qaPairs.length > 0 ? "Regenerate" : "Generate"}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
            <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          qaPairs.length > 0 && (
            <div ref={resultsRef} className="border border-gray-300 rounded-md mt-6">
              <div className="border p-4 rounded-lg relative">
                <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-4 underline">Generated Q&A Pairs:</h2>
                <ul className="text-gray-700 dark:text-gray-300 list-disc list-inside">
                  {qaPairs.map((pair, index) => (
                    <li key={index} className="mb-2 list-none">
                      <p className="font-semibold">{pair.question}</p>
                      <p className="mt-1">{pair.answer}</p>
                    </li>
                  ))}
                </ul>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={handleCopy}
                >
                  <Clipboard className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
