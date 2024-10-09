import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import '../App.css';
import background1 from '../assets/Visiting_Card/5103ebbd814dce9ea69a85d083e16db9.jpg';
import background2 from '../assets/Visiting_Card/Blank-Business-Card-Templates-141.jpg';
import background3 from '../assets/Visiting_Card/Screenshot (72).jpg';
import background4 from '../assets/Visiting_Card/Screenshot (74).jpg'
import background5 from '../assets/Visiting_Card/Screenshot (76).jpg'
import background6 from '../assets/Visiting_Card/Screenshot (77).jpg'
import background8 from '../assets/Visiting_Card/Screenshot (79).jpg'
import background10 from '../assets/Visiting_Card/Screenshot (80).jpg'
import background7 from '../assets/Visiting_Card/Screenshot (81).png'
import background9 from '../assets/Visiting_Card/Screenshot (82).png'
import background11 from '../assets/Visiting_Card/Screenshot (92).png'
import background12 from '../assets/Visiting_Card/Screenshot (93).png'
import background13 from '../assets/Visiting_Card/Screenshot (95).png'
import background14 from '../assets/Visiting_Card/Screenshot (96).png'
import background15 from '../assets/Visiting_Card/Screenshot (97).png'
import background16 from '../assets/Visiting_Card/page 2.jpg'
import background17 from '../assets/Visiting_Card/page.jpg'
import background18 from '../assets/Visiting_Card/image 7.png'
import background19 from '../assets/Visiting_Card/Screenshot (98).png'
import CreditLimitModal from './Model3';  // Modal to handle credit exhaustion
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL,BASE_URL2 } from '@/utils/funcitons';
import { validateInput } from '@/utils/validateInput';
import front from '../assets/front.png'
import back from '../assets/back.png'
import BigwigLoader from '@/pages/Loader';

const backgroundImages = [
  { id: 1, src: background1, name: 'Background 1' },
  { id: 2, src: background2, name: 'Background 2' },
  { id: 3, src: background3, name: 'Background 3' },
  { id: 4, src: background4, name: 'Background 4' },
  { id: 5, src: background5, name: 'Background 5' },
  { id: 6, src: background6, name: 'Background 6' },
  { id: 8, src: background8, name: 'Background 8' },
  { id: 9, src: background9, name: 'Background 9' },
  { id: 10, src: background10, name: 'Background 10' },
  { id: 7, src: background7, name: 'Background 7' },
  { id: 11, src: background11, name: 'Background 11' },
  { id: 12, src: background12, name: 'Background 12' },
  { id: 13, src: background13, name: 'Background 13' },
  { id: 14, src: background14, name: 'Background 14' },
  { id: 15, src: background15, name: 'Background 15' },
  { id: 16, src: background16, name: 'Background 16' },
  { id: 17, src: background17, name: 'Background 17' },
  { id: 18, src: background18, name: 'Background 18' },
  { id: 19, src: background19, name: 'Background 19' }
];

