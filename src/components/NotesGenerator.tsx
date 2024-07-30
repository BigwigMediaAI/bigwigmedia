import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardCopyIcon, CopyIcon, Download, Loader2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/funcitons'; // Corrected import path
import { useAuth } from '@clerk/clerk-react';
import { validateInput } from '@/utils/validateInput';

interface NotesSummary {
  [key: string]: string[] | string;
}

interface NotesResponse {
  summary: NotesSummary;
}

export function NotesGenerator() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<NotesSummary | null>(null);
  const [language, setLanguage] = useState('English'); // Default language
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);

  const handlePaste = async () => {
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
  };

  const handleSubmit = async () => {
    if (
      !validateInput(text)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setIsLoading(true);
    setSummary(null);
    if (!text) {
      toast.error('Please enter the text to generate quick notes');
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/response/getNotesSummary?clerkId=${userId}`,
        { notes: text, language: language.toLowerCase() } // Pass language to backend
      );

      if (res.status === 200) {
        setSummary(res.data.summary.Key_Points);
        setIsLoading(false);
      } else {
        toast.error('Failed to fetch summary');
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;

    let formattedText = '';

    Object.entries(summary).forEach(([sectionKey, sectionContent]) => {
      formattedText += `${sectionKey}:\n`;
      if (Array.isArray(sectionContent)) {
        sectionContent.forEach((item) => {
          formattedText += `- ${item}\n`;
        });
      } else {
        formattedText += `- ${sectionContent}\n`;
      }
      formattedText += '\n';
    });

    try {
      navigator.clipboard.writeText(formattedText.trim());
      toast.success('Copied to Clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setSummary(null);
  };

  const renderSummary = () => {
    if (!summary) return null;

    const summaryArray = Object.entries(summary);
    const handleShare = () => {
      const textToShare = summaryArray.join('\n');
      if (navigator.share) {
        navigator.share({
          title: 'Generated Domain Names',
          text: textToShare,
        }).catch((error) => console.error('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(textToShare).then(() => {
          toast.success('Domain names copied to clipboard');
        }).catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast.error('Failed to copy domain names to clipboard');
        });
      }
    };
  
    const handleDownload = () => {
      const textToDownload = summaryArray.join('\n');
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'domain-names.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    const handleCopyEvent = (e: ClipboardEvent) => {
      const selectedText = window.getSelection()?.toString() || '';
      if (selectedText) {
          e.clipboardData?.setData('text/plain', selectedText);
          e.preventDefault();
      }
  };
  
  document.addEventListener('copy', handleCopyEvent);

    return (
      <div className="h-44 w-full rounded-md border-2 border-gray-300 dark:text-gray-200 text-gray-800 p-5 overflow-y-scroll relative">
        {summaryArray.map(([sectionKey, sectionContent], sectionIndex) => (
          <div key={sectionIndex}>
            <strong>{sectionKey}:</strong>
            {Array.isArray(sectionContent) ? (
              sectionContent.map((item, index) => (
                <p key={index}>- {item}</p>
              ))
            ) : (
              <p>- {sectionContent}</p>
            )}
          </div>
        ))}
        <Button
          className="absolute top-2 right-2 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
          variant="ghost"
          onClick={handleCopy}
        title='Copy'>
          <CopyIcon className="h-5 w-5" />
        </Button>
        <button
                    className="absolute top-2 right-10 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleShare}
                  title='Share'>
                   <Share2/>
                  </button>
                  <button
                    className="absolute top-2 right-20 rounded-md px-2 py-1 text-gray-600 hover:dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-100"
                    onClick={handleDownload}
                 title='Download' >
                    <Download/>
                  </button>
      </div>
    );
  };

  useEffect(() => {
    if (isLoading) {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg dark:bg-[#262626] bg-white p-6 shadow-lg">
      <div className="flex flex-col">
        <Textarea
          className="mb-4 h-40 w-full rounded-md border-2 dark:bg-[#262626] border-gray-300 p-4"
          placeholder="Enter Text to Generate Quick Notes."
          value={text}
          onChange={handleTextChange}
        />
        <div className="flex items-center justify-between mb-4">
          <Button
            className="rounded-md px-4 py-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
            variant="ghost"
            onClick={handlePaste}>
            <ClipboardCopyIcon className="mr-2 h-5 w-5" />
            Paste Text
          </Button>
          <select
            className="border-2 border-gray-300 dark:bg-[#262626] rounded-md py-2 px-4 text-gray-600 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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

            {/* Add more languages as needed */}
            <option value="hindi">Hindi</option>
            <option value="tamil">Tamil</option>
            {/* Add more Indian languages */}
          </select>
        </div>
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-gray-400" />
            <p className="text-gray-400 text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          summary && (
            <div className="flex flex-col gap-2 mt-4">
              {renderSummary()}
              <Button
                className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto mt-4"
                onClick={handleSubmit}
              >
                Regenerate
              </Button>
            </div>
          )
        )}
        {!isLoading && !summary && (
          <Button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              'Generate'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
