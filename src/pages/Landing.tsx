// import React from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Menu from "../components/Menu";
import Cards from "../components/Cards";
import MenuMobile from "@/components/MenuMobile";
import { useEffect, useState } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { Popsicle } from "lucide-react";
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

  const urlParams = new URLSearchParams(window.location.search);
  const mytools = urlParams.get("mytools");

  const [selectedButton, setSelectedButton] = useState<String>(
    mytools ? "My Tools" : "All Tools"
  );
  const [cards, setCards] = useState<Card[]>([]);
  const [cardsBookmark, setCardsBookmark] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState<string>("");

  const getButtons = async () => {
    // const
    const res = await axios.get(`${BASE_URL2}/objects/getCategories`);
    const bookmarked = [...res.data.message];
    if (isSignedIn) bookmarked.splice(1, 0, "My Tools");
    setButtons(bookmarked);
    mytools && isSignedIn && setSelectedButton("My Tools");
  };

  useEffect(() => {
    getButtons();
    isSignedIn && getBookMarks();
  }, [isLoaded, isSignedIn]);

  const getBookMarks = async (bool = false) => {
    if (!isSignedIn) {
      setCards([]);
      toast.error("Please sign in to view your bookmarks");
      return;
    }
    let location =""
     getLocation(function (err: any, position: any) {
       if (err) {
         console.error("Error:", err);
       } else {
         location = position.address;
       }
     });
    const res = await axios.get(
      `${BASE_URL}/bookmarks?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}&address=${location}`
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

  useEffect(() => {
    if (mytools) {
      setTimeout(() => {
        searchParams.delete("mytools");
        setSearchParams(searchParams);
      }, 5000);

      
    }
    
  }, []);

  const getTemplates = async () => {
    let url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}`;

    if (isSignedIn)
      url = `${BASE_URL2}/objects/getObjectByLabel/${selectedButton}?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}`;
    const res = await axios.get(url);
    setCards(res.data.message);
    setIsLoading(false);
  };

  useEffect(() => {
    // if (buttons.length === 0) return;
    if (isSearched && selectedButton === isSearched) return;
    if (!isLoaded) return;
    setIsLoading(true);
    if (selectedButton !== "My Tools") {
      getTemplates();
    } else if (isSignedIn) getBookMarks(true);
  }, [selectedButton, isLoaded]);
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
      setSelectedButton(search);
    }
    setCards(res.data.message);
    setIsSearched(search);
    setIsLoading(false);
  };


  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="px-5 min-h-screen">
        <Hero search={search} setSearch={setSearch} onClick={handleSearch} />

        <div className="hidden md:block mt-10">
          {buttons.length > 0 && (
            <Menu
              buttons={buttons}
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
            />
          )}
          <Cards cards={cards} isLoading={isLoading} setChange={setChange} />
        </div>

        <div className="md:hidden">
          <MenuMobile
            buttons={buttons}
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            cards={cards}
            isLoading={isLoading}
            setChange={setChange}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
