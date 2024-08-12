import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const buttonLabels = [
  "Professional",
  "Art",
  "Drawing",
  "Photo",
  "Victorian",
  "Reflections",
  "Industrial",
  
];

import FileSaver from "file-saver";

type Props = {};

const ImageGenerator = (props: Props) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [number, setNumber] = useState<string>("1");
  const [quality, setQuality] = useState<string>("hd");
  const [selectedButton, setSelectedButton] = useState("Professional");


  const navigate = useNavigate();

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    //@ts-ignore
    setIsLoading(true);
    e.preventDefault();
    if (!isSignedIn) {
      navigate("/login");
      toast.error("Please Signin to continue");
      return;
    }
    if (!text) {
      toast.error("Please enter the text to generate");
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/response/image?clerkId=${userId}`,
        {
          prompt: text,
          quality,
          n: parseInt(number),
          style: selectedButton,
        }
      );

      if (res.status === 200) {
        setOutput(res.data.data);
        setIsLoading(false);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      // toast.error(error);
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
  return (
    <div className="m-auto w-full max-w-[1000px] rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      {/* text area */}
      <Textarea
        className="mb-4 h-24 w-full rounded-md border-2 border-gray-300 p-4"
        placeholder="Enter Prompt to generate image"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* selects */}
      <div className="flex flex-col md:flex-row w-full gap-5">
        <Select onValueChange={setNumber}>
          <SelectTrigger
            className="w-full"
            value={number}
            // @ts-ignore
          >
            <SelectValue placeholder="Select a Number of Images" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number of Images</SelectLabel>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <SelectItem value={`${val}`}>{`${val}`}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={setQuality}>
          <SelectTrigger
            className="w-full"
            defaultValue={quality}
            // @ts-ignore
          >
            <SelectValue placeholder="Select a Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number of Images</SelectLabel>
              <SelectItem value={"hd"}>{"High"}</SelectItem>
              <SelectItem value={"standard"}>{"Standard"}</SelectItem>
              {/* <SelectItem value={"fine"}>{"Fine"}</SelectItem> */}
            </SelectGroup>
          </SelectContent>

        </Select>
      </div>
          <div className="flex flex-wrap my-6 sm:flex-row justify-center gap-2">
            {buttonLabels.map((label, index) => (
              <button
                key={index}
                className={`border-2 rounded-full px-7 py-2 ${
                  selectedButton === label ? "border-[var(--teal-color)]" : ""
                }`}
                onClick={() => handleButtonClick(label)}
              >
                {label}
              </button>
            ))}
          </div>
      <button
        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs mt-10 py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
        onClick={(e) => void handleSubmit(e)}
      >
        Generate
      </button>

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      ) : (
        !!output && (
          <div className="h-fit w-full mt-20 justify-center rounded-md border-2 border-gray-300  dark:text-gray-200 py-10 flex flex-row flex-wrap gap-5 text-gray-800 p-5 ">
            {/* @ts-ignore */}
            {output.map((img: string) => (
              <div className=" relative shadow-2xl w-full h-full min-w-[300px] min-h-[300px] max-w-[400px] max-h-[400px]">
                <img
                  src={img}
                  loading="lazy"
                  alt="generated"
                  className=" w-full h-full "
                />

                <button
                  className="absolute shadow-sm shadow-gray-500 top-4 right-4 opacity-40 hover:opacity-70 text-white bg-gray-800  transition-all duration-300 p-2 rounded-md"
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

export default ImageGenerator;
