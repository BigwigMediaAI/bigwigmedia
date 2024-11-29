// // import React from "react";
// import Nav from "./Nav";
// import Footer from "./Footer";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { BASE_URL } from "@/utils/funcitons";
// import { useAuth } from "@clerk/clerk-react";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { button } from "@nextui-org/react";
// import { ClipboardList } from "lucide-react";
// import { Paraphrase } from "./paraphrase";
// import ImageGenerator from "./ImageGenerator";
// // type Props = {};



// const buttonIcons = [
//   {
//     id: "65b3ceecfecc1dc59cb3de29",
//     name: "Twitter",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="30"
//         height="30"
//         viewBox="0 0 30 30"
//         fill="none"
//         className="dark:invert !w-7 !h-7"
//       >
//         <g clip-path="url(#clip0_1_2688)">
//           <path
//             d="M17.7928 12.7031L28.7208 0H26.1309L16.6425 11.0297L9.06376 0H0.32251L11.783 16.6791L0.32251 30H2.91235L12.9328 18.3523L20.9363 30H29.6775L17.7921 12.7031H17.7928ZM14.2458 16.8258L13.0845 15.165L3.8454 1.94953H7.82321L15.2789 12.615L16.44 14.2758L26.1321 28.1391H22.1548L14.2458 16.8265V16.8258Z"
//             fill="black"
//           />
//         </g>
//         <defs>
//           <clipPath id="clip0_1_2688">
//             <rect width="30" height="30" fill="white" />
//           </clipPath>
//         </defs>
//       </svg>
//     ),
//   },
//   {
//     id: "65b3cfd1fecc1dc59cb3de2f",
//     name: "Facebook",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="34"
//         height="34"
//         viewBox="0 0 34 34"
//         fill="none"
//         className="w-7 h-7"
//       >
//         <g clip-path="url(#clip0_1_2691)">
//           <path
//             d="M34 17C34 7.61122 26.3888 0 17 0C7.61122 0 0 7.61122 0 17C0 25.4851 6.21669 32.5182 14.3438 33.7935V21.9141H10.0273V17H14.3438V13.2547C14.3438 8.99406 16.8818 6.64063 20.765 6.64063C22.6249 6.64063 24.5703 6.97266 24.5703 6.97266V11.1563H22.4267C20.3149 11.1563 19.6562 12.4667 19.6562 13.8112V17H24.3711L23.6174 21.9141H19.6562V33.7935C27.7833 32.5182 34 25.4853 34 17Z"
//             fill="#1877F2"
//           />
//           <path
//             d="M23.6174 21.9141L24.3711 17H19.6562V13.8112C19.6562 12.4666 20.3149 11.1562 22.4267 11.1562H24.5703V6.97266C24.5703 6.97266 22.6249 6.64062 20.7648 6.64062C16.8818 6.64062 14.3438 8.99406 14.3438 13.2547V17H10.0273V21.9141H14.3438V33.7935C15.2225 33.9312 16.1106 34.0002 17 34C17.8894 34.0003 18.7775 33.9312 19.6562 33.7935V21.9141H23.6174Z"
//             fill="white"
//           />
//         </g>
//         <defs>
//           <clipPath id="clip0_1_2691">
//             <rect width="34" height="34" fill="white" />
//           </clipPath>
//         </defs>
//       </svg>
//     ),
//   },
//   {
//     id: "65b3d1b2fecc1dc59cb3de35",
//     name: "Instagram",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="34"
//         height="34"
//         viewBox="0 0 34 34"
//         fill="none"
//         className="w-7 h-7"
//       >
//         <g clip-path="url(#clip0_1_2695)">
//           <path
//             d="M7.96875 0H26.0312C30.4323 0 34 3.56773 34 7.96875V26.0312C34 30.4323 30.4323 34 26.0312 34H7.96875C3.56773 34 0 30.4323 0 26.0312V7.96875C0 3.56773 3.56773 0 7.96875 0Z"
//             fill="url(#paint0_radial_1_2695)"
//           />
//           <path
//             d="M7.96875 0H26.0312C30.4323 0 34 3.56773 34 7.96875V26.0312C34 30.4323 30.4323 34 26.0312 34H7.96875C3.56773 34 0 30.4323 0 26.0312V7.96875C0 3.56773 3.56773 0 7.96875 0Z"
//             fill="url(#paint1_radial_1_2695)"
//           />
//           <path
//             d="M16.9988 3.71875C20.6057 3.71875 21.0585 3.73455 22.4751 3.79897C23.889 3.86378 24.8541 4.08757 25.6986 4.41602C26.5722 4.75522 27.3132 5.20904 28.0513 5.94748C28.7902 6.68578 29.244 7.42674 29.5842 8.29998C29.9136 9.14467 30.1377 10.1102 30.2013 11.5235C30.2646 12.9402 30.2812 13.3931 30.2812 17.0001C30.2812 20.6072 30.2653 21.0585 30.201 22.4751C30.136 23.889 29.9122 24.8541 29.584 25.6986C29.2445 26.5722 28.7907 27.3132 28.0523 28.0513C27.3142 28.7902 26.5733 29.2451 25.7003 29.5843C24.8552 29.9127 23.8899 30.1365 22.4763 30.2013C21.0595 30.2657 20.6072 30.2815 17.0004 30.2815C13.3931 30.2815 12.9418 30.2657 11.5252 30.2013C10.1113 30.1365 9.14507 29.9127 8.29998 29.5843C7.42674 29.2451 6.68684 28.7902 5.94894 28.0513C5.2101 27.3132 4.75641 26.5722 4.41602 25.699C4.08956 24.8541 3.86538 23.8887 3.79897 22.4753C3.73535 21.0588 3.71875 20.6072 3.71875 17.0001C3.71875 13.3931 3.73535 12.9405 3.79897 11.5237C3.86538 10.1098 4.08956 9.14481 4.41602 8.30038C4.75641 7.42674 5.2101 6.68578 5.94894 5.94748C6.68764 5.20877 7.42648 4.75495 8.30078 4.41615C9.14746 4.08757 10.1131 3.86365 11.5271 3.79897C12.9438 3.73455 13.3948 3.71875 17.0029 3.71875H16.9988ZM18.1903 6.11216C17.8366 6.11163 17.442 6.11216 16.9988 6.11216C13.4526 6.11216 13.0324 6.12491 11.632 6.18853C10.3371 6.24777 9.63422 6.46412 9.16605 6.64594C8.54622 6.88659 8.10435 7.1744 7.63977 7.63938C7.17493 8.10422 6.88726 8.54688 6.64594 9.16672C6.46412 9.63422 6.2475 10.3371 6.18853 11.632C6.12491 13.0321 6.1111 13.4526 6.1111 16.9971C6.1111 20.5416 6.12491 20.9622 6.18853 22.3622C6.24776 23.6571 6.46412 24.3599 6.64594 24.8276C6.88659 25.4474 7.17493 25.8887 7.63977 26.3533C8.10462 26.8182 8.54595 27.1058 9.16605 27.3466C9.63369 27.5292 10.3371 27.7451 11.632 27.8043C13.0321 27.8679 13.4526 27.8817 16.9988 27.8817C20.5452 27.8817 20.9655 27.8679 22.3655 27.8043C23.6604 27.7445 24.3633 27.5282 24.8318 27.3464C25.4515 27.1056 25.8943 26.8179 26.3592 26.3531C26.824 25.8882 27.1117 25.4466 27.353 24.8265C27.5348 24.3589 27.7514 23.656 27.8104 22.3611C27.874 20.961 27.8868 20.5405 27.8868 16.9938C27.8868 13.4471 27.874 13.0288 27.8104 11.6287C27.7512 10.3337 27.5348 9.6309 27.353 9.16273C27.1122 8.5429 26.824 8.10023 26.359 7.63539C25.8942 7.17055 25.4515 6.88274 24.8317 6.64156C24.3635 6.45894 23.6604 6.24312 22.3655 6.18362C21.1403 6.12823 20.6655 6.11163 18.1903 6.10884V6.11216ZM9.90927 8.31738C10.7892 8.31738 11.503 9.03059 11.503 9.9106C11.503 10.7905 10.7892 11.5044 9.90927 11.5044C9.02939 11.5044 8.31552 10.7905 8.31552 9.9106C8.31552 9.03072 9.02939 8.31685 9.90927 8.31685V8.31738ZM16.9988 10.1795C20.7654 10.1795 23.8193 13.2334 23.8193 17.0001C23.8193 20.7668 20.7654 23.8193 16.9988 23.8193C13.2321 23.8193 10.1793 20.7668 10.1793 17.0001C10.1793 13.2336 13.2324 10.1795 16.9991 10.1795H16.9988ZM16.9988 12.573C14.5539 12.573 12.5716 14.5549 12.5716 17.0001C12.5716 19.4451 14.5539 21.4273 16.9988 21.4273C19.4439 21.4273 21.4258 19.4451 21.4258 17.0001C21.4258 14.5549 19.4439 12.573 16.9988 12.573Z"
//             fill="white"
//           />
//         </g>
//         <defs>
//           <radialGradient
//             id="paint0_radial_1_2695"
//             cx="0"
//             cy="0"
//             r="1"
//             gradientUnits="userSpaceOnUse"
//             gradientTransform="translate(24.9688 36.6187) rotate(-90) scale(33.6965 31.3404)"
//           >
//             <stop stop-color="#FFDD55" />
//             <stop offset="0.1" stop-color="#FFDD55" />
//             <stop offset="0.5" stop-color="#FF543E" />
//             <stop offset="1" stop-color="#C837AB" />
//           </radialGradient>
//           <radialGradient
//             id="paint1_radial_1_2695"
//             cx="0"
//             cy="0"
//             r="1"
//             gradientUnits="userSpaceOnUse"
//             gradientTransform="translate(39.6951 2.4492) rotate(101.319) scale(15.0625 62.0882)"
//           >
//             <stop stop-color="#3771C8" />
//             <stop offset="0.128" stop-color="#3771C8" />
//             <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
//           </radialGradient>
//           <clipPath id="clip0_1_2695">
//             <rect
//               width="34"
//               height="34"
//               fill="white"
//               transform="matrix(-1 0 0 1 34 0)"
//             />
//           </clipPath>
//         </defs>
//       </svg>
//     ),
//   },
//   {
//     id: "65b3cd31fecc1dc59cb3de27",
//     name: "TickTock",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="28"
//         height="32"
//         viewBox="0 0 28 32"
//         fill="none"
//       >
//         <g clip-path="url(#clip0_1_2700)">
//           <path
//             d="M20.7511 11.5224C22.794 12.9949 25.2967 13.8614 27.9997 13.8614V8.61666C27.4881 8.61677 26.9779 8.56292 26.4774 8.456V12.5843C23.7746 12.5843 21.2723 11.718 19.2289 10.2456V20.9486C19.2289 26.3028 14.9244 30.6429 9.61485 30.6429C7.63374 30.6429 5.7923 30.039 4.2627 29.0032C6.00854 30.8033 8.44323 31.9198 11.1367 31.9198C16.4466 31.9198 20.7513 27.5798 20.7513 22.2253V11.5224H20.7511ZM22.6291 6.23112C21.585 5.08099 20.8994 3.59465 20.7511 1.95139V1.27686H19.3085C19.6717 3.36535 20.9103 5.14963 22.6291 6.23112ZM7.62094 24.8946C7.03764 24.1235 6.72233 23.18 6.72374 22.2099C6.72374 19.7612 8.6926 17.7756 11.1217 17.7756C11.5743 17.7754 12.0243 17.8455 12.4558 17.9834V12.6214C11.9515 12.5518 11.4427 12.5221 10.9341 12.533V16.7065C10.5025 16.5684 10.0523 16.4984 9.59943 16.4988C7.17043 16.4988 5.20168 18.4841 5.20168 20.9332C5.20168 22.665 6.18573 24.1642 7.62094 24.8946Z"
//             fill="#FF004F"
//           />
//           <path
//             d="M19.2287 10.2455C21.2722 11.7179 23.7744 12.5842 26.4772 12.5842V8.45589C24.9685 8.13181 23.6329 7.33688 22.6288 6.23112C20.9099 5.14952 19.6715 3.36524 19.3084 1.27686H15.5193V22.225C15.5106 24.6672 13.5452 26.6446 11.1213 26.6446C9.6931 26.6446 8.42413 25.9581 7.62055 24.8945C6.18555 24.1642 5.2014 22.6649 5.2014 20.9333C5.2014 18.4845 7.17015 16.4989 9.59915 16.4989C10.0645 16.4989 10.5131 16.572 10.9339 16.7066V12.5331C5.71754 12.6418 1.52246 16.9395 1.52246 22.2252C1.52246 24.8637 2.5671 27.2557 4.26263 29.0034C5.79224 30.039 7.63357 30.6431 9.61479 30.6431C14.9244 30.6431 19.2289 26.3027 19.2289 20.9486L19.2287 10.2455Z"
//             fill="white"
//           />
//           <path
//             d="M26.477 8.45572V7.3397C25.1164 7.34178 23.7828 6.95759 22.6285 6.23106C23.6503 7.35902 24.9957 8.13686 26.477 8.45595M19.308 1.27669C19.2734 1.07714 19.2468 0.87626 19.2283 0.674538V0H13.9965V20.9484C13.9882 23.3903 12.0227 25.3677 9.59875 25.3677C8.91157 25.3688 8.23379 25.2067 7.62016 24.8947C8.42373 25.9581 9.6927 26.6444 11.1209 26.6444C13.5447 26.6444 15.5104 24.6673 15.5189 22.2251V1.2768L19.308 1.27669ZM10.9338 12.533V11.3447C10.4966 11.2844 10.0559 11.2542 9.61461 11.2544C4.30445 11.2544 0 15.5947 0 20.9484C0 24.305 1.6917 27.2631 4.26245 29.0031C2.56692 27.2555 1.52228 24.8634 1.52228 22.225C1.52228 16.9395 5.71725 12.6417 10.9338 12.533Z"
//             fill="#00F2EA"
//           />
//         </g>
//         <defs>
//           <clipPath id="clip0_1_2700">
//             <rect width="28" height="32" fill="white" />
//           </clipPath>
//         </defs>
//       </svg>
//     ),
//   },
//   {
//     id: "65b3d2acfecc1dc59cb3de39",
//     name: "Threads",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="32"
//         height="32"
//         viewBox="0 0 32 32"
//         fill="none"
//         className="invert  dark:invert-0"
//       >
//         <path
//           d="M12.642 12.032C12.102 11.672 10.31 10.428 10.31 10.428C11.822 8.266 13.816 7.424 16.574 7.424C18.524 7.424 20.18 8.078 21.362 9.32C22.544 10.562 23.218 12.338 23.372 14.608C24.028 14.884 24.6313 15.2067 25.182 15.576C27.4 17.066 28.62 19.296 28.62 21.85C28.62 27.282 24.168 32 16.108 32C9.188 32 2 27.974 2 15.988C2 4.068 8.964 0 16.088 0C19.38 0 27.1 0.485999 30 10.072L27.28 10.778C25.032 3.948 20.326 2.86 16.012 2.86C8.882 2.86 4.848 7.202 4.848 16.44C4.848 24.726 9.356 29.126 16.108 29.126C21.662 29.126 25.802 26.24 25.802 22.014C25.802 19.138 23.386 17.76 23.262 17.76C22.79 20.228 21.526 24.38 15.974 24.38C12.738 24.38 9.948 22.144 9.948 19.216C9.948 15.036 13.916 13.522 17.048 13.522C18.22 13.522 19.636 13.602 20.374 13.75C20.374 12.476 19.294 10.294 16.574 10.294C14.074 10.294 13.442 11.104 12.64 12.03L12.642 12.032ZM17.432 16.38C13.352 16.38 12.824 18.12 12.824 19.212C12.824 20.968 14.91 21.548 16.024 21.548C18.064 21.548 20.158 20.984 20.488 16.702C19.4866 16.4684 18.4601 16.3602 17.432 16.38Z"
//           fill="white"
//         />
//       </svg>
//     ),
//   },
// ];

