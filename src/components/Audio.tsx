import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/BigwigLoader";


const Audio = () => {
  const [file, setfile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
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

  const handleTranscribe = async (e: any) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an audio file");
      return;
    }
    setIsLoading(true);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    // const openaiApiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key
    const key = import.meta.env.VITE_OPEN_API_KEY_AUDIO as string;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(response.status===200){

        const resp = await axios.post(`${BASE_URL2}/limits/decrease?clerkId=${userId}`)
        setOutput(response.data.text);
      }

    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex flex-col gap-4 m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md">
      <h1>Choose an audio file</h1>
      <Input
        type="file"
        accept="audio/mp3"
        // value={file}
        onChange={(e: any) => setfile(e.target.files[0])}
      />
      <button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
        onClick={(e) => void handleTranscribe(e)}
      >
        Generate
      </button>

      {(!!output || isLoading) &&isLoading ? (
        <div className="w-full mt-10 flex flex-col items-center justify-center">
        <BigwigLoader styleType="cube"  />
        <p className="mt-5 text-[var(--dark-gray-color)] text-center">Processing your data. Please bear with us as we ensure the best results for you...</p>
        </div>
      ) : (
       output && <div className="h-fit w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 ">
          {output}
        </div>
      )}
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
};

export default Audio;
