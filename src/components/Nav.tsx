import { useEffect, useState } from "react";
import logo from "../assets/bigwig-img.jpg";
import { ModeToggle } from "./ui/mode-toggle";

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
  testimonialsRef: RefObject<HTMLDivElement>,
  blogsRef: RefObject<HTMLDivElement>;
}

const Nav=() => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();

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

  const handleContacts = () => {
    window.location.href="/contact"
  };

  const handleBlogs = () => {
    window.location.href="/blog"
  };

  return (
    <nav className="sticky top-0 z-50 backnavdrop shadow-md dark:shadow-black">
      <div className="h-10vh flex justify-between z-50 text-black dark:text-white lg:py-5 px-5 md:px-14  mx-auto py-4 border-b items-center">
        {/* Hamburger menu for smaller screens */}
        <div className="md:hidden mr-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-0 bg-transparent focus-visible:border-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.75 5a.75.75 0 1 1 0-1.5h14.5a.75.75 0 1 1 0 1.5H2.75zm0 5a.75.75 0 1 1 0-1.5h14.5a.75.75 0 1 1 0 1.5H2.75zm0 5a.75.75 0 1 1 0-1.5h14.5a.75.75 0 1 1 0 1.5H2.75z"
                clipRule="evenodd"
              />
            </svg>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-zinc-900">
              <DropdownMenuItem onClick={() => navigate("/")}>Home</DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlogs}>Blogs</DropdownMenuItem>
              <DropdownMenuItem onClick={handleContacts}>
                Contact us
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          {/* Logo and site name */}
          <img
            src={logo}
            alt="bigwig-logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
          />
          <span className="text-gray-900 hidden md:block dark:text-white font-outfit text-2xl font-semibold">
            BigWigMedia.ai
            {/* <sup className="text-xs px-4 ml-2 py-0 justify-center items-center dark:text-white font-semibold rounded-3xl dark:border-white border-[1.4px] text-[14px] min-h-[25px] bg-green-400 border-black ">
              beta
            </sup> */}
          </span>
        </div>

        <div className="flex-grow flex justify-center">
          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-900 dark:text-white font-semibold"
          >
            Home
          </button>
          <button
            onClick={() => navigate('/blog')}
            className="text-gray-900 dark:text-white font-semibold"
          >
            Blogs
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="text-gray-900 dark:text-white font-semibold"
          >
            Contact us
          </button>
        </div>
        </div>

        {/* Language selector */}
        <div id="google_translate_element" className="mr-3"></div>

        {/* User profile and login/logout */}
        <div className="flex gap-4 items-center justify-end">
          <div>
            {!isSignedIn ? (
              <button
                className="flex px-1 md:px-4 py-0 justify-center items-center dark:text-white border-[1.4px] font-semibold rounded-3xl dark:border-white text-[14px] min-h-[25px] border-black"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </button>
            ) : (
              <button
                className="hidden md:flex px-4 py-0 justify-center items-center dark:text-white font-semibold rounded-3xl dark:border-white border-[1.4px] text-[14px] min-h-[25px] border-black"
                onClick={() => {
                  navigate("/profile");
                }}
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
                    className="dark:invert"
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
              <DropdownMenuContent className="dark:bg-zinc-900">
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
                      className="flex dark:text-white font-outfit text-base font-semibold gap-2 w-full"
                      onClick={() => {
                        navigate("/login");
                      }}
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
