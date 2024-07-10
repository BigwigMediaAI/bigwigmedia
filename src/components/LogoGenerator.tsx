import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Download, Loader2,Share2 } from "lucide-react";
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

import FileSaver from "file-saver";

type Props = {};

const LogoGenerator = (props: Props) => {
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [design, setDesign] = useState("");
  const [quality, setQuality] = useState<string>("hd");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Generate");

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (companyName && companyType && !isLoading) {
      setButtonText(output ? "Regenerate" : "Generate");
    } else {
      setButtonText("Generate");
    }
  }, [companyName, companyType, isLoading, output]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);
    e.preventDefault();
    if (!isSignedIn) {
      navigate("/login");
      toast.error("Please Sign in to continue");
      setIsLoading(false);
      return;
    }
    if (!companyName || !companyType) {
      toast.error("Please enter both company name and company type");
      setIsLoading(false);
      return;
    }
    // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    try {
      const res = await axios.post(
        `${BASE_URL}/response/logo?clerkId=${userId}`,
        {
          companyName,
          companyType,
          design,
          quality,
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
      toast.error(error.response?.data?.error || "An error occurred");
      setIsLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.download = "logo.jpg"; // You can customize the downloaded filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared Logo",
          text: "Check out this logo I generated!",
          url: output,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      // Implement your own custom sharing method here, like copying to clipboard or showing a share dialog
      // Example:
      // const shareUrl = output; // Your generated logo URL
      // const shareDialog = document.createElement("textarea");
      // shareDialog.value = shareUrl;
      // document.body.appendChild(shareDialog);
      // shareDialog.select();
      // document.execCommand("copy");
      // document.body.removeChild(shareDialog);
      // alert("Link copied to clipboard!");
      toast.error("Sharing not supported on this browser.");
    }
  };

  useEffect(() => {
    if (!isLoading && output) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, output]);

  return (
    <div className="m-auto w-full max-w-[1000px] rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      {/* Company Name */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="company-name">
          Company Name
        </label>
        <Input
          id="company-name"
          className="h-12 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Company Name (e.g., FoodVilla, Tech Innovators)"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>

      {/* Company Type */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="company-type">
          Company Type
        </label>
        <Input
          id="company-type"
          className="h-12 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Company Type (e.g., Restaurant, Technology)"
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
        />
      </div>

      {/* Design Instructions */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="design">
          Design Instructions (Optional)
        </label>
        <Input
          id="design"
          className="h-12 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Optional Design Instructions (e.g., Minimalist with blue and white colors)"
          value={design}
          onChange={(e) => setDesign(e.target.value)}
        />
      </div>

      {/* Quality Select */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">
          Quality
        </label>
        <Select onValueChange={setQuality}>
          <SelectTrigger
            className="w-full"
            defaultValue={quality}
            // @ts-ignore
          >
            <SelectValue placeholder="Select Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"hd"}>{"High"}</SelectItem>
              <SelectItem value={"standard"}>{"Standard"}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <button
        className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs mt-10 py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto ${isLoading ? "cursor-wait" : ""}`}
        onClick={(e) => void handleSubmit(e)}
        disabled={isLoading || !companyName || !companyType}
      >
        {isLoading ? "Generating..." : buttonText}
      </button>

      {isLoading ? (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
          <p className="text-gray-300 text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      ) : (
        !!output && (
          <div ref={resultsRef} className="h-fit w-full mt-20 justify-center rounded-md border-2 border-gray-300 dark:text-gray-200 py-10 flex flex-row flex-wrap gap-5 text-gray-800 p-5">
            <div className="relative shadow-2xl w-full h-full min-w-[300px] min-h-[300px] max-w-[400px] max-h-[400px]">
              <img
                src={output}
                loading="lazy"
                alt="generated logo"
                className="w-full h-full"
              />

              <button
                className="absolute shadow-sm shadow-gray-500 top-4 right-4 opacity-40 hover:opacity-70 text-white bg-gray-800 transition-all duration-300 p-2 rounded-md"
                onClick={() => handleDownload(output)}
              >
                <Download />
              </button>

              <button
                className="absolute shadow-sm shadow-gray-500 top-4 left-4 opacity-40 hover:opacity-70 text-white bg-gray-800 transition-all duration-300 p-2 rounded-md"
                onClick={() => handleShare()}
              >
               <Share2/>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LogoGenerator;
