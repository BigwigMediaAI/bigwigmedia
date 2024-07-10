import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { BASE_URL } from '@/utils/funcitons';
import { Loader2,Share2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

export function Decision() {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pros, setPros] = useState<string[]>([]);
    const [cons, setCons] = useState<string[]>([]);
    const [language, setLanguage] = useState('English'); // Default language
    const { userId } = useAuth();
    const [showActions, setShowActions] = useState(false); // To show share and download buttons

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post(
                `${BASE_URL}/response/decision`,
                { prompt: text, language: language },
                { params: { clerkId: userId } }
            );

            if (res.status === 200 && res.data?.data?.data) {
                const { pros: resPros, cons: resCons } = res.data.data.data;

                if (resPros && resCons) {
                    const filteredPros = resPros.map((item: string) => item.replace(/^\d+\.\s*/, '- ').trim());
                    const filteredCons = resCons.map((item: string) => item.replace(/^\d+\.\s*/, '- ').trim());

                    setPros(filteredPros);
                    setCons(filteredCons);
                    setShowActions(true); // Show share and download buttons
                } else {
                    toast.error('Invalid data format received from the server');
                }
            } else {
                toast.error(res.data?.error || 'Error generating response');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.error || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (!navigator.share) {
            toast.error('Sharing is not supported on this browser.');
            return;
        }

        const shareData = {
            title: 'Decision Pros and Cons',
            text: `Pros:\n${pros.join('\n')}\n\nCons:\n${cons.join('\n')}`,
        };

        try {
            await navigator.share(shareData);
            toast.success('Content shared successfully!');
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share content.');
        }
    };

    const handleDownload = () => {
        const content = `Pros:\n${pros.join('\n')}\n\nCons:\n${cons.join('\n')}`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'decision.txt');
    };

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#3f3e3e] bg-white p-6 shadow-xl">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-col">
                    <div className="w-full pr-2">
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
                                {/* Add other language options */}
                            </select>
                            <Button
                                className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                                type="submit"
                            >
                                Generate
                            </Button>
                        </div>
                    </div>
                    <div className="w-full pl-2 flex flex-col gap-2 justify-between">
                        {isLoading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center ">
                                <Loader2 className="animate-spin w-20 h-20 mt-20 text-black " />
                                <p className="text-black text-justify">
                                    Data processing in progress. Please bear with us...
                                </p>
                            </div>
                        ) : (
                            <div className="w-full">
                                {pros.length > 0 && cons.length > 0 && (
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
                                                        <td className="border border-gray-200 text-black p-2 text-center dark:text-white">
                                                            {pro}
                                                        </td>
                                                        <td className="border border-gray-200 text-black p-2 text-center dark:text-white">
                                                            {cons[index]}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {showActions && (
                                            <div className="flex justify-center gap-4 mt-4">
                                                <Button
                                                    className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                                                    onClick={handleShare}
                                                ><Share2/>
                                                    Share
                                                </Button>
                                                <Button
                                                    className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                                                    onClick={handleDownload}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
