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
              toolCount={100}
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
              toolCount={20}
              tagLine="Enhance Your Social Presence with Seamless Content Creation"
              redirectTo="/category/Social Media Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/343852/email-marketing-envelope-letter.svg"
              name="Email Tools"
              toolCount={10}
              tagLine="Effortless Email Solutions for Every Business Need"
              redirectTo="/category/Email Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/387435/edit.svg"
              name="Content Creation Tools"
              toolCount={10}
              tagLine="Create Compelling Content with Ease"
              redirectTo="/category/Content Creation Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/242947/marketing-professions-and-jobs.svg"
              name="Marketing Tools"
              toolCount={6}
              tagLine="Drive Your Campaigns with Innovative Marketing Tools"
              redirectTo="/category/Marketing Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/299307/browser-seo-and-web.svg"
              name="SEO & Web Tools"
              toolCount={6}
              tagLine="Optimize Your Online Presence for Maximum Impact"
              redirectTo="/category/SEO & Web Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/375830/image.svg"
              name="File & Image Tools"
              toolCount={25}
              tagLine="Streamline Your File Manangement and Image Editing"
              redirectTo="/category/File & Image Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/520509/video-courses.svg"
              name="Video & Audio Tools"
              toolCount={25}
              tagLine="Transform Your Media Content with Powerful Tools"
              redirectTo="/category/Video & Audio Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/502417/business.svg"
              name="Business & HR Tools"
              toolCount={7}
              tagLine="Boost Business Efficiency with Professional Solutions"
              redirectTo="/category/Business & HR Tools"
            />
            <CategoryBox
              logo="https://cdn-icons-png.flaticon.com/512/6230/6230391.png"
              name="Utility Tools"
              toolCount={15}
              tagLine="Versatile Tools for Everyday Tasks and Problem-Solving"
              redirectTo="/category/Utility Tools"
            />
            <CategoryBox
              logo="https://www.svgrepo.com/show/449588/lightbulb-idea.svg"
              name="Creative & Design Tools"
              toolCount={5}
              tagLine="Unleash Your Creativity with Desing-Driven Tools"
              redirectTo="/category/Creative & Design Tools"
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

      



      {/* Render the trial modal */}
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <Footer  />
    </div>
  );
};

export default Landing;
