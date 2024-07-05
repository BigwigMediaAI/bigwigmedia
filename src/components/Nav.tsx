import { useEffect, useState } from "react";
import logo from "../assets/bigwig-img.jpg";
import { ModeToggle } from "./ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

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
    // Check if the script has already been added
    if (!window.googleTranslateElementInit) {
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      // @ts-ignore
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 backnavdrop shadow-md dark:shadow-black">
      <div className=" h-10vh flex justify-between z-50 text-black dark:text-white lg:py-5 px-4 md:px-14 lg:pl-6 lg:pr-24 mx-auto py-4 border-b items-center">
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 md:hidden">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-zinc-900 mt-2 w-28">
              {isSignedIn && (
                <DropdownMenuItem>
                  <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                </DropdownMenuItem>
              )}
              {isSignedIn && (
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate("/")}>Home</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/blog")}>Blogs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/contact")}>Contact Us</DropdownMenuItem>
              {!isSignedIn ? (
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Login
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer mr-28"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="bigwig-logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg mx-auto"
          />
          <span className="hidden lg:block text-gray-900 dark:text-white font-outfit text-2xl font-semibold">
            BigWigMedia.ai
            <sup className="text-xs px-4 ml-2 py-0 justify-center items-center dark:text-white font-semibold rounded-3xl dark:border-white border-[1.4px] text-[14px] min-h-[25px] bg-green-400 border-black">beta</sup>
          </span>
        </div>

        <div className="justify-center flex random">
          <div id="google_translate_element" className="ml-1"></div>
        </div>

        <div className={cn("hidden md:flex gap-4 items-center justify-end front-normal max-h-[30px]")}>
          <button onClick={() => navigate("/")} className="px-2">Home</button>
          <button onClick={() => navigate("/blog")} className="px-2">Blogs</button>
          <button onClick={() => navigate("/contact")} className="px-2">Contact Us</button>
          {/* <ModeToggle /> */}
          {isSignedIn ? (
            <button
              className="flex px-4 py-0 justify-center items-center dark:text-white font-semibold rounded-3xl dark:border-white border-[1.4px] text-[14px] min-h-[25px] border-black"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
          ) : (
            <button
              className="flex px-1 md:px-4 py-0 justify-center items-center dark:text-white border-[1.4px] font-semibold rounded-3xl dark:border-white text-[14px] min-h-[25px] border-black"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}
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
    </nav>
  );
};

export default Nav;
