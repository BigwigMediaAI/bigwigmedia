import { useNavigate, useSearchParams } from "react-router-dom";
import gradient from "../assets/gradient.png";

// import logo from "../assets/Logo.png";
import logo from "../assets/bigwig-img.jpg";
import { useEffect, useState } from "react";
import { BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";

const Footer = () => {
  const [buttons, setButtons] = useState<string[]>([]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const getButtons = async () => {
    // const
    const res = await axios.get(`${BASE_URL2}/objects/getCategories`);
    const bookmarked = [...res.data.message];
    setButtons(bookmarked);
  };
  // console.log(setButtons)

  useEffect(() => {
    // getButtons();
    // isSignedIn && getBookMarks();
  }, []);

  const arr = [
    "Social Media Tools",
    "Email Generator Tools",
    "Content Generation Tools",
    "Marketing Tools",
    "Video Tools",
    "Audio Tools",
    "File Converter Tools",
    "PDF Tools",
    "Start-Up Tools",
  ];
  // const buttonFilter = buttons.filter((button) => !arr.includes(button ));

  return (
    <div className="flex flex-col relative items-center gap-[25px] shrink-0 mt-14 pb-4 border-t pt-8 px-8 justify-center w-full h-110">
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="231"
        height="252"
        viewBox="0 0 231 252"
        fill="none"
        className="absolute top-0 right-0 z-0 "
      >
        <g opacity="0.7">
          <g opacity="0.7" filter="url(#filter0_f_231_180)">
            <ellipse cx="186.5" cy="33.5" rx="58.5" ry="60.5" fill="#9E00FF" />
          </g>
          <g opacity="0.7" filter="url(#filter1_f_231_180)">
            <ellipse cx="268.5" cy="72.5" rx="58.5" ry="60.5" fill="#1473E6" />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_231_180"
            x="0.800003"
            y="-154.2"
            width="371.4"
            height="375.4"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="63.6"
              result="effect1_foregroundBlur_231_180"
            />
          </filter>
          <filter
            id="filter1_f_231_180"
            x="82.8"
            y="-115.2"
            width="371.4"
            height="375.4"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="63.6"
              result="effect1_foregroundBlur_231_180"
            />
          </filter>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="251"
        height="237"
        viewBox="0 0 251 237"
        fill="none"
        className="absolute bottom-0 left-0 z-0 "
      >
        <g opacity="0.7" filter="url(#filter0_f_231_177)">
          <ellipse cx="-17.5" cy="188.5" rx="58.5" ry="60.5" fill="#FFC700" />
        </g>
        <g opacity="0.7" filter="url(#filter1_f_231_177)">
          <ellipse cx="64.5" cy="227.5" rx="58.5" ry="60.5" fill="#FF003D" />
        </g>
        <defs>
          <filter
            id="filter0_f_231_177"
            x="-203.2"
            y="0.800003"
            width="371.4"
            height="375.4"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="63.6"
              result="effect1_foregroundBlur_231_177"
            />
          </filter>
          <filter
            id="filter1_f_231_177"
            x="-121.2"
            y="39.8"
            width="371.4"
            height="375.4"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="63.6"
              result="effect1_foregroundBlur_231_177"
            />
          </filter>
        </defs>
      </svg> */}
      <div className="flex flex-wrap items-start gap-2 px-5 md:px-auto md:gap-[83px]">
        <div className="flex flex-col items-start justify-center gap-[18px] w-fit h-[167px] mt-[-30px]">
          <div
            className="flex justify-cent
          er"
          >
            <div
              id="google_translate_element"
              className="hidden sm:block"
            ></div>
          </div>
          <div className="flex flex-row items-center gap-[24px]">
            <img
              src={logo}
              alt=""
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
            />
            <div className="bg-clip-text text-black font-bold text-[18px]">
              BigWigMedia.ai
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:gap-[21px]">
            <div className="  text-[12px] md:text-[15px] text-[var(--primary-text-color)] font-Outfit text-base font-medium leading-normal">
              BigWig Media AI Tools
            </div>
            <div className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] font-Outfit text-base font-medium leading-normal">
              Made with <span className="text-red-600">❤</span> by{" "}
              <button onClick={() => window.open("https://bigwigmedia.in")}>
                BigWigMedia
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 sm:w-auto ">
          <div className="text-black font-bold text-[18px]">Top Tools</div>
          <div className="grid grid-cols-2 gap-2">
            {arr.map((button, id) => (
              <div
                className=" text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)] font-Outfit text-base font-medium leading-normal cursor-pointer pr-[20px]"
                key={id}
                onClick={() => {
                  const encodedButton = encodeURIComponent(button);
                  searchParams.set("selectedButton", encodedButton);
                  setSearchParams(searchParams);
                  navigate(`/tool?selectedButton=${encodedButton}`);
                }}
              >
                {button}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col items-start gap-4 sm:w-auto ">
            <div className=" text-black font-bold text-[18px]">Company</div>
            <div className="flex flex-col items-start gap-2">
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  cursor-pointer font-Outfit text-base font-medium leading-normal"
                onClick={() => {
                  navigate("/about");
                }}
              >
                About Us
              </div>
              <div
                className=" text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  cursor-pointer  font-Outfit text-base font-medium leading-normal"
                onClick={() => {
                  navigate("/contact");
                }}
              >
                Contact
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursive cursor-pointer"
                onClick={() => {
                  navigate("/blog");
                }}
              >
                Blogs
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursive cursor-pointer"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                My Profile
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/Disclaimer");
                }}
              >
                Disclaimer
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/feedback");
                }}
              >
                Feedback
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 sm:w-auto ">
            <div className="text-black font-bold text-[18px]">Policies</div>
            <div className="flex flex-col items-start gap-2">
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/terms");
                }}
              >
                Terms of Service
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/privacy");
                }}
              >
                Privacy Policy
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/legal");
                }}
              >
                Legal
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/transaction");
                }}
              >
                Secure Transaction Policy
              </div>
              <div
                className="text-[12px] md:text-[15px] text-[var(--primary-text-color)] hover:text-[var(--teal-color)]  font-Outfit text-base font-medium leading-normal hover:cursor-pointer"
                onClick={() => {
                  navigate("/Cancellation-policy");
                }}
              >
                Refund and Cancellation Policy
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ModeToggle /> */}

      <div className="text-[var(--primary-text-color)] font-Outfit text-base font-medium leading-normal">
        © 2024 Bigwigmedia.ai. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
