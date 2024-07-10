import { Label } from "@radix-ui/react-dropdown-menu";
import OpenAI from "openai";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";



enum WordOptions {
  ALLOY = "alloy",
  ECHO = "echo",
  FABLE = "fable",
  ONYX = "onyx",
  NOVA = "nova",
  SHIMMER = "shimmer"
}

const AudioText = () => {
  const [file, setfile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState();
  const [audioBuffer, setAudioBuffer] = useState<string>("");
  const [tone, setTone] = useState < WordOptions>(WordOptions.ALLOY);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const key = import.meta.env.VITE_OPEN_API_KEY_AUDIO as string;
const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });


  const ref = useRef(null);
  const handleTranscribe = async (e: any) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please Input something to generate audio");
      return;
    }
    if (!tone) {
      toast.error("Please select a tone to generate audio");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("input", file);
    formData.append("voice", "alloy");
    formData.append("model", "tts-1");

    try {


      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: tone,
        input: file,
        // response_format: "mp3",
        //  output_format: "mp3"
      });
      const arrayBuffer = await mp3.arrayBuffer();

      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

      const objectURL = URL.createObjectURL(blob);

      setAudioBuffer(objectURL);
      if (mp3.status === 200) {

        // toast.success("hello")

        const resp = await axios.post(`${BASE_URL2}/limits/decrease?clerkId=${userId}`)
        // setOutput(response.data.text);
      }
      // @ts-ignore
    } catch (error: any) {
      toast.error("There has been a problem with your fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" flex flex-col gap-4 m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col   w-full max-w-[844px]  self-start gap-2">
        <Label className="dark:text-white self-start text-black text-left font-outfit text-xl font-semibold">
          Text to Audio Conversion
        </Label>
        <Textarea
          className="mb-4 h-24 w-full min-w-[300px] rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Prompt to generate audio"
          value={file}
          onChange={(e: any) => setfile(e.target.value)}
        />
      </div>

      <Select onValueChange={(e) => setTone(e as WordOptions)}>
        <SelectTrigger
          className="capitalize self-start min-w-[300px] max-w-[844px] "
          value={tone}
        // @ts-ignore
        >
          <SelectValue placeholder={"Select Tone "} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{"Choose a Tone"}</SelectLabel>
            {Object.values(WordOptions).map((option) => (
              <SelectItem value={option} className="capitalize">{option}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex  text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
        onClick={(e) => void handleTranscribe(e)}
      >
        {isLoading&&<Loader2 className="animate-spin w-7 h-7 " />}
        Generate
      </Button>

      <audio controls key={audioBuffer} autoPlay className="mx-auto">
        <source src={audioBuffer} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {audioBuffer && <a
        href={audioBuffer}
        download="audio_file.mp3"
        className="bg-blue-500 rounded-full text-white p-3 hover:bg-blue-600 mx-auto  block mt-2"
      title="Download">
        Download Audio
      </a>}
    </div>
  );
};

export default AudioText;
