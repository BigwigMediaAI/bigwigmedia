// Decision.tsx

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

export function Decision() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pros, setPros] = useState<string[]>([]);
    const [cons, setCons] = useState<string[]>([]);
    const [language, setLanguage] = useState("English"); // Default language

    const { userId } = useAuth();

    const handleLanguageChange = (e:any) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e: any) => {
        setIsLoading(true);
        e.preventDefault();

        try {
            const res = await axios.post(
                `${BASE_URL}/response/decision`,
                {
                    prompt: text,
                    language: language // Pass selected language to backend
                },
                {
                    params: {
                        clerkId: userId
                    }
                }
            );
            console.log(res.data.data.data.cons)
            console.log(res.data.data.data)

            if (res.status === 200) {
                if (res.data.data.data.pros && res.data.data.data.cons) {
                    // Extract pros and cons from the response
                    const filteredPros = res.data.data.data.pros.map((item: string) => item.replace(/^\d+\.\s*/, "- ").trim());
                    const filteredCons = res.data.data.data.cons.map((item: string) => item.replace(/^\d+\.\s*/, "- ").trim());

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
                        placeholder="Enter your decision here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex w-full my-4 items-center justify-between">
                        <select
                            className="rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
                            value={language}
                            onChange={handleLanguageChange}
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

                            {/* Add other languages as needed */}
                        </select>
                        <Button
                            className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                            onClick={handleSubmit}
                        >
                            Generate
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
                                        <th className="border border-gray-200 text-black p-2">Pros</th>
                                        <th className="border border-gray-200 text-black p-2">Cons</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pros.map((pro, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-200 text-black p-2 text-center  dark:text-white">{pro}</td>
                                            <td className="border border-gray-200 text-black p-2 text-center  dark:text-white">{cons}</td>
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
