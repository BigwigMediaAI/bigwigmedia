import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
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

  const handleSubmit = async () => {
    setIsLoading(true);
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-lg mx-auto border rounded-md p-6 space-y-4 bg-gray-50 shadow-lg">
        <div>
          <textarea
            disabled
            value="Please provide questions and answers for the podcast."
            className="w-full p-2 border rounded bg-black text-white"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">Enter the topic for the podcast:</p>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example:The Future of Artificial Intelligence"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">Enter the name of the guest:</p>
          <input
            type="text"
            value={guest}
            onChange={(e) => setGuest(e.target.value)}
            placeholder="Example: Dr. Jane Smith"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">Provide some background information:</p>
          <input
            type="text"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            placeholder="Eample: Expert in machine learning with 10 years of experience"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">List the guest's interests:</p>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Example: AI ethics, robotics, deep learning"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p className="text-gray-700 mb-2">Select the tone for the podcast:</p>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-2 border rounded"
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
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit border"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : qaPairs.length > 0 ? "Regenerate" : "Generate"}
        </button>
      </div>
      <div className="mt-8 max-w-lg mx-auto">
        {qaPairs.length > 0 ? (
          <div className="bg-gray-200 rounded-md shadow-md p-6 space-y-4">
            {qaPairs.map((pair, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded shadow-sm border border-gray-300">
                <p className="font-semibold text-black">{pair.question}</p>
                <p className="mt-2 text-gray-700">{pair.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500"></p>
        )}
      </div>
    </div>
  );
}
