import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
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
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogPostDetail from "./pages/BlogPostDetails";
import initializeGA from "../src/analytics"
import ReactGA from 'react-ga4';
import ToolData from "./pages/ToolData";
import { VideoToArticle } from "./components/VideoToArticle";

const App = () => {
 
  const location = useLocation();

  useEffect(() => {
  initializeGA();
  }, []);

  useEffect(() => {
  ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);
  
  return (
    <div className=" min-w-screen min-h-screen bg-white">
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
        <Route path="/blog/:slug" element={<BlogPostDetail />} />
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
        <Route path="/tool" element={<ToolData />} />
        <Route path="/vid2article" element={<VideoToArticle />} />
</Routes>
    </div>
  );
};

export default App;
