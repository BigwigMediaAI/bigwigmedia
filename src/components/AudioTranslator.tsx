import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Download, UploadIcon } from "lucide-react";
import { BASE_URL } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";

const VOICE_TONES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

export function AudioTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedAudioUrl, setTranslatedAudioUrl] = useState<string | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>('en');
  const [voiceTone, setVoiceTone] = useState<string>(VOICE_TONES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();

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

      const formData = new FormData();
      const inputRef = fileInputRef.current;
      if (!inputRef || !inputRef.files) return;
      formData.append("audio", inputRef.files[0]);
      formData.append("targetLanguage", targetLanguage);
      formData.append("voiceTone", voiceTone);

      const response = await axios.post(`${BASE_URL}/response/audio-translate?clerkId=${userId}`, formData, {
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
            <RefreshCw
              className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-800"
              onClick={refreshConverter}
            />
          </div>
        </div>
        {audioUrl && (
          <div className="flex flex-col items-center mb-5 w-full">
            <audio controls src={audioUrl} ref={audioPlayerRef} className="w-full mb-4" />
          </div>
        )}
        <div className="flex justify-between items-center mb-5 w-full">
          <div className="w-1/2 mr-2">
            <label htmlFor="targetLanguage" className="mb-2 text-[var(--dark-gray-color)]">Target Language</label>
            <select id="targetLanguage" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500">
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="hn">Hindi</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese (Simplified)</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="tr">Turkish</option>
              <option value="nl">Dutch</option>
              <option value="pl">Polish</option>
            <option value="sv">Swedish</option>
            <option value="fi">Finnish</option>
            <option value="no">Norwegian</option>
            <option value="da">Danish</option>
            <option value="el">Greek</option>
            <option value="cs">Czech</option>
            <option value="hu">Hungarian</option>
            <option value="th">Thai</option>
            <option value="id">Indonesian</option>
            <option value="ms">Malay</option>
            <option value="vi">Vietnamese</option>
              {/* Add more language options as needed */}
            </select>
          </div>
          <div className="w-1/2 ml-2">
            <label htmlFor="voiceTone" className="mb-2 text-[var(--dark-gray-color)]">Voice Tone</label>
            <select id="voiceTone" value={voiceTone} onChange={(e) => setVoiceTone(e.target.value)} className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:border-blue-500">
              {VOICE_TONES.map((tone) => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center mb-5">
          <Button
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${isFileSelected ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected || isLoading}
          >
            {isLoading ? "Translating..." : 'Translate'}
          </Button>
        </div>
      

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
          <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-10 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please wait...</p>
          </div>
        ) : (
          translatedAudioUrl && (
            <div ref={resultRef} className="m-auto w-full max-w-2xl rounded-lg  bg-[var(--white-color)] p-6  mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <audio controls src={translatedAudioUrl} className="w-full mb-4" />
                <Button
                  className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                  onClick={handleDownloadClick}
                title="Download">
                  Download
                  <Download className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
      </div>
    </div>
  );
}