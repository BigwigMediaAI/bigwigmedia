import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Cards from "./Cards";
import { Card } from "@/pages/Landing";

interface MenuProps {
  buttons: String[];
  selectedButton: String;
  setSelectedButton: Function;
  cards: Card[];
  isLoading: Boolean;
  setChange: Function;
}

const MenuMobile = ({
  buttons,
  selectedButton,
  setSelectedButton,
  cards,
  isLoading,
  setChange,
}: MenuProps) => {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined); // Use undefined instead of null

  const handleAccordionChange = (value: string | undefined) => {
    if (value === openItem) {
      setOpenItem(undefined); // Close the item if it's already open
    } else {
      setOpenItem(value); // Open the selected item
    }
    setSelectedButton(value);
  };

  return (
    <div className="my-14 z-50">
      <Accordion
        type="single"
        collapsible
        value={openItem}
        className="w-full flex flex-col gap-2"
        onValueChange={handleAccordionChange}
      >
        {buttons.map((ac, id) => (
          <AccordionItem value={ac as string} key={id}>
            <AccordionTrigger className="py-4 z-40 items-center rounded-md shadow-accordion px-5 font-outfit">
              {ac}
            </AccordionTrigger>
            <AccordionContent>
              <Cards cards={cards} isLoading={isLoading} setChange={setChange} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MenuMobile;
