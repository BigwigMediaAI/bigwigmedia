import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";


export function Decision() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();


  const navigate = useNavigate();

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
  
    try {
      const res = await axios.post(
        `${BASE_URL}/response/decision?clerkId=${userId}`,
        {
          prompt: text,
        }
      );
  
      if (res.status === 200) {
        const data = res.data.data.data;
        if (typeof data === 'object' && 'pros' in data && 'cons' in data) {
          // Extract pros and cons from the response
          const filteredCons = data.cons
            .filter((item: string) => !item.startsWith('Cons:')) // Filter out unwanted line
            .map((item: string) => item.replace(/^\d+\.\s*/, "- ").trim().replace(/###|(\|\r\n|\n|\r)/gm, "")); // Remove ### and replace leading digits and dot
  
          const filteredPros = data.pros
          .filter((item: string) => !item.startsWith('Pros:')) // Filter out unwanted line

            .map((item: string) => item.replace(/###|(\|\r\n|\n|\r)/gm, "")); // Remove ###
  
          setPros(filteredPros);
          setCons(filteredCons);
        } else {
          toast.error("Invalid data format received from the server");
        }
      } else {
        toast.error(res.data.error);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="flex flex-col md:flex-col">
        <div className="w-full  pr-2">
          <Textarea
            className="mb-4 h-20 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
            placeholder="For Example : Buy a car,
For Example : Buy a I-phone
For Example : Want to Invest in share market
            "
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex w-full my-4 items-center justify-between">
            <Button
              className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100"
              onClick={handlePaste}
            >
              Paste Text
            </Button>
            <Button
              className="rounded-md bg-green-500 px-6 py-2 text-white hover:bg-green-600"
              onClick={handleSubmit}
            >
              Clarify Now
            </Button>
          </div>
        </div>
        <div className="w-full  pl-2 flex flex-col gap-2 justify-between">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
              <p className="text-black text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    {/* <th className="border border-gray-200 text-black p-2">Pros</th>
                    <th className="border border-gray-200 text-black p-2">Cons</th> */}
                  </tr>
                </thead>
                <tbody>
                  {pros.map((pro, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 text-black p-2 text-center  dark:text-white " >{pro}</td>
                      {/* Check if cons[index] exists before rendering */}
                      <td className="border border-gray-200 text-black p-2 text-center  dark:text-white">{cons[index] || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
