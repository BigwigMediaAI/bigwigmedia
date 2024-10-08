// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import thumbnail from "../assets/video.svg"; // Import default thumbnail image
// import { Loader2 } from "lucide-react";
// import { FaSyncAlt, FaDownload, FaShareAlt } from "react-icons/fa";

// export function InstagramDownloader() {
//   const [postLink, setPostLink] = useState<string>("");
//   const [downloadLinks, setDownloadLinks] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [thumbnails, setThumbnails] = useState<string[]>([]); // State for thumbnails
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [hasFetched, setHasFetched] = useState<boolean>(false);
//   const loaderRef = useRef<HTMLDivElement>(null);
//   const resultsRef = useRef<HTMLDivElement>(null);

//   const handleDownload = async (retryCount = 0) => {
//     setIsLoading(true);
//     setErrorMessage(null); // Reset the error message

//     // Scroll to loader after a short delay to ensure it's rendered
//     setTimeout(() => {
//       loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }, 100);

//     try {
//       const response = await axios.get('https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/', {
//         params: { url: postLink },
//         headers: {
//           'X-RapidAPI-Key': 'f3b1fe477bmsh8883dd78bae0b6bp145d5ejsnbfdf6e9ba144',
//           'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader.p.rapidapi.com'
//         }
//       });

//       if (response.data.status) {
//         const videos = response.data.result.filter((item: any) => item.type === 'video/mp4');
//         const videoLinks = videos.map((video: any) => video.url);
//         setDownloadLinks(videoLinks);

//         // Extract thumbnails from the response
//         const videoThumbnails = videos.map((video: any) => video.thumb || thumbnail); // Use video thumbnail if available, otherwise use default thumbnail
//         setThumbnails(videoThumbnails);

//         setHasFetched(true); // Indicate that fetching is done
//       } else {
//         setErrorMessage("API returned no video data: " + JSON.stringify(response.data));
//       }
//     } catch (error) {
//       if (retryCount < 2) {
//         // Retry up to 3 times
//         console.log(retryCount)
//         handleDownload(retryCount + 1);
//       } else {
//         if (error instanceof Error) {
//           setErrorMessage("Error: " + error.message);
//         } else {
//           setErrorMessage("An unknown error occurred.");
//         }
//       }
//     } finally {
//       // Ensure loading state is reset regardless of outcome
//       setIsLoading(false);
//     }
//   };

//   const handleDownloadClick = (url: string) => {
//     window.open(url, '_blank');
//   };

//   const handleShareClick = (url: string) => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'Instagram Video',
//         text: 'Check out this video!',
//         url: url
//       }).catch(console.error);
//     } else {
//       alert('Sharing is not supported in your browser.');
//     }
//   };

//   const handleRefresh = () => {
//     window.location.reload();
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPostLink(e.target.value);
//     setDownloadLinks([]); // Clear the download links
//     setThumbnails([]); // Clear the thumbnails
//     setHasFetched(false); // Reset the fetch status
//   };

//   useEffect(() => {
//     if (!isLoading && downloadLinks.length > 0) {
//       resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [isLoading, downloadLinks]);

//   return (
//     <div className="m-auto w-full max-w-xl mx-auto mt-8 bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
//       <h3 className="text-base mb-2 text-[var(--primary-text-color)]">Copy any video link from Instagram and paste it in the box below:</h3>
//       <div className="flex items-center mb-4">
//         <input
//           type="text"
//           value={postLink}
//           onChange={handleInputChange}
//           placeholder="Paste Instagram Video Link"
//           className="w-full px-4 py-2 rounded-md border border-[var(--primary-text-color)] focus:outline-none focus:border-blue-500"
//         />
//         <button onClick={handleRefresh} className="ml-2 text-blue-500 hover:text-blue-700">
//           <FaSyncAlt />
//         </button>
//       </div>
//       <div className="flex justify-center">
//         <button
//           onClick={() => handleDownload()}
//           disabled={isLoading || !postLink || hasFetched}
//           className={`text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full ${
//             isLoading || !postLink || hasFetched ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)]'
//           }`}
//         >
//           {isLoading ? 'Getting Videos...' : 'Get All Videos'}
//         </button>
//       </div>
//       <div className="w-full pl-2 flex flex-col gap-2 justify-between">
//         {isLoading ? (
//           <div ref={loaderRef} className="w-full h-full flex flex-col items-center justify-center">
//             <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
//             <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
//           </div>
//         ) : (
//           <>
//             {errorMessage && (
//               <div className="text-red-500 mt-4">
//                 {errorMessage}
//               </div>
//             )}
//             {thumbnails.length > 0 && (
//               <div ref={resultsRef} className="flex flex-col gap-4 mt-4">
//                 {thumbnails.map((thumbnail, index) => (
//                   <div
//                     key={index}
//                     className="relative flex items-center p-2 border border-gray-300 rounded-md transition-colors"
//                   >
//                     <img src={thumbnail} alt={`Thumbnail ${index + 1}`} className="w-16 h-auto rounded-md mr-4" />
//                     <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
//                       <button
//                         onClick={() => handleDownloadClick(downloadLinks[index])}
//                         className="p-2 text-[var(--dark-gray-color)] rounded-full hover:bg-[var(--teal-color)] hover:text-[var(--white-color)]"
//                         title="Download"
//                       >
//                         <FaDownload />
//                       </button>
//                       <button
//                         onClick={() => handleShareClick(downloadLinks[index])}
//                         className="p-2 text-[var(--dark-gray-color)] rounded-full hover:bg-[var(--teal-color)] hover:text-[var(--white-color)]"
//                         title="Share"
//                       >
//                         <FaShareAlt />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <h3 className="text-sm mt-4 italic text-gray-700">Hint - To copy video link from Instagram, click on share button then click on copy link option.</h3>
//     </div>
//   );
// }
