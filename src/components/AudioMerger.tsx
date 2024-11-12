import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import Slider from "rc-slider";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useEffect } from "react";
import BigwigLoader from "@/pages/Loader";
import { useAuth } from "@clerk/clerk-react";
import CreditLimitModal from "./Model3";

export function AudioMerger() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSelected1, setIsFileSelected1] = useState(false);
  const [isFileSelected2, setIsFileSelected2] = useState(false);
  const [selectedFileName1, setSelectedFileName1] = useState<string | null>(null);
  const [selectedFileName2, setSelectedFileName2] = useState<string | null>(null);
  const [startTime1, setStartTime1] = useState(0);
  const [endTime1, setEndTime1] = useState(0);
  const [startTime2, setStartTime2] = useState(0);
  const [endTime2, setEndTime2] = useState(0);
  const [audioUrl1, setAudioUrl1] = useState<string | null>(null);
  const [audioUrl2, setAudioUrl2] = useState<string | null>(null);
  const [audioDuration1, setAudioDuration1] = useState(0);
  const [audioDuration2, setAudioDuration2] = useState(0);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null); // To hold the merged audio URL
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [credits, setCredits] = useState(0);
  const [showModal3, setShowModal3] = useState(false);

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

  // Function to update the audio duration
  const updateAudioDuration = (file: File, setDuration: React.Dispatch<React.SetStateAction<number>>) => {
    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };
  };

  const handleFileChange1 = () => {
    const inputRef = fileInputRef1.current;
    if (!inputRef) return;

    const file = inputRef.files?.[0];
    if (!file) return;

    setSelectedFileName1(file.name);
    setIsFileSelected1(true);
    const url = URL.createObjectURL(file);
    setAudioUrl1(url);
    setStartTime1(0);
    setEndTime1(0);
    
    // Update audio duration
    updateAudioDuration(file, setAudioDuration1);
  };

  const handleFileChange2 = () => {
    const inputRef = fileInputRef2.current;
    if (!inputRef) return;

    const file = inputRef.files?.[0];
    if (!file) return;

    setSelectedFileName2(file.name);
    setIsFileSelected2(true);
    const url = URL.createObjectURL(file);
    setAudioUrl2(url);
    setStartTime2(0);
    setEndTime2(0);
    
    // Update audio duration
    updateAudioDuration(file, setAudioDuration2);
  };

  const handleConvertClick = async () => {
    setIsLoading(true);

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
      const formData = new FormData();
      const inputRef1 = fileInputRef1.current;
      const inputRef2 = fileInputRef2.current;
      if (!inputRef1 || !inputRef1.files || !inputRef2 || !inputRef2.files) return;

      formData.append("audio1", inputRef1.files[0]);
      formData.append("audio2", inputRef2.files[0]);
      formData.append("start1", new Date(startTime1 * 1000).toISOString().substr(11, 8));
      formData.append("end1", new Date(endTime1 * 1000).toISOString().substr(11, 8));
      formData.append("start2", new Date(startTime2 * 1000).toISOString().substr(11, 8));
      formData.append("end2", new Date(endTime2 * 1000).toISOString().substr(11, 8));

      const response = await axios.post(`${BASE_URL}/response/AudioMerge`, formData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setMergedAudioUrl(url); // Set merged audio URL for playback
        toast.success("Audio conversion successful.");
      } else {
        toast.error("Error converting audio. Please try again later.");
      }
    } catch (error) {
      console.error("Error converting audio:", error);
      toast.error("Error converting audio. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const handleDownloadClick = () => {
    if (!mergedAudioUrl) return;
    const link = document.createElement('a');
    link.href = mergedAudioUrl;
    link.setAttribute('download', 'mergedAudio.mp3');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareClick = () => {
    if (navigator.share && mergedAudioUrl) {
      fetch(mergedAudioUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "merged.mp3", { type: "audio/mpeg" });
          navigator
            .share({
              title: "Generated MP3",
              files: [file],
            })
            .then(() => toast.success("Audio shared successfully!"))
            .catch((error) => console.error("Error sharing:", error));
        })
        .catch((error) => {
          console.error("Error fetching audio file:", error);
          toast.error("Error fetching audio for sharing.");
        });
    } else {
      toast.error("Sharing not supported on this browser.");
    }
  };
  

  useEffect(() => {
    if (!isLoading && mergedAudioUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, mergedAudioUrl]);

  return (
    <div>
      <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
        {/* Audio file 1 input */}
        <div className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center">
          <Upload className="w-12 h-12" />
          <input
            type="file"
            ref={fileInputRef1}
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleFileChange1}
          />
          <Button className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md bg-white hover:bg-gray-100" onClick={() => fileInputRef1.current?.click()}>
            {selectedFileName1?(selectedFileName1):"Select First Audio File"}
          </Button>
          <div className="flex gap-5 w-full mt-5">
          <Slider min={0} max={audioDuration1} step={1} value={startTime1} onChange={(value) => setStartTime1(Array.isArray(value) ? value[0] : value as number)} />
          <span>Start: {formatTime(startTime1)}</span>
          <Slider min={0} max={audioDuration1} step={1} value={endTime1} onChange={(value) => setEndTime1(Array.isArray(value) ? value[0] : value as number)} />
          <span>End: {formatTime(endTime1)}</span>
          </div>
          
        </div>

        {/* Audio file 2 input */}
        <div className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center">
          <Upload className="w-12 h-12" />
          <input
            type="file"
            ref={fileInputRef2}
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleFileChange2}
          />
          <Button className="border border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md bg-white hover:bg-gray-100" onClick={() => fileInputRef2.current?.click()}>
          {selectedFileName2?(selectedFileName2):"Select Second Audio File"}
          </Button>
          <div className="flex gap-5 w-full mt-5">
          <Slider min={0} max={audioDuration2} step={1} value={startTime2} onChange={(value) => setStartTime2(Array.isArray(value) ? value[0] : value as number)} />
          <span>Start: {formatTime(startTime2)}</span>
          <Slider min={0} max={audioDuration2} step={1} value={endTime2} onChange={(value) => setEndTime2(Array.isArray(value) ? value[0] : value as number)} />
          <span>End: {formatTime(endTime2)}</span>
          </div>
          
        </div>

        <div className="flex justify-center mb-5">
          <Button
            className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto ${(isFileSelected1 || isFileSelected2) ? '' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleConvertClick}
            disabled={!isFileSelected1 || !isFileSelected2 || isLoading}
          >
            {isLoading ? "Merging..." : 'Merge Audio'}
          </Button>
        </div>

        <div className="mt-5">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
            mergedAudioUrl && (
                <div ref={resultsRef} className="m-auto w-full max-w-2xl rounded-lg bg-white p-6  mt-5 flex flex-col items-center">
              <div className="mt-4 w-full text-center">
                <audio src={mergedAudioUrl} controls className=" mb-4 w-full" />
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
                title="Share">
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
