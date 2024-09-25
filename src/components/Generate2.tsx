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
import { useAuth,useUser } from "@clerk/clerk-react";
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
import { FaDownload, FaShareAlt } from "react-icons/fa";
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
import { VideoScript } from "./paraphrase2";
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
// import { InstagramDownloader } from "./InstagramVideo";
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
import { VideoAudioTrimmer } from "./AddAudio";
import { PdfSummarizer } from "./SummarizePdf";
import { PdfChat } from "./ChatWithPdf";
import { AudioTranslation } from "./AudioTranslator";
import { VideoTranslation } from "./TranslateVideo2Audio";
import { VideoTranslator } from "./VideoTranslator";
import { YouTubeTranslator } from "./YoutubeTranslator";
import { FinanceAdvisor } from "./FinanceAdvisor";
import { ImageCropper } from "./ImageCrop";
import { AIDetector } from "./AiDetector";
import { NewsSummarize } from "./NewsSummary";
import { TextInfographic } from "./TextInfoGraphic";
import { ImageCompressor } from "./ImageCompressor";
import { AvatarTool } from "./Avatar";
import { SWOTGenerator } from "./SwotGenerator";
import { CoverLetterGenerator } from "./CoverLetter";
import LogoGenerator from "./LogoGenerator";
import Model3 from './Model3'
import { GenerateLinkedInPosts } from "./LinkedinPostGenerator";
import { GenerateLinkedInConnection } from "./LinkedinConnection";
import { GenerateLinkedInBio } from "./LinkedinBioGenerator";
import GenerateLinkedInRecommendations from "./LinkedinRecommendatin";
import { YoutubeScriptOutline } from "./YoutubeScriptOutline";
import { YoutubeTitleGenerator } from "./YoutubeTitleGenerator";
import { YoutubeVideoIdeas } from "./YoutubeVideoIdeas";
import { AttentionGrabbingTitleGenerator } from "./TitleGenerator";
import { TiktokCaption } from "./TiktokCaption";
import { AboutmeGenerator } from "./AboutmeGenerator";
import { ReelScriptGenerator } from "./ReelScriptGenerator";
import { ReelIdeasGenerator } from "./ReelIdeas";
import { AboutCompanyGenerator } from "./AboutCompanyGenerator";
import { TweetReplyGenerator } from "./TweetReplyGenerator";
import { SocialMediaPostGenerator } from "./SocialMediaPostGenerator";
import { GenerateTiktokHastag } from "./TiktokHastagGenerator";
import { GenerateCalenderContent } from "./ContentCalenderGenerator";
import { BulletPointGenerator } from "./BulletPointGenerator";
import { EventNameGenerator } from "./EventNameGenerator";
import { ProfessionalBioGenerator } from "./ProfessionalBioGenerator";
import { SeoBriefGenerator } from "./SeoBriefGenerator";
import { CompanyProfileGenerator } from "./CompanyProfileGenerator";
import { EventReminderEmail } from "./EventRemiderEmail";
import { TinerBioGenerator } from "./TinderBioGenerator";
import { InstagramHashtag } from "./InstagramHashtag";
import { FollowupEmail } from "./FollowUpEmail";
import { EmailSubjectLine } from "./EmailSubjectline";
import { ResumeSkills } from "./ResumeSkills";
import { PerformanceReview } from "./PerformanceReviewGenerator";
import { OfferLetter } from "./JobOfferLetter";
import { ElevatorPitch } from "./ElevatorPitchGenerator";
import { ResignationLetter } from "./ResignationLetter";
import { ReviewResponse } from "./ReviewResponse";
import { JobDescription } from "./JobDescription";
import WatermarkEditor from "./editor";
import { CTAGenerator } from "./CallToActionGenerator";
import { GMBPost } from "./GMBPostGenerator";
import { GMBProductDescription } from "./GMBProductDescription";
import { MeetingInvite } from "./MeetingInvite";
import { ProductDescription } from "./ProductDescription";
import { ProjectReport } from "./ProjectReportGenerator";
import { RefrenceLetter } from "./RefrenceLetterGenerator";
import { ExperienceLetter } from "./ExperienceLetterGenerator";
import { ProductName } from "./ProductNameGenerator";
import { SOPGenerator } from "./SOPGenerator";
import { BusinessProposal } from "./BusinessProposal";
import { CatchtTagline } from "./CatchyTagline";
import { MottoGenerator } from "./MottoGenerator";
import { ProductBrochure } from "./ProductBrochure";
import { BusinessMemo } from "./BusinessMemoGenerator";
import { PasFramework } from "./PASFramework";
import { AidaFramework } from "./AIDAGenerator";
import { ColdEmail } from "./ColdEmail";
import { MetaDescription } from "./MetaDescription";
import { NewsLetterNameGenerator } from "./NewsLetterName";
import { JobResponsibility } from "./JobResponsibilityGenerator";
import { JobQualification } from "./JobQualification";
import { JobSummary } from "./JobSummary";
import { OkrGenerator } from "./OkrGenerator";
import { ProjectTimeline } from "./ProjectTimeline";
import { UniqueValue } from "./UniqueValueProposition";
import { SubHeading } from "./SubHeadingGenerator";
import { BackgroundRemover } from "./BgRemover";
import { validateInput } from "@/utils/validateInput";
import { StatisticsGenerator } from "./StatisticsGenerator";
import { PRideaGenerator } from "./PRIdeasGenerator";
import { AudioTranscriber } from "./AudioHighlightsGenerator";
import { PdfToAudioConverter } from "./PdfToAudio";
import { PdfSignTool } from "./PdfSign";
import DocsToAudioConverter from "./DocxtoAudio";
import { DocxToTextExtractor } from "./DocxTextExtractor";
import { ImagePromptGenerator } from "./ImagePromptGenerator";
import { InstagramImgVidDownloader } from "./InstagramImageVideoDownloader";
import { GenerateInstagramCaption } from "./InstagramPostCaptionGenerator";
import { GenerateInstagramBio } from "./InstagramBioGenerator";
import { GenerateInstagramStoryPost } from "./InstagramStoryPostGenerator";
import { GenerateInstagramReelPost } from "./InstagramReelPostGenerator";
import { GenerateInstagramThreadsPost } from "./InstagramThreadsPost";
import { GenerateFacebookPost } from "./FacebookPostGenerator";
import { EventInvitation } from "./InvitationEmail";
import { GenerateFbAdHeadline } from "./FacebookAdHeadlineGenerator";
import { GenerateFacebookBio } from "./FacebookBioGenerator";
import { GenerateFacebookGroupPost } from "./FacebookGroupPost";
import { GenerateFacebookGroupDescription } from "./FacebookGroupDescription";
import { GenerateFacebookPageDescription } from "./FacebookPageDescription";
import { GenerateYoutubePostTitle } from "./YoutubePostTitle";
import { GenerateYoutubePostDescription } from "./YoutubePostDescription";
import { GenerateTwitterBio } from "./TwitterBioGenerator";
import { GenerateTwitterPost } from "./TwitterPostGenerator";
import { GenerateTwitterThreadPost } from "./TwitterThreadsPost";
import { GenerateTwitterThreadBio } from "./TwitterThreadBioGenerator";
import { GenerateLinkedinPageHeadline } from "./LinkedinPageHeadlineGenerator";
import { GenerateLinkedinCompanyPageHeadline } from "./LinkedinCompanyPageHeadline";
import { GenerateLinkedinPageSummary } from "./LinkedinPageSummaryGenerator";
import { GenerateLinkedinCompanySummary } from "./LinkedinCompanySummary";
import { GeneratePostHashtag } from "./PostHashtagGenerator";
import { GenerateBlogPost } from "./BlogPostGenerator";
import { GenerateArticle } from "./ArticleGenerator";
import { GeneratePressRelease } from "./PressRelease";
import { GenerateNewsLetter } from "./NewsLetterGenerator";
import { GenerateGoogleAdHeadline } from "./GoogleAdHeadline";
import { GenerateMarketingPlan } from "./MarketingPlanGenerator";
import { GenerateGoogleAdDescription } from "./GoogleAdDescription";
import { GenerateMarketingFunnel } from "./MarketingFunnel";
import { GenerateProductDescription } from "./CreateProductDescription";
import { GenerateArticleIdea } from "./ArticleIdeaGenerator";
import { GenerateArticleOutline } from "./ArticleOutlineGenerator";
import { GenerateArticleIntro } from "./ArticleIntroGenerator";
import { GenerateBlogIdeas } from "./BlogIdeasGenerator";
import { GenerateBlogTitle } from "./BlogTitleGenerator";
import { GenerateBlogOutline } from "./BlogOutlineGenerator";
import { GenerateBlogIntro } from "./BlogIntroGenerator";
import { GenerateSeoAndDescription } from "./SeoTitle&DescriptionGenerator";
import { GeneratePrompt } from "./PromptGenerator";
import { GenerateReviewReply } from "./ReviewReplyGenerator";
import { SpotifyMp3Downloader } from "./SpotifyDownloader";
import { ImageSelectPromptGenerator } from "./ImageWithPrompt";
import { PodcastSummary } from "./PodcastSummaryGenerator";
import { VideoPromptGenerator } from "./videoPromptGenerator";
import { GenerateLetterhead } from "./LetterHeadGenerator";
import { GenerateVisitingCard } from "./VisitingCard";
import { GenerateFreestyleEmailUtil } from "./FreeStyleEmail";
import { GenerateEmailReplie } from "./EmailReplie";


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
  const [showModel3, setShowModal3] = useState(false);
  const [credits, setCredits] = useState(Number)
  
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

  const getCredits = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL2}/plans/current?clerkId=${userId}`
      );
      if (res.status === 200) {
        setCredits(res.data.data.currentLimit);
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };
  getCredits();

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
        const value = val[ele.in];
      if (typeof value === "string" && !validateInput(value)) {
        toast.error(`Input contains prohibited words. Please remove them and try again.`);
        setIsLoading(false);
        return; // Exit the function if input validation fails
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
      if(credits<=0){

        setTimeout(() => {
          setShowModal3(true);
        }, 0);
      }
      // console.log(error.response.data.error)
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


  // Add an event listener for the 'copy' event to handle manual copying
useEffect(() => {
  const handleManualCopy = (event: ClipboardEvent) => {
    event.preventDefault();
    const tempElement = document.createElement("div");
    tempElement.innerHTML = output?.output as string;

    // Replace newline characters (\n) with <br> elements
    tempElement.querySelectorAll("br")?.forEach((br) => {
      br.insertAdjacentHTML("beforebegin", "\n");
      // @ts-ignore
      br.parentNode.removeChild(br);
    });

    // Extract the text content from the temporary element
    const textContent = tempElement.innerText;

    if (event.clipboardData) {
      event.clipboardData.setData("text/plain", textContent);
    }
  };

  document.addEventListener("copy", handleManualCopy);

  // Cleanup event listener on component unmount
  return () => {
    document.removeEventListener("copy", handleManualCopy);
  };
}, [output]);
  const handleRegenerate = () => {
    setOutput(undefined);
    setIsGenerated(false);
  };
  const removeHtmlTags = (html:any) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const handleDownload = () => {
    const textContent = removeHtmlTags(output?.output || ''); // Assuming output.output contains your HTML content
  
    const element = document.createElement("a");
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "generated_text.txt";
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element);
  };
  
  const handleShare = () => {
    const textContent = removeHtmlTags(output?.output || ''); // Assuming output.output contains your HTML content
  
    // Check if the navigator.share API is available in the browser
    if (navigator.share) {
      navigator.share({
        title: 'Shared Text', // Title of the shared content (optional)
        text: textContent,    // Text content to be shared
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback option if navigator.share is not supported (e.g., show an alert with instructions)
      alert('Sharing is not supported in your browser. Please copy the text manually and share it.');
    }
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

  const handleCopyEvent = (e: ClipboardEvent) => {
    const selectedText = window.getSelection()?.toString() || '';
    if (selectedText) {
        e.clipboardData?.setData('text/plain', selectedText);
        e.preventDefault();
    }
};

document.addEventListener('copy', handleCopyEvent);

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
    <div className="flex flex-col  gap-8 min-h-screen bg-[var(--background-color)]">
      <Nav />
      <div className="flex flex-col justify-center items-center gap-6 ">
        <h1 className="   text-[var(--primary-text-color)] text-center font-outfit text-2xl md:text-3xl lg:text-4xl  font-medium">
          {description?.name}
        </h1>
        <p className="  text-[var(--primary-text-color)] text-center font-outfit max-w-[844px] text-base px-6 lg:text-lg font-base">
          {description?.description}
        </p>
      </div>
      {id === "65c87f7bfaf3fd266b16ce9f" ? (
        <Paraphrase />
      ) : id === "6601b84f03d49ef5e50f3caf" ? (
          <VideoScript/>
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
      ) : id === "66448f523748e094e4b1e788" ? (
        <Mp3Downloader/>
      ) : id === "664497a53748e094e4b1e789" ? (
        <InstagramImgVidDownloader/>
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
      ) : id === "66643b05acd3ab5713d7756d" ? (
        <VideoAudioTrimmer/>
      ) : id === "6666df6f884806754c30c811" ? (
        <PdfSummarizer/>
      ) : id === "6666df85884806754c30c812" ? (
        <PdfChat/>
      ) : id === "666824b841b7e2731cd6da69" ? (
        <AudioTranslation/>
      ) : id === "666824c741b7e2731cd6da6a" ? (
        <VideoTranslation/>
      ) : id === "6669926f04450b0cc689fefa" ? (
        <VideoTranslator/>
      ) : id === "666c1f9d2ee240337cc199a2" ? (
        <FinanceAdvisor/>
      ) : id === "666c220d2ee240337cc199a3" ? (
        <ImageCropper/>
      ) : id === "666da5118e6978dd891a37df" ? (
        <AIDetector/>
      ) : id === "666da51c8e6978dd891a37e0" ? (
        <NewsSummarize/>
      ) : id === "666da52a8e6978dd891a37e1" ? (
        <TextInfographic/>
      ) : id === "66707c18595b6463098d789a" ? (
        <ImageCompressor/>
      ) : id === "66707c23595b6463098d789b" ? (
        <AvatarTool/>
      ) : id === "667178d85ae1c15aa15057c6" ? (
        <SWOTGenerator/>
      ) : id === "667178e95ae1c15aa15057c7" ? (
        <CoverLetterGenerator/>
      ) : id === "6673ccb99a855dfab85e0de8" ? (
        <LogoGenerator/>
      ) : id === "6628c6bd6213ba01b08276c0" ? (
        <Decision/>
      ) : id === "6697c11e17d5e2950f5ef979" ? (
        <GenerateLinkedInPosts/>
      ) : id === "6697c14517d5e2950f5ef97c" ? (
        <GenerateLinkedInConnection/>
      ) : id === "6697c12d17d5e2950f5ef97a" ? (
        <GenerateLinkedInBio/>
      ) : id === "6697c13a17d5e2950f5ef97b" ? (
        <GenerateLinkedInRecommendations/>
      ) : id === "6697c14e17d5e2950f5ef97d" ? (
        <VideoDownloader/>
      ): id === "6698fe070e14d980a108a66c" ? (
        <YoutubeScriptOutline/>
      ):id === "6698fe140e14d980a108a66d" ? (
        <YoutubeTitleGenerator/>
      ):id === "6698fe1e0e14d980a108a66e" ? (
        <YoutubeVideoIdeas/>
      ):id === "6698fe280e14d980a108a66f" ? (
        <AttentionGrabbingTitleGenerator/>
      ):id === "6698fe310e14d980a108a670" ? (
        <TiktokCaption/>
      ):id === "6698fe390e14d980a108a671" ? (
        <AboutmeGenerator/>
      ):id === "669a616a719c629535e83a86" ? (
        <ReelScriptGenerator/>
      ):id === "669a6178719c629535e83a87" ? (
        <ReelIdeasGenerator/>
      ):id === "669a6181719c629535e83a88" ? (
        <AboutCompanyGenerator/>
      ):id === "669a618b719c629535e83a89" ? (
        <TweetReplyGenerator/>
      ):id === "669a618b719c629535e83a89" ? (
        <TweetReplyGenerator/>
      ):id === "669a77a7fd2127d8423de85c" ? (
        <GenerateTiktokHastag/>
      ):id === "669a7794fd2127d8423de85b" ? (
        <GenerateCalenderContent/>
      ):id === "669baac1b372a9153918cd88" ? (
        <BulletPointGenerator/>
      ):id === "669baacbb372a9153918cd89" ? (
        <EventNameGenerator/>
      ):id === "669baad4b372a9153918cd8a" ? (
        <ProfessionalBioGenerator/>
      ):id === "669baaddb372a9153918cd8b" ? (
        <SeoBriefGenerator/>
      ):id === "669baae5b372a9153918cd8c" ? (
        <CompanyProfileGenerator/>
      ):id === "669baaedb372a9153918cd8d" ? (
        <EventInvitation/>
      ):id === "669baaf5b372a9153918cd8e" ? (
        <EventReminderEmail/>
      ):id === "669baafeb372a9153918cd8f" ? (
        <TinerBioGenerator/>
      ):id === "669cb83357cc40569bc24817" ? (
        <InstagramHashtag/>
      ):id === "669cb83e57cc40569bc24818" ? (
        <FollowupEmail/>
      ):id === "669e51bb18819926d2cbef5a" ? (
        <EmailSubjectLine/>
      ):id === "669e51c618819926d2cbef5b" ? (
        <ResumeSkills/>
      ):id === "669e51d118819926d2cbef5c" ? (
        <PerformanceReview/>
      ):id === "669e51da18819926d2cbef5d" ? (
        <OfferLetter/>
      ):id === "669e51e618819926d2cbef5e" ? (
        <ElevatorPitch/>
      ):id === "669e51f018819926d2cbef5f" ? (
        <ResignationLetter/>
      ):id === "669e51fe18819926d2cbef60" ? (
        <ReviewResponse/>
      ):id === "669e55fa18819926d2cbef61" ? (
        <JobDescription/>
      ):id === "669f95581fa385cf9e9973a8" ? (
        <WatermarkEditor/>
      ):id === "669f95621fa385cf9e9973a9" ? (
        <CTAGenerator/>
      ):id === "669f956b1fa385cf9e9973aa" ? (
        <GMBPost/>
      ):id === "669f95741fa385cf9e9973ab" ? (
        <GMBProductDescription/>
      ):id === "669f957c1fa385cf9e9973ac" ? (
        <MeetingInvite/>
      ):id === "669f95831fa385cf9e9973ad" ? (
        <ProductDescription/>
      ):id === "669f958d1fa385cf9e9973ae" ? (
        <ProjectReport/>
      ):id === "66a0f3b75b35dd60efa2fa7c" ? (
        <RefrenceLetter/>
      ):id === "66a0f3c35b35dd60efa2fa7d" ? (
        <ExperienceLetter/>
      ):id === "66a0f3eb5b35dd60efa2fa81" ? (
        <ProductName/>
      ):id === "66a0f3e15b35dd60efa2fa80" ? (
        <SOPGenerator/>
      ):id === "66a0f3d75b35dd60efa2fa7f" ? (
        <BusinessProposal/>
      ):id === "66a0f3cd5b35dd60efa2fa7e" ? (
        <CatchtTagline/>
      ):id === "66a25166ed834074a59bb932" ? (
        <MottoGenerator/>
      ):id === "66a2516fed834074a59bb933" ? (
        <ProductBrochure/>
      ):id === "66a25179ed834074a59bb934" ? (
        <BusinessMemo/>
      ):id === "66a25183ed834074a59bb935" ? (
        <PasFramework/>
      ):id === "66a2518ced834074a59bb936" ? (
        <AidaFramework/>
      ):id === "66a25196ed834074a59bb937" ? (
        <ColdEmail/>
      ):id === "66a251a0ed834074a59bb938" ? (
        <MetaDescription/>
      ):id === "66a251aaed834074a59bb939" ? (
        <NewsLetterNameGenerator/>
      ):id === "66a7208c5f1d43b937d6d8d0" ? (
        <JobResponsibility/>
      ):id === "66a7209a5f1d43b937d6d8d1" ? (
        <JobQualification/>
      ):id === "66a720a35f1d43b937d6d8d2" ? (
        <JobSummary/>
      ):id === "66a720ac5f1d43b937d6d8d3" ? (
        <OkrGenerator/>
      ):id === "66a720b65f1d43b937d6d8d4" ? (
        <ProjectTimeline/>
      ):id === "66a720c75f1d43b937d6d8d5" ? (
        <UniqueValue/>
      ):id === "66a720d15f1d43b937d6d8d6" ? (
        <SubHeading/>
      ):id === "669a6197719c629535e83a8a" ? (
        <SocialMediaPostGenerator/>
      ):id === "66a76db0d6ca77c31063b25d" ? (
        <BackgroundRemover/>
      ):id === "66aa34c2ec9fc26d5f2213a4" ? (
        <StatisticsGenerator/>
      ):id === "66aa34cbec9fc26d5f2213a5" ? (
        <PRideaGenerator/>
      ):id === "66c87e58450a336facd4da1d" ? (
        <PdfToAudioConverter/>
      ):id === "66c87e62450a336facd4da1e" ? (
        <PdfSignTool/>
      ):id === "66c9a3c584b80bcd28f62669" ? (
        <DocsToAudioConverter/>
      ):id === "66cf0c545f77a21fa1ac2396" ? (
        <DocxToTextExtractor/>
      ):id === "66cf0c5e5f77a21fa1ac2397" ? (
        <ImagePromptGenerator/>
      ):id === "65cb1c6c4378133a722cbb2f" ? (
        <GenerateInstagramCaption/>
      ):id === "65c7b79166f83315da0d622a" ? (
        <GenerateInstagramBio/>
      ):id === "65c85fb7ca51dfa84930e502" ? (
        <GenerateInstagramStoryPost/>
      ):id === "65c86045ca51dfa84930e695" ? (
        <GenerateInstagramReelPost/>
      ):id === "65cb1c1c4378133a722cb750" ? (
        <GenerateInstagramThreadsPost/>
      ):id === "65c85edaca51dfa84930e1f0" ? (
        <GenerateFacebookPost/>
      ):id === "65c927ca8f7cafdd6d4f15b9" ? (
        <GenerateFbAdHeadline/>
      ):id === "65c7b0b866f83315da0d5dc0" ? (
        <GenerateFacebookBio/>
      ):id === "65c85f28ca51dfa84930e376" ? (
        <GenerateFacebookGroupPost/>
      ):id === "65cb1cbf4378133a722cbb35" ? (
        <GenerateFacebookGroupDescription/>
      ):id === "65c7b74966f83315da0d6207" ? (
        <GenerateFacebookPageDescription/>
      ):id === "65c7b65c66f83315da0d60ed" ? (
        <GenerateYoutubePostTitle/>
      ):id === "65c7b69566f83315da0d61fd" ? (
        <GenerateYoutubePostDescription/>
      ):id === "65c74eac295cbf4469c85bc3" ? (
        <GenerateTwitterBio/>
      ):id === "65c7b8b566f83315da0d64a4" ? (
        <GenerateTwitterPost/>
      ):id === "65c7b9c866f83315da0d6618" ? (
        <GenerateTwitterThreadPost/>
      ):id === "65c7b43366f83315da0d5fcd" ? (
        <GenerateTwitterThreadBio/>
      ):id === "65c7b17566f83315da0d5e55" ? (
        <GenerateLinkedinPageHeadline/>
      ):id === "65c7b32466f83315da0d5faf" ? (
        <GenerateLinkedinCompanyPageHeadline/>
      ):id === "65c7b45166f83315da0d60a0" ? (
        <GenerateLinkedinPageSummary/>
      ):id === "65c7b5db66f83315da0d60ce" ? (
        <GenerateLinkedinCompanySummary/>
      ):id === "65cb1ab54378133a722cb37c" ? (
        <GeneratePostHashtag/>
      ):id === "65c8ce784c88ac77e6565e58" ? (
        <GenerateBlogPost/>
      ):id === "65c92d368f7cafdd6d4f3d16" ? (
        <GenerateArticle/>
      ):id === "65c92c058f7cafdd6d4f37b4" ? (
        <GeneratePressRelease/>
      ):id === "65c92aa78f7cafdd6d4f2cda" ? (
        <GenerateNewsLetter/>
      ):id === "65c929288f7cafdd6d4f259a" ? (
        <GenerateGoogleAdHeadline/>
      ):id === "65c929ac8f7cafdd6d4f291e" ? (
        <GenerateGoogleAdDescription/>
      ):id === "6609a1476231c9382088ec28" ? (
        <GenerateMarketingPlan/>
      ):id === "6609a27c6231c9382088ec2e" ? (
        <GenerateMarketingFunnel/>
      ):id === "66099fb26231c9382088ea19" ? (
        <GenerateProductDescription/>
      ):id === "65c92d818f7cafdd6d4f3d1a" ? (
        <GenerateArticleIdea/>
      ):id === "65c92e8c8f7cafdd6d4f4282" ? (
        <GenerateArticleOutline/>
      ):id === "65c92ef98f7cafdd6d4f4287" ? (
        <GenerateArticleIntro/>
      ):id === "65c8cc6e4c88ac77e6565e39" ? (
        <GenerateBlogIdeas/>
      ):id === "65c8cd394c88ac77e6565e4f" ? (
        <GenerateBlogTitle/>
      ):id === "65c8ce724c88ac77e6565e53" ? (
        <GenerateBlogOutline/>
      ):id === "66aa34d5ec9fc26d5f2213a6" ? (
        <AudioTranscriber/>
      ):id === "65c8cf254c88ac77e6565e5f" ? (
        <GenerateBlogIntro/>
      ):id === "65c96f73c50c97e2d03a5c27" ? (
        <GenerateSeoAndDescription/>
      ):id === "65cb1a474378133a722cafa9" ? (
        <GeneratePrompt/>
      ):id === "65cb19884378133a722ca9e5" ? (
        <GenerateReviewReply/>
      ):id === "66e4027a54be9a68399be40a" ? (
        <SpotifyMp3Downloader/>
      ):id === "66ea8e2238ee5d49df349ce4" ? (
        <ImageSelectPromptGenerator/>
      ):id === "66ec07b3aa6a73f2cfe65357" ? (
        <PodcastSummary/>
      ):id === "66ec0fde3510fbf0108ee8de" ? (
        <VideoPromptGenerator/>
      ):id === "66f1425e0ab136750d271d36" ? (
        <GenerateLetterhead/>
      ):id === "66f1426d0ab136750d271d37" ? (
        <GenerateVisitingCard/>
      ):id === "65c8c9164c88ac77e6565cb1" ? (
        <GenerateFreestyleEmailUtil/>
      ):id === "6609a5666231c9382088ec5c" ? (
        <GenerateEmailReplie/>
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
            <div className=" flex justify-start">
          <p className=" text-base text-[var(--gray-color)] mt-2">
        👉 Try a few combinations to generate the best result for your needs.
        </p>
          </div>
          </div>
          
          <div className="mt-5 flex justify-center">
          <button
            className="text-[var(--white-color)] text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full  bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-fit"
            onClick={(e) => void handleSubmit(e)}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin w-7 h-7 " />}
            {isGenerated ? "Regenerate" : "Generate"}
          </button>
          </div>
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
            <div className="flex gap-3 absolute bottom-2 right-4">
              {output && (
                <>
                  <button onClick={handleCopy} title="Copy">
                    <ClipboardList className="w-5 h-5 text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]" />
                  </button>
                  <button onClick={handleDownload} title="Download">
                    <FaDownload className="w-5 h-5 text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]" />
                  </button>
                  <button onClick={handleShare} title="Share">
                    <FaShareAlt className="w-5 h-5 text-[var(--primary-text-color)]  hover:text-[var(--teal-color)]" />
                  </button>
                </>
              )}
            </div>

          </div>
          {!isLoading ? (
            <p
              className="p-5 text-base md:text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: output?.output as string }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center text-justify justify-center">
              <Loader2 className="animate-spin w-20 h-20 mt-20" />
              <p className="text-[var(--dark-gray-color)] text-justify">Data processing in progress. Please bear with us...</p>
            </div>
          )}
        </div>
      )}

      <h1 className="  text-[var(--primary-text-color)] text-center font-outfit text-md md:text-lg lg:text-xl  font-medium">
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
        <h1 className="text-xl md:text-3xl text-center font-semibold my-6">
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
                className="   py-4 z-40 items-center rounded-md shadow-md px-5 font-outfit"
                key={ac.question}
              >
                {ac.question}
              </AccordionTrigger>
              <AccordionContent>{ac.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {showModel3 && (
        <Model3
          isOpen={true}
          onClose={() => setShowModal3(false)}
        />
      )}
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
          className="data-[state=checked]:bg-[var(--emoji)]  data-[state=unchecked]:bg-gray-400"
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
          className=" self-start my-auto text-[var(--primary-text-color)] text-left font-outfit text-xl font-semibold"
          htmlFor={element.text}
        >
          {element.text}
        </Label>
        <div className="flex flex-wrap sm:flex-row  justify-center md:justify-start md:self-start gap-2">
          {element.options.map((label, index) => (
            <button
              key={index}
              className={`border rounded-full text-sm md:text-base p-2 md:px-7 py-2 ${
                val[element.in] === label ? " border-2 border-[var(--teal-color)]" : ""
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
          className=" self-start my-auto text-black text-left font-outfit text-xl font-semibold"
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
          className=" self-start text-black text-left font-outfit text-xl font-semibold"
          htmlFor={element.placeholder}
        >
          {element.text}
        </Label>
        <Textarea
          className="mb-4 h-24 w-full   md:min-w-[300px] rounded-md border-2 border-gray-300 p-4"
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
        className=" self-start text-black text-left font-outfit text-xl font-semibold"
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
