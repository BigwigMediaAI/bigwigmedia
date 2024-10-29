import React, { useState, useRef, useEffect } from 'react';
import { VideoDownloader } from './Youtube';
import { VideoToArticle } from './VideoToArticle';

export function GenerateYTArticle() {

  return (
    
    <div className="m-auto w-full max-w-4xl rounded-lg bg-white p-6 shadow-md shadow-[var(--teal-color)]">
        <VideoDownloader  />
        <h1 className='mt-10 text-center text-2xl font-semibold mb-5'>👇 First Download the Video and Upload below 👇</h1>
        
    <VideoToArticle />
    </div>
  );
}
