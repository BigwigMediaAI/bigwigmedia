import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "../pages/ToolData";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import LoginModal from "../components/Model2";
import BigwigLoader from "@/pages/Loader";

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
          <BigwigLoader />
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
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      setChange((prev: number) => prev + 1);
      toast.success("Bookmark " + (isBookmarked ? "removed!" : "added!"));
      setIsBookmarked(!isBookmarked);
    }
  };

  const bool = card.labels?.includes("Upcoming Tools");

  return (
    <div className="shadow-md shadow-[var(--teal-color)] p-0.5 rounded-xl">
      <div className="flex flex-col justify-between gap-5 px-3 py-4 text-gray-700 shadow-accordian rounded-xl w-[355px] h-[265px] bg-[var(--white-color)]">
        <div className="flex flex-row gap-8 justify-start items-center">
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
            className="m-3 max-w-16 max-h-16"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            style={{ display: imageLoaded ? "initial" : "none" }}
          />
          <div className="flex items-center text-xl text-[var(--primary-text-color)] font-outfit font-semibold">
            {card.name}
          </div>
        </div>
        <div className="w-full line-clamp-3 text-center text-md font-normal">
          {card.tagLine}
        </div>
        <div className="flex items-start justify-center pt-0 gap-5">
          <button
            className="flex w-full p-1 md:p-2 justify-center my-auto gap-2.26 rounded-full bg-white hover:bg-[var(--teal-color)] hover:text-[var(--white-color)] border-2 border-[var(--teal-color)] text-[var(--teal-color)] font-outfit text-base font-medium px-10 mx-auto"
            onClick={() => {
              if (bool) {
                toast("Coming Soon...");
                return;
              }
              if (!isSignedIn) {
                console.log("clicked");
                setTimeout(() => {
                  setShowLoginModal(true);
                }, 0);
                const redirectUrl = `/generate?id=${card._id}`;
    navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
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
    "flex w-fit p-1 my-auto h-fit bg-[var(--white-color)] justify-center items-center cursor-pointer rounded-full border border-gray-900",
    isBookmarked && "bg-[#ee3d49]"
  )}
  onClick={handleBookmarkToggle}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="self-center w-4 h-4"
    viewBox="0 0 24 24"
    fill={isBookmarked ? "#ffffff" : "none"}
    stroke={isBookmarked ? "none" : "#ee3d49"}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={isBookmarked ? "#ffffff" : "none"}
      stroke={isBookmarked ? "none" : "#ee3d49"}
      strokeWidth="2"
    />
  </svg>
</div>

        </div>
      </div>
    </div>
  );
};
