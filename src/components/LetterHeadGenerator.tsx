import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import '../App.css';
import background1 from '../assets/LetterHead/LetterHead Template2.png';
import background2 from '../assets/LetterHead/Letterhead_01.png';
import background3 from '../assets/LetterHead/Letterhead_11.png';
import background4 from '../assets/LetterHead/converted-image (2).png';
import background5 from '../assets/LetterHead/converted-image (3).png';
import background6 from '../assets/LetterHead/letterHead Template5.png';
import background7 from '../assets/LetterHead/letterHead Template6.png';
import background8 from '../assets/LetterHead/letterHead template.png';
import background9 from '../assets/LetterHead/letterHeadtemplate12.jpg';
import background10 from '../assets/LetterHead/letterTemplate3.png';
import background11 from '../assets/LetterHead/letterheadtemplate13.jpg';
import background12 from '../assets/LetterHead/letterheadtemplate14.jpg';
import background13 from '../assets/LetterHead/letterheadtemplate15.jpg';
import background14 from '../assets/LetterHead/letterheadtemplate16.jpg';
import background15 from '../assets/LetterHead/letterheadtemplate17.jpg';
import background16 from '../assets/LetterHead/letterheadtemplate18.jpg';
import background17 from '../assets/LetterHead/letterheadtemplate19.jpg';
import background18 from '../assets/LetterHead/letterheadtemplate20.jpg';
import background19 from '../assets/LetterHead/letterheadtemplate21.jpg';
import CreditLimitModal from './Model3';
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL, BASE_URL2 } from '@/utils/funcitons';
import { validateInput } from '@/utils/validateInput';
import BigwigLoader from '@/pages/Loader';

const backgroundImages = [
  { id: 1, src: background1, name: 'Background 1' },
  { id: 2, src: background2, name: 'Background 2' },
  { id: 3, src: background3, name: 'Background 3' },
  { id: 4, src: background4, name: 'Background 4' },
  { id: 5, src: background5, name: 'background 5' },
  { id: 6, src: background6, name: 'background 6' },
  { id: 7, src: background7, name: 'background 7' },
  { id: 8, src: background8, name: 'background 8' },
  { id: 9, src: background9, name: 'background 9' },
  { id: 10, src: background10, name: 'background 10' },
  { id: 11, src: background11, name: 'background 11' },
  { id: 12, src: background12, name: 'background 12' },
  { id: 13, src: background13, name: 'background 13' },
  { id: 14, src: background14, name: 'background 14' },
  { id: 15, src: background15, name: 'background 15' },
  { id: 16, src: background16, name: 'background 16' },
  { id: 17, src: background17, name: 'background 17' },
  { id: 18, src: background18, name: 'background 18' },
  { id: 19, src: background19, name: 'background 19' },
];

