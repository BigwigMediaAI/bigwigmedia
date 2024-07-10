// AboutUs.tsx

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import React, { useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Disclaimer: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="max-w-6xl mx-auto px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-white text-2xl cursor-pointer hover:text-blue-700"
          onClick={handleBackClick}
        />
      </div>
      <div className="p-10 text-center min-h-screen">
        <h1 className=" text-3xl font-bold mb-4">Disclaimer</h1>
        <p className="text-base my-4 text-justify lg:mx-[25vh] ">
BigwigMedia.ai is continuously learning and evolving with every conversation. Your feedback matters. Check your facts and 
always validate results independently, as BigwigMedia.ai  may display inaccurate, harmful, or biased information.
Avoid seeking advice as Bigwigmedia.ai is not equipped to provide advice on sensitive topics. Please consult a professional for help.
Happy exploring!
        </p>
        <p className="mt-8">If you have any questions, feedback or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p>

       
      </div>
      <Footer />
    </div>
  );
};

export default Disclaimer;
