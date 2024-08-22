// import React from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
// import Hero from "../components/Hero";
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
import WhoCanUseIt from "./WhoCanUse";
// import Profile from "@/components/Profile";
import MenuMobile from "@/components/MenuMobile";
import Menu from "@/components/Menu";
import '../App.css'

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
  const [buttons, setButtons] = useState<string[]>([]);
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
      // console.log("User created at:", userCreatedAt);
      // console.log("Current time:", currentDate);
      // console.log("Difference in days:", differenceInDays);
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

  const rotatingColors = [
    "black", // Calm Blue
    "black", // Orange
    "black", // Red
    "black", // Green
    "black", // Purple
    "black", // Yellow
    "black", // Light Blue
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

const handleSearch = async () => {
  if (search.trim() === "") return;
  setIsLoading(true);
  const res = await axios.get(`${BASE_URL2}/objects/searchObjects/${search}`);
  if (window.innerWidth < 768) {
    if (!!isSearched) {
      setButtons([search, ...buttons.slice(1)]);
    } else setButtons([search, ...buttons]);
    searchParams.set("selectedButton", search);
    setSearchParams(searchParams);
  }
  setCards(res.data.message);
  setIsSearched(search);
  setIsLoading(false);
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearch(e.target.value);
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

  const toolSetter = (tool:string)=>{
    searchParams.set("selectedButton", tool);
    setSearchParams(searchParams);
  }




  return (
    <div className="bg-[var(--background-color)]">
      <Nav />
      <div className="px-5 min-h-screen">
        <div className="flex flex-col justify-center items-center relative mt-5">
          <div className="text-[var(--primary-text-color)] text-center font-outfit text-[20px] md:text-[30px] lg:text-[40px] font-normal w-full flex gap-2 justify-center flex-wrap">
            <span>Tools to Make{" "}</span>
            <span
              className="rotating-words fontW w-1/3 md:w-1/5 lg:w-1/6 font-outfit font-semibold text-white"
              style={{
                backgroundColor: rotatingColors[wordIndex],
                animation: `moveUp 2s ease-in-out infinite, rotate 2s infinite`,
                borderRadius: "0.25rem"
              }}
            >
              {rotatingWords[wordIndex]}
            </span>{" "}
            <span>Simple</span>
          </div>
          <div className="text-medium md:text-[30px] text-center text-[var(--primary-text-color)] mt-3 md:mt-5 mb-5">All-In-One AI Tools Platform</div>

          <div className="w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] relative flex flex-col justify-center items-center h-fit mb-10">
            <div className="z-10 w-full max-w-[637px] mx-auto p-[4px] md:p-2 bg-[var(--background-color)] shadow-md border border-[var(--teal-color)] rounded-full">
              <div className="flex justify-between items-center">
                <input
                  placeholder="Find Your Tool.."
                  className="w-full border-none focus-visible:placeholder:text-transparent z-50 rounded-l-full outline-none px-4 py-1 md:py-4 placeholder:text-[var(--gray-color)] text-[var(--primary-text-color)] bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="text-[var(--white-color)] text-center font-outfit md:text-lg font-semibold flex relative text-xs p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] transition-all duration-300 ease-in-out"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <div className="flex items-center justify-center ">
          <Stats />
        </div>
        <div className=" hidden md:block">
          {buttons.length > 0 && (
            <Menu
              buttons={buttons}
              selectedButton={selectedButton}
              setSelectedButton={toolSetter}
            />
          )}
          {/* <Cards cards={cards} isLoading={isLoading} setChange={setChange} /> */}
        </div>
  
        <div className="max-w-6xl m-auto px-4 hidden md:block ">
          <div className="mb-6">
            {filteredCategories.length === 0 ? (
              <p className="text-center text-2xl md:text-5xl mt-8 text-[var(--gray-color)]">No such category found</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredCategories.map((category) =>
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
                )}
              </div>
            )}
          </div>
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
        </div>
      </div>
      <WhoCanUseIt />
      <PricingPlan />
      <FAQ />
      <div className="mt-20 px-9 md:px-14 lg:px-24 mx-auto">
        <Testimonials />
      </div>
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <div className="mt-20 px-9 md:px-14 lg:px-24 mx-auto">
        <LandingBlog />
      </div>
      <Features />
      <Footer />
    </div>
  );
  
  
};

export default Landing;
