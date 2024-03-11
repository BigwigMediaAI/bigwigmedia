import { Chip } from "@nextui-org/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface MultiSelectProps {
  chips: string[];
  setChips: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  options?: string[];
  placeholder?: string;  
}

const MultiSelect = ({ chips, setChips, label, options = [], placeholder }:MultiSelectProps) => {
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [height, setHeight] = useState();
  const ref = useRef();
  const ref2 = useRef();
  const topId = "top";

  const popupOptions = useMemo(() => {
    return options?.filter((option) => {
      return option?.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, options]);

  const handleKeyDown = (event: any) => {
    // alert(event.key);
    if (
      (event.key === "Enter" ||
        event.key === "Tab" ||
        event.charCode === 13 ||
        event.keyCode === 13) &&
      !!search
    ) {
      // ... (existing code for handling Enter key remains unchanged)
      event.preventDefault();
      let newChip = event.target.value.trim();

      if (popupOptions.length !== 0 && highlightedIndex !== -1) {
        newChip = popupOptions[highlightedIndex];
      }
      if (newChip) {
        setChips((prevChips) => [...prevChips, newChip]);
        setSearch(""); // Clear the input after adding the chip
      }
      return;
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < popupOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }
  };
  const handleChipCloseFoodItem = (indexToRemove:any) => {
    setChips((prevChips) =>
      prevChips.filter((_, index) => index !== indexToRemove)
    );
  };
  useEffect(() => {
    //@ts-ignore
    setHeight(ref.current?.offsetHeight);
    if (ref2.current) {
      //@ts-ignore

      ref2.current.style.top = `${ref.current.offsetHeight}px`;
    }
  }, [chips]);

  return (
    <div
    // @ts-ignore
      ref={ref}
      className="bg-default-100  py-2 px-3 flex flex-col min-h-[56px] rounded-medium relative"
    >
      <label
        htmlFor="numdays"
        className=" z-10 pointer-events-none origin-top-left subpixel-antialiased block text-foreground-500 cursor-text will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-default-600 group-data-[filled-within=true]:pointer-events-auto group-data-[filled-within=true]:scale-85 text-xs group-data-[filled-within=true]:-translate-y-[calc(50%_+_theme(fontSize.small)/2_-_6px)] pe-2 max-w-full text-ellipsis overflow-hidden"
      >
        {label}
      </label>
      <div className="flex flex-row  flex-wrap gap-2 ">
        {chips?.map((chip, index) => (
          <Chip
            onClose={() => {
              handleChipCloseFoodItem(index);
            }}
            variant="flat"
            key={chip}
          >
            {chip}
          </Chip>
        ))}

        <input
          type="text"
          className="bg-inherit relative outline-none border-none ring-none w-fit min-w-[200px] placeholder:text-foreground-500 text-foreground-600 font-normal text-small"
          placeholder={placeholder ?? "Search "}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          enterKeyHint="enter"
        />

        {
          <div
            className={`${
              search === "" && "hidden"
            } absolute left-0 w-full z-50 bg-content1 px-2.5 py-1 rounded-lg  transition-all   !duration-1000 delay-300 outline-none`}
            //@ts-ignore
            ref={ref2}
          >
            <div className="px-1 py-2 overflow-y-scroll scrollbar-thin max-h-[300px] flex flex-col">
              {popupOptions?.map((option, index) => (
                <div
                  className={`flex flex-col justify-center text-gray-700 px-2 ${
                    highlightedIndex === index ? "bg-gray-300  rounded-md" : "" // Add a background color or any styling for the highlighted option
                  }`}
                  key={option}
                  onClick={() => {
                    setChips((prevChips) => [...prevChips, option]);
                    setSearch("");
                  }}
                >
                  {option}
                </div>
              ))}
              {popupOptions?.length === 0 && (
                <div className="flex flex-col justify-center text-gray-700">
                  No Results Found
                </div>
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default MultiSelect;
