import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ClipboardCopyIcon, DownloadIcon, ShareIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import { validateInput } from '@/utils/validateInput';

export function YouTubeScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [language, setLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateScript = async () => {
    setIsLoading(true);
    if (!topic || !tone || !length || !language) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }
    if (
      !validateInput(topic)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
    setScript("")

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const res = await axios.post(`${BASE_URL}/response/youtubescript?clerkId=${userId}`, {
        topic,
        tone,
        length,
        language
      });
      if (res.status === 200) {
        setScript(res.data.script);
      } else {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    try {
      navigator.clipboard.writeText(script);
      toast.success('Script copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy script');
    }
  };

  const handleShareScript = () => {
    if (navigator.share) {
      navigator.share({
        title: 'YouTube Script',
        text: script
      }).then(() => {
        toast.success('Script shared successfully');
      }).catch((error) => {
        toast.error('Failed to share script');
      });
    } else {
      toast.error('Share feature is not supported in this browser');
    }
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "YouTubeScript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Script downloaded');
  };

  useEffect(() => {
    if (!isLoading && script.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, script]);

  useEffect(() => {
    setScript('');
  }, [topic, tone, length, language]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter topic (e.g., How to bake a cake)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border border-[var(--primary-text-color)] rounded-md p-3 "
        />
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border border-[var(--primary-text-color)] rounded-md p-3 "
        >
          <option value="">Select tone</option>
          <option value="Informative and Friendly">Informative and Friendly</option>
          <option value="Professional and Authoritative">Professional and Authoritative</option>
          <option value="Casual and Conversational">Casual and Conversational</option>
          <option value="Energetic and Exciting">Energetic and Exciting</option>
          <option value="Serious and Formal">Serious and Formal</option>
        </select>
        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="border border-[var(--primary-text-color)] rounded-md p-3 "
        >
          <option value="">Select length</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-[var(--primary-text-color)] rounded-md p-3 "
        >
          <option value="">Select language</option>
<option value="Afrikaans">Afrikaans</option>
<option value="Albanian">Albanian</option>
<option value="Amharic">Amharic</option>
<option value="Arabic">Arabic</option>
<option value="Armenian">Armenian</option>
<option value="Azerbaijani">Azerbaijani</option>
<option value="Basque">Basque</option>
<option value="Belarusian">Belarusian</option>
<option value="Bengali">Bengali</option>
<option value="Bosnian">Bosnian</option>
<option value="Bulgarian">Bulgarian</option>
<option value="Catalan">Catalan</option>
<option value="Cebuano">Cebuano</option>
<option value="Chichewa">Chichewa</option>
<option value="Chinese (Simplified)">Chinese (Simplified)</option>
<option value="Chinese (Traditional)">Chinese (Traditional)</option>
<option value="Corsican">Corsican</option>
<option value="Croatian">Croatian</option>
<option value="Czech">Czech</option>
<option value="Danish">Danish</option>
<option value="Dutch">Dutch</option>
<option value="English">English</option>
<option value="Esperanto">Esperanto</option>
<option value="Estonian">Estonian</option>
<option value="Filipino">Filipino</option>
<option value="Finnish">Finnish</option>
<option value="French">French</option>
<option value="Frisian">Frisian</option>
<option value="Galician">Galician</option>
<option value="Georgian">Georgian</option>
<option value="German">German</option>
<option value="Greek">Greek</option>
<option value="Gujarati">Gujarati</option>
<option value="Haitian Creole">Haitian Creole</option>
<option value="Hausa">Hausa</option>
<option value="Hawaiian">Hawaiian</option>
<option value="Hebrew">Hebrew</option>
<option value="Hindi">Hindi</option>
<option value="Hmong">Hmong</option>
<option value="Hungarian">Hungarian</option>
<option value="Icelandic">Icelandic</option>
<option value="Igbo">Igbo</option>
<option value="Indonesian">Indonesian</option>
<option value="Irish">Irish</option>
<option value="Italian">Italian</option>
<option value="Japanese">Japanese</option>
<option value="Javanese">Javanese</option>
<option value="Kannada">Kannada</option>
<option value="Kazakh">Kazakh</option>
<option value="Khmer">Khmer</option>
<option value="Kinyarwanda">Kinyarwanda</option>
<option value="Korean">Korean</option>
<option value="Kurdish (Kurmanji)">Kurdish (Kurmanji)</option>
<option value="Kyrgyz">Kyrgyz</option>
<option value="Lao">Lao</option>
<option value="Latin">Latin</option>
<option value="Latvian">Latvian</option>
<option value="Lithuanian">Lithuanian</option>
<option value="Luxembourgish">Luxembourgish</option>
<option value="Macedonian">Macedonian</option>
<option value="Malagasy">Malagasy</option>
<option value="Malay">Malay</option>
<option value="Malayalam">Malayalam</option>
<option value="Maltese">Maltese</option>
<option value="Maori">Maori</option>
<option value="Marathi">Marathi</option>
<option value="Mongolian">Mongolian</option>
<option value="Myanmar (Burmese)">Myanmar (Burmese)</option>
<option value="Nepali">Nepali</option>
<option value="Norwegian">Norwegian</option>
<option value="Odia (Oriya)">Odia (Oriya)</option>
<option value="Pashto">Pashto</option>
<option value="Persian">Persian</option>
<option value="Polish">Polish</option>
<option value="Portuguese">Portuguese</option>
<option value="Punjabi">Punjabi</option>
<option value="Romanian">Romanian</option>
<option value="Russian">Russian</option>
<option value="Samoan">Samoan</option>
<option value="Scots Gaelic">Scots Gaelic</option>
<option value="Serbian">Serbian</option>
<option value="Sesotho">Sesotho</option>
<option value="Shona">Shona</option>
<option value="Sindhi">Sindhi</option>
<option value="Sinhala">Sinhala</option>
<option value="Slovak">Slovak</option>
<option value="Slovenian">Slovenian</option>
<option value="Somali">Somali</option>
<option value="Spanish">Spanish</option>
<option value="Sundanese">Sundanese</option>
<option value="Swahili">Swahili</option>
<option value="Swedish">Swedish</option>
<option value="Tajik">Tajik</option>
<option value="Tamil">Tamil</option>
<option value="Tatar">Tatar</option>
<option value="Telugu">Telugu</option>
<option value="Thai">Thai</option>
<option value="Turkish">Turkish</option>
<option value="Turkmen">Turkmen</option>
<option value="Ukrainian">Ukrainian</option>
<option value="Urdu">Urdu</option>
<option value="Uyghur">Uyghur</option>
<option value="Uzbek">Uzbek</option>
<option value="Vietnamese">Vietnamese</option>
<option value="Welsh">Welsh</option>
<option value="Xhosa">Xhosa</option>
<option value="Yiddish">Yiddish</option>
<option value="Yoruba">Yoruba</option>
<option value="Zulu">Zulu</option>

        </select>
        <p className="text-base text-gray-400 mt-2">
        👉 Try a few combinations to generate the best script for your needs.
        </p>
        <button
          onClick={handleGenerateScript}
          className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? "Generating..." :(script?"Regenerate":'Generate') }
        </button>
      </div>
      {isLoading && (
        <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
        </div>
      )}
      {script && (
        <div ref={resultsRef} className="mt-6 max-h-[500px] rounded-md p-5 overflow-y-auto border border-[var(--primary-text-color)]">
          <h3 className="text-xl font-semibold mb-4">Generated Script</h3>
          <div className="border border-[var(--primary-text-color)] rounded-md p-4  relative overflow-x-auto max-w-full">
            <pre className="whitespace-pre-wrap mt-5">{script}</pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleCopyScript}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
              title='Copy'>
                <ClipboardCopyIcon className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadScript}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
              title='Download' >
                <FaDownload className="inline-block w-5 h-5" />
              </button>
              <button
                onClick={handleShareScript}
                className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] rounded-md px-3 py-1  "
              title='Share'>
                <FaShareAlt className="inline-block w-5 h-5" />
              </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
