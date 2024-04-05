import gradient from "../assets/gradient.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Hero = ({
  search,
  setSearch,
  onClick,
}: {
  search: string;
  setSearch: Function;
  onClick: Function;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center space-y-4">
      <div className=" py-4 text-black dark:text-white text-center font-outfit text-[40px] md:text-[45px] lg:text-[50px] font-normal flex flex-col md:block">
        ACCESS THE POWER OF 
        <span className="bg-gradient text-transparent bg-clip-text font-outfit font-semibold">
          {" "}
          GENERATIVE AI{" "}
        </span>
        
      </div>
      <div className="  sm:text-[14px] md:text-[17px] lg:text-[20px] content-center py-4  text-center font-outfit text-black dark:text-white   z-10 w-full max-w-[320] md:auto lg:844px mx-auto font-normal">
        AI Generative Tools for Everyone! : Simplify, Create, Dominate with Bigwig
Media AI
      </div>
      <div className="w-full max-w-[320] md:auto lg:844px relative my-8 flex justify-center items-center h-fit">
        <div className="z-10 w-full max-w-[637px]  overflow-hidden mx-auto p-[6px] md:p-2  border-gradient bg-white  dark:bg-[#1E1E1E] ">
          <div className="flex  justify-between   border-opacity-0  overflow-hidden  rounded-[73px] items-center ">
            <input
              placeholder="Find Your Tool.."
              className="w-full  border-none focus-visible:placeholder:text-transparent z-50 rounded-l-[73px] outline-none px-4 py-1 md:py-4 placeholder:text-black dark:placeholder:text-white dark:text-white bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onClick();
                }
              }}
            />
            <button
              className=" text-white text-center font-outfit md:text-lg font-semibold flex relative  text-xs  p-3 md:p-5 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient hover:opacity-80"
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
export default Hero;
7;
