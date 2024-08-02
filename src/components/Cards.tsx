import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "../pages/Landing";
import { useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import  LoginModal  from "../components/Model2";

const Cards = ({
  cards,
  isLoading,
  setChange,
}: {
  cards: Card[];
  isLoading: Boolean;
  setChange: Function;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mx-auto flex-wrap md:mt-5 lg:mt-14 gap-3 xl:max-w-[90%]  md:gap-10">
      {!isLoading ? (
        cards.map((card, id) => {
          return <CardComponent card={card} key={id} setChange={setChange} />;
        })
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="animate-spin w-20 h-20 mt-20" />
        </div>
      )}
    </div>
  );
};

export default Cards;

const CardComponent = ({
  card,
  setChange,
}: {
  card: Card;
  setChange: Function;
}) => {
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(card.isBookmarked);
  const navigate = useNavigate();
  const { user, isSignedIn, isLoaded } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false); // State for managing modal visibility
  

  
  const handleBookmarkToggle = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to bookmark this template");
      return navigate("/login");
    }
    
    
    const res = await axios.post(
      `${BASE_URL}/bookmarks/add-remove/${card._id}?clerkId=${user.id}`,
      {}
    );
    if (res.status === 200) {
      // setIsBookmarked(res.data.data.includes(card._id));
      setChange((prev: number) => prev+1);
      toast.success("Bookmark " + (isBookmarked ? "removed!" : "added!"));
      setIsBookmarked(!isBookmarked);
    }
  };

  const bool = card.labels?.includes("Upcoming Tools");

  return (
    <div className="bg-teal-400 p-0.5 rounded-xl">
    <div className="flex flex-col justify-between gap-5 px-3 py-4 text-gray-700 shadow-accordian rounded-xl max-w-80 h-[234px]   bg-white dark:bg-[#262626] dark:border dark:border-gray-700 w-full">
      <div className="flex flex-row gap-8  justify-start items-center ">
        {!imageLoaded && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="37"
            height="38"
            viewBox="0 0 37 38"
            fill="none"
            className="m-3 dark:invert"
          >
            <path
              d="M22.1409 16.3738L35.8019 0.493652H32.5643L20.7029 14.2818L11.2287 0.493652H0.301323L14.628 21.3441L0.301323 37.9965H3.53887L16.0654 23.4357L26.0705 37.9965H36.9979L22.14 16.3738H22.1409ZM17.7068 21.5275L16.255 19.4514L4.70527 2.93075H9.67792L18.9983 16.2636L20.4497 18.3397L32.5658 35.6702H27.5937L17.7068 21.5284V21.5275Z"
              fill="black"
            />
          </svg>
        )}
        <img
          src={card.logo.replace(
            "http://localhost:4000",
            "https://social-media-ai-content-api.onrender.com"
          )}
          alt=""
          className="m-3 max-w-9 max-h-9"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
          style={{ display: imageLoaded ? "initial" : "none" }}
        />
        <div className=" flex items-center text-xl text-black  dark:text-white font-outfit  font-semibold">
          {card.name}
        </div>
      </div>
      <div className="w-full line-clamp-3 text-center  text-sm dark:text-white  font-normal">
        {/* {card.xion} */}
        {card.tagLine}
      </div>
      <div className="flex items-start justify-center  pt-0 gap-5">
        <button
          className=" dark:text-white flex w-full p-1 md:p-2 justify-center my-auto hover:opacity-80 gap-2.26 rounded-full bg-teal-400 hover:bg-teal-600 text-white font-outfit text-base font-medium px-10 mx-auto"
          onClick={() => {
            if (bool) {
              toast("Coming Soon...");
              return;
            }
            // If user is not signed in, show the login modal
          if (!isSignedIn) {
            console.log("clicked")
            setTimeout(() => {
              setShowLoginModal(true);
            }, 0);
          } else {
            const newPath = `/generate?id=${card._id}`;
            window.open(newPath, "_blank");
          }
          }}
        >
          Generate
        </button>
        {showLoginModal && (
        <LoginModal
          isOpen={true}
          onClose={() => setShowLoginModal(false)}
        />
      )}
        <div
          className={cn(
            "flex w-fit p-1 my-auto hover:invert h-fit bg-white justify-center items-center cursor-pointer  rounded-full border border-gray-900",
            isBookmarked && "invert hover:invert-0"
          )}
          onClick={handleBookmarkToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="self-center w-4 h-4"
            viewBox="0 0 17 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.83362 3.48541C2.83362 2.961 3.04194 2.45807 3.41275 2.08725C3.78357 1.71644 4.2865 1.50812 4.81091 1.50812H11.4019C11.9263 1.50812 12.4292 1.71644 12.8 2.08725C13.1708 2.45807 13.3792 2.961 13.3792 3.48541V14.0494C13.3792 14.8535 12.4696 15.3215 11.8158 14.8542L8.10639 12.2046L4.39699 14.8542C3.74251 15.3221 2.83362 14.8541 2.83362 14.0501V3.48541Z"
              fill="#1E1E1E"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
  );
};