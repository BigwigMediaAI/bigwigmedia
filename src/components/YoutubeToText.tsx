import React from 'react';
import { VideoDownloader } from './Youtube'; // Adjust the import path as needed
import { VideoToTextConverter } from './VideoToText';

export function YoutubeToText() {
  return (

     <>
     <div className='mb-10'>
      <VideoDownloader />
      </div>
    <h1 className='text-center text-2xl font-semibold mb-5'>👇 First Download the Video and Upload below 👇</h1>
      <VideoToTextConverter />
      </> 
  );
}

export default YoutubeToText;
