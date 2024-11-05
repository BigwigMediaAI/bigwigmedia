import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the types for FAQ item
interface FAQItem {
  question: string;
  answer: string;
}

// Define the type for the description prop
interface FAQSectionProps {
  description: {
    faq: FAQItem[];
  };
}

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-gray-200", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 justify-between items-center text-left transition-colors duration-200 hover:bg-gray-100 py-4 px-5 rounded-md",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-5 w-5 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all duration-300"
    {...props}
  >
    <div className={cn("bg-gray-50 p-4 text-gray-700 border-l-4 border-blue-500", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const FAQSection: React.FC<FAQSectionProps> = ({ description }) => (
  <Accordion
    type="single"
    collapsible
    className="w-full flex flex-col gap-2"
  >
    {description?.faq?.map((ac: FAQItem, id: number) => (
      <AccordionItem value={ac.question} key={id}>
        <AccordionTrigger className="font-outfit">
          {ac.question}
        </AccordionTrigger>
        <AccordionContent>
          {ac.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, FAQSection };
