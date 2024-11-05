import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BASE_URL, BASE_URL2 } from '@/utils/funcitons';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'sonner';
import BigwigLoader from '@/pages/Loader';
import CreditLimitModal from './Model3';

const ImageOverlay: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const { getToken, isLoaded, isSignedIn, userId } = useAuth();
    const loaderRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [showModal3, setShowModal3] = useState(false);
    const [credits, setCredits] = useState(0);

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        }
    };

    const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBackgroundImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

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

        const formData = new FormData();
        if (mainImage) formData.append('mainImage', mainImage);
        if (backgroundImage) formData.append('backgroundImage', backgroundImage);

        try {
            const response = await axios.post(`${BASE_URL}/response/overlay`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob', // Set the response type to blob
            });

            // Create a URL for the image blob
            const imageBlob = new Blob([response.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(imageBlob);
            setResultImage(imageUrl); // Set the generated image URL
        } catch (error) {
            console.error('Error uploading images:', error);
        }finally {
            setIsLoading(false);
          }
    };

    useEffect(() => {
        if (!isLoading && resultImage) {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, [isLoading, resultImage]);

    return (
        <div className="m-auto w-full max-w-4xl rounded-lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
            <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2 font-semibold" htmlFor="mainImage">Upload Main Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="mb-4 border-1 border-gray-700 p-3 rounded-md"
                    required
                />
                <label className="mb-2 font-semibold" htmlFor="backgroundImage">Upload Background Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageChange}
                    className="mb-4 border-1 border-gray-700 p-3 rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                >
                     {isLoading ? 'Changing...' :  'Change Background'}
                </button>
            </form>

            <div className="mt-5">
        {isLoading ? (
        <div ref={loaderRef} className="w-full flex flex-col items-center justify-center mt-10">
        <BigwigLoader />
        <p className="text-[var(--dark-gray-color)] text-ceter mt-5">Processing your data. Please bear with us as we ensure the best results for you...</p>
          </div>
        ) : (
            resultImage && (
                <div className="mt-4 flex-col items-center justify-center">
                    <img
                        src={resultImage}
                        alt="Result"
                        className="rounded-lg shadow-lg max-w-full h-auto mb-4 mx-auto"
                    />
                    <a
                        href={resultImage}
                        download="overlay-image.png"
                        className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                    >
                        Download Image
                    </a>
                </div>
            )
        )}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
        </div>
    );
};

export default ImageOverlay;