// interface Tool {
//   _id: String;
//   name: String;
//   description: String;
//   logo: string;
//   labels: String[];
//   faq: {
//     question: string;
//     answer: string;
//   }[];
// }

// interface Icon {
//   _id: String;
//   name: String;
//   logo: String;
// }

// function manipulate(bio: string) {
//   // Convert the bio to lowercase for case-insensitive matching
//   const lowerCaseBio = bio?.toLowerCase();

//   // Check if "ai" is present in the bio
//   const containsAI = lowerCaseBio?.includes("ai");

//   // Check if "generator" is present in the bio
//   const containsGenerator = lowerCaseBio?.includes("generator");

//   // Remove "ai" from the bio
//   const bioWithoutAI = containsAI ? bio.replace(/ai/gi, "") : bio;

//   // Remove "Generator!" from the bio (if present)
//   const bioWithoutGenerator = containsGenerator
//     ? bioWithoutAI.replace(/generator[!]?/gi, "")
//     : bioWithoutAI;

//   // Trim any extra spaces resulting from the removals
//   const finalBio = bioWithoutGenerator?.trim();

//   return finalBio;
// }

// const Generate = () => {
//   const [description, setDescription] = useState<Tool | undefined>();
//   const [text, settext] = useState("");
//   const [output, setOutput] = useState("");
//   const [hashTag, setHashTag] = useState(true);
//   const [icons, setIcons] = useState(true);
//   const urlParams = new URLSearchParams(window.location.search);
//   const id = urlParams.get("id");
//   const { getToken, isLoaded, isSignedIn, userId } = useAuth();
//   const [selectedButton, setSelectedButton] = useState("Professional");
//   const [isLoading, setIsLoading] = useState(false);
//   const [relatedTemplates, setrelatedTemplates] = useState<Icon[]>([]);

