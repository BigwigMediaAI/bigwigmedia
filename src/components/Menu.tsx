import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/funcitons";

interface MenuProps {
  buttons: string[];
  selectedButton: string;
  setSelectedButton: (button: string) => void;
}

const Menu = ({ buttons, selectedButton, setSelectedButton }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
    navigate(`/category/${button}`);
  };

  if (buttons.length === 0) return null;

  return (
    <div className="relative flex flex-row mt-4 justify-end gap-1 md:gap-3 z-10 w-5/6 mx-auto transition-all duration-1000 mb-5 md:mb-10">
      <div
        className={cn(
          "left-0 z-40 w-[calc(100%-44px)] md:w-[calc(100%-76px)] mx-w-[240] md:auto lg:[644px] h-16 md:py-2 md:px-10 rounded-md bg-white-color shadow-md transition-all border border-gray-700 duration-1000 delay-1000",
          isOpen && "h-fit overflow-auto"
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center justify-start overflow-hidden gap-1 md:gap-4 transition-all duration-300 text-xl font-bold",
            isOpen && "h-fit overflow-auto flex-wrap justify-center"
          )}
        >
          {buttons.map((button, id) => (
            <button
              className={cn(
                "text-[rgba(30,30,30,0.50)] font-outfit rounded-full p-3 min-w-fit text-base font-medium",
                button === selectedButton && "items-start text-[var(--teal-color)] border border-[var(--teal-color)]"
              )}
              onClick={() => handleButtonClick(button)}
              key={id}
            >
              {button}
            </button>
          ))}
        </div>
      </div>

      <div className="w-14 h-14">
        <button
          className="flex flex-col w-30 h-16 p-4 items-center justify-center gap-4 rounded-md border border-gray-700 bg-white-color shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className={cn(
              "w-30 h-30 transition-all duration-300 dark:invert",
              isOpen && "rotate-180"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M22.5 15L15 22.5L7.5 15"
                stroke="#1E1E1E"
                strokeWidth="1.875"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.5 7.5L15 15L7.5 7.5"
                stroke="#1E1E1E"
                strokeWidth="1.875"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
