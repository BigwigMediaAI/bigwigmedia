import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons"; // Fixed typo in import path
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import CreditLimitModal from './Model3';

export function VideoPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [mainObject, setMainObject] = useState('');
  const [style, setStyle] = useState('');
  const [mood, setmood] = useState('');
  const [cameraAngles, setcameraAngles] = useState('');
  const [sceneType, setsceneType] = useState('');
  const [duration, setDuration] = useState(0);
  const [language, setLanguage] = useState('English');
  const [outputCount, setOutputCount] = useState(1);
  const [generatedPrompt, setGeneratedPrompt] = useState<string[]>([]);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();     
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const handleGenerate = async () => {
    if (
      !validateInput(mainObject) ||
      !validateInput(cameraAngles)||
      !validateInput(sceneType)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompt([]);

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/GenerateVideoPromptContent?clerkId=${userId}`, {
        mainObject,
        style,
        mood,
        cameraAngles,
        sceneType,
        duration,
        language,
        outputCount,
      });

      if (response.status === 200) {
        setGeneratedPrompt(response.data);
      } else {
        toast.error('Error generating prompt. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Error generating prompt. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && generatedPrompt.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedPrompt]);

  const languages = [
    { value: 'Select Language', label: 'Select Language'},
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
    { value: 'Zulu', label: 'Zulu' }
  ];

  const outputCounts = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  const handleCopy = (titleContent: string) => {
    navigator.clipboard.writeText(titleContent);
    toast.success('Prompt copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "prompt.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element); // Clean up
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Prompt',
      text: generatedPrompt.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing prompt:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Describes the central focus of the Video (e.g., person, object)
        </label>
        <input
          type="text"
          value={mainObject}
          onChange={(e) => setMainObject(e.target.value)}
          placeholder="E.g., a lone tree"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Camera Angles or Perspectives</label>
        <input
          type="text"
          value={cameraAngles}
          onChange={(e) => setcameraAngles(e.target.value)}
          placeholder="E.g., overhead view, close-up, wide angle"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Scene Type or Background of the Video</label>
        <input
          type="text"
          value={sceneType}
          onChange={(e) => setsceneType(e.target.value)}
          placeholder="E.g., a bustling city street, tranquil forest"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value={5}>5 sec</option>
          <option value={10}>10 sec</option>
          <option value={15}>15 sec</option>
          <option value={20}>20 sec</option>
        </select>
      </div>

      <div className='flex gap-3 w-full'>
      <div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value="">Select Style</option>
          <option value="cinematic">Cinematic</option>
          <option value="documentary">Documentary</option>
          <option value="vlog">Vlog</option>
          <option value="animated">Animated</option>
          <option value="stopMotion">Stop Motion</option>
          <option value="timeLapse">Time-Lapse</option>
          <option value="tutorial">Tutorial</option>
          <option value="interview">Interview</option>
          <option value="promo">Promotional</option>
          <option value="musicVideo">Music Video</option>
          <option value="montage">Montage</option>
          <option value="narrative">Narrative</option>
          <option value="liveStream">Live Stream</option>
          <option value="explainer">Explainer</option>
          <option value="commercial">Commercial</option>
          <option value="testimonial">Testimonial</option>
          <option value="bRoll">B-Roll</option>
          <option value="behindTheScenes">Behind the Scenes</option>
          <option value="socialMedia">Social Media Short</option>
          <option value="experimental">Experimental</option>
        </select>
      </div>


      <div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select mood</label>
        <select
          value={mood}
          onChange={(e) => setmood(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value="">Select Mood</option>
          <option value="Calm and Peaceful">Calm and Peaceful</option>
          <option value="Energetic and Vibrant">Energetic and Vibrant</option>
          <option value="Dark and Moody">Dark and Moody</option>
          <option value="Warm and Cozy">Warm and Cozy</option>
          <option value="Mysterious and Intriguing">Mysterious and Intriguing</option>
          <option value="Romantic and Dreamy">Romantic and Dreamy</option>
          <option value="Playful and Fun">Playful and Fun</option>
          <option value="Ethereal and Surreal">Ethereal and Surreal</option>
          <option value="Melancholic and Somber">Melancholic and Somber</option>
          <option value="Bold and Dramatic">Bold and Dramatic</option>
          <option value="Serene and Tranquil">Serene and Tranquil</option>
          <option value="Joyful and Uplifting">Joyful and Uplifting</option>
          <option value="Nostalgic and Reflective">Nostalgic and Reflective</option>
          <option value="Tense and Suspenseful">Tense and Suspenseful</option>
          <option value="Bright and Cheerful">Bright and Cheerful</option>
          <option value="Chill and Relaxed">Chill and Relaxed</option>
          <option value="Majestic and Grand">Majestic and Grand</option>
          <option value="Gritty and Realistic">Gritty and Realistic</option>
          <option value="Euphoric and Blissful">Euphoric and Blissful</option>
          <option value="Mystical and Enchanting">Mystical and Enchanting</option>
          <option value="Weird and Quirky">Weird and Quirky</option>
          <option value="Rebellious and Defiant">Rebellious and Defiant</option>
          <option value="Cold and Isolated">Cold and Isolated</option>
          <option value="Festive and Celebratory">Festive and Celebratory</option>
          <option value="Thoughtful and Contemplative">Thoughtful and Contemplative</option>
        </select>
      </div>
      </div>
      
      <div className='flex gap-3 w-full'>
      <div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
      </div>
      <div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
      </div>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedPrompt.length > 0 ? "Regenerate" : 'Generate')}
        </button>
      </div>
      <div className="mt-5">
        {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
        ) : (
            generatedPrompt.length > 0 && (
            <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
                <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl text-[var(--primary-text-color)] ">Generated Prompt</h1>
                <div className="flex gap-2">
                    <button
                    onClick={handleShare}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    title="Share"
                    >
                    <Share2 />
                    </button>
                    <button
                    onClick={handleDownload}
                    className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                    title="Download"
                    >
                    <Download />
                    </button>
                </div>
                </div>
                <div className="flex flex-col gap-4 max-h-[600px] overflow-auto">
              {generatedPrompt.map((post, index) => (
          <div key={index} className="border border-[var(--primary-text-color)] p-4 rounded-lg mb-4 relative ">
            <div className="flex justify-between items-center mb-2">
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={() => handleCopy(post)}
                  className="text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)] cursor-pointer"
                  title="Copy"
                >
                  <Copy />
                </button>
              </div>
            </div>
            <p className="text-[var(--primary-text-color)] whitespace-pre-wrap">{post}</p>
          </div>
        ))}
        </div>
                
            </div>
            )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}