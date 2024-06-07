// import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { useAuth } from "@clerk/clerk-react";
import {
  Link,
  Navigate,
  json,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { button } from "@nextui-org/react";
import { ClipboardList } from "lucide-react";
import { Paraphrase } from "./paraphrase";
import { Special } from "./Special";
import { Decision } from "./DecisionTool";
import { Seotool } from "./SEOtool";
import { ImageTool } from "./Imageresizer";
import ImageGenerator from "./ImageGenerator";
import { ElementType } from "@/pages/Form";
import { Input } from "./ui/input";
import { CodeConverter } from "./Codeconverter";
import { MarketingCampaign } from "./Marketingcampaing";
import { QRCodeGenerator } from "./QRcode";
import { FacebookImageTool } from "./FacebookImageResizer";
import Audio from "./Audio";
import AudioText from "./AudioText";
import { RotateCw } from "lucide-react";
import Share from "./Share";
import { Script } from "./paraphrase2";
import { InstagramImageTool } from "./InstagramImageResizer";
import { LinkedinImageTool } from "./LinkedInImageResizer";
import { PinterestImageTool } from "./PinterestImageResizer";
import { SnapchatImageTool } from "./SnapchatImageResizer";
import { TwitterImageTool } from "./TwitterImageResizer";
import { YoutubeImageTool } from "./YoutubeImageResizer";
import { CodeGenerator } from "./CodeGenerator";
import { Rephrase } from "./ParaRepharse";
import { ImagetoText } from "./ImgtoText";
import { JPEGtoPDFConverter } from "./ImagetoPdf";
import { PDFMerger } from "./PdfMerge";
import { VideoDownloader } from "./Youtube";
import { Mp3Downloader } from "./YoutubeMp3";
import { InstagramDownloader } from "./InstagramVideo";
import { PNGtoPDFConverter } from "./PngtoPdf";
import { AudioConverter } from "./VideotoAudio";
import { InstagramImageDownloader } from "./InstagramImage";
import { FacebookDownloader } from "./FacebookVideo";
import { PNGtoJPGConverter } from "./PngToJpg";
import { JPGtoPNGConverter } from "./JpgToPng";
import { TikTokDownloader } from "./TiktokVideo";
import { TextToPdfConverter } from "./TextToPdf";
import { TwitterDownloader } from "./TwitterVideo";
import { Seopodcast } from "./Podcast";
import { SvgConverter } from "./SvgConverter";
import { FileToZipConverter } from "./ZipConverter";
import { GifConverter } from "./GifConverter";
import { Summarize } from "./GenarateSummary";
import { ZipExtractor } from "./ZipExtractor";
import GeneratorImage from "./SpeechToImage";
import { NotesGenerator } from "./NotesGenerator";
import { PdfToTextConverter } from "./PdfToText";
import { ExtractImage } from "./ExtractImage";
import { VideoCompressor } from "./VideoCompressor";
import { GenerateDomainNames } from "./DomainName";
import { GenerateBusinessNames } from "./BuisnessNameGenerator";
import { PdfTranslate } from "./TranslatePdf";
import { VideoToTextConverter } from "./VideoToText";
import { GenerateCurrentTopics } from "./CurrentTopicGenerator";
import { VideoTrimmer } from "./TrimVideo";
import { AudioTrimmer } from "./TrimAudio";
import { PdfPageDeleter } from "./PdfPageDeleter";
import { NDAForm } from "./GenerateNDA";
import { YouTubeScriptGenerator } from "./YoutubeScriptGenerator";
import { NCAForm } from "./GenerateNCA";
import { BusinessSloganGenerator } from "./BusinessSloganGenerator";
import { ContentImprover } from "./ContentImprover";
import { TriviaGenerator } from "./TriviaGenerate";
import { AudioRemover } from "./AudioRemover";
import { PollGenerator } from "./PollGenerator";
import { GeneratePrivacyPolicy } from "./PrivacyPolicyGenerator";
import { BusinessPlanGenerator } from "./BusinessPlanGenerator";
// import { ShareSocial } from "react-share-social"; 



function extractJSON(textWithJSON: string) {
  // Find the index of the first occurrence of '{'
  var startIndex = textWithJSON.indexOf("{");
  // Find the index of the last occurrence of '}'
  var endIndex = textWithJSON.lastIndexOf("}") + 1;
  // Extract the JSON content
  var jsonContent = textWithJSON.substring(startIndex, endIndex);
  console.log("abcd",textWithJSON,"abcd",jsonContent)
  return jsonContent;
}

interface Tool {
  _id: String;
  name: String;
  description: String;
  logo: string;
  labels: String[];
  faq: {
    question: string;
    answer: string;
  }[];
}

interface Icon {
  _id: String;
  name: String;
  logo: String;
}

function manipulate(bio: string) {
  // Convert the bio to lowercase for case-insensitive matching
  const lowerCaseBio = bio?.toLowerCase();

  // Check if "ai" is present in the bio
  const containsAI = lowerCaseBio?.includes("ai");

  // Check if "generator" is present in the bio
  const containsGenerator = lowerCaseBio?.includes("generator");

  // Remove "ai" from the bio
  const bioWithoutAI = containsAI ? bio.replace(/ai/gi, "") : bio;

  // Remove "Generator!" from the bio (if present)
  const bioWithoutGenerator = containsGenerator
    ? bioWithoutAI.replace(/generator[!]?/gi, "")
    : bioWithoutAI;

  // Trim any extra spaces resulting from the removals
  const finalBio = bioWithoutGenerator?.trim();

  return finalBio;
}

const Generate = () => {
  const [description, setDescription] = useState<Tool | undefined>();
  const [text, settext] = useState("");
  const [output, setOutput] = useState<{ output: string } | undefined>();
  const [hashTag, setHashTag] = useState(true);
  const [icons, setIcons] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const reffered = urlParams.get("reffered");
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [selectedButton, setSelectedButton] = useState("Professional");
  const [isLoading, setIsLoading] = useState(false);
  const [relatedTemplates, setrelatedTemplates] = useState<Icon[]>([]);
  const [val, setVal] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const basicOutputRef = useRef(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedInput, setGeneratedInput] = useState<any[]>()
  const arr = useMemo(() => groups, [groups])
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({
        pathname: "/login",
        
      });
      toast.error("Please Signin to continue");
      return;
    }

    const handleReffer = async()=>{
      const res = await axios.get(
        `${BASE_URL2}/limits/?limit=${userId}&reffered=${reffered}`,
        
      );
    }
    if(isLoaded&&isSignedIn&&reffered){
       handleReffer()
    }
  }, [isLoaded, reffered]);
  const handleButtonClick = (selected: string) => {
    setSelectedButton(selected);
  };

  const getData = async () => {
    let url = `${BASE_URL2}/objects/getObject/${id}`;
    const res = await axios.get(url);
    console.log(res)

    let i = -1;
    const obj: any = {};

    const grop = res.data.message.object.groups.map((grp: any) =>
      grp.map((ele: any) => {
        ++i;
        obj[i] = "";
        if (ele.type === "switch" || ele.type === "checkbox") {
          obj[i] = true;
        }
        if (ele.type === "tone") {
          obj[i] = ele.options[0];
        }
        return {
          ...ele,
          in: i,
        };
      })
    );
    setVal(obj);
    setGroups(grop);

    setrelatedTemplates(res.data.message.similarObject);
    setDescription(res.data.message.object);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    //@ts-ignore
    setIsLoading(true);
    e.preventDefault();
    if (!isSignedIn) {
      navigate({
        pathname: "/login",
        search: `?redirect=${window.location.pathname}`,
      });
      toast.error("Please Signin to continue");
      return;
    }

    let isRequiredFieldMissing = false; // Flag to track missing required fields
    const dupVal: any[] = [];
    console.log("first")
    groups?.forEach((grp: any, index) => {
      dupVal.push([]);
      grp?.forEach((ele: any) => {
        console.log("two")
        if (
          ele.required &&
          !(ele.type === "switch" || ele.type === "checkbox") &&
          !val[ele.in]
        ) {
        console.log("three");

          console.log(ele.placeholder)
          toast.error(`${ele.placeholder} is required`);
          isRequiredFieldMissing = true; // Set flag to true if a required field is missing
        }
        if (ele.type === "switch") {
          dupVal[index].push(val[ele.in] ? ele.options[0] : ele.options[1]);
          return;
        }

        dupVal[index].push(val[ele.in]);
      });
    });

    if (isRequiredFieldMissing) {
      setIsLoading(false);
      return; // Exit the function if a required field is missing
    }

    setTimeout(() => {
      scrollToBasicOutput();
    }, 10);
    try {
      const res = await axios.post(
        `${BASE_URL2}/objects/getResponseOfObject/${id}?clerkId=${userId}`,
        {
          groups: dupVal,
        }
      );

      if (res.status === 200) {
        setIsGenerated(true);
        setIsLoading(false);
        const formatted = extractJSON(res.data.data);
        const json = JSON.parse(formatted.replace("</p>", "</p><br/>"));
        setOutput(json);
        // setGeneratedInput(dupVal);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      // toast.error(error);
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };
  const handleReSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    //@ts-ignore
    setIsLoading(true);
    e.preventDefault();
    if (!isSignedIn) {
      navigate({
        pathname: "/login",
        search: `?redirect=${window.location.pathname}`,
      });
      toast.error("Please Signin to continue");
      return;
    }

    let isRequiredFieldMissing = false; // Flag to track missing required fields
    

    setTimeout(() => {
      scrollToBasicOutput();
    }, 10);
    try {
      const res = await axios.post(
        `${BASE_URL2}/objects/getResponseOfObject/${id}?clerkId=${userId}`,
        {
          groups: generatedInput,
        }
      );

      if (res.status === 200) {
        setIsGenerated(true);
        setIsLoading(false);
        const formatted = extractJSON(res.data.data);
        const json = JSON.parse(formatted.replace("</p>", "</p><br/>"));
        console.log(json);
        setOutput(json);
        // setGeneratedInput(dupVal);
      } else {
        toast.error(res.data.error);
        setIsLoading(false);
      }
    } catch (error: any) {
      // toast.error(error);
      toast.error(error.response.data.error);
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    setOutput(undefined);
    setIsGenerated(false);
  };

  const handleCopy = () => {
    try {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = output?.output as string;

      // Replace newline characters (\n) with <br> elements
      tempElement.querySelectorAll("br")?.forEach((br) => {
        br.insertAdjacentHTML("beforebegin", "\n");
        // @ts-ignore
        br!.parentNode.removeChild(br);
      });

      // Extract the text content from the temporary element
      const textContent = tempElement.innerText;
      navigator.clipboard.writeText(textContent);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    getData();
  }, [id]);

  const scrollToBasicOutput = () => {
    // Check if basicOutputRef exists
    console.log("first", basicOutputRef);
    if (basicOutputRef.current) {
      // @ts-ignore
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "start", // Align the top of the element with the top of the scrollable area within the viewport
      };

      // Calculate the offset by subtracting some pixels from the top of the element
      const offset = 200; // Adjust this value as needed

      // Get the DOM element
      const element = basicOutputRef.current as HTMLElement;

      // Calculate the target scroll position
      const targetScrollPosition =
        element.getBoundingClientRect().top + window.scrollY - offset;

      // Scroll to the target position
      window.scrollTo({
        top: targetScrollPosition,
        behavior: scrollOptions.behavior,
      });
    }
  };
 
  console.log("here",arr)

  return (
    <div className="flex flex-col  gap-8 min-h-screen">
      <Nav />
      <div className="flex flex-col justify-center items-center gap-6">
        <h1 className="  dark:text-white text-black text-center font-outfit text-2xl md:text-3xl lg:text-4xl  font-medium">
          {description?.name}
        </h1>
        <p className="  dark:text-white text-black text-center font-outfit max-w-[844px] text-base px-6 lg:text-lg font-base">
          {description?.description}
        </p>
      </div>
      {id === "65c87f7bfaf3fd266b16ce9f" ? (
        <Paraphrase />
      ) : id === "6601b84f03d49ef5e50f3caf" ? (
          <Script groups={arr} val={val} setVal={setVal} handleSubmit={handleSubmit} output={output} isLoading={isLoading} />
      ) : id === "65c88181faf3fd266b16cedb" ? (
        <ImageGenerator />
      ) : id === "65cb60bae8bbe5d25d13b9ba" ? (
        <Audio />
      ) : id === "65cb886ebd2f462c896d46b3" ? (
        <AudioText />
      ) : id === "661e75f237b7826a2e2dddc1" ? (
        <Special/>
      ) : id === "662f311912268d562ccfebca" ? (
        <Seotool/>
      ) : id === "6631da17b852e5912e9f52bd" ? (
        <ImageTool/>
      ) : id === "663242e2b852e5912e9f52c4" ? (
        <CodeConverter/>
      ) : id === "66347b90b852e5912e9f52c6" ? (
        <MarketingCampaign/>
      ) : id === "6634c2d2b852e5912e9f52c7" ? (
        <QRCodeGenerator/>
      ) : id === "66352513b852e5912e9f52c8" ? (
        <FacebookImageTool/>
      ) : id === "663525dfb852e5912e9f52c9" ? (
        <InstagramImageTool/>
      ) : id === "663526bdb852e5912e9f52ca" ? (
        <LinkedinImageTool/>
      ) : id === "663526fdb852e5912e9f52cb" ? (
        <PinterestImageTool/>
      ) : id === "66352744b852e5912e9f52cc" ? (
        <SnapchatImageTool/>
      ) : id === "66352762b852e5912e9f52cd" ? (
        <TwitterImageTool/>
      ) : id === "6639d129b852e5912e9f52d3" ? (
        <CodeGenerator/>
      ) : id === "663ca713c40cf070532812ba" ? (
        <Rephrase/>
      ) : id === "663e0c62e2b749bd37c881c8" ? (
        <ImagetoText/>
      ) : id === "6641b9a43748e094e4b1e783" ? (
        <JPEGtoPDFConverter/>
      ) : id === "6635277bb852e5912e9f52ce" ? (
        <YoutubeImageTool/>
      ) : id === "6642052d3748e094e4b1e784" ? (
        <PDFMerger/>
      ) : id === "664482cf3748e094e4b1e787" ? (
        <VideoDownloader/>
      ) : id === "66448f523748e094e4b1e788" ? (
        <Mp3Downloader/>
      ) : id === "664497a53748e094e4b1e789" ? (
        <InstagramDownloader/>
      ) : id === "6643400f3748e094e4b1e786" ? (
        <PNGtoPDFConverter/>
      ) : id === "66473fd1e3099a6561101561" ? (
        <AudioConverter/>
      ) : id === "6648900d0ec5e7ade584ec9a" ? (
        <InstagramImageDownloader/>
      ) : id === "664892720ec5e7ade584ec9b" ? (
        <FacebookDownloader/>
      ) : id === "664b19221986743386a460ff" ? (
        <PNGtoJPGConverter/>
      ) : id === "664b1d0e1986743386a46100" ? (
        <JPGtoPNGConverter/>
      ) : id === "664c970a0fbc0067b02d61b2" ? (
        <TikTokDownloader/>
      ) : id === "664d9a8c1f894ec946966742" ? (
        <TextToPdfConverter/>
      ) : id === "664d9bd51f894ec946966743" ? (
        <TwitterDownloader/>
      ) : id === "664f5cf21f894ec946966744" ? (
        <Seopodcast/>
      ) : id === "665079261f894ec946966745" ? (
        <SvgConverter/>
      ) : id === "665079751f894ec946966746" ? (
        <FileToZipConverter/>
      ) : id === "6654739de82896c09bbc52de" ? (
        <Summarize/>
      ) : id === "6654398ae82896c09bbc52dd" ? (
        <GifConverter/>
      ) : id === "66557e344ce4bc50452d5b7c" ? (
        <ZipExtractor/>
      ) : id === "6655d0794ce4bc50452d5b7d" ? (
        <GeneratorImage/>
      ) : id === "66570ccf35fb9ca10468a391" ? (
        <NotesGenerator/>
      ) : id === "66570cdc35fb9ca10468a392" ? (
        <PdfToTextConverter/>
      ) : id === "665864be26e80a56d0fb76c7" ? (
        <ExtractImage/>
      ) : id === "665864c826e80a56d0fb76c8" ? (
        <VideoCompressor/>
      ) : id === "6659c63b0b06a662162fa9fc" ? (
        <GenerateDomainNames/>
      ) : id === "6659c6460b06a662162fa9fd" ? (
        <GenerateBusinessNames/>
      ) : id === "6659c6500b06a662162fa9fe" ? (
        <PdfTranslate/>
      ) : id === "665af9d9850bc0ffc2950614" ? (
        <VideoToTextConverter/>
      ) : id === "665b0446850bc0ffc2950615" ? (
        <GenerateCurrentTopics/>
      ) : id === "665db017689ca1a6e8164e8d" ? (
        <VideoTrimmer/>
      ) : id === "665db021689ca1a6e8164e8e" ? (
        <AudioTrimmer/>
      ) : id === "665f0642fbf077c2285ca85e" ? (
        <PdfPageDeleter/>
      ) : id === "665f064cfbf077c2285ca85f" ? (
        <NDAForm/>
      ) : id === "66603d384dc01b5930c07962" ? (
        <YouTubeScriptGenerator/>
      ) : id === "66603d414dc01b5930c07963" ? (
        <NCAForm/>
      ) : id === "66603d4f4dc01b5930c07964" ? (
        <BusinessSloganGenerator/>
      ) : id === "66619f0cfd944686812f59ea" ? (
        <ContentImprover/>
      ) : id === "66619f18fd944686812f59eb" ? (
        <TriviaGenerator/>
      ) : id === "66619f23fd944686812f59ec" ? (
        <AudioRemover/>
      ) : id === "6662e4a6fd944686812f59ed" ? (
        <PollGenerator/>
      ) : id === "6662e4b8fd944686812f59ee" ? (
        <GeneratePrivacyPolicy/>
      ) : id === "6662e4c8fd944686812f59ef" ? (
        <BusinessPlanGenerator/>
      ) : id === "6628c6bd6213ba01b08276c0" ? (
        <Decision/>
      ):(
        <>
          <div className="flex justify-center px-5 max-w-[1084px] w-full mx-auto items-center flex-col gap-8">
            {groups.map((grp: any, index: number) => (
              <div
                key={index}
                className="w-full flex flex-col md:flex-row  max-w-[844px] justify-center gap-8 items-center"
              >
                {grp.map((ele: any, i: number) => (
                  <Element key={i} element={ele} val={val} setVal={setVal} />
                ))}
              </div>
            ))}
          </div>

          <button
            className="text-white text-center font-outfit md:tepxt-lg font-semibold flex relative text-xs py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bt-gradient disabled:opacity-60 hover:opacity-80 w-fit mx-auto"
            onClick={(e) => void handleSubmit(e)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin w-7 h-7 " />}
            {isGenerated ? "Regenerate" : "Generate"}
          </button>
        </>
      )}

      {(id !== "6601b84f03d49ef5e50f3caf")&&(!!output || isLoading) && (
        <div className="flex flex-col border xl:w-full w-[calc(100%-40px)] mx-5 lg:mx-auto max-w-[1084px] pb-8 rounded-xl relative">
          <div className="w-full border p-5 rounded-t-xl flex flex-row justify-between">
            <h1
              className="text-base md:text-3xl font-semibold"
              ref={basicOutputRef}
            >
              Your Pitch
            </h1>
            <div className="absolute bottom-2 right-4">
              {output && (
                <button onClick={handleCopy}>
                  <ClipboardList className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          {!isLoading ? (
            <p
              className="p-5 text-base md:text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: output?.output as string }}
            />
          ) : (
            <div className="w-full h-full flex items-center text-justify justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
            </div>
          )}
        </div>
      )}

      <h1 className="  dark:text-white text-black text-center font-outfit text-md md:text-lg lg:text-xl  font-medium">
        Related Tools
      </h1>
      <div className="flex mx-auto flex-row justify-center gap-4  md:gap-8 md:w-full max-w-[473px] rounded-full px-3  w-4/5 py-2 border border-gray-500">
        {relatedTemplates?.slice(0, 5).map((icon, index) => (
          <a
            key={index}
            className="p-2  rounded-full shadow-md flex justify-center item-center"
            target="_blank"
            href={`${window.location.origin}/generate?id=${icon._id}`}
            // @ts-ignore
            title={icon.accoName}
          >
            <img
              src={
                icon.logo.replace(
                  "http://localhost:4000",
                  "https://bigwigmedia-backend.onrender.com"
                ) as string
              }
              alt={icon!.name as string}
              title={icon.name as string}
            />
          </a>
        ))}
      </div>

      <div className="flex flex-col gap-6  mt-16 w-fit mx-auto">
        <h1 className="text-3xl text-center px-3 font-semibold">
          Share This Tool 
        </h1>

        <Share url={window.location.href + "&reffered="+userId} />
      </div>

      <div className="flex  flex-col px-5 gap-6 max-w-[1084px] w-full mx-auto">
        <h1 className="text-3xl text-center font-semibold my-6">
          Everything you need to know about {description?.name}
        </h1>
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-2"
        >
          {description?.faq?.map((ac, id) => (
            <AccordionItem value={ac.question} key={id}>
              <AccordionTrigger
                className="dark:text-white dark:border dark:border-white  py-4 z-40 items-center rounded-md shadow-md px-5 font-outfit"
                key={ac.question}
              >
                {ac.question}
              </AccordionTrigger>
              <AccordionContent>{ac.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Footer />
    </div>
  );
};

export default Generate;

interface ElementComponent {
  val: any;
  setVal: Function;
  element: { in: string } & ElementType;
}

export const Element = ({ val, setVal, element }: ElementComponent) => {
  if (element.type === "switch") {
    return (
      <div className=" flex flex-row gap-2">
        <Switch
          id={element.text}
          className="data-[state=checked]:bg-green-500  data-[state=unchecked]:bg-gray-400"
          checked={val[element.in]}
          onCheckedChange={(e) => setVal({ ...val, [element.in]: e })}
        />
        <Label htmlFor={element.text}>{element.placeholder}</Label>
      </div>
    );
  }

  if (element.type === "tone") {
    return (
      <div className="flex flex-wrap flex-col  sm:flex-row self-start gap-4">
        <Label
          className="dark:text-white self-start my-auto text-black text-left font-outfit text-xl font-semibold"
          htmlFor={element.text}
        >
          {element.text}
        </Label>
        <div className="flex flex-wrap sm:flex-row  justify-center md:justify-start md:self-start gap-2">
          {element.options.map((label, index) => (
            <button
              key={index}
              className={`border rounded-full text-sm md:text-base p-2 md:px-7 py-2 ${
                val[element.in] === label ? "border-gradient-1" : ""
              }`}
              onClick={() => setVal({ ...val, [element.in]: label })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (element.type === "select") {
    return (
      <div className="flex w-full flex-wrap md:flex-row flex-col  sm:flex-row self-start gap-4">
        <Label
          className="dark:text-white self-start my-auto text-black text-left font-outfit text-xl font-semibold"
          htmlFor={element.text}
        >
          {element.text}
        </Label>
      <Select onValueChange={(e) => setVal({ ...val, [element.in]: e })}>
        <SelectTrigger
          className=" self-start w-full  md:min-w-[300px] max-w-[844px] "
          value={val[element.in]}
          // @ts-ignore
        >
          <SelectValue placeholder={element.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{element.text}</SelectLabel>
            {element.options.map((option) => (
              <SelectItem value={option}>{option}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
    );
  }
  if (element.type === "textarea") {
    return (
      <div className="flex flex-col   w-full max-w-[844px]  self-start gap-2">
        <Label
          className="dark:text-white self-start text-black text-left font-outfit text-xl font-semibold"
          htmlFor={element.placeholder}
        >
          {element.text}
        </Label>
        <Textarea
          className="mb-4 h-24 w-full   md:min-w-[300px] rounded-md border-2 dark:bg-zinc-800 border-gray-300 p-4"
          placeholder={element.placeholder}
          value={val[element.in]}
          onChange={(e) => setVal({ ...val, [element.in]: e.target.value })}
        />
      </div>
    );
  }
  if (element.type === "paraphrase") {
    return <Paraphrase />;
  }
  return (
    <div className="flex flex-col w-full max-w-[844px] self-start gap-2">
      <Label
        className="dark:text-white self-start text-black text-left font-outfit text-xl font-semibold"
        htmlFor={element.text}
      >
        {element.text}
      </Label>
      <Input
        className="w-full   md:min-w-[300px]"
        placeholder={element.placeholder}
        value={val[element.in]}
        onChange={(e) => setVal({ ...val, [element.in]: e.target.value })}
      />
    </div>
  );
};
