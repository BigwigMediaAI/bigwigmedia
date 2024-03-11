import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";


const Audio = () => {
  const [file, setfile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const handleTranscribe = async (e: any) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an audio file");
      return;
    }
    setIsLoading(true);

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
    <div className=" flex flex-col gap-4 m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <h1>Choose an audio file</h1>
      <Input
        type="file"
        accept="audio/mp3"
        // value={file}
        onChange={(e: any) => setfile(e.target.files[0])}
      />
      <button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
        onClick={(e) => void handleTranscribe(e)}
      >
        Generate
      </button>

      {(!!output || isLoading) &&isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-10" />
        </div>
      ) : (
       output && <div className="h-fit w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 ">
          {output}
        </div>
      )}
    </div>
  );
};

export default Audio;
