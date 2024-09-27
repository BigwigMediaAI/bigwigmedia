import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Loader2 } from "lucide-react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import CreditLimitModal from "./Model3";


export function CodeGenerator() {
  const [code, setCode] = useState("");
  const [selectedStructure, setSelectedStructure] = useState("");
  const [selectedDesign, setSelectedDesign] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const [showModal3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(0);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans/current?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
        return res.data.data.currentLimit; // Return credits for immediate use
      } else {
        toast.error("Error occurred while fetching account credits");
        return 0;
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error("Error occurred while fetching account credits");
      return 0;
    }
  };

  const structures = ["HTML", "React", "Angular"];
  const designs = ["CSS", "Tailwind", "Bootstrap"];

  const handleCodeChange = (e:any) => {
    setCode(e.target.value);
  };

  const handleStructureChange = (e:any) => {
    setSelectedStructure(e.target.value);
  };

  const handleDesignChange = (e:any) => {
    setSelectedDesign(e.target.value);
  };

  const handleSubmit = async () => {
    if (!code || !selectedStructure || !selectedDesign) {
      toast.error("Please enter code and select structure and design.");
      return;
    }

    setIsLoading(true);

    const currentCredits = await getCredits();
    console.log('Current Credits:', currentCredits);

    if (currentCredits <= 0) {
      setTimeout(() => {
        setShowModal3(true);
      }, 0);
      setIsLoading(false)
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/response/component?clerkId=${userId}`,
        {
          command: code,
          structure: selectedStructure,
          design: selectedDesign,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let adjustedCode = response.data.code;
    //   if (selectedStructure === "HTML") {
    //     adjustedCode = formatHTML(adjustedCode);
    //   } else if (selectedStructure === "React") {
    //     adjustedCode = formatReact(adjustedCode);
    //   } else if (selectedStructure === "Angular") {
    //     adjustedCode = formatAngular(adjustedCode);
    //   }

      // Insert line breaks after each `>` character
      adjustedCode = adjustedCode.replace(/>/g, ">\n");

      setConvertedCode(adjustedCode);
    } catch (error:any) {
      console.error("Error converting code:", error);
      toast.error(error.response?.data?.error || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying code to clipboard:", error);
        toast.error("Failed to copy code to clipboard");
      });
  };

//   const formatHTML = (code:any) => {
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Title</title>
//   <style>
//     /* CSS styles here */
//   </style>
// </head>
// <body>
//   ${code}
// </body>
// </html>`;
//   };

//   const formatReact = (code:any) => {
//     return `import React from "react";
// import ReactDOM from "react-dom";

// function App() {
//   return (
//     <div>
//       ${code}
//     </div>
//   );
// }

// ReactDOM.render(<App />, document.getElementById("root"));`;
//   };

//   const formatAngular = (code:any) => {
//     return `import { Component, NgModule } from "@angular/core";
// import { BrowserModule } from "@angular/platform-browser";

// @Component({
//   selector: "app-root",
//   template: \`
//     ${code}
//   \`,
// })
// export class AppComponent {}

// @NgModule({
//   declarations: [AppComponent],
//   imports: [BrowserModule],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}`;
//   };

  return (
    <div className="m-auto w-full max-w-4xl rounded-lg lg bg-[var(--white-color)] p-6 shadow-md shadow-[var(--teal-color)]">
      <div className="flex flex-col md:flex-col">
        <div className="w-full pr-2">
          <label className="block text-[var(--primary-text-color)]">Write your text</label>
          <Textarea
            className="mb-5 h-28 border border-[var(--primary-text-color)]"
            placeholder="Create a navbar...
Create a footer...
Create a Login page...
            "
            value={code}
            onChange={handleCodeChange}
          />
          <div className="flex w-full my-4 items-center justify-between">
            <select
              className="w-1/2 mr-2 rounded-md border border-[var(--primary-text-color)] p-4"
              value={selectedStructure}
              onChange={handleStructureChange}
            >
              <option value="">Select Structure</option>
              {structures.map((structure) => (
                <option key={structure} value={structure}>
                  {structure}
                </option>
              ))}
            </select>
            <select
              className=" w-1/2 mr-2 rounded-md border border-[var(--primary-text-color)] p-4"
              value={selectedDesign}
              onChange={handleDesignChange}
            >
              <option value="">Select Design</option>
              {designs.map((design) => (
                <option key={design} value={design}>
                  {design}
                </option>
              ))}
            </select>
            </div>
            <Button
              className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-7 px-10 mt-3 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
              onClick={handleSubmit}
            >
              Generate
            </Button>
            {/* {convertedCode && (
              <Button
                className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit mx-auto"
                onClick={handleCopy}
              >
                Copy
              </Button>
            )} */}
          
        </div>
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-20 h-20 mt-20 text-[var(--dark-gray-color)]" />
            <p className="text-[var(--dark-gray-color)] text-justify">Converting code. Please wait...</p>
          </div>
        ) : convertedCode ? (
          <div className="w-full border border-[var(--primary-text-color)] rounded-lg p-4 mt-10">
            <div className="flex justify-between items-center mb-4 ">
              
              <h1 className="text-lg font-semibold">Converted Code</h1>
              <div className="flex gap-4">
              <Copy className="cursor-pointer text-[var(--primary-text-color)] hover:text-[var(--hover-teal-color)]" onClick={handleCopy} />
              </div>
            </div>
            <Textarea
              className="w-full mb-4 h-80 border border-[var(--primary-text-color)]"
              placeholder="Converted code will be displayed here..."
              value={convertedCode}
              readOnly
            />
          </div>
        ) : null}
      </div>
      {showModal3 && <CreditLimitModal isOpen={showModal3} onClose={() => setShowModal3(false)} />}
    </div>
  );
}