//   // Define the array of button labels
//   const buttonLabels = [
//     "Professional",
//     "Informal",
//     "Humorous",
//     "Creative",
//     "Minimal",
//   ];


//   // Function to handle button click
//   const handleButtonClick = (selected: string) => {
//     setSelectedButton(selected);
//   };

//   const navigate = useNavigate();

//   const getData = async () => {
//     const res = await axios.get(`${BASE_URL}/templates/get/${id}`);
//     setrelatedTemplates(res.data.relatedTempletes);
//     setDescription(res.data.data);
//   };

//   const handleSubmit = async (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     //@ts-ignore
//     setIsLoading(true);
//     e.preventDefault();
//     if (!isSignedIn) {
//       navigate("/login");
//       toast.error("Please Signin to continue");
//       return;
//     }
//     if (!text) {
//       toast.error("Please enter the text to generate");
//       setIsLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.post(`${BASE_URL}/response?clerkId=${userId}`, {
//         prompt: text,
//         tone: selectedButton,
//         useEmoji: icons,
//         useHashTags: hashTag,
//         templateId: id,
//       });

//       console.log(res);

//       if (res.status === 200) {
//         setOutput(res.data.data);
//         setIsLoading(false);
//       } else {
//         toast.error(res.data.error);
//         setIsLoading(false);
//       }
//     } catch (error: any) {
//       // toast.error(error);
//       toast.error(error.response.data.error);
//       setIsLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     try {
//       navigator.clipboard.writeText(output);
//       toast.success("Copied to Clipboard");
//     } catch (error) {
//       toast.error("Failed to copy");
//     }
//   };

