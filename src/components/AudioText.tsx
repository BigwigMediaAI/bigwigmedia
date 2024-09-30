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
import { Loader2, Share2 } from "lucide-react";
import BigwigLoader from "@/pages/BigwigLoader";

enum WordOptions {
  ALLOY = "alloy",
  ECHO = "echo",
  FABLE = "fable",
  ONYX = "onyx",
  NOVA = "nova",
  SHIMMER = "shimmer"
}

const AudioText = () => {
  const [file, setfile] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<string>("");
  const [tone, setTone] = useState<WordOptions>(WordOptions.ALLOY);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const key = import.meta.env.VITE_OPEN_API_KEY_AUDIO as string;
  const openai = new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });

  const ref = useRef(null);

  const handleTranscribe = async (e: any) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please input something to generate audio");
      return;
    }
    if (!tone) {
      toast.error("Please select a tone to generate audio");
      return;
    }
    setIsLoading(true);

    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: tone,
        input: file,
      });
      const arrayBuffer = await mp3.arrayBuffer();

      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const objectURL = URL.createObjectURL(blob);

      setAudioBuffer(objectURL);

      if (mp3.status === 200) {
        await axios.post(`${BASE_URL2}/limits/decrease?clerkId=${userId}`);
      }
    } catch (error: any) {
      toast.error("There has been a problem with your fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = async () => {
    if (!audioBuffer) return;

    try {
      const blob = await fetch(audioBuffer).then(res => res.blob());
      const file = new File([blob], 'audio_file.mp3', { type: blob.type });

      if (navigator.share) {
        await navigator.share({
          title: 'Generated Audio',
          files: [file],
        });
        toast.success("Audio shared successfully.");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing audio:", error);
      toast.error("Error sharing audio. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-4 m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col w-full max-w-[844px] self-start gap-2">
        <Label className="self-start text-[var(--primary-text-color)] text-left font-outfit text-xl font-semibold">
          Text to Audio Conversion
        </Label>
        <Textarea
          className="mb-4 h-24 w-full min-w-[300px] rounded-md border-2 border-gray-300 p-4"
          placeholder="Enter Prompt to generate audio"
          value={file}
          onChange={(e) => setfile(e.target.value)}
        />
      </div>

      <Select onValueChange={(e) => setTone(e as WordOptions)}>
        <SelectTrigger
          className="capitalize self-start min-w-[300px] max-w-[844px] border border-[var(--gray-color)]"
          value={tone}
        >
          <SelectValue placeholder={"Select Tone"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{"Choose a Tone"}</SelectLabel>
            {Object.values(WordOptions).map((option) => (
              <SelectItem value={option} className="capitalize" key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        className="text-white text-center font-outfit md:text-lg font-semibold flex text-xs py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
        onClick={(e) => void handleTranscribe(e)}
      >
        Generate
      </Button>

      {isLoading && (
        <div className="w-full mt-10 flex flex-col items-center justify-center">
        <BigwigLoader styleType="cube"  />
        <p className="mt-5 text-[var(--dark-gray-color)] text-center">Processing your data. Please bear with us as we ensure the best results for you...</p>
        </div>
      )}

      <audio controls key={audioBuffer} autoPlay className="mx-auto">
        <source src={audioBuffer} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {audioBuffer && (
        <div className="flex justify-center gap-4 mt-4">
          <a
            href={audioBuffer}
            download="audio_file.mp3"
            className="text-white text-center font-outfit md:text-lg font-semibold flex text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            title="Download"
          >
            Download
          </a>
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex text-xs py-7 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            onClick={handleShareClick}
            title="Share"
          >
            Share
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioText;
