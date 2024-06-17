import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from "@clerk/clerk-react";
import { BASE_URL } from "@/utils/funcitons";

interface AvatarOptions {
  avatarStyle: string;
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  facialHairColor: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
  hatColor: string;
}

export function AvatarTool() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>({
    avatarStyle: 'Circle',
    topType: 'ShortHairShortFlat',
    accessoriesType: 'Blank',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    facialHairColor: 'BrownDark',
    clotheType: 'BlazerShirt',
    clotheColor: 'Red',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Default',
    skinColor: 'Light',
    hatColor: 'White',
  });

  useEffect(() => {
    generateAvatar();
  }, []);

  useEffect(() => {
    generateAvatar();
  }, [avatarOptions]);

  const generateAvatar = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/response/avatar`, {
        params: avatarOptions,
        responseType: 'blob',
      });
      
      const avatarBlob = new Blob([response.data], { type: 'image/jpeg' });
      const avatarUrl = URL.createObjectURL(avatarBlob);
      console.log(avatarUrl)
      setAvatarUrl(avatarUrl);
    } catch (error) {
      console.error('Error generating avatar:', error);
      toast.error('Error generating avatar. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvatarOptions({
      ...avatarOptions,
      [e.target.name]: e.target.value,
    });
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/response/avatar`, {
        params: avatarOptions,
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'avatar.jpg';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading avatar:', error);
      toast.error('Error downloading avatar. Please try again later.');
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
      <div className="flex flex-col items-center mb-5">
        <h1 className="text-2xl font-bold mb-4">Avatar Generator</h1>
        <div className="relative rounded-full border border-gray-300 h-40 w-40 flex justify-center items-center mb-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Generated Avatar" className="rounded-full" />
          ) : (
            <RefreshCw className="animate-spin h-6 w-6 text-gray-500" />
          )}
          {avatarUrl && (
            <button
              onClick={handleDownload}
              className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <Download className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Avatar Style</label>
          <select
            name="avatarStyle"
            value={avatarOptions.avatarStyle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Circle">Circle</option>
            <option value="Transparent">Transparent</option>
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Top Type</label>
          <select
            name="topType"
            value={avatarOptions.topType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="ShortHairShortFlat">ShortHairShortFlat</option>
            <option value="WinterHat4">WinterHat4</option>
            <option value="LongHairStraight">LongHairStraight</option>
            <option value="Hat">Hat</option>
            <option value="Hijab">Hijab</option>
            <option value="Turban">Turban</option>
            <option value="LongHairBun">LongHairBun</option>
            <option value="LongHairCurly">LongHairCurly</option>
            <option value="ShortHairDreads01">ShortHairDreads01</option>
            <option value="ShortHairDreads02">ShortHairDreads02</option>
            <option value="NoHair">NoHair</option>
            <option value="Eyepatch">Eyepatch</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Accessories Type</label>
          <select
            name="accessoriesType"
            value={avatarOptions.accessoriesType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Blank">Blank</option>
            <option value="Prescription01">Prescription01</option>
            <option value="Prescription02">Prescription02</option>
            <option value="Round">Round</option>
            <option value="Sunglasses">Sunglasses</option>
            <option value="Wayfarers">Wayfarers</option>
            <option value="Kurt">Kurt</option>
            <option value="Square">Square</option>
            <option value="Hoodie">Hoodie</option>
            <option value="GraphicShirt">GraphicShirt</option>
            <option value="Blank">Blank</option>
            <option value="Kurt">Kurt</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Hair Color</label>
          <select
            name="hairColor"
            value={avatarOptions.hairColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="BrownDark">BrownDark</option>
            <option value="Auburn">Auburn</option>
            <option value="Black">Black</option>
            <option value="Blonde">Blonde</option>
            <option value="BlondeGolden">BlondeGolden</option>
            <option value="Brown">Brown</option>
            <option value="PastelPink">PastelPink</option>
            <option value="Platinum">Platinum</option>
            <option value="Red">Red</option>
            <option value="SilverGray">SilverGray</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Facial Hair Type</label>
          <select
            name="facialHairType"
            value={avatarOptions.facialHairType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Blank">Blank</option>
            <option value="BeardLight">BeardLight</option>
            <option value="BeardMagestic">BeardMagestic</option>
            <option value="BeardMedium">BeardMedium</option>
            <option value="MoustacheFancy">MoustacheFancy</option>
            <option value="MoustacheMagnum">MoustacheMagnum</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Facial Hair Color</label>
          <select
            name="facialHairColor"
            value={avatarOptions.facialHairColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="BrownDark">BrownDark</option>
            <option value="Auburn">Auburn</option>
            <option value="Black">Black</option>
            <option value="Blonde">Blonde</option>
            <option value="BlondeGolden">BlondeGolden</option>
            <option value="Brown">Brown</option>
            <option value="Platinum">Platinum</option>
            <option value="Red">Red</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Clothe Type</label>
          <select
            name="clotheType"
            value={avatarOptions.clotheType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="BlazerShirt">BlazerShirt</option>
            <option value="ShirtVNeck">ShirtVNeck</option>
            <option value="Hoodie">Hoodie</option>
            <option value="GraphicShirt">GraphicShirt</option>
            <option value="CollarSweater">CollarSweater</option>
            <option value="Overall">Overall</option>
            <option value="BlazerSweater">BlazerSweater</option>
            <option value="Sweater">Sweater</option>
            <option value="ShirtScoopNeck">ShirtScoopNeck</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Clothe Color</label>
          <select
            name="clotheColor"
            value={avatarOptions.clotheColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Red">Red</option>
            <option value="Black">Black</option>
            <option value="Blue01">Blue01</option>
            <option value="Blue02">Blue02</option>
            <option value="Blue03">Blue03</option>
            <option value="Gray01">Gray01</option>
            <option value="Gray02">Gray02</option>
            <option value="Heather">Heather</option>
            <option value="PastelBlue">PastelBlue</option>
            <option value="PastelGreen">PastelGreen</option>
            <option value="PastelOrange">PastelOrange</option>
            <option value="PastelRed">PastelRed</option>
            <option value="PastelYellow">PastelYellow</option>
            <option value="Pink">Pink</option>
            <option value="Red">Red</option>
            <option value="White">White</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Eye Type</label>
          <select
            name="eyeType"
            value={avatarOptions.eyeType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Default">Default</option>
            <option value="Close">Close</option>
            <option value="Cry">Cry</option>
            <option value="Dizzy">Dizzy</option>
            <option value="EyeRoll">EyeRoll</option>
            <option value="Happy">Happy</option>
            <option value="Hearts">Hearts</option>
            <option value="Side">Side</option>
            <option value="Squint">Squint</option>
            <option value="Surprised">Surprised</option>
            <option value="Wink">Wink</option>
            <option value="WinkWacky">WinkWacky</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Eyebrow Type</label>
          <select
            name="eyebrowType"
            value={avatarOptions.eyebrowType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Default">Default</option>
            <option value="UpDown">UpDown</option>
            <option value="RaisedExcited">RaisedExcited</option>
            <option value="Angry">Angry</option>
            <option value="UnibrowNatural">UnibrowNatural</option>
            <option value="FlatNatural">FlatNatural</option>
            <option value="RaisedExcitedNatural">RaisedExcitedNatural</option>
            <option value="SadConcernedNatural">SadConcernedNatural</option>
            <option value="RaisedExcitedOutline">RaisedExcitedOutline</option>
            <option value="UpDownOutline">UpDownOutline</option>
            <option value="RaisedExcitedHappy">RaisedExcitedHappy</option>
            <option value="UnibrowNatural">UnibrowNatural</option>
            <option value="FlatNatural">FlatNatural</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Mouth Type</label>
          <select
            name="mouthType"
            value={avatarOptions.mouthType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Default">Default</option>
            <option value="Smile">Smile</option>
            <option value="Twinkle">Twinkle</option>
            <option value="Disbelief">Disbelief</option>
            <option value="Tongue">Tongue</option>
            <option value="Twinkle">Twinkle</option>
            <option value="Eating">Eating</option>
            <option value="Sad">Sad</option>
            <option value="Serious">Serious</option>
            <option value="Concerned">Concerned</option>
            <option value="SadConcerned">SadConcerned</option>
            <option value="ScreamOpen">ScreamOpen</option>
            <option value="SadConcernedNatural">SadConcernedNatural</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Skin Color</label>
          <select
            name="skinColor"
            value={avatarOptions.skinColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="Light">Light</option>
            <option value="DarkBrown">DarkBrown</option>
            <option value="Pale">Pale</option>
            <option value="Yellow">Yellow</option>
            <option value="Tanned">Tanned</option>
            <option value="Yellow">Yellow</option>
            <option value="Pale">Pale</option>
            <option value="Red">Red</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Brown">Brown</option>
            <option value="Dark">Dark</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 dark:text-gray-300">Hat Color</label>
          <select
            name="hatColor"
            value={avatarOptions.hatColor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 p-3 mb-4"
          >
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Blue01">Blue01</option>
            <option value="Blue02">Blue02</option>
            <option value="Blue03">Blue03</option>
            <option value="Gray01">Gray01</option>
            <option value="Gray02">Gray02</option>
            <option value="Heather">Heather</option>
            <option value="PastelBlue">PastelBlue</option>
            <option value="PastelGreen">PastelGreen</option>
            <option value="PastelOrange">PastelOrange</option>
            <option value="PastelRed">PastelRed</option>
            <option value="PastelYellow">PastelYellow</option>
            <option value="Pink">Pink</option>
            <option value="Red">Red</option>
          </select>
        </div>

      </div>
    </div>
  );
}
