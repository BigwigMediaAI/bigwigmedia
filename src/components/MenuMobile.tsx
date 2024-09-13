// import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Cards from "./Cards";
import { Card } from "@/pages/Landing";
import { button } from "@nextui-org/react";



interface MenuProps {
  buttons: String[];
  selectedButton: String;
  setSelectedButton: Function;
  cards: Card[];
  isLoading:Boolean;
  setChange:Function;
}

const MenuMobile = ({buttons,selectedButton,setSelectedButton,cards,isLoading,setChange}:MenuProps) => {
  return (
    <div className="my-14 z-50">
      <Accordion
        type="single"
        collapsible
        value={selectedButton as string}
        className="w-full flex flex-col gap-2"
        onValueChange={(value) => setSelectedButton(value)}
      >
        {buttons.map((ac, id) => (
          <AccordionItem value={ac as string} key={id} >
            <AccordionTrigger className="dark:text-white dark:border dark:border-gray-700 py-4 z-40 items-center rounded-md shadow-accordian px-5 font-outfit" >
              {ac}
            </AccordionTrigger>
            <AccordionContent >
              <Cards cards={cards} isLoading={isLoading} setChange={setChange}/>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default MenuMobile;
