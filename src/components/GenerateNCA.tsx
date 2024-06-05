import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, RefreshCw, Download } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";

export function NCAForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ncaContent, setNcaContent] = useState<string | null>(null);
  const [employer, setEmployer] = useState('');
  const [employee, setEmployee] = useState('');
  const [restrictedActivities, setRestrictedActivities] = useState('');
  const [restrictedDuration, setRestrictedDuration] = useState('');
  const [restrictedTerritory, setRestrictedTerritory] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/response/nca?clerkId=${userId}`, {
        employer,
        employee,
        restrictedActivities,
        restrictedDuration,
        restrictedTerritory
      });
        console.log(response)
      if (response.status === 200) {
        const cleanContent = response.data.nda.replace(/\*\*/g, ''); // Remove asterisks
        setNcaContent(cleanContent);
        toast.success("NCA generated successfully.");
      } else {
        toast.error("Error generating NCA. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating NCA:", error);
      toast.error("Error generating NCA. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshForm = () => {
    setEmployer('');
    setEmployee('');
    setRestrictedActivities('');
    setRestrictedDuration('');
    setRestrictedTerritory('');
    setNcaContent(null);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center w-full">
            <input
              type="text"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              placeholder="Employer"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="text"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Employee"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="text"
              value={restrictedActivities}
              onChange={(e) => setRestrictedActivities(e.target.value)}
              placeholder="Restricted Activities"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="text"
              value={restrictedDuration}
              onChange={(e) => setRestrictedDuration(e.target.value)}
              placeholder="Restricted Duration"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="text"
              value={restrictedTerritory}
              onChange={(e) => setRestrictedTerritory(e.target.value)}
              placeholder="Restricted Territory"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={handleSubmit}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Generate NCA'}
            </Button>
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshForm}
            />
          </div>
        </div>
      </div>
      {ncaContent && (
        <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 overflow-auto">
          <h2>Generated NCA:</h2>
          <pre className="whitespace-pre-wrap break-words">{ncaContent}</pre>
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-4"
            onClick={() => navigator.clipboard.writeText(ncaContent)}
          >
            Copy to Clipboard
            <Download className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