export function GenerateVisitingCard() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [includeCompanyOnBack, setIncludeCompanyOnBack] = useState(true);
  const [includeLogoOnFront, setIncludeLogoOnFront] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [nameColor, setNameColor] = useState('#000000');
  const [positionColor, setPositionColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#000000');
  const [lineColor, setLineColor] = useState('#000000');
  const [logo, setLogo] = useState<File | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);  // For showing modal when credits are exhausted
  const [credits, setCredits] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  const loaderRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();

  // Function to fetch credits
  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error fetching account credits");
      return 0;
    }
  };

  // Handle logo file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLogo(e.target.files[0]);
    }
  };

  // Handle background selection
  const handleBackgroundSelection = (image: any) => {
    setSelectedBackground(image);
  };

  // Generate Visiting Card
  const handleGenerateCard = async () => {
    if (!name || !position || !phone || !email ) {
      toast.error('All fields are required!');
      return;
    }

    if (
      !validateInput(name) ||
      !validateInput(position)||
      !validateInput(phone)||
      !validateInput(email)||
      !validateInput(address)||
      !validateInput(company)
    ) {
      toast.error('Your input contains prohibited words. Please remove them and try again.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    // Scroll to loader
    setTimeout(() => {
      loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Check credits
    const currentCredits = await getCredits();
    if (currentCredits <= 0) {
      setIsLoading(false);
      setShowModal(true);
      return;
    }

    // Add logo and background to form data
    if (logo) formData.append('logo', logo);
    if (selectedBackground) {
      try {
        const response = await fetch(selectedBackground.src);
        const imageBlob = await response.blob();
        formData.append('background', imageBlob, selectedBackground.name);
      } catch (error) {
        toast.error('Failed to load background image.');
        setIsLoading(false);
        return;
      }
    }

    formData.append('name', name);
    formData.append('position', position);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('company', company);
    formData.append('backgroundColor', backgroundColor);
    formData.append('nameColor', nameColor);
    formData.append('positionColor', positionColor);
    formData.append('textColor', textColor);
    formData.append('lineColor', lineColor);
    formData.append('includeCompanyOnBack', includeCompanyOnBack ? 'true' : 'false');
    formData.append('includeLogoOnFront', includeLogoOnFront ? 'true' : 'false');


    try {
      const response = await axios.post(`${BASE_URL}/response/visiting?clerkId=${userId}`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      toast.success('Visiting card generated successfully!');
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Error generating card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && pdfUrl) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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




  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
<h1 className='text-center underline text-xl mb-5 font-semibold'>Front Side</h1>
<div className='flex gap-5 w-full'>
  <div className='w-2/3'>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Full Name<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="e.g., John Doe"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
  <div className="mb-4 w-1/3">
          <label className="block text-sm font-semibold mb-2">Choose Your Name Color:</label>
          <input
            type="color"
            value={nameColor}
            onChange={(e) => setNameColor(e.target.value)}
            className='w-14 h-12'
          />
        </div>
        </div> 
        <div className='flex gap-5 w-full'> 
  <div className='w-2/3'>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Job Title<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={position}
      onChange={(e) => setPosition(e.target.value)}
      placeholder="e.g., Software Engineer"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
  <div className="mb-4 w-1/3">
          <label className="block text-sm font-semibold mb-2">Choose Your Job Title Color:</label>
          <input
            type="color"
            value={positionColor}
            onChange={(e) => setPositionColor(e.target.value)}
            className='w-14 h-12'
          />
        </div>
  </div> 
  <div className='mb-5'>
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

<div>
  <label className="block text-sm font-semibold mb-2">
    Enter Your Email Address<span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => handleEmailChange(e.target.value)}  // Call custom function for email validation
    placeholder="e.g., john.doe@example.com"
    className={`block w-full p-3 border rounded-md focus:outline-none ${emailError ? 'border-red-500' : 'focus:border-blue-500'}`}  // Change border color on error
    required
  />
  {emailError && (
    <span className="text-red-500 text-sm mt-2">
      Please enter a valid email address.
    </span>
  )}
</div>

  <div>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Registered Business Address:
    </label>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="e.g., 123 Main St, City, Country"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      maxLength={50}
      required
    />
  </div>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mt-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Choose Text Color:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className='w-14 h-12'
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Choose Line Color:</label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className='w-14 h-12'
          />
        </div>
      </div>

      <div className="mt-6 mb-5">
  <label className="block text-sm font-semibold mb-2">Would You like to Add Logo</label>
  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        value="true"
        checked={includeLogoOnFront === true}
        onChange={() => setIncludeLogoOnFront(true)}
        className="mr-2"
      />
      Yes
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        value="false"
        checked={includeLogoOnFront === false}
        onChange={() => setIncludeLogoOnFront(false)}
        className="mr-2"
      />
      No
    </label>
  </div>
</div>

      <h1 className='text-center underline text-xl mb-5 font-semibold'>Back Side</h1>

      

      <div className="mt-6 mb-5">
  <label className="block text-sm font-semibold mb-2">
    Upload Your Company Logo (Supported Image: Jpg/Png):
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="block w-full p-3 border rounded-md"
  />
</div>
<div className="mt-6 mb-5">
  <label className="block text-sm font-semibold mb-2">Would You like to Add Company Name</label>
  <div className="flex gap-4">
    <label className="flex items-center">
      <input
        type="radio"
        value="true"
        checked={includeCompanyOnBack === true}
        onChange={() => setIncludeCompanyOnBack(true)}
        className="mr-2"
      />
      Yes
    </label>
    <label className="flex items-center">
      <input
        type="radio"
        value="false"
        checked={includeCompanyOnBack === false}
        onChange={() => setIncludeCompanyOnBack(false)}
        className="mr-2"
      />
      No
    </label>
  </div>
</div>

{includeCompanyOnBack && (
  <div>
    <label className="block text-sm font-semibold mb-2">
      Enter Your Company Name
    </label>
    <input
      type="text"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      placeholder="e.g., Bigwig Media & Events Pvt Ltd"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
)}



<div className="mt-6 mb-10">
  <label className="block text-sm font-semibold mb-2">Choose any of templates:</label>
  <div className="overflow-x-auto">
    <div className="grid grid-flow-col auto-cols-max gap-3 justify-start">
      {backgroundImages.map((image) => (
        <div
          key={image.id}
          className={`cursor-pointer p-2 border-2 rounded-md transition-colors duration-300 ${
            selectedBackground?.id === image.id ? 'border-blue-500' : 'border-gray-200'
          }`}
          onClick={() => handleBackgroundSelection(image)}
        >
          <img
            src={image.src}
            alt={image.name}
            className="md:w-52 md:h-32 w-44 h-28 object-cover rounded"
          />
        </div>
      ))}
    </div>
  </div>
</div>

<h1 className='font-semibold mb-2'>Sample Visiting Card:</h1>
      <div className='flex justify-start gap-5'>
        <div className='w-1/3 text-center' >
        <img src={front} alt=""/>
        <p className='font-semibold'>Front Side</p>
        </div>
        <div className='w-1/3 text-center' >
        <img src={back} alt="" />
        <p className='font-semibold'>Back Side</p>
        </div>
        
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerateCard}
          disabled={isLoading}
        >
          {isLoading ?  'Generating...' : (pdfUrl? "Regenerate" : 'Generate')}
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
              <h2 className="text-xl font-bold mb-4">Generated Visiting Card:</h2>
              <iframe
                src={pdfUrl}
                title="Generated Visiting Card"
                className="w-full sm:hidden"
                style={{ height: '130vh' }}
                frameBorder="0"
              />
              <div className="flex justify-center ">
              <button
                className="mt-5 text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = pdfUrl;
                  a.download = "converted.pdf";
                  a.click();
                }}
              title="Download">
                Download Visiting Card
              </button>
                </div>
            </div>
          )
        )}
      </div>

      {showModal && <CreditLimitModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
}
