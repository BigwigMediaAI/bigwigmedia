import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";


export function Seotool() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ keywords: { keyword: string; searchVolume: number }[], title: string }[]>([]);
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
        `${BASE_URL}/response/getseo?clerkId=${userId}`,
        {
          prompt: text,
        }
      );
      console.log(res.data.data.data)

      if (res.status === 200) {
        setData(res.data.data.data);
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
            placeholder="For example...
Mobile phones
Share marketing
Digaital media
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
                    <th className="border border-gray-200 text-black p-2"style={{ width: '30%' }}>Title</th>
                    <th className="border border-gray-200 text-black p-2">Keywords</th>
                    <th className="border border-gray-200 text-black p-2"style={{ width: '30%' }}>Search Volume</th>
                  </tr>
                </thead>
                <tbody>
  {data.map((item, index) => (
    item.keywords.map((keyword:any, keywordIndex:any) => {
      const { title } = item;
      const { keyword: keywordText, searchVolume } = keyword;
      return (
        <tr key={`${index}-${keywordIndex}`}>
          <td className="border border-gray-200 text-white p-2 text-center text-small">{title}</td>
          <td className="border border-gray-200 text-white p-2 text-center">{keywordText}</td>
          <td className="border border-gray-200 text-white p-2 text-center">{searchVolume}</td>
        </tr>
      );
    }) 
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
