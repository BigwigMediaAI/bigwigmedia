import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import '../App.css';
import background1 from '../assets/5103ebbd814dce9ea69a85d083e16db9.jpg';
import background2 from '../assets/Blank-Business-Card-Templates-141.jpg';
import background3 from '../assets/abstract-blank-name-card-template-for-business-artwork-eps-10-J953R6.jpg';
import background4 from '../assets/Screenshot (72).jpg'
import background5 from '../assets/Screenshot (73).jpg'
import background6 from '../assets/Screenshot (74).jpg'
import background8 from '../assets/Screenshot (77).jpg'
import background9 from '../assets/Screenshot (78).jpg'
import background10 from '../assets/Screenshot (79).jpg'
import background7 from '../assets/Screenshot (80).jpg'
import CreditLimitModal from './Model3';  // Modal to handle credit exhaustion
import { useAuth } from '@clerk/clerk-react';
import { BASE_URL,BASE_URL2 } from '@/utils/funcitons';
import { validateInput } from '@/utils/validateInput';

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
  { id: 7, src: background7, name: 'Background 7' }
];

export function GenerateVisitingCard() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [nameColor, setNameColor] = useState('#000000');
  const [positionColor, setPositionColor] = useState('#a2a2a3');
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
    if (!name || !position || !phone || !email || !address || !company) {
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

    try {
      const response = await axios.post(`${BASE_URL}/response/visiting`, formData, {
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

<div className="grid md:grid-cols-2 grid-cols-1 gap-6">
  <div>
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
  <div>
    <label className="block text-sm font-semibold mb-2">
      Specify Your Job Position or Title<span className="text-red-500">*</span>
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
  <div>
  <label className="block text-sm font-semibold mb-2">
    Provide Your Contact Phone Number<span className="text-red-500">*</span>
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
    Enter a Valid Email Address<span className="text-red-500">*</span>
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
      Enter Your Complete Residential or Office Address<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="e.g., 123 Main St, City, Country"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      maxLength={30}
      required
    />
  </div>
  <div>
    <label className="block text-sm font-semibold mb-2">
      Provide the Name of Your Company or Organization<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      placeholder="e.g., ABC Corporation"
      className="block w-full p-3 border rounded-md focus:border-blue-500 focus:outline-none"
      required
    />
  </div>
</div>




      <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mt-6">

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Choose a Color for Your Name:</label>
          <input
            type="color"
            value={nameColor}
            onChange={(e) => setNameColor(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Select the Color for Your Job Position Title:</label>
          <input
            type="color"
            value={positionColor}
            onChange={(e) => setPositionColor(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Choose a General Text Color for the Card:</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Pick a Color for the Separator Line:</label>
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
  <label className="block text-sm font-semibold mb-2">
    Upload Your Company Logo (Jpg Only):
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="block w-full p-3 border rounded-md"
  />
</div>


      <div className="mt-6">
        <label className="block text-sm font-semibold mb-2">Choose any of templates:</label>
        <div className="flex flex-wrap justify-center space-x-4">
          {backgroundImages.map((image) => (
            <div
              key={image.id}
              className={`cursor-pointer p-2 border-2 rounded-md transition-colors duration-300 ${
                selectedBackground?.id === image.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => handleBackgroundSelection(image)}
            >
              <img src={image.src} alt={image.name} className="md:w-40 md:h-28 w-36 h-24 object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-5 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
          onClick={handleGenerateCard}
          disabled={isLoading}
        >
          {isLoading ?  'Generating...' : (pdfUrl? "Regenerate" : 'Generate')}
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
              <h2 className="text-xl font-bold mb-4">Generated Visiting Card:</h2>
              <iframe
                src={pdfUrl}
                title="Generated Visiting Card"
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
