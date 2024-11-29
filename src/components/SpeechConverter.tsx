import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { ClipboardPasteIcon, Mic, MicOff } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import CreditLimitModal from './Model3';
import '../App.css'
import BigwigLoader from '@/pages/Loader';
import beep from "../assets/beep.mp3";


const SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();




export function TranslatorAudio() {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [text, settext] = useState('');
  const [tone, setTone] = useState('nova');
  const [targetLanguage, settargetLanguage] = useState('English');
  const [audioUrl, setAudioUrl] = useState("");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const [recognition, setRecognition] = useState<typeof SpeechRecognition  | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition() as typeof SpeechRecognition ;
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-US';

      speechRecognition.onstart = () => {
        setIsRecording(true);
      };

      speechRecognition.onresult = (event: typeof SpeechRecognition ) => {
        const speechToText = event.results[0][0].transcript;
        settext(speechToText);
      };


      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(speechRecognition);
    } else {
      toast.error("Sorry, your browser doesn't support speech recognition.");
    }
  }, []);

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

  const handleStartRecording = () => {
    if (recognition) {
      recognition.start();
      if (beepRef.current) {
        beepRef.current.play();
      }
    }
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleGenerate = async () => {
    if (!validateInput(text)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }
  
    setIsLoading(true);
    setAudioUrl("");  // Clear previous audio URL
  
    // Scroll to the loader after a small delay
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      // Check credits before proceeding
      const currentCredits = await getCredits();
      console.log('Current Credits:', currentCredits);
  
      if (currentCredits <= 0) {
        // Show modal if no credits available and stop loading
        setTimeout(() => setShowModal3(true), 0);
        setIsLoading(false);
        return;
      }
  
      // Make API call to generate speech, expecting binary audio data
      const response = await axios.post(`${BASE_URL}/response/speech?clerkId=${userId}`, {
        text,
        tone,
        targetLanguage
      }, {
        responseType: 'blob'  // Ensure response is treated as a Blob (binary data)
      });
  
      if (response.status === 200) {
        // Create a URL for the audio Blob and set it in state
        const audioUrl = URL.createObjectURL(response.data);
        console.log('Generated Audio URL:', audioUrl);
        setAudioUrl(audioUrl);  // Set the audio URL in state to be used in the UI
      } else {
        toast.error('Error generating intro. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating intro:', error);
      toast.error('Error generating intro. Please try again later.');
    } finally {
      setIsLoading(false);  // Stop the loader
    }
  };
  

  useEffect(() => {
    if (!isLoading && audioUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, audioUrl]);

  const tones = [
    { value: 'nova', label: 'nova' },
    { value: 'shimmer', label: 'shimmer' },
    { value: 'onyx', label: 'onyx' },
    { value: 'echo', label: 'echo' },
    { value: 'fable', label: 'fable' },
    { value: 'alloy', label: 'alloy' }
  ];

  const targetLanguages = [
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


  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      settext((prevText) => prevText + clipboardText); // Append pasted text to existing text
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
    }
  };
  



  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-md shadow-[var(--teal-color)]">
        <div className='flex items-center gap-3 mb-3'>
      <div className='w-2/3'>
        <textarea
          value={text}
          onChange={(e) => settext(e.target.value)}
          placeholder="Write or Paste your text, or click the mic and speak after the beep"
          className="mt-1 block w-full rounded-md border-1 border-[var(--primary-text-color)] shadow-sm p-3"
          rows={3}
        />
      </div>

        {/* Record Button */}
        <div className="flex items-center justify-center w-1/3">
        <button
          className="text-gray-600 text-center font-outfit md:text-lg flex relative text-xs mt-3 py-3 px-7 md:px-7 justify-center items-center gap-5 flex-shrink-0 rounded-full border border-gray-500 w-fit mx-auto"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? <MicOff /> : <Mic />}
          <span className="hidden md:block">
        {isRecording ? "Listening..." : "Speak"}
      </span>
          {isRecording && (
            <div className="ml-2 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          )}
        </button>


      {/* Beep Sound */}
      <audio ref={beepRef} src={beep} />
        </div>
        </div>

        <div className='flex justify-start mb-5'>
  <button
    onClick={handlePaste}
    className="flex items-center text-gray-600 font-semibold text-sm gap-2 mt-2 hover:text-gray-800"
  >
    <ClipboardPasteIcon className="w-5 h-5" /> {/* Replace with the actual icon component */}
    Paste
  </button>
</div>


      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Target Language</label>
        <select
          value={targetLanguage}
          onChange={(e) => settargetLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {targetLanguages.map((targetLanguageOption) => (
            <option key={targetLanguageOption.value} value={targetLanguageOption.value}>
              {targetLanguageOption.label}
            </option>
          ))}
        </select>
      </div>
      
      
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>
              {toneOption.label}
            </option>
          ))}
        </select>
      </div>

      <p className=" text-center text-[var(--gray-color)] mt-2">
        👉 Try a few combinations to generate the best result for your needs.
        </p>
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (audioUrl? "Regenerate" : 'Generate')}
        </button>
        
      </div>
      
      
      <div className="mt-5">
  {isLoading ? (
    <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
      <BigwigLoader />
      <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
    </div>
  ) : (
    audioUrl && (
      <div ref={resultsRef} className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl text-[var(--primary-text-color)]">Translated Audio</h1>
        </div>

        {/* Audio player */}
        <div className="flex flex-col items-center">
          <audio controls src={audioUrl} className="w-full mb-4">
            Your browser does not support the audio element.
          </audio>

          {/* Download button */}
          <a href={audioUrl} download className="bg-[var(--primary-color)] text-white py-2 px-4 rounded-md hover:bg-opacity-80">
            Download Audio
          </a>
        </div>
      </div>
    )
  )}
</div>

      
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
  
  
}
