import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import CreditLimitModal from './Model3';

export function ImageSelectPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [mainObject, setMainObject] = useState('');
  const [style, setStyle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [colors, setColors] = useState('');
  const [background, setBackground] = useState('');
  const [outputCount, setOutputCount] = useState(3); // Default multiple prompt generation
  const [language, setLanguage] = useState("English"); // Default language
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState(''); // State to store the image URL
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

  const handleGeneratePrompts = async () => {
    if (!validateInput(mainObject) || !validateInput(style)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompts([]);
    setGeneratedImageUrl(''); // Reset the image when generating new prompts
    setSelectedPrompt('');

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/response/generatePrompts`, {
        mainObject,
        style,
        feeling,
        colors,
        background,
        language,
        outputCount,
      });

      if (response.status === 200) {
        setGeneratedPrompts(response.data.prompts);
        console.log(response.data.prompts) // Store all prompts
      } else {
        toast.error('Error generating prompts. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
      toast.error('Error generating prompts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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


  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt); // Store selected prompt
  };

  const handleGenerateImage = async () => {
    if (!selectedPrompt) {
      toast.error('Please select a prompt first.');
      return;
    }
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      setIsImageLoading(true);
      const response = await axios.post(`${BASE_URL}/response/generateImageFromPrompt`, {
        prompt: selectedPrompt,
      });
  
      if (response.status === 200 && response.data.images && response.data.images.length > 0) {
        // Extract the URL from the first image object in the array
        const imageUrl = response.data.images[0].url;
        
        // Handle successful image generation
        toast.success('Image generated successfully!');
        setGeneratedImageUrl(imageUrl); // Store the image URL
        console.log('Generated Image URL:', imageUrl);
      } else {
        toast.error('Error generating image. Please try again later.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Error generating image. Please try again later.');
    } finally {
      setIsImageLoading(false);
    }
  };

  // Function to download the image

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = generatedImageUrl;
    link.target = "_blank";
    link.download = "image.jpg"; // You can customize the downloaded filename here
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  useEffect(() => {
    if (!isLoading && generatedPrompts.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, generatedPrompts]);

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      {/* Input fields */}
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Main Object</label>
        <input
          type="text"
          value={mainObject}
          onChange={(e) => setMainObject(e.target.value)}
          placeholder="E.g., a lone tree"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Colors</label>
        <input
          type="text"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          placeholder="E.g., soft greens and blues"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Background</label>
        <input
          type="text"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="E.g., a sunset sky"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
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
          <option value="Realistic">Realistic</option>
          <option value="Watercolor">Watercolor</option>
          <option value="Pencil Sketch">Pencil Sketch</option>
          <option value="Oil Painting">Oil Painting</option>
          <option value="Digital Art">Digital Art</option>
          <option value="Pop Art">Pop Art</option>
          <option value="Retro">Retro</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Anime">Anime</option>
          <option value="3D Render">3D Render</option>
        </select>
      </div>

      <div className="w-1/2 mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Feeling</label>
        <select
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value="">Select Feeling</option>
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
      {/* Generate Prompts Button */}
      <div className="mt-5 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGeneratePrompts}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : (generatedPrompts.length > 0 ? "Regenerate Prompt" : 'Generate Prompt')}
        </button>
      </div>

      {/* Display generated prompts */}
      <div className="mt-5">
          {isLoading ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
              <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          ) : (
            generatedPrompts.length > 0 && (
              <div ref={resultsRef} className="mt-6">
                <h1 className="text-xl mb-4">Select a Prompt to Generate Image</h1>
                <div className="flex flex-col gap-4 max-h-96 overflow-auto">
                  {generatedPrompts.map((prompt, index) => (
                    <label
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 ${prompt === selectedPrompt ? 'bg-blue-200' : ''}`}
                    >
                      <input
                        type="radio"
                        name="prompt"
                        value={prompt}
                        checked={prompt === selectedPrompt}
                        onChange={() => handleSelectPrompt(prompt)}
                        className="form-radio"
                      />
                      <p>{prompt}</p>
                    </label>
                  ))}
                </div>
              </div>
            )
          )}
        </div>


      {/* Button to generate image */}
      {selectedPrompt && (
        <div className="mt-5 flex justify-center">
          <button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            onClick={handleGenerateImage}
          >
            {isImageLoading ? 'Generating...' : (generatedImageUrl.length > 0 ? "Regenerate Image" : 'Generate Image')}
          </button>
        </div>
      )}

      {/* Display the generated image and download button */}
      <div className="mt-5">
        {isImageLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
          <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
      generatedImageUrl.length>0 && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
          <img src={generatedImageUrl} alt="Generated" className="rounded-lg shadow-lg w-full mb-4" />
          <button
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
            onClick={downloadImage}
            
          >
            Download Image
          </button>
        </div>
      ))}
      </div>

      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
