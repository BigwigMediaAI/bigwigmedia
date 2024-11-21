import React, { useState,useRef,useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ClipboardList, RefreshCw,UploadIcon } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from '@clerk/clerk-react';
import { FaDownload, FaShareAlt } from "react-icons/fa";
import BigwigLoader from '@/pages/Loader';
import { Label } from 'react-konva';

export function VideoSubtitle() {
    const [video, setVideo] = useState<File | null>(null);
    const [language, setLanguage] = useState("English");
    const [isLoading, setIsLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { userId } = useAuth();
    const loaderRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [showModal3, setShowModal3] = useState(false);
    const [credits, setCredits] = useState(0);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedFile(file);
        setVideo(file); // Keep `video` in sync
      };
    
      const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
        setSelectedFile(file);
        setVideo(file); // Keep `video` in sync
      };
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

    const languages = [
        { value: 'Afrikaans', label: 'Afrikaans' },
    { value: 'Albanian', label: 'Albanian' },
    { value: 'Amharic', label: 'Amharic' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Armenian', label: 'Armenian' },
    { value: 'Azerbaijani', label: 'Azerbaijani' },
    { value: 'Basque', label: 'Basque' },
    { value: 'Belarusian', label: 'Belarusian' },
    { value: 'Bosnian', label: 'Bosnian' },
    { value: 'Bulgarian', label: 'Bulgarian' },
    { value: 'Catalan', label: 'Catalan' },
    { value: 'Cebuano', label: 'Cebuano' },
    { value: 'Chichewa', label: 'Chichewa' },
    { value: 'Chinese (Simplified)', label: 'Chinese (Simplified)' },
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
    { value: 'Haitian Creole', label: 'Haitian Creole' },
    { value: 'Hausa', label: 'Hausa' },
    { value: 'Hawaiian', label: 'Hawaiian' },
    { value: 'Hebrew', label: 'Hebrew' },
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
  
    const handleSubmit = async (e:any) => {
        setIsLoading(true)
        
      if (!video || !language) {
        alert("Please upload a video and select a language.");
        return;
      }

      // Scroll to loader after a short delay to ensure it's rendered
    setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
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
      formData.append("video", video);
      formData.append("language", language);
  
      try {
        setDownloadLink(""); // Clear previous download link
        const response = await axios.post(
          `${BASE_URL}/response/subtitle?clerkId=${userId}`, // Update this URL to match your backend
          formData,
          {
            responseType: "blob", // Ensure proper handling of the video file
          }
        );
  
        if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadLink(url);
            toast.success("Video processed successfully!");
          } else {
            toast.error("Failed to process the video. Please try again.");
          }
        } catch (error) {
          console.error("Error uploading video:", error);
          toast.error("An error occurred while processing the video.");
        } finally {
          setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && downloadLink) {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth',block:'center' });
        }
      }, [isLoading, downloadLink]);
  
    return (
      <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
        <div 
        className="border-4 border-dashed border-[var(--gray-color)] p-6 mb-5 rounded-md w-full flex flex-col items-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex justify-between w-full">
        
          <div className="flex flex-col items-center w-full">
          <UploadIcon className="w-12 h-12 text-[var(--gray-color)] mb-4" />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <Button
              className="border bg-white border-gray-300 text-gray-600 px-4 py-2 mb-3 rounded-md hover:bg-gray-100"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse Files
            </Button>
            <p className="text-gray-400">or drag and drop video file</p>
          </div>
          
        </div>
        {selectedFile && (
          <div className="mt-4 w-full text-center">
            <p className="text-[var(--primary-text-color)]">{selectedFile.name}</p>
          </div>
        )}

      </div>

      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value="">Select Language</option>
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>
              {languageOption.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-red-600 mb-4 text-md">
      Note: video length should be less than 3 minutes.
      </p>

      <div className="mt-5 flex justify-center">
        <Button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-6 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Subtitle'}
        </Button>
      </div>

      <div className="w-full pl-2 flex flex-col gap-2 justify-between">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          downloadLink && (
            <div ref={resultsRef} className="mt-5 p-4 border border-gray-300 rounded-md shadow-inner max-h-unit-9xl overflow-y-auto">
              <div>
              <video controls src={downloadLink} className="w-full rounded-md"></video>
              </div>
              <div className='flex justify-center'>
                <a
                    href={downloadLink}
                    download="subtitled_video.mp4"
                    className=" mt-5 w-fit text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]"
                >
                    Download
                </a>
              </div>
          
            </div>
          )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}

        </div>
    );
}
