import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

import Generate from "./components/Generate";
import Generate2 from "./components/Generate2";
import Form from "./pages/Form";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Failed from "./pages/Failed";
import Plan from "./pages/Plan";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Success from "./pages/Success";
import Terms from "./pages/Terms";
import Transaction from "./pages/Transaction";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Legal from "./pages/Legal";
import Cancellation from "./pages/Cancellation";
import Getdata from "../src/pages/Getdata"
import Feedback from "./pages/Feedback";
import Getfeedback from "./pages/Getfeedback";
import {Decision} from "./components/DecisionTool";
import { Seotool } from "./components/SEOtool";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { clarity } from "react-microsoft-clarity";
import { ImageTool } from "./components/Imageresizer";
import { CodeConverter } from "./components/Codeconverter";
import { MarketingCampaign } from "./components/Marketingcampaing";
import { QRCodeGenerator } from "./components/QRcode";
import { FacebookImageTool } from "./components/FacebookImageResizer";
import {InstagramImageTool} from "./components/InstagramImageResizer";
import {TwitterImageTool} from "./components/TwitterImageResizer";
import {PinterestImageTool} from "./components/PinterestImageResizer";
import {LinkedinImageTool} from "./components/LinkedInImageResizer";
import {SnapchatImageTool} from "./components/SnapchatImageResizer";
import {YoutubeImageTool} from "./components/YoutubeImageResizer";
import { CodeGenerator } from "./components/CodeGenerator";
import { LetterheadGenerator } from "./components/LetterHead";
import { Rephrase } from "./components/ParaRepharse";
import { ImagetoText } from "./components/ImgtoText";
import { JPEGtoPDFConverter } from "./components/ImagetoPdf";
import { PDFMerger } from "./components/PdfMerge";
import { VideoDownloader } from "./components/Youtube";
import { Mp3Downloader } from "./components/YoutubeMp3";
const App = () => {
 
  // const location = useLocation();
  // useEffect(() => {
  //   ReactGA.send({ hitType: "pageview", page: location.pathname + location.search , title: "Home Page"});
  // }, []);
  
  return (
    <div className=" min-w-screen min-h-screen bg-white dark:bg-[#1E1E1E]">
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/2" element={<Landing />} /> */}
        <Route path="/login" element={<Login />} />

        <Route path="/profile" element={<Profile />} />

        {/* <Route path="/generate" element={<Generate />} /> */}
        <Route path="/generate" element={<Generate2 />} />
        <Route path="/form" element={<Form />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cancel" element={<Failed />} />
        <Route path="/success" element={<Success />} />
        <Route path="/about" element={<About />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/Disclaimer" element={<Disclaimer />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/Cancellation-policy" element={<Cancellation />} />
        <Route path="/getdata" element={<Getdata />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/review" element={<Getfeedback />} />
        <Route path="/decision" element={<Decision />} />
        <Route path="/seo" element={<Seotool />} />
        <Route path="/resize" element={<ImageTool />} />
        <Route path="/code" element={<CodeConverter />} />
        <Route path="/marketing" element={<MarketingCampaign />} />
        <Route path="/qrcode" element={<QRCodeGenerator />} />
        <Route path="/fbImage" element={<FacebookImageTool />} />
        <Route path="/instagramImage" element={<InstagramImageTool />} />
        <Route path="/twitterImage" element={<TwitterImageTool />} />
        <Route path="/pinterestImage" element={<PinterestImageTool />} />
        <Route path="/linkedinImage" element={<LinkedinImageTool />} />
        <Route path="/snapchatImage" element={<SnapchatImageTool />} />
        <Route path="/youtubeImage" element={<YoutubeImageTool />} />
        <Route path="/component" element={<CodeGenerator />} />
        <Route path="/letter" element={<LetterheadGenerator />} />
        <Route path="/rephrase" element={<Rephrase />} />
        <Route path="/imgtotext" element={<ImagetoText />} />
        <Route path="/imgtopdf" element={<JPEGtoPDFConverter />} />
        {/* <Route path="/youtube" element={<VideoDownloader />} /> */}
        <Route path="/youtubemp3" element={<Mp3Downloader />} />
      </Routes>
    </div>
  );
};

export default App;
