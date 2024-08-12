import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Download, Loader2, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FileSaver from "file-saver";
import beep from "../assets/beep.mp3";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateInput } from "@/utils/validateInput";

const buttonLabels = [
  "Professional",
  "Art",
  "Drawing",
  "Photo",
  "Victorian",
  "Reflections",
  "Industrial",
];

type Props = {};

// Declare types for the Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

const GeneratorImage: React.FC<Props> = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [number, setNumber] = useState<string>("1");
  const [quality, setQuality] = useState<string>("hd");
  const [selectedButton, setSelectedButton] = useState("Professional");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const beepRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition() as SpeechRecognition;
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onstart = () => {
        setIsRecording(true);
      };

      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechToText = event.results[0][0].transcript;
        setText(speechToText);
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(event.error);
        setIsRecording(false);
      };

      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(speechRecognition);
    } else {
      toast.error("Sorry, your browser doesn't support speech recognition.");
    }
  }, []);

  const handleStartRecording = () => {
    if (recognition) {
      recognition.start();
      if (beepRef.current) {
        beepRef.current.play();
      }
    }
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    e.preventDefault();
    if (!text) {
      toast.error("Please enter the text to generate");
      setIsLoading(false);
      return;
    }

    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/image?clerkId=${userId}`, {
        prompt: text,
        quality,
        n: parseInt(number),
        style: selectedButton,
      });

      if (res.status === 200) {
        setOutput(res.data.data);
        setIsLoading(false);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.download = "image.jpg"; // You can customize the downloaded filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleButtonClick = (selected: string) => {
    setSelectedButton(selected);
  };

  const handleRegenerate = () => {
    setOutput([]);
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && output.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' ,block:'center'});
    }
  }, [isLoading, output]);

  return (
    <div className="m-auto w-full max-w-[1000px] rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      {/* text area */}
      <Textarea
        className="mb-4 h-24 w-full rounded-md border border-[var(--primary-text-color)] p-4"
        placeholder="Please speak after a beep"
        value={text}
        readOnly
      />

      {/* Record Button */}
      <div className="flex items-center justify-center mb-4">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs mt-10 py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <MicOff /> : <Mic />}
          {isRecording ? "Stop Recording" : "Start Recording"}
          {isRecording && (
            <div className="ml-2 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Beep Sound */}
      <audio ref={beepRef} src={beep} />

{/* selects */}
<div className="flex flex-col md:flex-row w-full gap-5">
  <Select onValueChange={setNumber}>
    <SelectTrigger className="w-full border border-[var(--primary-text-color)]" value={number}>
      <SelectValue placeholder="Select a Number of Images" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Number of Images</SelectLabel>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
          <SelectItem key={val} value={`${val}`}>{`${val}`}</SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  <Select onValueChange={setQuality}>
    <SelectTrigger className="w-full border border-[var(--primary-text-color)]" defaultValue={quality}>
      <SelectValue placeholder="Select a Quality" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Quality</SelectLabel>
        <SelectItem value={"hd"}>{"High"}</SelectItem>
        <SelectItem value={"standard"}>{"Standard"}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
<div className="flex flex-wrap my-6 sm:flex-row justify-center gap-2">
  {buttonLabels.map((label, index) => (
    <button
      key={index}
      className={`border rounded-full px-7 py-2 ${
        selectedButton === label ? "border-2 border-[var(--teal-color)]" : ""
      }`}
      onClick={() => handleButtonClick(label)}
    >
      {label}
    </button>
  ))}
</div>
<button
  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs mt-10 py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
  onClick={(e) => {
    handleSubmit(e);
    handleRegenerate(); // Adding handleRegenerate here to clear output when generating new images
  }}
>
  {output.length ? "Regenerate" : "Generate"}
</button>

{isLoading ? (
  <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
    <Loader2 className="animate-spin w-20 h-20 mt-10" />
    <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
  </div>
) : (
  !!output.length && (
    <div ref={resultsRef} className="h-fit w-full mt-20 justify-center rounded-md border-2 border-gray-300  py-10 flex flex-row flex-wrap gap-5 text-gray-800 p-5 ">
      {output.map((img: string, index: number) => (
        <div
          key={index}
          className="relative shadow-2xl w-full h-full min-w-[300px] min-h-[300px] max-w-[400px] max-h-[400px]"
        >
          <img
            src={img}
            loading="lazy"
            alt="generated"
            className="w-full h-full"
          />

          <button
            className="absolute shadow-sm shadow-gray-500 top-4 right-4 opacity-40 hover:opacity-70 text-white bg-gray-800 transition-all duration-300 p-2 rounded-md"
            onClick={() => handleDownload(img)}
          title="Download">
            <Download />
          </button>
        </div>
      ))}
    </div>
  )
)}
</div>
);
};

export default GeneratorImage;

