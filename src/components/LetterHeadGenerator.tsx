import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import '../App.css';
import background1 from '../assets/converted-image (2).png';
import background2 from '../assets/Letterhead_01.png';
import background3 from '../assets/Letterhead_11.png';
import background4 from '../assets/converted-image (3).png';
import CreditLimitModal from './Model3';
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL, BASE_URL2 } from '@/utils/funcitons';
import { validateInput } from '@/utils/validateInput';

const backgroundImages = [
  { id: 1, src: background1, name: 'Background 1' },
  { id: 2, src: background2, name: 'Background 2' },
  { id: 3, src: background3, name: 'Background 3' },
  { id: 4, src: background4, name: 'Background 4' },
];

export function GenerateLetterhead() {
  const [headerText, setHeaderText] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [HeaderColor, setHeaderColor] = useState('#000000');
  const [currentDate, setCurrentDate] = useState('');
  const [phone, setPhone] = useState('');
  const [background, setBackground] = useState<any>(null);
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
    formData.append('currentDate', currentDate);
    formData.append('phone', phone);

    try {
      const response = await axios.post(`${BASE_URL}/response/create-letterhead`, formData, {
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

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
       <div className='mb-5'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Company/Organisation Name<span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={headerText}
    onChange={(e) => setHeaderText(e.target.value)}
    placeholder="e.g., ABC Corporation"
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
</div>

<div className='mb-5'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Complete Address<span className="text-red-500">*</span>
  </label>
  <textarea
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="e.g., 123 Main St, City, Country"
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
</div>

<div className='flex w-full gap-3 mb-5'>
  <div className='w-1/2'>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Contact Phone Number<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="e.g., +1 123 456 7890"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
  <div className='w-1/2'>
    <label className="block text-sm font-semibold mb-2">
      Enter a Valid Email Address<span className="text-red-500">*</span>
    </label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="e.g., john.doe@example.com"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
</div>

<div className='mb-5'>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Website URL<span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={website}
    onChange={(e) => setWebsite(e.target.value)}
    placeholder="e.g., www.yourwebsite.com"
    className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
    required
  />
</div>


        
      

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold">Choose Your Company Name Color:</label>
          <input
            type="color"
            value={HeaderColor}
            onChange={(e) => setHeaderColor(e.target.value)}
          />
        </div>
    
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold mb-2">Upload Your Company Logo (Png Only):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-500 file:text-white hover:file:bg-gray-600"
            />
            </div>
            <div className="mt-6">
        <label className="block text-sm font-semibold mb-2">Choose any of templates:</label>
        <div className="flex flex-wrap justify-center space-x-4">
          {backgroundImages.map((image) => (
            <div
              key={image.id}
              className={`cursor-pointer p-2 border-2 rounded-md transition-colors duration-300 ${
                background?.id === image.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => handleBackgroundSelection(image)}
            >
              <img src={image.src} alt={image.name} className="md:w-36 md:h-48 w-24 h-36 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-5 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerateLetterhead}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : pdfUrl ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div ref={loaderRef} className="w-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-5 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
          </div>
        ) : (
          pdfUrl && (
            <div ref={resultsRef} className="mt-8">
              <h2 className="text-xl font-bold mb-4">Generated Letterhead:</h2>
              <iframe
                src={pdfUrl}
                title="Generated Letterhead"
                className="w-full h-96"
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
