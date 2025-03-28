import { useEffect, useState } from "react";
import logo from "../assets/bigwig-img.jpg";
import { ModeToggle } from "./ui/mode-toggle";
import google from "../assets/google-rating.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import {
  SignOutButton,
  SignIn,
  useAuth,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Globe } from "lucide-react";
import { RefObject } from "react";
interface NavProps {
  testimonialsRef: RefObject<HTMLDivElement>;
  blogsRef: RefObject<HTMLDivElement>;
}

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [credits, setCredits] = useState<{
    currentLimit: number;
    maxLimit: number;
    plan: string;
  } | null>();

  const getCredits = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL2}/plans/current?clerkId=${user!.id}`
      );
      if (res.status === 200) {
        setCredits(res.data.data);
        if (res.data.data.currentLimit === 0) {
          sendCreditLimitWarningEmail(
            user?.primaryEmailAddress?.emailAddress,
            user!.id
          );
        } else if (res.data.data.currentLimit > 0) {
          resetEmailSentFlag();
        }
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };
  const sendCreditLimitWarningEmail = async (email: any, clerkId: any) => {
    try {
      const res = await axios.post(
        "https://bigwigaibackend.onrender.com/send-email",
        { email, clerkId }
      );
      if (res.status === 200) {
        console.log("Credit limit warning email sent to:", email);
      } else {
        console.error("Failed to send credit limit warning email");
      }
    } catch (error) {
      console.error("Error sending credit limit warning email:", error);
    }
  };

  const resetEmailSentFlag = async () => {
    try {
      const res = await axios.put(
        "https://bigwigaibackend.onrender.com/reset-email-sent",
        { clerkId: user!.id }
      );
      if (res.status === 200) {
        console.log(res.data);
      } else {
        console.error("Failed to reset email sent flag");
      }
    } catch (error) {
      console.error("Error resetting email sent flag:", error);
    }
  };

  useEffect(() => {
    getCredits();
  }, [isLoaded, credits]);

  const googleTranslateElementInit = () => {
    // @ts-ignore
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    const googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
    // Check if the script has already been added
    const loadGoogleTranslateScript = () => {
      if (!window.googleTranslateElementInit) {
        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
        window.googleTranslateElementInit = googleTranslateElementInit;
      }
    };

    loadGoogleTranslateScript();
  }, []);

  const handleBlogs = () => {
    window.location.href = "/blog";
  };
  const handleTools = () => {
    window.location.href = "/tool";
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-[var(--background-color)] shadow-md"
      style={{ boxShadow: `0 4px 6px -1px var(--nav-shadow-color)` }}
    >
      <div className="h-10vh flex justify-between z-50 text-[var(--primary-text-color)] lg:py-5 px-5 md:px-14 mx-auto py-4 border-b items-center">
        <div className="md:hidden mr-3 relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-0 bg-transparent focus-visible:border-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[50vh] h-[30vh] fixed -left-8 top-0 bg-[var(--background-color)] shadow-md flex flex-col p-4">
              <DropdownMenuItem
                className="py-3 text-lg flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-5v-6H9v6H4a2 2 0 01-2-2V9z" />
                </svg>
                Home
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-3 text-lg flex items-center gap-2"
                onClick={handleTools}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14m7-7H5" />
                </svg>
                Tools
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-3 text-lg flex items-center gap-2"
                onClick={handleBlogs}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 16h8M8 12h8M8 8h8" />
                </svg>
                Blogs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="flex items-center gap-2 md:gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="bigwig-logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
          />
          <span className="text-[var(--primary-text-color)] hidden md:block font-outfit text-2xl font-semibold">
            BigWigMedia.ai
          </span>
          <img
            src={google}
            alt="secondary-logo"
            className="w-10 h-8 md:w-28 md:h-14 md:block hidden"
          />
        </div>

        <div className="flex-grow flex justify-center">
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className={`px-3 py-2 rounded-md text-lg ${
                location.pathname === "/"
                  ? "text-[var(--teal-color)] font-bold text-xl"
                  : "text-[var(--primary-text-color)] hover:bg-[var(--bg-color)] hover:text-[var(--teal-color)]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/tool")}
              className={`px-3 py-2 rounded-md text-lg ${
                location.pathname === "/tool"
                  ? "text-[var(--teal-color)] font-bold text-xl"
                  : "text-[var(--primary-text-color)] hover:bg-[var(--bg-color)] hover:text-[var(--teal-color)]"
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => navigate("/blog")}
              className={`px-3 py-2 rounded-md text-lg ${
                location.pathname === "/blog"
                  ? "text-[var(--teal-color)] font-bold text-xl"
                  : "text-[var(--primary-text-color)] hover:bg-[var(--bg-color)] hover:text-[var(--teal-color)]"
              }`}
            >
              Blogs
            </button>
          </div>
        </div>

        <div id="google_translate_element" className="mr-2"></div>
        <div className=" md:ml-3 flex gap-4 items-center justify-end">
          <div>
            {!isSignedIn ? (
              <button
                className="flex px-1 md:px-4 py-0 justify-center items-center text-[var(--teal-color)] border-[var(--teal-color)] font-semibold rounded-3xl text-[14px] min-h-[25px] border"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <button
                className="hidden md:flex px-4 py-0 justify-center items-center text-[var(--green)] border-[var(--green)] hover:bg-[var(--green)] hover:text-[var(--white-color)]  rounded-3xl text-[16px] min-h-[25px] border"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
            )}
          </div>

          <div className={cn("ml-3 mt-1", !isSignedIn && "hidden")}>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-0 bg-transparent focus-visible:border-none">
                {isSignedIn ? (
                  <img
                    src={user.imageUrl}
                    alt=""
                    className="w-9 h-9 focus-visible:border-none rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                  >
                    <path
                      d="M7.79199 25.5416H28.2087M7.79199 18.25H28.2087M7.79199 10.9583H28.2087"
                      stroke="black"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[var(--background-color)] shadow-md">
                {isSignedIn && (
                  <DropdownMenuItem
                    className="md:hidden"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  {!isSignedIn ? (
                    <button
                      className="flex text-[var(--primary-text-color)] font-outfit text-base font-semibold gap-2 w-full"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  ) : (
                    <div>
                      <SignOutButton />
                    </div>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