//   useEffect(() => {
//     if (!id) return;
//     window.scrollTo(0, 0);
//     getData();
//   }, [id]);

//   return (
//     <div className="flex flex-col  gap-8 min-h-screen">
//       <Nav />
//       <div className="flex flex-col justify-center items-center gap-4">
//         <h1 className="  dark:text-gredient text-black  text-center font-outfit text-2xl md:text-3xl lg:text-4xl  font-medium">
//           {description?.name}
//         </h1>
//         <p className="  dark:text-white text-black text-center font-outfit max-w-[844px] text-base px-6 lg:text-lg font-base">
//           {description?.description}
//         </p>
//         <div className="flex flex-row justify-center gap-4  md:gap-8 md:w-full max-w-[473px] rounded-full px-3  w-4/5 py-2 border border-gray-500">
//           {relatedTemplates?.slice(0, 5).map((icon, index) => (
//             <Link
//               key={index}
//               className="p-2  rounded-full shadow-md"
//               target="_blank"
//               to={ `${window.location.origin}/generate?id=${icon._id}`
//               }
//             >
//               <img
//                 src={
//                   icon.logo.replace(
//                     "http://localhost:4000",
//                     "https://social-media-ai-content-api.onrender.com"
//                   ) as string
//                 }
//                 alt=""
//               />
//             </Link>
//           ))}
//         </div>
//       </div>
//       {
//   id === "65c08738e31efb40ed5c4213" ? (
//     <Paraphrase />
//   ) : id === "65c08894e31efb40ed5c4227" ? (
//     <ImageGenerator />
//   ) : (
//     <>
//       <div className="flex justify-center px-5 max-w-[1084px] w-full mx-auto items-center flex-col gap-4">
//         <p className="dark:text-white self-start text-black text-left font-outfit text-xl font-semibold">
//           Paste your current {manipulate(description?.name as string)} or write just a few keywords:
//         </p>

