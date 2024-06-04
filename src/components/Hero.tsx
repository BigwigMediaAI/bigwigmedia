import gradient from "../assets/gradient.png";
import { useState, useEffect } from "react";

const rotatingWords = ["Your Work", "Your Life", "Your Task", "Business", "Everything"];

const Hero = ({
  search,
  setSearch,
  onClick,
}: {
  search: string;
  setSearch: (value: string) => void;
  onClick: () => void;
}) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <div className="py-4 text-black dark:text-white text-center font-outfit text-[30px] md:text-[40px] lg:text-[50px] font-normal w-full flex gap-2 justify-center flex-wrap">
        <span>Include Tools to Make{" "}</span>
        <span className="rotating-words w-1/2 md:w-1/5 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text font-outfit font-semibold" style={{animation: "rotate 2s infinite"}}>
          {rotatingWords[wordIndex]}
        </span>{" "}
        <span >Simple</span>
      </div>
      <div className="sm:text-[14px] md:text-[17px] lg:text-[20px] py-4 text-center font-outfit text-black dark:text-white z-10 w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] mx-auto font-normal">
        AI Generative Tools for Everyone! : Simplify, Create, Dominate with Bigwig Media AI
      </div>
      <div className="w-full max-w-[320px] md:max-w-[640px] lg:max-w-[844px] relative my-8 flex justify-center items-center h-fit">
        <div className="z-10 w-full max-w-[637px] overflow-hidden mx-auto p-[6px] md:p-2 border-gradient bg-white dark:bg-[#1E1E1E]">
          <div className="flex justify-between border-opacity-0 overflow-hidden rounded-[73px] items-center">
            <input
              placeholder="Find Your Tool.."
              className="w-full border-none focus-visible:placeholder:text-transparent z-50 rounded-l-[73px] outline-none px-4 py-1 md:py-4 placeholder:text-black dark:placeholder:text-white dark:text-white bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onClick();
                }
              }}
            />
            <button
              className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-xs p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80"
              onClick={() => {
                onClick();
              }}
            >
              Search
            </button>
          </div>
        </div>
        <img src={gradient} className="absolute -z-1" />
      </div>
      
    </div>
  );
};

export default Hero;