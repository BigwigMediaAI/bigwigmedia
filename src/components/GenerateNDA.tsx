import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, RefreshCw, Download } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";

export function NDAForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [ndaContent, setNdaContent] = useState<string | null>(null);
  const [disclosingParty, setDisclosingParty] = useState('');
  const [receivingParty, setReceivingParty] = useState('');
  const [DateAgreement, setDateAgreement] = useState('');
  const [language, setLanguage] = useState('English');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/response/nda?clerkId=${userId}`, {
        disclosingParty,
        receivingParty,
        DateAgreement,
        language
      });

      if (response.status === 200) {
        const cleanContent = response.data.nda.replace(/\*\*/g, ''); // Remove asterisks
        setNdaContent(cleanContent);
        toast.success("NDA generated successfully.");
      } else {
        toast.error("Error generating NDA. Please try again later.");
      }
    } catch (error) {
      console.error("Error generating NDA:", error);
      toast.error("Error generating NDA. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshForm = () => {
    setDisclosingParty('');
    setReceivingParty('');
    setDateAgreement('');
    setLanguage('English');
    setNdaContent(null);
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
      <div className="border border-gray-300 p-6 mb-5 rounded-md w-full flex flex-col items-center">
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center w-full">
            <input
              type="text"
              value={disclosingParty}
              onChange={(e) => setDisclosingParty(e.target.value)}
              placeholder="Disclosing Party"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="text"
              value={receivingParty}
              onChange={(e) => setReceivingParty(e.target.value)}
              placeholder="Receiving Party"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <input
              type="date"
              value={DateAgreement}
              onChange={(e) => setDateAgreement(e.target.value)}
              placeholder="Date of Agreement"
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 p-2 mb-3 rounded-md w-full"
              required
            >
              <option value="English">English</option>
<option value="Spanish">Spanish</option>
<option value="French">French</option>
<option value="German">German</option>
<option value="Chinese">Chinese</option>
<option value="Hindi">Hindi</option>
<option value="Arabic">Arabic</option>
<option value="Portuguese">Portuguese</option>
<option value="Bengali">Bengali</option>
<option value="Russian">Russian</option>
<option value="Japanese">Japanese</option>
<option value="Lahnda">Lahnda</option>
<option value="Punjabi">Punjabi</option>
<option value="Javanese">Javanese</option>
<option value="Korean">Korean</option>
<option value="Telugu">Telugu</option>
<option value="Marathi">Marathi</option>
<option value="Tamil">Tamil</option>
<option value="Turkish">Turkish</option>
<option value="Vietnamese">Vietnamese</option>
<option value="Italian">Italian</option>
<option value="Urdu">Urdu</option>
<option value="Persian">Persian</option>
<option value="Malay">Malay</option>
<option value="Thai">Thai</option>
<option value="Gujarati">Gujarati</option>
<option value="Kannada">Kannada</option>
<option value="Polish">Polish</option>
<option value="Ukrainian">Ukrainian</option>
<option value="Romanian">Romanian</option>

            </select>
            <Button
              className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={handleSubmit}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Generate NDA'}
            </Button>
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshForm}
            />
          </div>
        </div>
      </div>
      {ndaContent && (
        <div className="m-auto w-full max-w-2xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl mt-5 overflow-auto">
          <h2>Generated NDA:</h2>
          <pre className="whitespace-pre-wrap break-words">{ndaContent}</pre>
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto mt-4"
            onClick={() => navigator.clipboard.writeText(ndaContent)}
          >
            Copy to Clipboard
            <Download className="w-6 h-6 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
