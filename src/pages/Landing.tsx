// import React from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
// import Menu from "../components/Menu";
import Cards from "../components/Cards";
import Stats from "./Stats";
// import MenuMobile from "@/components/MenuMobile";
import { useEffect, useState,useRef } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useSearchParams,useNavigate } from "react-router-dom";
import { Bookmark, Popsicle } from "lucide-react";
import Modal from "../components/Model";
import CategoryBox from "../components/CategoryBox";
// @ts-ignore
import { getLocation } from "current-location-geo";
import {Loader2} from "lucide-react"
import FAQ from "./Faq";
import LandingBlog from "./LandingBlog";
import TestimonialsCarousel from "./Testimonials";
import Testimonials from "./Testimonials";
import PricingPlan from "./Pricing";
import Features from "./Features";
// import Profile from "@/components/Profile";

// type Props = {};

export interface Card {
  _id: String;
  name: String;
  description: String;
  logo: string;
  isBookmarked: Boolean;
  labels: string[];
  tagLine: String;
  // setChange: Function;
}

const Landing = () => {
  const [buttons, setButtons] = useState<String[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();
  const [change, setChange] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [searchResults, setSearchResults] = useState<Card[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const selectedButton = urlParams.get("selectedButton")?? "All Tools";


  const [cards, setCards] = useState<Card[]>([]);
  const [cardsBookmark, setCardsBookmark] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const resultRef=useRef<HTMLDivElement>(null)
  const navigate = useNavigate();

  const handleCloseTrialModal = () => {
    // Function to handle closing the trial modal
    setShowTrialModal(false);
    // Set sessionStorage flag to indicate modal has been closed
    sessionStorage.setItem("modalShown", "true");
  };

  useEffect(() => {
    const modalShown = sessionStorage.getItem("modalShown");
    if (!modalShown && isSignedIn && user?.createdAt) { // Check if user is signed in and createdAt is available
      const userCreatedAt = new Date(user.createdAt);
      const currentDate = new Date();
      const differenceInMilliseconds = currentDate.getTime() - userCreatedAt.getTime();
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      console.log("User created at:", userCreatedAt);
      console.log("Current time:", currentDate);
      console.log("Difference in days:", differenceInDays);
      if (differenceInDays <= 1) { // Show modal only if user is signed in and created within the last 1 days
        setShowTrialModal(true);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const getLocationFunction = () => {
    if (!location) {
      getLocation(function (err: any, position: any) {
        if (err) {
          if (err.message === "User denied Geolocation") {
            toast.error("Please enable location to get the best experience");
          }
        } else {
          setLocation(position.address);
        }
      });
    }
  }
 



  const getButtons = async () => {
    // const
    const res = await axios.get(`${BASE_URL2}/objects/getCategories`);
    const bookmarked = [...res.data.message];
    if (isSignedIn) bookmarked.splice(1, 0, "My Tools");
    setButtons(bookmarked);
    // console.log(bookmarked)
  };
  // console.log(buttons)

  useEffect(() => {
    getButtons();
    // isSignedIn && getBookMarks();
  }, [isLoaded, isSignedIn]);

  const getBookMarks = async (bool = false) => {
    console.log("a")
    if (!isSignedIn) {
      setCards([]);
      toast.error("Please sign in to view your bookmarks");
      return;
    }
    // if (!location) return;
    let locationn = "";
    try {
      getLocation(function (err: any, position: any) {
        if (err) {
          console.error("Error:", err);
        } else {
          locationn = position.addresss;
        }
      });
    } catch (error) {
      console.log("error", error);
    }
    // console.log(location)

    // console.log("av", locationn, location);

    const res = await axios.get(
      `${BASE_URL}/bookmarks?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}&address=${location??locationn}`
    );
  
  
    const cards = res.data.data.map((card: Card) => ({
      ...card,
      isBookmarked: true,
    }));
    // setCards(cards);
    setCardsBookmark(cards);
  
    if (bool) setCards(cards);
    setIsLoading(false);
  };
  // useEffect(() => {
  //   if (mytools) {
  //     setTimeout(() => {
  //       searchParams.delete("mytools");
  //       setSearchParams(searchParams);
  //     }, 5000);
  //   }
  // }, []);

  const getTemplates = async () => {
    let url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}`;
    // console.log("three", location);

    if (isSignedIn)
      url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}&address=${location}`;
    const res = await axios.get(url);
    // console.log("this is respose",res)
    setCards(res.data.message);
    setIsLoading(false);
  };
// console.log(cards)
  useEffect(() => {
    // if (buttons.length === 0) return;
    // getLocationFunction()
    if (isSearched && selectedButton === isSearched) return;
    if (!isLoaded) return;
    setIsLoading(true);
    if (selectedButton !== "My Tools") {
      getTemplates();
    } else if (isSignedIn) getBookMarks(true);
  }, [selectedButton, isLoaded, location]);
  useEffect(() => {
    if (buttons.length === 0) return;
    if (selectedButton !== "My Tools") {
      // getTemplates();
    } else if (isSignedIn) {
      setIsLoading(true);

      getBookMarks(true);
    }
  }, [isLoaded, change]);

  const handleSearch = async () => {
    setIsLoading(true); // Assuming you manage loading state
    const res = await axios.get(`${BASE_URL2}/objects/searchObjects/${search}`);
    console.log(res.data.message)
    setSearchResults(res.data.message);
    setSearchParams(search);
    setIsLoading(false);
    // Scroll to search results section
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toolSetter = (tool:string)=>{
    searchParams.set("selectedButton", tool);
    setSearchParams(searchParams);
  }




  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="px-5 min-h-screen">
        <Hero search={search} setSearch={setSearch} onClick={handleSearch} />
        <div className="mt-2 flex items-center justify-center">
          <Stats />
        </div>

        <div className=" max-w-6xl m-auto px-4">
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <CategoryBox
              logo="https://www.svgrepo.com/show/219380/tools-screwdriver.svg"
              name="All Tools"
              toolCount={130}
              tagLine="Empower Your Productivity with Versatile Tools for Every Task"
              redirectTo="/category/All Tools"
            />

            {/* Render CategoryBox conditionally based on isSignedIn */}
            {isSignedIn && (
              <CategoryBox
                logo="https://www.svgrepo.com/show/407090/person-pouting-light-skin-tone.svg"
                name="My Tools"
                tagLine="View and manage your bookmarked tools"
                redirectTo="/category/My Tools"
              />
            )}
            <CategoryBox
              logo="https://www.svgrepo.com/show/343856/marketing-flow-business.svg"
              name="Social Media Tools"
              toolCount={36}
              tagLine="Enhance Your Social Presence with Seamless Content Creation"
              redirectTo="/category/Social Media Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/387435/edit.svg"
              name="Content Generation Tools"
              toolCount={13}
              tagLine="Create Compelling Content with Ease"
              redirectTo="/category/Content Generation Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/520509/video-courses.svg"
              name="Video Tools"
              toolCount={12}
              tagLine="Transform Your Video Content with Powerful Tools"
              redirectTo="/category/Video Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/375830/image.svg"
              name="Image Generator & Image Tools"
              toolCount={12}
              tagLine="Streamline Your File Manangement and Image Editing"
              redirectTo="/category/Image Generator & Image Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/490948/audio.svg"
              name="Audio Tools"
              toolCount={7}
              tagLine="Unleash Your Creativity: Top Tools for Audio Mastery"
              redirectTo="/category/Audio Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/242947/marketing-professions-and-jobs.svg"
              name="Marketing Tools"
              toolCount={8}
              tagLine="Drive Your Campaigns with Innovative Marketing Tools"
              redirectTo="/category/Marketing Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/261894/translator-subject.svg"
              name="Language Translator Tools"
              toolCount={1}
              tagLine="Break Barriers: Seamless Language Translation Tools"
              redirectTo="/category/Language Translator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/250184/qr-code.svg"
              name="QR Code Generator Tools"
              toolCount={1}
              tagLine="Scan the Future: Create Custom QR Codes Instantly"
              redirectTo="/category/QR Code Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/454713/article-blog-optimation.svg"
              name="Article Generator Tools"
              toolCount={4}
              tagLine="Generate High-Quality Articles Instantly with Our Advanced Writing Tools"
              redirectTo="/category/Article Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/343850/blog-seo-optimization-search.svg"
              name="Blog Generator Tools"
              toolCount={5}
              tagLine="Create Engaging Blog Posts in Minutes with Our Powerful Generation Tools"
              redirectTo="/category/Blog Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/271588/newspaper-journal.svg"
              name="Press Release Tools"
              toolCount={1}
              tagLine="Craft Professional Press Releases Quickly with Our Comprehensive Tools"
              redirectTo="/category/Press Release Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/268514/voice-recording-radio.svg"
              name="Podcast Generator Tools"
              toolCount={1}
              tagLine="Transform Ideas into Captivating Podcasts with Our Easy-to-Use Generation Tools"
              redirectTo="/category/Podcast Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/395625/news.svg"
              name="NewsLetter Tools"
              toolCount={1}
              tagLine="Design and Deliver Impactful Newsletters Effortlessly with Our All-in-One Tools"
              redirectTo="/category/NewsLetter Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/415749/email-inbox-letter.svg"
              name="Email Generator Tools"
              toolCount={11}
              tagLine="Effortless Email Solutions for Every Business Need"
              redirectTo="/category/Email Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/207030/startup-bussiness.svg"
              name="Start-Up Tools"
              toolCount={12}
              tagLine="Empower Your Startup with Essential Tools for Success"
              redirectTo="/category/Start-Up Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/485395/file.svg"
              name="File Converter Tools"
              toolCount={8}
              tagLine="Seamlessly Convert Your Files with Our Versatile Conversion Tools"
              redirectTo="/category/File Converter Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/475656/google-color.svg"
              name="Google Adwords & Meta Ads"
              toolCount={2}
              tagLine="Maximize Your Reach with Our Powerful Google Ad Tools"
              redirectTo="/category/Google Adwords & Meta Ads"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/299307/browser-seo-and-web.svg"
              name="SEO Tools"
              toolCount={2}
              tagLine="Optimize Your Online Presence for Maximum Impact"
              redirectTo="/category/SEO Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/349410/instagram.svg"
              name="Instagram Tools"
              toolCount={8}
              tagLine="Elevate Your Instagram Presence with Our Essential Tools"
              redirectTo="/category/Instagram Tools"
            />
            <CategoryBox
              logo="https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512d8dd24a0261059ca0b40_logo-threads.svg"
              name="Instagram Threads Tools"
              toolCount={1}
              tagLine="Enhance Your Instagram Strategy with Our Comprehensive Tools"
              redirectTo="/category/Instagram Threads Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/475647/facebook-color.svg"
              name="Facebook Tools"
              toolCount={8}
              tagLine="Boost Your Facebook Strategy with Our Essential Tools"
              redirectTo="/category/Facebook Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/475700/youtube-color.svg"
              name="Youtube Tools"
              toolCount={6}
              tagLine="Elevate Your YouTube Presence with Our Comprehensive Tools"
              redirectTo="/category/Youtube Tools"
            />
            <CategoryBox
              logo="https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512589c982265fa7120a132_ico-X.svg"
              name="(X) Twitter Tools"
              toolCount={4}
              tagLine="Enhance Your Twitter Strategy with Our Powerful Tools"
              redirectTo="/category/(X) Twitter Tools"
            />
            <CategoryBox
              logo="https://uploads-ssl.webflow.com/64dc619021257128d0687cce/6512589c982265fa7120a132_ico-X.svg"
              name="(X) Twitter Threads Tools"
              toolCount={2}
              tagLine="Master Your Twitter Threads with Our Advanced Tools"
              redirectTo="/category/(X) Twitter Threads Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/303299/linkedin-icon-2-logo.svg"
              name="Linkedin Tools"
              toolCount={6}
              tagLine="Optimize Your LinkedIn Presence with Our Comprehensive Tools"
              redirectTo="/category/Linkedin Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/452114/tiktok.svg"
              name="Tiktok Tools"
              toolCount={2}
              tagLine="Boost Your TikTok Success with Our Powerful Tools"
              redirectTo="/category/Tiktok Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/292472/website-ui.svg"
              name="Website Tools"
              toolCount={4}
              tagLine="Transform Your Online Presence with Our Essential Website Tools"
              redirectTo="/category/Website Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/54359/logo.svg"
              name="Logo Generator Tools"
              toolCount={1}
              tagLine="Create Stunning Logos Effortlessly with Our Powerful Design Tools"
              redirectTo="/category/Logo Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/446529/avatar.svg"
              name="Avatar Generator Tools"
              toolCount={1}
              tagLine="Craft Unique Avatars with Our Easy-to-Use Design Tools"
              redirectTo="/category/Avatar Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/484943/pdf-file.svg"
              name="PDF Tools"
              toolCount={8}
              tagLine="Manage and Edit Your PDFs Seamlessly with Our Versatile Tools"
              redirectTo="/category/PDF Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/461636/hastag-square.svg"
              name="Hashtag Generator Tools"
              toolCount={1}
              tagLine="Maximize Your Social Media Reach with Our Effective Hashtag Tools"
              redirectTo="/category/Hashtag Generator Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/476957/document.svg"
              name="Paraphase Tools"
              toolCount={1}
              tagLine="Refine Your Writing Instantly with Our Advanced Paraphrasing Tools"
              redirectTo="/category/Paraphase Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/159920/detective.svg"
              name="AI Detector Tools"
              toolCount={1}
              tagLine="Identify and Analyze with Precision Using Our AI Detector Tools"
              redirectTo="/category/AI Detector Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/410916/research.svg"
              name="Humanize AI Tools"
              toolCount={1}
              tagLine="Enhance Human Interactions with Advanced AI Tools"
              redirectTo="/category/Humanize AI Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/439270/prettier.svg"
              name="Prompt Tools"
              toolCount={1}
              tagLine="Inspire Creativity and Efficiency with Our Versatile Prompt Tools"
              redirectTo="/category/Prompt Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/474372/code.svg"
              name="Code Converter Tools"
              toolCount={1}
              tagLine="Effortlessly Transform Your Code with Our Advanced Conversion Tools"
              redirectTo="/category/Code Converter Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/373590/excel2.svg"
              name="Excel Sheet Tools"
              toolCount={1}
              tagLine="Streamline Your Data Management with Our Powerful Excel Tools"
              redirectTo="/category/Excel Sheet Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/56741/jpg.svg"
              name="JPG Tools"
              toolCount={3}
              tagLine="Optimize and Transform Your Images with Our Advanced JPG Tools"
              redirectTo="/category/JPG Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/213365/png.svg"
              name="PNG Tools"
              toolCount={3}
              tagLine="Edit and Enhance Your Images with Our Versatile PNG Tools"
              redirectTo="/category/PNG Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/291484/curriculum-resume.svg"
              name="Resume & HR Tools"
              toolCount={2}
              tagLine="Streamline Your Hiring Process with Our Comprehensive Resume & HR Tools"
              redirectTo="/category/Resume & HR Tools"
            />
            <CategoryBox
              logo="https://cdn-icons-png.flaticon.com/512/6230/6230391.png"
              name="Utility Tools"
              toolCount={11}
              tagLine="Empowering Efficiency: Your One-Stop Solution for Essential Tools"
              redirectTo="/category/Utility Tools"
            />

          </div>
        </div>

        {/* <div className="hidden md:block">
          {buttons.length > 0 && (
            <Menu
              buttons={buttons}
              selectedButton={selectedButton}
              setSelectedButton={toolSetter}
            />
          )}
          <div ref={resultRef} className="mt-10 max-w-6xl m-auto px-4"></div>
          <Cards cards={cards} isLoading={isLoading} setChange={setChange} />
        </div>

        <div className="md:hidden">
          <MenuMobile
            buttons={buttons}
            selectedButton={selectedButton}
            setSelectedButton={toolSetter}
            cards={cards}
            isLoading={isLoading}
            setChange={setChange}
          />
        </div> */}

        {/* Render search results section */}
        <div ref={resultRef} className="mt-10 max-w-6xl m-auto px-4 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                searchResults.map((card: Card, id: number) => (
                  <Cards cards={[card]} key={id} isLoading={isLoading} />
                ))
               }
            </div>
          </div>
      </div>
      <PricingPlan />
      <FAQ />
      <Testimonials />

      {/* Render the trial modal */}
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <LandingBlog />
      <Features />
      <Footer  />
    </div>
  );
};

export default Landing;
