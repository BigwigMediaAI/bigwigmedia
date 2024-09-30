import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CopyIcon, Share2, Download } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3"; // Ensure the BASE_URL is correct
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

export function CoverLetterGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [highlights, setHighlights] = useState('');
  const [language, setLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(1);
  const [coverLetters, setCoverLetters] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\+?[1-9]\d{1,14}$/; // International phone number validation
    return re.test(phone);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setCoverLetters([]); // Clear previous cover letters
    if (!jobDescription || !userName || !userEmail || !userPhone) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(userEmail)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!validatePhone(userPhone)) {
      toast.error("Please enter a valid phone number");
      setIsLoading(false);
      return;
    }

    if (!validateInput(jobDescription) || !validateInput(userName) || !validateInput(highlights)) {
      toast.error("Please remove any prohibited words from the input fields");
      setIsLoading(false);
      return;
    }

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
      const response = await axios.post(`${BASE_URL}/response/generateCoverLetter?clerkId=${userId}`, {
        jobDescription,
        userDetails: {
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress
        },
        highlights,
        language,
        outputCount
      });
        console.log(response.data)
      if (response.status === 200) {
        setCoverLetters(response.data);
      } else {
        toast.error('Error generating cover letter. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Error generating cover letter. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (coverLetter: string) => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      toast.success('Cover letter copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy cover letter');
    }
  };

  useEffect(() => {
    if (!isLoading && coverLetters.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, coverLetters]);

  const handleShare = () => {
    const textToShare = coverLetters.join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'cover letter',
        text: textToShare,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(textToShare).then(() => {
        toast.success('cover letter copied to clipboard');
      }).catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy cover letter to clipboard');
      });
    }
  };

  const handleDownload = () => {
    const textToDownload = coverLetters.join('\n');
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
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">
    Job Description (Responsibilities and Requirements)
  </label>
  <textarea
    value={jobDescription}
    onChange={(e) => setJobDescription(e.target.value)}
    placeholder="e.g., Seeking an experienced full-stack developer with proficiency in JavaScript, Node.js, and React. Responsibilities include designing scalable web applications and collaborating with cross-functional teams."
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>

<div className="mb-5">
  <label className="block text-[var(--primary-text-color)] ">
    Enter Your Full Name (As it appears on official documents)
  </label>
  <input
    type="text"
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
    placeholder="e.g., John Doe"
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>


<div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">
    Enter Your Email Address
  </label>
  <input
    type="email"
    value={userEmail}
    onChange={(e) => setUserEmail(e.target.value)}
    placeholder="e.g., john.doe@example.com"
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>

<div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">
    Enter Your Phone Number
  </label>
  <input
    type="tel"
    value={userPhone}
    onChange={(e) => setUserPhone(e.target.value)}
    placeholder="e.g., +1 (123) 456-7890"
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>

<div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">
    Enter Your Address (Optional)
  </label>
  <input
    type="text"
    value={userAddress}
    onChange={(e) => setUserAddress(e.target.value)}
    placeholder="e.g., 1234 Elm St, Springfield, IL"
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>


<div className="mb-5">
  <label className="block text-[var(--primary-text-color)]">
    Enter Key Highlights / Achievements
  </label>
  <textarea
    value={highlights}
    onChange={(e) => setHighlights(e.target.value)}
    placeholder="e.g., Led development of large-scale web applications, reduced page load times by 30%, recognized for outstanding problem-solving skills"
    className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
  />
</div>


      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  px-3 py-2"
        >
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
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
        <input
          type="number"
          value={outputCount}
          onChange={(e) => setOutputCount(parseInt(e.target.value))}
          placeholder="Enter number of outputs (e.g., 1)"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm focus:border-indigo-500 focus:ring-indigo-500  px-3 py-2"
        />
      </div>

      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader styleType="cube" />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          <div>
            {coverLetters.length > 0 && coverLetters.map((letter, index) => (
              <div key={index} ref={resultsRef} className='border  border-[var(--primary-text-color)] rounded-md p-5 relative mb-5'>
                <h3 className="text-[var(--primary-text-color)]">Generated Cover Letter {index + 1}:</h3>
                <div className="mt-2 p-4 rounded-md">
                  {letter.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="text-[var(--primary-text-color)]">{line}</p>
                  ))}
                </div>
                <div className='flex justify-center items-center mt-4'>
                <button
                  className="absolute top-2 right-2 rounded-md p-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                  onClick={() => handleCopy(letter)}
                title='Copy'>
                  <CopyIcon className="h-5 w-5" />
                </button>
                <button
                    className="absolute top-2 right-10 rounded-md p-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleShare}
                  title='Share'>
                   <Share2/>
                  </button>
                  <button
                    className="absolute top-2 right-20 rounded-md p-2 text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]"
                    onClick={handleDownload}
                  title='Download'>
                    <Download/>
                  </button>
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