//         <Textarea
//           placeholder="Enter Prompt to generate response"
//           className="w-full bg-transparent"
//           value={text}
//           onChange={(e) => settext(e.target.value)}
//         />

//         <p className="dark:text-white self-start text-black text-left font-outfit text-xl font-semibold">
//           Choose a tone:
//         </p>
//         {/* TODO: convert to array */}
//         <div className="flex flex-wrap sm:flex-row self-start gap-2">
//           {buttonLabels.map((label, index) => (
//             <button
//               key={index}
//               className={`border rounded-full px-7 py-2 ${
//                 selectedButton === label ? "border-gradient-1" : ""
//               }`}
//               onClick={() => handleButtonClick(label)}
//             >
//               {label}
//             </button>
//           ))}
//         </div>
//         <div className="flex items-center space-x-2">
//           <Switch
//             id="emoji"
//             className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400"
//             checked={icons}
//             onCheckedChange={setIcons}
//           />
//           <Label htmlFor="emoji">Use Emoji</Label>
//           <Switch
//             id="hashtag"
//             className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400"
//             checked={hashTag}
//             onCheckedChange={setHashTag}
//           />
//           <Label htmlFor="hashtag">Use Hashtags</Label>
//         </div>
//       </div>
//       <button
//         className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80 w-fit mx-auto"
//         onClick={(e) => void handleSubmit(e)}
//       >
//         Generate
//       </button>
//     </>
//   )
// }

