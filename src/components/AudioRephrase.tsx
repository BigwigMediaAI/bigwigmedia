import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download, UploadIcon, Share2 } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import BigwigLoader from "@/pages/Loader";



export function AudioRephraser() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [tone, settone] = useState('nova');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const VOICE_TONES = [
    { value: 'alloy', label: 'alloy' },
{ value: 'echo', label: 'echo' },
{ value: 'nova', label: 'nova' },
{ value: 'fable', label: 'fable' },
{ value: 'onyx', label: 'onyx' },
{ value: 'shimmer', label: 'shimmer' }
  ];

  const languages = [
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

  const handleFileChange = () => {
    const inputRef = fileInputRef.current;
    if (!inputRef) return;

    const file = inputRef.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsFileSelected(true);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setTranslatedAudioUrl("");
  };

  const refreshConverter = () => {
    window.location.reload()
  };

  const handleConvertClick = async () => {
    try {
      setIsLoading(true);

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

      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("audio", inputRef.files[0]);
      formData.append("tone", tone);
      formData.append("targetLanguage", targetLanguage);

      const response = await axios.post(`${BASE_URL}/response/audioRepharse?clerkId=${userId}`, formData, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setTranslatedAudioUrl(url);
        toast.success("Audio processed successfully.");
      } else {
        toast.error("Error processing audio. Please try again later.");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Error processing audio. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!translatedAudioUrl) return;
    const link = document.createElement('a');
    link.href = translatedAudioUrl;
    link.setAttribute('download', 'translated_audio.mp3');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = async () => {
    if (!translatedAudioUrl) return;
    try {
      const blob = await fetch(translatedAudioUrl).then(res => res.blob());
      const file = new File([blob], 'translated-audio.mp3', { type: blob.type });
      if (navigator.share) {
        await navigator.share({
          title: 'Translated Audio',
          files: [file],
        });
        toast.success("Audio shared successfully.");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing audio:", error);
      toast.error("Error sharing audio. Please try again later.");
    }
  };

  useEffect(() => {
    if (!isLoading && translatedAudioUrl) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isLoading, translatedAudioUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg  bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
        <div
          className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center w-full">
              <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                className="border border-gray-300 text-gray-600 bg-[var(--white-color)] px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Audio File
              </Button>
              {selectedFileName && (
                <p className="text-[var(--dark-gray-color)] text-center mt-2">{selectedFileName}</p>
              )}
              <p className="text-gray-400">or drag and drop an audio file</p>
            </div>
            
          </div>
        </div>
        {audioUrl && (
          <div className="flex flex-col items-center mb-5 w-full">
            <audio controls src={audioUrl} ref={audioPlayerRef} className="w-full mb-4" />
          </div>
        )}
<div className="w-full flex gap-5">
<div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Language</label>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>
              {languageOption.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 w-1/2">
        <label className="block text-[var(--primary-text-color)]">Select Tone</label>
        <select
          value={tone}
          onChange={(e) => settone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          {VOICE_TONES.map((voiceTone) => (
            <option key={voiceTone.value} value={voiceTone.value}>
              {voiceTone.label}
            </option>
          ))}
        </select>
      </div>
</div>

      <p className="text-red-600 mb-4 text-md">
      Note: Response time varies with file size; larger files may take longer to process.
      </p>
        <div className="flex justify-center mb-5">
          <Button
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected || isLoading}
          >
            {isLoading ? "Rephrasing..." : 'Rephrase'}
          </Button>
        </div>
      

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          translatedAudioUrl && (
            <div ref={resultRef} className="m-auto w-full max-w-2xl rounded-lg  bg-[var(--white-color)] p-6  mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <audio controls src={translatedAudioUrl} className="w-full mb-4" />
                <div className="flex gap-5">
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={handleDownloadClick}
                title="Download">
                  Download
                </Button>
                <Button
                      className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                      onClick={handleShareClick}
                      title="Share"
                    >
                      Share
                    </Button>
                </div>
                
              </div>
            </div>
          )
        )}
      </div>
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}