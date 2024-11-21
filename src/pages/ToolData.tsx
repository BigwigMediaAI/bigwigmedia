import Cards from "@/components/Cards";
import Menu from "@/components/Menu";
import MenuMobile from "@/components/MenuMobile";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { debounce } from "lodash";

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

const ToolData = () => {

    const [buttons, setButtons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isSignedIn, isLoaded } = useUser();
  const [change, setChange] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParams = new URLSearchParams(window.location.search);
  const selectedButton = urlParams.get("selectedButton")?? "All Tools";

  const [cards, setCards] = useState<Card[]>([]);
  const [cardsBookmark, setCardsBookmark] = useState<Card[]>([]);
  const [search, setSearch] = useState("");
  const [isSearched, setIsSearched] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const resultRef=useRef<HTMLDivElement>(null)
  const navigate = useNavigate();
 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    // console.log(location)

    // console.log("av", locationn, location);

    const res = await axios.get(
      `${BASE_URL}/bookmarks?clerkId=${user.id}&name=${user?.fullName}&email=${user?.primaryEmailAddress?.emailAddress}&imageUrl=${user?.imageUrl}`
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  

  
    const toolSetter = (tool:string)=>{
      searchParams.set("selectedButton", tool);
      setSearchParams(searchParams);
    }


    const searchTools = debounce(async (query: string) => {
      setIsLoading(true);
      if (!query.trim()) {
        // Reset cards to the default list when the search query is empty
        if (selectedButton === "My Tools" && isSignedIn) {
          await getBookMarks(true);
        } else {
          await getTemplates();
        }
        setIsSearched(""); // Clear the search state
        return;
      }
    
      setIsLoading(true);
      try {
        const res = await axios.get(`${BASE_URL2}/objects/searchObjects/${query}`);
        setCards(res.data.message); // Set tools matching the query
        setIsSearched(query);
      } catch (error) {
        console.error("Error fetching tools:", error);
        toast.error("Error fetching search results.");
      } finally {
        setIsLoading(false);
      }
    }, 200);
    

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearch(query); // Update the search state
      searchTools(query); // Trigger debounced search or reset
    };
    


return(
    <>
    <Nav />

    <div className="flex flex-col justify-center items-center relative mt-5">
          <div className="w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] relative flex flex-col justify-center items-center h-fit">
            <div className="z-10 w-full max-w-[637px] mx-auto p-[4px] md:p-2 bg-[var(--background-color)] shadow-md border border-[var(--teal-color)] rounded-full">
              <div className="flex justify-between items-center">
                <input
                  placeholder="Find Your Tool.."
                  className="w-full border-none focus-visible:placeholder:text-transparent z-50 rounded-l-full outline-none px-4 py-1 md:py-4 placeholder:text-[var(--gray-color)] text-[var(--primary-text-color)] bg-transparent"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button
                  className="text-[var(--white-color)] text-center font-outfit md:text-lg font-semibold flex relative text-xs p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--green)] hover:bg-[#141481] transition-all duration-300 ease-in-out"
                  onClick={() => searchTools(search)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>


    <div className=" hidden md:block">
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

        <Footer />
    </>
)
}

export default ToolData