//       {(!!output || isLoading) && (
//         <div className="flex flex-col border   w-full mx-auto max-w-[1084px] pb-8 rounded-xl">
//           <div className="w-full border p-5 rounded-t-xl flex flex-row  justify-between">
//             <h1 className="text-xl md:text-3xl font-semibold ">Your Pitch</h1>
//             {output && (
//               <button onClick={handleCopy}>
//                 <ClipboardList className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//           {!isLoading ? (
//             <p className="p-5 text-base md:text-lg font-medium">{output}</p>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <Loader2 className="animate-spin w-20 h-20 mt-20" />
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex flex-col gap-6 w-fit mx-auto">
//         <h1 className="text-3xl text-center font-semibold">Share This</h1>
//         <div
//           className="elfsight-app-41c0aaf1-c9af-4d02-bf17-6ae8306f8500"
//           data-elfsight-app-lazy
//         ></div>
//         {/* <div className="flex flex-row gap-3">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="63"
//             height="63"
//             viewBox="0 0 63 63"
//             fill="none"
//             className="w-14 h-14"
//           >
//             <g clip-path="url(#clip0_1_2790)">
//               <path
//                 d="M63 31.5C63 14.1031 48.8969 0 31.5 0C14.1031 0 0 14.1031 0 31.5C0 47.2224 11.5192 60.2543 26.5781 62.6173V40.6055H18.5801V31.5H26.5781V24.5602C26.5781 16.6655 31.281 12.3047 38.4763 12.3047C41.9226 12.3047 45.5273 12.9199 45.5273 12.9199V20.6719H41.5554C37.6423 20.6719 36.4219 23.1001 36.4219 25.5913V31.5H45.1582L43.7616 40.6055H36.4219V62.6173C51.4808 60.2543 63 47.2227 63 31.5Z"
//                 fill="#1877F2"
//               />
//               <path
//                 d="M43.7616 40.6055L45.1582 31.5H36.4219V25.5913C36.4219 23.0998 37.6423 20.6719 41.5554 20.6719H45.5273V12.9199C45.5273 12.9199 41.9226 12.3047 38.476 12.3047C31.281 12.3047 26.5781 16.6655 26.5781 24.5602V31.5H18.5801V40.6055H26.5781V62.6173C28.2063 62.8725 29.8519 63.0004 31.5 63C33.1481 63.0005 34.7937 62.8725 36.4219 62.6173V40.6055H43.7616Z"
//                 fill="white"
//               />
//             </g>
//             <defs>
//               <clipPath id="clip0_1_2790">
//                 <rect width="63" height="63" fill="white" />
//               </clipPath>
//             </defs>
//           </svg>
//           <button className="w-14 h-14 rounded-full flex items-center justify-center bg-black">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="40"
//               height="40"
//               viewBox="0 0 40 40"
//               fill="none"
//               className="w-8 h-8 "
//             >
//               <g clip-path="url(#clip0_1_2796)">
//                 <path
//                   d="M23.7234 16.9375L38.2941 0H34.8409L22.1897 14.7063L12.0847 0H0.429688L15.7103 22.2388L0.429688 40H3.88281L17.2434 24.4697L27.9147 40H39.5697L23.7225 16.9375H23.7234ZM18.9941 22.4344L17.4456 20.22L5.12688 2.59938H10.4306L20.3716 16.82L21.9197 19.0344L34.8425 37.5187H29.5394L18.9941 22.4353V22.4344Z"
//                   fill="white"
//                 />
//               </g>
//               <defs>
//                 <clipPath id="clip0_1_2796">
//                   <rect width="40" height="40" fill="white" />
//                 </clipPath>
//               </defs>
//             </svg>
//           </button>
//           <button className="w-14 h-14 rounded-full flex items-center justify-center bg-[#5FD669]">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="44"
//               height="44"
//               viewBox="0 0 44 44"
//               fill="none"
//               className="w-10 h-10"
//             >
//               <g clip-path="url(#clip0_1_2800)">
//                 <path
//                   d="M0.938964 21.7367C0.937932 25.4336 1.91143 29.0433 3.76253 32.2249L0.761932 43.0956L11.9737 40.1787C15.0747 41.8538 18.5492 42.7315 22.0799 42.7317H22.0892C33.7449 42.7317 43.2329 33.3206 43.2379 21.7532C43.2402 16.148 41.0422 10.8772 37.0489 6.91177C33.0562 2.94666 27.7461 0.761835 22.0884 0.759277C10.4313 0.759277 0.943948 10.1698 0.939136 21.7367"
//                   fill="url(#paint0_linear_1_2800)"
//                 />
//                 <path
//                   d="M0.183906 21.7299C0.182703 25.5597 1.19109 29.2985 3.10819 32.5941L0 43.8545L11.6138 40.833C14.8137 42.5642 18.4166 43.4769 22.0827 43.4783H22.0921C34.166 43.4783 43.9948 33.7287 44 21.7473C44.0021 15.9406 41.7251 10.4804 37.5891 6.37284C33.4525 2.26583 27.9525 0.0023876 22.0921 0C10.0162 0 0.188719 9.74822 0.183906 21.7299ZM7.10033 32.0265L6.66669 31.3435C4.84378 28.4675 3.88162 25.144 3.883 21.7312C3.88678 11.7724 12.055 3.67008 22.099 3.67008C26.9631 3.67212 31.5343 5.55355 34.9724 8.96713C38.4105 12.3811 40.3023 16.9192 40.3011 21.7459C40.2966 31.7047 32.1283 39.8081 22.0921 39.8081H22.0849C18.817 39.8064 15.6121 38.9356 12.8171 37.29L12.1519 36.8986L5.26006 38.6915L7.10033 32.0265Z"
//                   fill="url(#paint1_linear_1_2800)"
//                 />
//                 <path
//                 d="M16.6165 12.6455C16.2064 11.7411 15.7748 11.7228 15.3849 11.707C15.0655 11.6933 14.7005 11.6944 14.3357 11.6944C13.9707 11.6944 13.3775 11.8306 12.8762 12.3738C12.3743 12.9175 10.9601 14.2313 10.9601 16.9036C10.9601 19.576 12.9217 22.1585 13.1952 22.5213C13.469 22.8833 16.9821 28.5426 22.546 30.7197C27.1702 32.529 28.1112 32.1692 29.1148 32.0785C30.1185 31.9881 32.3536 30.7649 32.8095 29.4966C33.2659 28.2285 33.2659 27.1414 33.1291 26.9143C32.9923 26.6879 32.6272 26.552 32.0798 26.2805C31.5322 26.0088 28.841 24.6948 28.3393 24.5135C27.8374 24.3324 27.4725 24.242 27.1074 24.7859C26.7424 25.3289 25.6941 26.552 25.3746 26.9143C25.0554 27.2773 24.7359 27.3225 24.1886 27.0509C23.6409 26.7783 21.878 26.2055 19.7864 24.3553C18.1591 22.9155 17.0605 21.1376 16.7411 20.5938C16.4218 20.0508 16.7069 19.7564 16.9814 19.4858C17.2274 19.2424 17.529 18.8515 17.803 18.5345C18.0759 18.2173 18.167 17.991 18.3495 17.6287C18.5322 17.2662 18.4408 16.9489 18.3042 16.6773C18.167 16.4056 17.1033 13.7194 16.6165 12.6455Z"
//                   fill="white"
//                 />
//               </g>
//               <defs>
//                 <linearGradient
//                   id="paint0_linear_1_2800"
//                   x1="2124.56"
//                   y1="4234.4"
//                   x2="2124.56"
//                   y2="0.759277"
//                   gradientUnits="userSpaceOnUse"
//                 >
//                   <stop stop-color="#1FAF38" />
//                   <stop offset="1" stop-color="#60D669" />
//                 </linearGradient>
//                 <linearGradient
//                   id="paint1_linear_1_2800"
//                   x1="2200"
//                   y1="4385.45"
//                   x2="2200"
//                   y2="0"
//                   gradientUnits="userSpaceOnUse"
//                 >
//                   <stop stop-color="#F9F9F9" />
//                   <stop offset="1" stop-color="white" />
//                 </linearGradient>
//                 <clipPath id="clip0_1_2800">
//                   <rect width="44" height="44" fill="white" />
//                 </clipPath>
//               </defs>
//             </svg>
//           </button>
//           <button className="w-14 h-14 rounded-full flex items-center justify-center bg-[#FFC700]">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="44"
//               height="44"
//               viewBox="0 0 44 44"
//               fill="none"
//             >
//               <g clip-path="url(#clip0_1_2806)">
//                 <path
//                   d="M40.3337 13.8142V31.1667C40.3337 32.5696 39.7977 33.9195 38.8353 34.9402C37.8729 35.9609 36.5568 36.5752 35.1563 36.6575L34.8337 36.6667H9.16699C7.76411 36.6668 6.41421 36.1308 5.39351 35.1684C4.37281 34.2059 3.75846 32.8898 3.67616 31.4894L3.66699 31.1667V13.8142L20.9828 25.3587L21.1955 25.4797C21.4461 25.6022 21.7214 25.6658 22.0003 25.6658C22.2793 25.6658 22.5545 25.6022 22.8052 25.4797L23.0178 25.3587L40.3337 13.8142Z"
//                   fill="white"
//                 />
//                 <path
//                   d="M34.8333 7.33325C36.8133 7.33325 38.5495 8.37825 39.5175 9.94942L22 21.6278L4.48251 9.94942C4.94219 9.20283 5.57374 8.57699 6.32448 8.12412C7.07522 7.67125 7.92337 7.40449 8.79818 7.34609L9.16668 7.33325H34.8333Z"
//                   fill="white"
//                 />
//               </g>
//               <defs>
//                 <clipPath id="clip0_1_2806">
//                   <rect width="44" height="44" fill="white" />
//                 </clipPath>
//               </defs>
//             </svg>
//           </button>
//           <button className="w-14 h-14 rounded-full flex items-center justify-center bg-transparent border">
//             ...
//           </button>
//         </div> */}
//       </div>
//       <div className="flex  flex-col gap-6 max-w-[1084px] w-fit mx-auto">
//         <h1 className="text-3xl text-center font-semibold">More Tools</h1>
//         <div className="flex px-4 justify-center flex-row flex-wrap gap-3">
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             Freestyle Email Generator
//           </button>
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             Blog Titles
//           </button>
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             SEO Meta Title Generator
//           </button>
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             Facebook Bio
//           </button>
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             LinkedIn Company Summary
//           </button>
//           <button className="rounded-full text-base lg:text-xl font-medium dark:border-white   py-2 px-5 border bg-transparent">
//             Freestyle Email Generator
//           </button>
//         </div>
//         <Link
//           to="/"
//           className="text-gray-400 w-fit text-lg mx-auto bg-transparent flex gap-2"
//         >
//           See all Tools
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="25"
//             height="25"
//             viewBox="0 0 32 32"
//             fill="none"
//           >
//             <path
//               d="M17.2925 6.29243C17.1995 6.3853 17.1258 6.49559 17.0754 6.61699C17.0251 6.73839 16.9992 6.86852 16.9992 6.99993C16.9992 7.13135 17.0251 7.26147 17.0754 7.38287C17.1258 7.50427 17.1995 7.61456 17.2925 7.70743L24.5863 14.9999H5.00001C4.73479 14.9999 4.48044 15.1053 4.2929 15.2928C4.10536 15.4804 4.00001 15.7347 4.00001 15.9999C4.00001 16.2651 4.10536 16.5195 4.2929 16.707C4.48044 16.8946 4.73479 16.9999 5.00001 16.9999H24.5863L17.2925 24.2924C17.1049 24.4801 16.9995 24.7346 16.9995 24.9999C16.9995 25.2653 17.1049 25.5198 17.2925 25.7074C17.4801 25.8951 17.7346 26.0005 18 26.0005C18.2654 26.0005 18.5199 25.8951 18.7075 25.7074L27.7075 16.7074C27.8005 16.6146 27.8742 16.5043 27.9246 16.3829C27.9749 16.2615 28.0008 16.1313 28.0008 15.9999C28.0008 15.8685 27.9749 15.7384 27.9246 15.617C27.8742 15.4956 27.8005 15.3853 27.7075 15.2924L18.7075 6.29243C18.6146 6.19945 18.5043 6.12569 18.3829 6.07537C18.2615 6.02505 18.1314 5.99915 18 5.99915C17.8686 5.99915 17.7385 6.02505 17.6171 6.07537C17.4957 6.12569 17.3854 6.19945 17.2925 6.29243Z"
//               fill="white"
//               fill-opacity="0.6"
//             />
//           </svg>
//         </Link>
//       </div>
//       <div className="flex  flex-col px-5 gap-6 max-w-[1084px] w-full mx-auto">
//         <h1 className="text-3xl text-center font-semibold">
//           Everything you need to know
//         </h1>
//         <Accordion
//           type="single"
//           collapsible
//           className="w-full flex flex-col gap-2"
//         >
//           {description?.faq?.map((ac, id) => (
//             <AccordionItem value="item-1" key={id}>
//               <AccordionTrigger
//                 className="dark:text-white dark:border dark:border-white  py-4 z-40 items-center rounded-md shadow-md px-5 font-outfit"
//                 key={ac.question}
//               >
//                 {ac.question}
//               </AccordionTrigger>
//               <AccordionContent>{ac.answer}</AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Generate;
