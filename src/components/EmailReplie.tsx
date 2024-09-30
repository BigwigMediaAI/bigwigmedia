import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import CreditLimitModal from "./Model3";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

export function GenerateEmailReplie() {
  const [isLoading, setIsLoading] = useState(false);
  const [to, setTo] = useState('');
  const [receivedEmail, setreceivedEmail] = useState('');
  const [replyIntent, setreplyIntent] = useState('');
  const [tone, setTone] = useState('');
  const [language, setLanguage] = useState('en');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [credits, setCredits] = useState(0);

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
    if (!validateInput(receivedEmail)) {
      toast.error('Your input contains prohibited words. Please correct them.');
      return;
    }
    setIsLoading(true);
    setGeneratedEmails([]);
    const currentCredits = await getCredits();

    if (currentCredits <= 0) {
      setShowModal(true);
      setIsLoading(false);
      return;
    }
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);

    try {
      const response = await axios.post(`${BASE_URL}/response/generateemailreplie?clerkId=${userId}`, {
        to, receivedEmail, tone, language, outputCount,replyIntent
      });

      if (response.status === 200) {
        setGeneratedEmails(response.data.emails);
      } else {
        toast.error('Error generating email. Try again later.');
      }
    } catch (error) {
      toast.error('Error generating email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedEmails.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "generated_email.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Generated Email',
      text: generatedEmails.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing email:', err);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedEmails.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedEmails]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-gray-700">Enter the recipient's email address you want to reply to:</label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="example@example.com"
          className="w-full p-3 border rounded-md shadow-sm"
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700">Paste the original email which you received :</label>
        <textarea
          value={receivedEmail}
          onChange={(e) => setreceivedEmail(e.target.value)}
          placeholder="Thank you for your message. I wanted to ask for a follow-up on our project."
          className="w-full p-3 border rounded-md shadow-sm"
          rows={4}
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700">What you want to reply : </label>
        <textarea
          value={replyIntent}
          onChange={(e) => setreplyIntent(e.target.value)}
          placeholder=""
          className="w-full p-3 border rounded-md shadow-sm"
          rows={4}
        />
      </div>
      <div className="mb-5">
        <label className="block text-gray-700">Select Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm"
        >
          <option value="">Select tone</option>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="polite">Polite</option>
            <option value="friendly">Friendly</option>
            <option value="confident">Confident</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="empathetic">Empathetic</option>
            <option value="persuasive">Persuasive</option>
            <option value="direct">Direct</option>
            <option value="neutral">Neutral</option>
            <option value="apologetic">Apologetic</option>
            <option value="encouraging">Encouraging</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm"
        >
          <option value="af">Afrikaans</option>
          <option value="sq">Albanian</option>
          <option value="am">Amharic</option>
          <option value="ar">Arabic</option>
          <option value="hy">Armenian</option>
          <option value="az">Azerbaijani</option>
          <option value="eu">Basque</option>
          <option value="be">Belarusian</option>
          <option value="bn">Bengali</option>
          <option value="bs">Bosnian</option>
          <option value="bg">Bulgarian</option>
          <option value="ca">Catalan</option>
          <option value="ceb">Cebuano</option>
          <option value="ny">Chichewa</option>
          <option value="zh">Chinese (Simplified)</option>
          <option value="zh-TW">Chinese (Traditional)</option>
          <option value="co">Corsican</option>
          <option value="hr">Croatian</option>
          <option value="cs">Czech</option>
          <option value="da">Danish</option>
          <option value="nl">Dutch</option>
          <option value="en">English</option>
          <option value="eo">Esperanto</option>
          <option value="et">Estonian</option>
          <option value="tl">Filipino</option>
          <option value="fi">Finnish</option>
          <option value="fr">French</option>
          <option value="fy">Frisian</option>
          <option value="gl">Galician</option>
          <option value="ka">Georgian</option>
          <option value="de">German</option>
          <option value="el">Greek</option>
          <option value="gu">Gujarati</option>
          <option value="ht">Haitian Creole</option>
          <option value="ha">Hausa</option>
          <option value="haw">Hawaiian</option>
          <option value="he">Hebrew</option>
          <option value="hi">Hindi</option>
          <option value="hmn">Hmong</option>
          <option value="hu">Hungarian</option>
          <option value="is">Icelandic</option>
          <option value="ig">Igbo</option>
          <option value="id">Indonesian</option>
          <option value="ga">Irish</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="jv">Javanese</option>
          <option value="kn">Kannada</option>
          <option value="kk">Kazakh</option>
          <option value="km">Khmer</option>
          <option value="rw">Kinyarwanda</option>
          <option value="ko">Korean</option>
          <option value="ku">Kurdish (Kurmanji)</option>
          <option value="ky">Kyrgyz</option>
          <option value="lo">Lao</option>
          <option value="la">Latin</option>
          <option value="lv">Latvian</option>
          <option value="lt">Lithuanian</option>
          <option value="lb">Luxembourgish</option>
          <option value="mk">Macedonian</option>
          <option value="mg">Malagasy</option>
          <option value="ms">Malay</option>
          <option value="ml">Malayalam</option>
          <option value="mt">Maltese</option>
          <option value="mi">Maori</option>
          <option value="mr">Marathi</option>
          <option value="mn">Mongolian</option>
          <option value="my">Myanmar (Burmese)</option>
          <option value="ne">Nepali</option>
          <option value="no">Norwegian</option>
          <option value="or">Odia (Oriya)</option>
          <option value="ps">Pashto</option>
          <option value="fa">Persian</option>
          <option value="pl">Polish</option>
          <option value="pt">Portuguese</option>
          <option value="pa">Punjabi</option>
          <option value="ro">Romanian</option>
          <option value="ru">Russian</option>
          <option value="sm">Samoan</option>
          <option value="gd">Scots Gaelic</option>
          <option value="sr">Serbian</option>
          <option value="st">Sesotho</option>
          <option value="sn">Shona</option>
          <option value="sd">Sindhi</option>
          <option value="si">Sinhala</option>
          <option value="sk">Slovak</option>
          <option value="sl">Slovenian</option>
          <option value="so">Somali</option>
          <option value="es">Spanish</option>
          <option value="su">Sundanese</option>
          <option value="sw">Swahili</option>
          <option value="sv">Swedish</option>
          <option value="tg">Tajik</option>
          <option value="ta">Tamil</option>
          <option value="tt">Tatar</option>
          <option value="te">Telugu</option>
          <option value="th">Thai</option>
          <option value="tr">Turkish</option>
          <option value="tk">Turkmen</option>
          <option value="uk">Ukrainian</option>
          <option value="ur">Urdu</option>
          <option value="ug">Uyghur</option>
          <option value="uz">Uzbek</option>
          <option value="vi">Vietnamese</option>
          <option value="cy">Welsh</option>
          <option value="xh">Xhosa</option>
          <option value="yi">Yiddish</option>
          <option value="yo">Yoruba</option>
          <option value="zu">Zulu</option>
          {/* Add more languages */}
        </select>
      </div>
      <div className="mb-5">
        <label className="block text-gray-700">Select Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="w-full p-3 border rounded-md shadow-sm"
        >
          {[1, 2, 3, 4, 5].map((count) => (
            <option key={count} value={count}>{count}</option>
          ))}
        </select>
      </div>
      <div className="text-center">
        <button
          onClick={handleGenerate}
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedEmails.length > 0 ? "Regenerate" : 'Generate')}
        </button>
      </div>

      {isLoading && (
      <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
      <BigwigLoader styleType="cube" />
      <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
      )}

      {generatedEmails.length > 0 && (
        <div ref={resultsRef} className="mt-5 border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Generated Emails</h2>
            <div className="flex gap-2">
                    <button
                    onClick={handleShare}
                    className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                    title="Share"
                    >
                    <Share2 />
                    </button>
                    <button
                    onClick={handleDownload}
                    className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                    title="Download"
                    >
                    <Download />
                    </button>
                </div>
          </div>
          <div className="space-y-4">
            {generatedEmails.map((email, idx) => (
              <div key={idx} className="border border-[var(--primary-text-color)] p-4 rounded-lg mb-4 relative ">
              <div className="flex justify-between items-center mb-2">
                <div className="absolute top-2 right-2 space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(email)}
                    className="text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]  cursor-pointer"
                    title="Copy"
                  >
                    <Copy />
                  </button>
                </div>
              </div>
              <p className="text-[var(--primary-text-color)]  whitespace-pre-wrap">{email}</p>
            </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <CreditLimitModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
}
