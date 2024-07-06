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
import categories from "@/components/toolsData";
import gradient from "../assets/gradient.png";
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
  const [wordIndex, setWordIndex] = useState(0);
  const [filteredCategories, setFilteredCategories] = useState(categories);

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

  const rotatingWords = [
    "Your Work",
    "Your Life",
    "Your Task",
    "Your Job",
    "Start-Up",
    "Business",
    "Everything",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category:any) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCategories(filtered);
      // console.log(filteredCategories)
    }
  }, [search]);

  const toolSetter = (tool:string)=>{
    searchParams.set("selectedButton", tool);
    setSearchParams(searchParams);
  }




  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="px-5 min-h-screen">
      <div className="flex flex-col justify-center items-center space-y-4 relative">
      <div className="py-4 text-black dark:text-white text-center font-outfit text-[30px] md:text-[40px] lg:text-[50px] font-normal w-full flex gap-2 justify-center flex-wrap">
        <span>Tools to Make{" "}</span>
        <span className="rotating-words fontW w-1/2 md:w-1/5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold" style={{ animation: "rotate 2s infinite" }}>
          {rotatingWords[wordIndex]}
        </span>{" "}
        <span>Simple</span>
      </div>
      <div className="sm:text-[14px] md:text-[17px] lg:text-[20px] py-4 text-center font-outfit text-black dark:text-white z-10 w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] mx-auto font-normal">
        AI Generative Tools for Everyone! : Simplify, Create, Dominate with Bigwig Media AI
      </div>
      <div className="w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] relative my-8 flex flex-col justify-center items-center h-fit">
        <div className="z-10 w-full max-w-[637px] overflow-hidden mx-auto p-[6px] md:p-2 border-gradient bg-white dark:bg-[#1E1E1E]">
          <div className="flex justify-between border-opacity-0 overflow-hidden rounded-[73px] items-center">
            <input
              placeholder="Find Your Tool.."
              className="w-full border-none focus-visible:placeholder:text-transparent z-50 rounded-l-[73px] outline-none px-4 py-1 md:py-4 placeholder:text-black dark:placeholder:text-white dark:text-white bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80"
            >
              Search
            </button>
          </div>
        </div>
        
        <img src={gradient} className="absolute -z-1" alt="gradient" />
      </div>
    </div>
        <div className="mt-2 flex items-center justify-center">
          <Stats />
        </div>

        <div className="max-w-6xl m-auto px-4">
          <div className="mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredCategories.map((category) => (
              category.name === "My Tools" && !isSignedIn ? null : (
                <CategoryBox
                  key={category.name}
                  logo={category.logo}
                  name={category.name}
                  toolCount={category.toolCount}
                  tagLine={category.tagLine}
                  redirectTo={category.redirectTo}
                />
              )
            ))}
          </div>
        </div>

      </div>
      <PricingPlan />
      <FAQ />
      
      <div className="mt-20 px-9 md:px-14 lg:px-24 mx-auto">
      <Testimonials />
    </div>

      {/* Render the trial modal */}
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <div className="mt-20 px-9 md:px-14 lg:px-24 mx-auto" >
      <LandingBlog />
    </div>
      
      <Features />
      <Footer  />
    </div>
  );
};

export default Landing;
