import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, Share2, Download, Copy } from 'lucide-react';
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";
import { useAuth } from "@clerk/clerk-react";
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

export function SocialMediaPostGenerator() {

  const [imageDescription, setImageDescription] = useState("");
  const [promptCount, setPromptCount] = useState(1);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for post generation
  const [platform, setPlatform] = useState("Instagram");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("casual");
  const [language, setLanguage] = useState("English");
  const [outputCount, setOutputCount] = useState(1);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [includeHashtag, setIncludeHashtag] = useState(true);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const loaderRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showModal3, setShowModal3] = useState(false);
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
      console.error("Error fetching credits:", error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  // Generate prompts
  const handleGeneratePrompts = async () => {
    setLoadingPrompts(true);
    setError(null);

     // Scroll to loader after a short delay to ensure it's rendered
     setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

      const currentCredits = await getCredits();
      if (currentCredits <= 0) {
        setShowModal3(true);
        setLoadingPrompts(false);
        return;
      }


    try {
      const response = await axios.post(`${BASE_URL}/response/imagePrompt?clerkId=${userId}`, {
        imageDescription,
        promptCount,
      });

      setPrompts(response.data);
      setSelectedPrompt(null);
    } catch (err) {
      setError("Failed to generate prompts. Please try again.");
    } finally {
      setLoadingPrompts(false);
    }
  };

  // Generate social media post & image
  const handleGeneratePost = async () => {
    setLoadingPost(true);
    setError(null);
    setGeneratedPosts([])

     // Scroll to loader after a short delay to ensure it's rendered
     setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
    }, 100);

      const currentCredits = await getCredits();
      if (currentCredits <= 0) {
        setShowModal3(true);
        setLoadingPost(false);
        return;
      }

      console.log(platform, description,tone, language, outputCount, includeEmoji, includeHashtag,selectedPrompt)
    try {
      const response = await axios.post(`${BASE_URL}/response/generateSocialMediaPost?clerkId=${userId}`, {
        platform,
        description,
        tone,
        language,
        outputCount,
        includeEmoji,
        includeHashtag,
        imagePrompt: selectedPrompt,
      });

      setGeneratedPosts(response.data.posts);
      console.log(response.data)
      setImageUrl(response.data.imageUrl);
    } catch (err) {
      setError("Failed to generate post. Please try again.");
    } finally {
      setLoadingPost(false);
    }
  };
  

  const platforms = [
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'Snapchat', label: 'Snapchat' },
    { value: 'Pinterest', label: 'Pinterest' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'Quora', label: 'Quora' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Vimeo', label: 'Vimeo' },
    { value: 'Telegram', label: 'Telegram' },
];

const tones = [
  { value: 'informative', label: 'Informative' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'informal', label: 'Informal' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'optimistic', label: 'Optimistic' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
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

  const outputCounts = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];
  const handleCopy = (caption:any) => {
    navigator.clipboard.writeText(caption);
    toast.success('Post copied to clipboard!');
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPosts.join("\n\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "posts.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Twitter post',
      text: generatedPosts.join("\n\n"),
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing posts:', err);
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">

      {/* Step 1: Generate Prompts */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Step 1: Generate Prompts</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image Description:</label>
          <input
            type="text"
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Describe the image..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Number of Prompts:</label>
          <select className="w-full p-2 border rounded" value={promptCount} onChange={(e) => setPromptCount(Number(e.target.value))}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
        </div>

        <button
          onClick={handleGeneratePrompts}
          disabled={loadingPrompts}
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-7 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
        >
          {loadingPrompts ? "Generating..." : "Generate Prompts"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {prompts.length > 0 && (
  <div className="mt-4">
    <h4 className="text-lg font-semibold mb-2">Select a Prompt:</h4>
    <div className="flex flex-col gap-2">
      {prompts.map((prompt, index) => (
        <label key={index} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-100">
          <input
            type="radio"
            name="prompt"
            value={prompt}
            checked={selectedPrompt === prompt}
            onChange={(e) => setSelectedPrompt(e.target.value)}
            className="accent-blue-500"
          />
          {prompt}
        </label>
      ))}
    </div>
  </div>
)}

      </div>

      {/* Step 2: Generate Post & Image */}
      {selectedPrompt && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Step 2: Generate Post & Image</h3>

          <div className="mb-4">
          <label className="block text-[var(--primary-text-color)]">Select Social Media Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >

          {platforms.map((platformOption) => (
            <option key={platformOption.value} value={platformOption.value}>{platformOption.label}</option>
          ))}
        </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Post Description:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe the post..."
            />
          </div>

          <div className="mb-4">
          <label className="block text-[var(--primary-text-color)]">Select Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {tones.map((toneOption) => (
            <option key={toneOption.value} value={toneOption.value}>{toneOption.label}</option>
          ))}
        </select>
          </div>
          <div className="mb-4">
          <label className="block text-[var(--primary-text-color)]">Select Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {languages.map((languageOption) => (
            <option key={languageOption.value} value={languageOption.value}>{languageOption.label}</option>
          ))}
        </select>
          </div>
          <div className="mb-4">
          <label className="block text-[var(--primary-text-color)]">Select Output Count</label>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border border-[var(--primary-text-color)] shadow-sm  p-3 mb-4"
        >
          {outputCounts.map((outputCountOption) => (
            <option key={outputCountOption.value} value={outputCountOption.value}>{outputCountOption.label}</option>
          ))}
        </select>
          </div>


          <div className='flex justify-center gap-5'>
      <div className="mb-5 flex items-center gap-4">
        <label className="text-[var(--primary-text-color)]">Use Emoji</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={includeEmoji}
            onChange={() => setIncludeEmoji(!includeEmoji)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      
      <div className="mb-5 flex items-center gap-4">
        <label className="text-[var(--primary-text-color)]">Use Hashtag</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={includeHashtag}
            onChange={() => setIncludeHashtag(!includeHashtag)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      </div>

          <button
            onClick={handleGeneratePost}
            disabled={loadingPost}
            className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-7 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          >
            {loadingPost ? "Generating..." : (generatedPosts.length > 0 ? "Regenerate" : 'Generate')}
          </button>


          {imageUrl && (
            <div>
             <p className="text-red-600 mt-4 mb-4 text-md md:block hidden">Note: OpenAI's policy does not allow direct downloading of images. However, you can download the image by clicking on it. You will be redirected to a new page where you can right-click on the image and select "Save Image As" to download it.</p>
             <p className="text-red-600 mt-4 mb-4 text-md md:hidden">Note: OpenAI's policy does not allow direct downloading of images. However, you can download the image by tapping on it. You will be redirected to a new page, where you can touch and hold the image, then select "Save Image" to download it.</p>
             </div>
          )}

          <div className="mt-5">
        {loadingPost ? (
            <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
            <BigwigLoader />
            <p className="text-[var(--dark-gray-color)] text-center mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          generatedPosts.length > 0 && (
            <div className="border border-[var(--primary-text-color)] rounded-md mt-6 p-5 relative">
              <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold mb-2">Generated Posts:</h4>
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
              <ul className="list-disc pl-5">
              {imageUrl && (
            <div className="my-4">
              <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-lg" />
            </div>
          )}
                {generatedPosts.map((post, index) => (
                  <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
                    {post}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

          
        </div>
      )}

{showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );


}
