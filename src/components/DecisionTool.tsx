import React, { useState,useEffect,useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { BASE_URL } from '@/utils/funcitons';
import { Clipboard, Download, Loader2,Share2, Share2Icon } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { validateInput } from '@/utils/validateInput';

export function Decision() {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pros, setPros] = useState<string[]>([]);
    const [cons, setCons] = useState<string[]>([]);
    const [language, setLanguage] = useState('English'); // Default language
    const { userId } = useAuth();
    const [showActions, setShowActions] = useState(false); // To show share and download buttons
    const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !validateInput(text)
          ) {
            toast.error('Your input contains prohibited words. Please remove them and try again.');
            return;
          }
        setIsLoading(true);
        // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

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

    const handleCopyEvent = (e: ClipboardEvent) => {
        const selectedText = window.getSelection()?.toString() || '';
        if (selectedText) {
            e.clipboardData?.setData('text/plain', selectedText);
            e.preventDefault();
        }
    };
    
    document.addEventListener('copy', handleCopyEvent);

    useEffect(() => {
        if (!isLoading && pros.length > 0) {
          loaderRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, [isLoading, pros]);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-col">
                    <div className="w-full pr-2">
                    <label className="mb-2 block text-gray-700 dark:text-gray-300">Enter Your Decision:</label>
                        <Textarea
                            className="mb-4 h-20 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
                            placeholder="e.g: Starting a Bakery shop..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex-col w-full my-4">
                        <label className="mb-2 block text-gray-700 dark:text-gray-300">Language:</label>
                            <select
                                className="w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-2"
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
                                {/* Add other language options */}
                            </select>
                           
                        </div>
                        <Button
                                className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                                type="submit"
                            >
                                {isLoading?"Generating...":(pros.length>0?"Regenerate":"Generate")}
                            </Button>
                    </div>
                    <div className="w-full pl-2 flex flex-col gap-2 justify-between">
                        {isLoading ? (
                            <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center ">
                                <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)] " />
                                <p className="text-[var(--dark-gray-color)] text-justify">
                                    Data processing in progress. Please bear with us...
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 w-full">
                                {showActions && (
                                            <div className="flex justify-between gap-4 mt-4">
                                                <h1 className='text-2xl text-[var(--primary-text-color)] mb-4'>Generated Output</h1>
                                                <div className='flex gap-4'>
                                                <Button
                                                    className="bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                                                    onClick={handleDownload}
                                                title='Download'>
                                                    <Download className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    className="bg-white hover:bg-white text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                                                    onClick={handleShare}
                                                title='Share'>
                                                   <Share2Icon className="w-5 h-5" />
                                                </Button>
                                                </div>
                                                
                                            </div>
                                        )}
                                {pros.length > 0 && cons.length > 0 && (
                                    <div ref={resultsRef} className="w-full">
                                        <table className="w-full border-collapse border border-[var(--primary-text-color)]">
                                            <thead>
                                                <tr>
                                                    <th className="border border-[var(--primary-text-color)] text-[var(--primary-text-color)] p-2">Pros</th>
                                                    <th className="border border-[var(--primary-text-color)] text-[var(--primary-text-color)] p-2">Cons</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pros.map((pro, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-[var(--primary-text-color)] text-[var(--primary-text-color)] p-2 text-center dark:text-white">
                                                            {pro}
                                                        </td>
                                                        <td className="border border-[var(--primary-text-color)] text-[var(--primary-text-color)] p-2 text-center dark:text-white">
                                                            {cons[index]}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
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
