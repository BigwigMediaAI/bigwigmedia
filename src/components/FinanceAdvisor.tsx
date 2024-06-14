import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Copy } from 'lucide-react';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

export function FinanceAdvisor() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [advice, setAdvice] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/response/finance?clerkId=${userId}`, {
        description,
        amount: parseFloat(amount) || 0
      });

      setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      if (response.status === 200) {
        setAdvice(response.data.advice);
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

  useEffect(() => {
    if (!isLoading && advice) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, advice]);

  const handleCopy = () => {
    navigator.clipboard.writeText(advice);
    toast.success('Advice copied to clipboard');
  };

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
            {advice && (
              <div ref={resultsRef} className='border border-gray-300 rounded-md p-5'style={{ height: '300px', overflowY: 'scroll' }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-gray-700 dark:text-gray-300">Generated Financial Advice:</h3>
                  <button onClick={handleCopy} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mt-2">
                  {advice}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