export function GenerateLetterhead() {
  const [headerText, setHeaderText] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [HeaderColor, setHeaderColor] = useState('#000000');
  const [FooterColor, setFooterColor] = useState('#808080');
  const [FooterLineColor, setFooterLineColor] = useState('#000000');
  const [currentDate, setCurrentDate] = useState('');
  const [phone, setPhone] = useState('');
  const [background, setBackground] = useState<any>(null);
  const [watermarkType, setWatermarkType] = useState('');
    const [watermarkText, setWatermarkText] = useState('');
    const [addWatermark, setAddWatermark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [credits, setCredits] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit;
      } else {
        toast.error('Error fetching account credits');
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Error fetching account credits');
      return 0;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogo(e.target.files[0]);
    }
  };

  const handleBackgroundSelection = (image: any) => {
    setBackground(image);
  };

  const handleGenerateLetterhead = async () => {
    if (!headerText || !address || !email || !website || !phone) {
      toast.error('All fields are required!');
      return;
    }

    if (
      !validateInput(headerText) ||
      !validateInput(address) ||
      !validateInput(email) ||
      !validateInput(website) ||
      !validateInput(phone)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    const currentCredits = await getCredits();
    if (currentCredits <= 0) {
      setIsLoading(false);
      setShowModal(true);
      return;
    }

    if (logo) formData.append('logo', logo);
    if (background) {
      try {
        const response = await fetch(background.src);
        const imageBlob = await response.blob();
        formData.append('background', imageBlob, background.name);
      } catch (error) {
        toast.error('Failed to load background image.');
        setIsLoading(false);
        return;
      }
    }

    formData.append('headerText', headerText);
    formData.append('address', address);
    formData.append('email', email);
    formData.append('website', website);
    formData.append('HeaderColor', HeaderColor);
    formData.append('FooterLineColor', FooterLineColor);
    formData.append('FooterColor', FooterColor);
    formData.append('currentDate', currentDate);
    formData.append('phone', phone);
    formData.append('watermarkType', watermarkType);
    if (watermarkType === 'text') {
        formData.append('watermarkText', watermarkText);
    }
    
    

    try {
      const response = await axios.post(`${BASE_URL}/response/create-letterhead?clerkId=${userId}`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      toast.success('Letterhead generated successfully!');
    } catch (error) {
      console.error('Error generating letterhead:', error);
      toast.error('Error generating letterhead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && pdfUrl) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading, pdfUrl]);

  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = (value:any) => {
    setEmail(value);
  
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(value)) {
      setEmailError(true);  // Show error if email is invalid
    } else {
      setEmailError(false); // Hide error if email is valid
    }
  };

const [websiteError, setWebsiteError] = useState(false);

const handleWebsiteChange = (value:any) => {
  setWebsite(value);

  // Regex for validating website URL format
  const websiteRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  if (!websiteRegex.test(value)) {
    setWebsiteError(true);  // Set error if URL is invalid
  } else {
    setWebsiteError(false);  // Clear error if URL is valid
  }
};


  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className='flex gap-6 w-full'>
       <div className='mb-5 w-2/3'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Company / Business Name<span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={headerText}
    onChange={(e) => setHeaderText(e.target.value)}
    placeholder="e.g., Bigwig Media & Events Private Limited"
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
</div>

<div className="mb-4 w-1/3">
          <label className="block text-sm font-semibold">Choose Header Text Color:</label>
          <input
            type="color"
            value={HeaderColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            className='h-14 w-12'
          />
        </div>

</div>

<div className='mb-5'>
        <label className="block text-sm font-semibold mb-2">Upload Your Company Logo (Supported Image: Jpg/Png):</label>
        <input
  type="file"
  accept=".jpg,.jpeg,.png"
  onChange={handleFileChange}
  className="block w-full p-3 border rounded-md"
/>

            </div>

<div className='mb-5'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Business Address<span className="text-red-500">*</span>
  </label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="e.g., S1, Janta Market, Rajouri Garden, New Delhi, 110027"
    maxLength={65}
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
</div>



<div className='flex w-full gap-3 mb-5'>
  <div className='w-1/2'>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Phone Number<span className="text-red-500">*</span>
    </label>
    <input
    type="tel"
    value={phone}
    onChange={(e) => {
      const value = e.target.value;
      // Regex to match a phone number that starts with '+' followed by numbers
      if (/^\+?[0-9]*$/.test(value)) {
        setPhone(value);
      }
    }}
    placeholder="e.g., +1 123 456 7890"
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
  </div>
  <div className='w-1/2'>
  <label className="block text-sm font-semibold mb-2">
    Enter a Email Address<span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => handleEmailChange(e.target.value)}  // Use a handler for validation
    placeholder="e.g., john.doe@example.com"
    className={`block w-full p-3 border rounded-md focus:outline-none ${emailError ? 'border-red-500' : 'focus:border-blue-500'}`}  // Dynamic border color on error
    required
  />
  {emailError && (
    <span className="text-red-500 text-sm mt-2">
      Please enter a valid email address.
    </span>
  )}
</div>

</div>

<div className='mb-5'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Website URL<span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={website}
    onChange={(e) => handleWebsiteChange(e.target.value)}  // Use handler for validation
    placeholder="e.g., www.yourwebsite.com"
    className={`block w-full p-3 border rounded-md focus:outline-none ${websiteError ? 'border-red-500' : 'focus:border-blue-500'}`}  // Dynamic border color
    required
  />
  {websiteError && (
    <span className="text-red-500 text-sm mt-2">
      Please enter a valid website URL.
    </span>
  )}
</div>



        
      

      <div className="grid grid-cols-3 gap-6 mt-6">
        
        <div className="mb-4">
          <label className="block text-sm font-semibold">Choose Footer Line Color:</label>
          <input
            type="color"
            value={FooterLineColor}
            onChange={(e) => setFooterLineColor(e.target.value)}
            className='h-14 w-12'
          />
        </div><div className="mb-4">
          <label className="block text-sm font-semibold">Choose Footer Text Color:</label>
          <input
            type="color"
            value={FooterColor}
            onChange={(e) => setFooterColor(e.target.value)}
            className='h-14 w-12'
          />
        </div>
    
      </div>

      <div className="mt-5 mb-5">
  <label>Would you like to add a watermark?</label>
  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
    <label>
      <input
        type="radio"
        value="yes"
        checked={addWatermark === true}
        onChange={() => setAddWatermark(true)}
      />
      Yes
    </label>
    <label>
      <input
        type="radio"
        value="no"
        checked={addWatermark === false}
        onChange={() => {
          setAddWatermark(false);
          setWatermarkType(''); // Clear watermark type when "No" is selected
        }}
      />
      No
    </label>
  </div>
</div>

{/* Conditionally show watermark options if the user selects 'Yes' */}
{addWatermark && (
  <div className='mt-5 mb-5'>
    <label>Watermark Type:</label>
    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
      <label>
        <input
          type="radio"
          value="logo"
          checked={watermarkType === 'logo'}
          onChange={(e) => setWatermarkType(e.target.value)}
        />
        Logo
      </label>
      <label>
        <input
          type="radio"
          value="text"
          checked={watermarkType === 'text'}
          onChange={(e) => setWatermarkType(e.target.value)}
        />
        Text
      </label>
    </div>

    {/* Conditionally show watermark text input if the user selects 'text' */}
    {watermarkType === 'text' && (
      <div className='mb-5'>
        <label className="block text-sm font-semibold mb-2">
          Enter Watermark Text:
        </label>
        <input
          value={watermarkText}
          onChange={(e) => setWatermarkText(e.target.value)}
          placeholder="e.g., Confidential"
          className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
        />
      </div>
    )}
  </div>
)}

<div className="mt-6">
  <label className="block text-sm font-semibold mb-2">Choose any of templates:</label>
  <div className="overflow-x-auto">
    <div className="grid grid-flow-col auto-cols-max gap-3 justify-start">
      {backgroundImages.map((image) => (
        <div
          key={image.id}
          className={`cursor-pointer p-2 border-2 rounded-md transition-colors duration-300 ${
            background?.id === image.id ? 'border-blue-500' : 'border-gray-200'
          }`}
          onClick={() => handleBackgroundSelection(image)}
        >
          <img
            src={image.src}
            alt={image.name}
            className="md:w-36 md:h-48 w-24 h-36 object-cover rounded"
          />
        </div>
      ))}
    </div>
  </div>
</div>

      <div className="mt-8 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerateLetterhead}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : pdfUrl ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
          pdfUrl && (
            <div ref={resultsRef} className="mt-8">
              <h2 className="text-xl font-bold mb-4">Generated Letterhead:</h2>
              <iframe
                src={pdfUrl}
                title="Generated Letterhead"
                className="w-full"
                style={{ height: '130vh' }} // Full viewport height
                frameBorder="0"
              />
            </div>
          )
          
        )}
      </div>

      {showModal && <CreditLimitModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
}
