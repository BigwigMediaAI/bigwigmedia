import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import CreditLimitModal from './Model3';
import BigwigLoader from '@/pages/Loader';

export function ImageSelectPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [mainObject, setMainObject] = useState('');
  const [style, setStyle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [colors, setColors] = useState('');
  const [customColor, setCustomColor] = useState('');
  const [background, setBackground] = useState('');
  const [outputCount, setOutputCount] = useState(3); // Default multiple prompt generation
  const [language, setLanguage] = useState("English"); // Default language
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [editedPrompt, setEditedPrompt] = useState(''); 
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
    if (!validateInput(mainObject) || !validateInput(background)) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setIsLoading(true);
    setGeneratedPrompts([]);
    setGeneratedImageUrl(''); // Reset the image when generating new prompts
    setSelectedPrompt('');
    setEditedPrompt('')
    

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

    const selectedColors = colors === 'Custom' ? customColor : colors;

    try {
      const response = await axios.post(`${BASE_URL}/response/generatePrompts?clerkId=${userId}`, {
        mainObject,
        style,
        feeling,
        colors:selectedColors,
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
    setSelectedPrompt(prompt); 
    setEditedPrompt(prompt)
  };

  const handleGenerateImage = async () => {
    if (!editedPrompt) {
      toast.error('Please select a prompt first.');
      return;
    }
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  
    try {
      setIsImageLoading(true);
      const response = await axios.post(`${BASE_URL}/response/generateImageFromPrompt?clerkId=${userId}`, {
        prompt: editedPrompt,
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
        <label className="block text-[var(--primary-text-color)]">Describes the central focus of the Image (e.g., person, object)</label>
        <input
          type="text"
          value={mainObject}
          onChange={(e) => setMainObject(e.target.value)}
          placeholder="E.g., A majestic mountain peak, a playful puppy"
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Describe the background of image</label>
        <input
          type="text"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="E.g., A golden sunset over the ocean, a busy city skyline  "
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        />
      </div>
      <div className="mb-5">
        <label className="block text-[var(--primary-text-color)]">Select Colors</label>
        <select
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
        >
          <option value="">Select Colors</option>
          <option value="Natural tones">Natural Tones</option>
          <option value="Soft pastels">Soft Pastels</option>
          <option value="Warm tones">Warm Tones</option>
          <option value="Cool tones">Cool Tones</option>
          <option value="Earthy tones">Earthy Tones</option>
          <option value="Monochrome">Monochrome</option>
          <option value="Bold and vibrant">Bold and Vibrant</option>
          <option value="Muted and neutral">Muted and Neutral</option>
          <option value="Dark and moody">Dark and Moody</option>
          <option value="Bright and cheerful">Bright and Cheerful</option>
          <option value="Metallic">Metallic</option>
          <option value="Jewel tones">Jewel Tones</option>
          <option value="Retro colors">Retro Colors</option>
          <option value="Gradient">Gradient</option>
          <option value="Fantasy palette">Fantasy Palette</option>
          <option value="Autumnal">Autumnal</option>
          <option value="Spring pastels">Spring Pastels</option>
          <option value="Tropical palette">Tropical Palette</option>
          <option value="Oceanic palette">Oceanic Palette</option>
          <option value="Wintery tones">Wintery Tones</option>
          <option value="Candy colors">Candy Colors</option>
          <option value="Vintage tones">Vintage Tones</option>
          <option value="Desert palette">Desert Palette</option>
          <option value="Galaxy palette">Galaxy Palette</option>
          <option value="Floral tones">Floral Tones</option>
          <option value="Forest palette">Forest Palette</option>
          <option value="Sunset hues">Sunset Hues</option>
          <option value="Rainy day tones">Rainy Day Tones</option>
          <option value="Art Deco palette">Art Deco Palette</option>
          <option value="Punk neon">Punk Neon</option>
          <option value="Custom">Custom Color</option> {/* Add this option */}
        </select>

        {colors === "Custom" && (
          <input
            type="text"
            placeholder="Enter your custom color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm p-3 mb-4"
          />
        )}
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
          <option value="Surrealism">Surrealism</option>
          <option value="Impressionism">Impressionism</option>
          <option value="Minimalism">Minimalism</option>
          <option value="Abstract">Abstract</option>
          <option value="Cubism">Cubism</option>
          <option value="Pointillism">Pointillism</option>
          <option value="Expressionism">Expressionism</option>
          <option value="Steampunk">Steampunk</option>
          <option value="Pixel Art">Pixel Art</option>
          <option value="Vector Art">Vector Art</option>
          <option value="Graffiti">Graffiti</option>
          <option value="Chalk Drawing">Chalk Drawing</option>
          <option value="Charcoal Drawing">Charcoal Drawing</option>
          <option value="Flat Design">Flat Design</option>
          <option value="Comic Book">Comic Book</option>
          <option value="Collage">Collage</option>

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
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader styleType="cube" />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
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


{/* Editable Text Area for Selected Prompt */}
{selectedPrompt && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-4">Edit Your Selected Prompt</h2>
          <textarea
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full rounded-md border shadow-sm p-3 mb-4"
            rows={4}
          />
        </div>
      )}

      

      {/* Button to generate image */}
      {editedPrompt && (
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
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
          <BigwigLoader styleType="cube" />
          <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
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
