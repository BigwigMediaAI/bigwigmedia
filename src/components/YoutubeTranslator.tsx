import React from 'react';
import { VideoDownloader } from './Youtube'; 
import { VideoTranslation } from './TranslateVideo2Audio';
import { VideoTranslator } from './VideoTranslator';

export function YoutubeTranslator() {
  return (

     <>
     <div className='mb-10'>
      <VideoDownloader />
      </div>
    <h1 className='text-center text-2xl font-semibold mb-5'>👇 First Download the Video and Upload below 👇</h1>
      <VideoTranslator />
      </> 
  );
}

export default YoutubeTranslator;
