import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Download, Loader2 } from "lucide-react";

import { BASE_URL } from "@/utils/funcitons";

export function CodeConverter() {
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const languages = ["C", "C++", "Java", "JavaScript", "Python"];

  const handleCodeChange = (e:any) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e:any) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!code || !selectedLanguage) {
      toast.error("Please enter code and select a target language.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post( `${BASE_URL}/response/code?clerkId=${userId}`,
        {
            sourceCode: code,
            targetLanguage: selectedLanguage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
       
      setConvertedCode(response.data.convertedCode);
    } catch (error:any) {
      console.error("Error converting code:", error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <Textarea
            className="mb-5"
            placeholder="Enter code here..."
            value={code}
            onChange={handleCodeChange}
          />
          <select
            className="mb-4 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="">Select Target Language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <div className="flex w-full my-4 items-center justify-between">
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
              onClick={handleSubmit}
            >
              Generate
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-black" />
            <p className="text-black text-justify">Converting code. Please wait...</p>
          </div>
        ) : convertedCode ? (
          <div className="w-full">
            <Textarea
              className="w-full mb-4 h-40"
              placeholder="Converted code will be displayed here..."
              value={convertedCode}
              readOnly
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
