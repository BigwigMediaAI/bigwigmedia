// AboutUs.tsx

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import React, { useEffect } from "react";

const Disclaimer: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="p-10 text-center min-h-screen">
        <h1 className=" text-3xl font-bold mb-4">Disclaimer</h1>
        <p className="text-xl my-4 lg:mx-[20vh] text-center ">
BigwigMedia.ai is continuously learning and evolving with every conversation. Your feedback matters.Check your facts
Always validate results independently as BigwigMedia.ai  may display inaccurate, harmful or biased information.
Avoid seeking adviceBigwigmedia.ai is not equipped to provide advice on sensitive topics. Please consult a professional for help.
Happy exploring!
        </p>
        <p className="mt-8">If you have any questions or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p>

       
      </div>
      <Footer />
    </div>
  );
};

export default Disclaimer;
