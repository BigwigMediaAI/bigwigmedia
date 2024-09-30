import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2,ClipboardCopy, Download, Share2 } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from '@clerk/clerk-react';
import { FaDownload, FaShareAlt } from 'react-icons/fa';
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

const languageOptions = [
{ value: 'Afrikaans', label: 'Afrikaans' },
{ value: 'Albanian', label: 'Albanian' },
{ value: 'Amharic', label: 'Amharic' },
{ value: 'Arabic', label: 'Arabic' },
{ value: 'Armenian', label: 'Armenian' },
{ value: 'Azerbaijani', label: 'Azerbaijani' },
{ value: 'Basque', label: 'Basque' },
{ value: 'Belarusian', label: 'Belarusian' },
{ value: 'Bengali', label: 'Bengali' },
{ value: 'Bosnian', label: 'Bosnian' },
{ value: 'Bulgarian', label: 'Bulgarian' },
{ value: 'Catalan', label: 'Catalan' },
{ value: 'Cebuano', label: 'Cebuano' },
{ value: 'Chichewa', label: 'Chichewa' },
{ value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
{ value: 'Chinese (Traditional)', label: 'Chinese (Traditional)' },
{ value: 'Corsican', label: 'Corsican' },
{ value: 'Croatian', label: 'Croatian' },
{ value: 'Czech', label: 'Czech' },
{ value: 'Danish', label: 'Danish' },
{ value: 'Dutch', label: 'Dutch' },
{ value: 'English', label: 'English' },
{ value: 'Esperanto', label: 'Esperanto' },
{ value: 'Estonian', label: 'Estonian' },
{ value: 'Filipino', label: 'Filipino' },
{ value: 'Finnish', label: 'Finnish' },
{ value: 'French', label: 'French' },
{ value: 'Frisian', label: 'Frisian' },
{ value: 'Galician', label: 'Galician' },
{ value: 'Georgian', label: 'Georgian' },
{ value: 'German', label: 'German' },
{ value: 'Greek', label: 'Greek' },
{ value: 'Gujarati', label: 'Gujarati' },
{ value: 'Haitian Creole', label: 'Haitian Creole' },
{ value: 'Hausa', label: 'Hausa' },
{ value: 'Hawaiian', label: 'Hawaiian' },
{ value: 'Hebrew', label: 'Hebrew' },
{ value: 'Hindi', label: 'Hindi' },
{ value: 'Hmong', label: 'Hmong' },
{ value: 'Hungarian', label: 'Hungarian' },
{ value: 'Icelandic', label: 'Icelandic' },
{ value: 'Igbo', label: 'Igbo' },
{ value: 'Indonesian', label: 'Indonesian' },
{ value: 'Irish', label: 'Irish' },
{ value: 'Italian', label: 'Italian' },
{ value: 'Japanese', label: 'Japanese' },
{ value: 'Javanese', label: 'Javanese' },
{ value: 'Kannada', label: 'Kannada' },
{ value: 'Kazakh', label: 'Kazakh' },
{ value: 'Khmer', label: 'Khmer' },
{ value: 'Kinyarwanda', label: 'Kinyarwanda' },
{ value: 'Korean', label: 'Korean' },
{ value: 'Kurdish (Kurmanji)', label: 'Kurdish (Kurmanji)' },
{ value: 'Kyrgyz', label: 'Kyrgyz' },
{ value: 'Lao', label: 'Lao' },
{ value: 'Latin', label: 'Latin' },
{ value: 'Latvian', label: 'Latvian' },
{ value: 'Lithuanian', label: 'Lithuanian' },
{ value: 'Luxembourgish', label: 'Luxembourgish' },
{ value: 'Macedonian', label: 'Macedonian' },
{ value: 'Malagasy', label: 'Malagasy' },
{ value: 'Malay', label: 'Malay' },
{ value: 'Malayalam', label: 'Malayalam' },
{ value: 'Maltese', label: 'Maltese' },
{ value: 'Maori', label: 'Maori' },
{ value: 'Marathi', label: 'Marathi' },
{ value: 'Mongolian', label: 'Mongolian' },
{ value: 'Myanmar (Burmese)', label: 'Myanmar (Burmese)' },
{ value: 'Nepali', label: 'Nepali' },
{ value: 'Norwegian', label: 'Norwegian' },
{ value: 'Odia (Oriya)', label: 'Odia (Oriya)' },
{ value: 'Pashto', label: 'Pashto' },
{ value: 'Persian', label: 'Persian' },
{ value: 'Polish', label: 'Polish' },
{ value: 'Portuguese', label: 'Portuguese' },
{ value: 'Punjabi', label: 'Punjabi' },
{ value: 'Romanian', label: 'Romanian' },
{ value: 'Russian', label: 'Russian' },
{ value: 'Samoan', label: 'Samoan' },
{ value: 'Scots Gaelic', label: 'Scots Gaelic' },
{ value: 'Serbian', label: 'Serbian' },
{ value: 'Sesotho', label: 'Sesotho' },
{ value: 'Shona', label: 'Shona' },
{ value: 'Sindhi', label: 'Sindhi' },
{ value: 'Sinhala', label: 'Sinhala' },
{ value: 'Slovak', label: 'Slovak' },
{ value: 'Slovenian', label: 'Slovenian' },
{ value: 'Somali', label: 'Somali' },
{ value: 'Spanish', label: 'Spanish' },
{ value: 'Sundanese', label: 'Sundanese' },
{ value: 'Swahili', label: 'Swahili' },
{ value: 'Swedish', label: 'Swedish' },
{ value: 'Tajik', label: 'Tajik' },
{ value: 'Tamil', label: 'Tamil' },
{ value: 'Tatar', label: 'Tatar' },
{ value: 'Telugu', label: 'Telugu' },
{ value: 'Thai', label: 'Thai' },
{ value: 'Turkish', label: 'Turkish' },
{ value: 'Turkmen', label: 'Turkmen' },
{ value: 'Ukrainian', label: 'Ukrainian' },
{ value: 'Urdu', label: 'Urdu' },
{ value: 'Uyghur', label: 'Uyghur' },
{ value: 'Uzbek', label: 'Uzbek' },
{ value: 'Vietnamese', label: 'Vietnamese' },
{ value: 'Welsh', label: 'Welsh' },
{ value: 'Xhosa', label: 'Xhosa' },
{ value: 'Yiddish', label: 'Yiddish' },
{ value: 'Yoruba', label: 'Yoruba' },
{ value: 'Zulu', label: 'Zulu' }

    // Add more languages as needed
];

export function FinanceAdvisor() {
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [language, setLanguage] = useState('English');
    const [outputCount, setOutputCount] = useState(3); // Default output count
    const [advices, setAdvices] = useState<string[]>([]);
    const { userId } = useAuth();
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const [showModal3, setShowModal3] = useState(false);
    const [credits, setCredits] = useState(0);

    const getCredits = async () => {
        try {
          const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
          if (res.status === 200) {
            setCredits(res.data.data.currentLimit);
            return res.data.data.currentLimit; // Return credits for immediate use
          } else {
            toast.error("Error occurred while fetching account credits");
            return 0;
          }
        } catch (error) {
          console.error('Error fetching credits:', error);
          toast.error("Error occurred while fetching account credits");
          return 0;
        }
      };

    const handleGenerate = async () => {
        if (
            !validateInput(description)
          ) {
            toast.error('Your input contains prohibited words. Please remove them and try again.');
            return;
          }
        setIsLoading(true);
        setAdvices([]); // Clear previous advices

        // Scroll to loader after a short delay to ensure it's rendered
        setTimeout(() => {
            loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }

        try {
            const response = await axios.post(`${BASE_URL}/response/finance?clerkId=${userId}`, {
                description,
                amount: parseFloat(amount) || 0,
                language,
                outputCount,
            });

            if (response.status === 200) {
                setAdvices(response.data.advice);
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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Advice copied to clipboard');
    };

    const handleShare = (text: string) => {
        if (navigator.share) {
            navigator.share({
                title: 'Financial Advice',
                text,
            }).then(() => {
                toast.success('Advice shared successfully');
            }).catch((error) => {
                console.error('Error sharing advice:', error);
                toast.error('Error sharing advice');
            });
        } else {
            toast.error('Web Share API not supported in this browser');
        }
    };

    const handleDownload = (text: string) => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'financial_advice.txt';
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        toast.success('Advice downloaded');
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
        if (!isLoading && advices.length > 0 && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, advices]);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
            <div className="mb-5">
                <label className="block text-[var(--primary-text-color)]">What’s Your Goal?</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter what financial help you need (e.g., Saving for retirement, Managing debt)"
                    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)]  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                />
            </div>

            <div className="mb-5">
                <label className="block text-[var(--primary-text-color)]"> Amount to Invest or Save</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the amount (e.g., $5000, $100 per month)"
                    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)]  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                />
            </div>

            <div className="mb-5">
                <label className="block text-[var(--primary-text-color)]">Select Language</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)]  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                >
                    {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
                <input
                    type="number"
                    value={outputCount}
                    onChange={(e) => setOutputCount(parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)]  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                />
            </div>

            <div className="mt-5 flex justify-center">
                <button
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : advices.length > 0 ? 'Regenerate' : 'Generate'}
                </button>
            </div>

            <div className="mt-5">
                {isLoading ? (
                    <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
                    <BigwigLoader />
                    <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
                  </div>
                ) : (
                    <div>
                        {advices.map((advice, index) => (
                            <div key={index} className="border border-[var(--primary-text-color)]  rounded-md p-4 mb-4 max-h-80 overflow-y-auto">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-[var(--primary-text-color)]">Generated Financial Advice {index + 1}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopy(advice)}
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                                        title='Copy'>
                                            <ClipboardCopy className="inline-block w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(advice)}
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                                        title='Download'>
                                            <Download className="inline-block w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleShare(advice)}
                                            className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                                        title='Share'>
                                            <Share2 className="inline-block w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="whitespace-pre-wrap text-[var(--primary-text-color)]">
                                    {advice}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div ref={resultsRef}></div>
            {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
        </div>
    );
}
