// FinanceAdvisor.js

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Copy } from 'lucide-react';
import { BASE_URL } from '@/utils/funcitons';
import { useAuth } from '@clerk/clerk-react';

const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Kannada', label: 'Kannada' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Nepali', label: 'Nepali' },
    { value: 'Odia', label: 'Odia' },
    { value: 'Punjabi', label: 'Punjabi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Assamese', label: 'Assamese' },
    { value: 'Bihari', label: 'Bihari' },
    { value: 'Kashmiri', label: 'Kashmiri' },
    { value: 'Konkani', label: 'Konkani' },
    { value: 'Maithili', label: 'Maithili' },
    { value: 'Manipuri', label: 'Manipuri' },
    { value: 'Santali', label: 'Santali' },
    { value: 'Sindhi', label: 'Sindhi' },
    { value: 'Bhojpuri', label: 'Bhojpuri' },
    { value: 'Urdu', label: 'Urdu' },
    // Add more languages as needed
];

export function FinanceAdvisor() {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [language, setLanguage] = useState('English');
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const [advices, setAdvices] = useState([]);
    const { userId } = useAuth();
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const resultsRef = useRef<HTMLDivElement | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/response/finance?clerkId=${userId}`, {
                description,
                amount: parseFloat(amount) || 0,
                language,
                outputCount,
            });
            console.log(response.data)

            if (response.status === 200) {
                setAdvices(response.data.advice);
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                toast.error('Error generating financial advice. Please try again later.');
            }
        } catch (error) {
            console.error('Error generating financial advice:', error);
            toast.error('Error generating financial advice. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text:any) => {
        navigator.clipboard.writeText(text);
        toast.success('Advice copied to clipboard');
    };

    useEffect(() => {
        if (!isLoading && advices.length > 0 && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, advices]);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300">Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your financial situation description"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
                />
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300">Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the amount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
                />
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300">Language</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
                >
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300">Number of Advices</label>
                <input
                    type="number"
                    value={outputCount}
                    onChange={(e) => setOutputCount(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 px-3 py-2"
                />
            </div>

            <div className="mt-5 flex justify-center">
                <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-300" />
                        <p className="text-gray-300 text-justify">Generating financial advice. Please wait...</p>
                    </div>
                ) : (
                    <div>
                        {advices.map((advice, index) => (
                            <div key={index} className='border border-gray-300 rounded-md p-5 mb-4'>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-700 dark:text-gray-300">Generated Financial Advice {index + 1}:</h3>
                                    <button onClick={() => handleCopy(advice)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mt-2">
                                    {advice}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div ref={resultsRef} /> {/* This empty div is used for scrolling */}
        </div>
    );
}
