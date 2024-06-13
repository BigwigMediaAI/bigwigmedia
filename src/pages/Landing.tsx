// import React from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Menu from "../components/Menu";
import Cards from "../components/Cards";
import Stats from "./Stats";
import MenuMobile from "@/components/MenuMobile";
import { useEffect, useState } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { Bookmark, Popsicle } from "lucide-react";
import Modal from "../components/Model";
// @ts-ignore
import { getLocation } from "current-location-geo";
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

  const urlParams = new URLSearchParams(window.location.search);
  const selectedButton = urlParams.get("selectedButton")?? "All Tools";


  const [cards, setCards] = useState<Card[]>([]);
  const [cardsBookmark, setCardsBookmark] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState<string>("");
  const [location, setLocation] = useState<string>("");

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
  console.log(buttons)

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
    console.log("b")
    console.log(location)

    console.log("av", locationn, location);

    const res = await axios.get(
      `${BASE_URL}/bookmarks?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}&address=${location??locationn}`
    );
    console.log(res)

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
    console.log("three", location);

    if (isSignedIn)
      url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}&address=${location}`;
    const res = await axios.get(url);
    console.log("this is respose",res)
    setCards(res.data.message);
    setIsLoading(false);
  };
console.log(cards)
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
    // const res = await axios.get(
    //   `${BASE_URL}/templates/search?search=${search}`
    // );
    setIsLoading(true);
    const res = await axios.get(`${BASE_URL2}/objects/searchObjects/${search}`);
    if (window.innerWidth < 768) {
      if (!!isSearched) {
        setButtons([search, ...buttons.slice(1)]);
      } else setButtons([search, ...buttons]);
      // setSelectedButton(search);
      searchParams.set("selectedButton", search);
      setSearchParams(searchParams);
    }
    setCards(res.data.message);
    setIsSearched(search);
    setIsLoading(false);
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
        <div className="hidden md:block">
          {buttons.length > 0 && (
            <Menu
              buttons={buttons}
              selectedButton={selectedButton}
              setSelectedButton={toolSetter}
            />
          )}
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
        </div>
      </div>

      



      {/* Render the trial modal */}
      <Modal isOpen={showTrialModal} onClose={handleCloseTrialModal} />
      <Footer  />
    </div>
  );
};

export default Landing;
