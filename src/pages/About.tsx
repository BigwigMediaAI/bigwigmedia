// AboutUs.tsx

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import React, { useEffect } from "react";

const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav />
      <div className="p-10 text-center min-h-screen">
        <h1 className=" text-3xl font-bold mb-4">About Us</h1>
        <p className="text-xl my-4 lg:mx-[20vh] text-center ">
          Embark on a transformative journey with BigWigMedia.Ai, where
          innovation meets excellence inside the realm of artificial
          intelligence answers. As your foremost vacation spot for modern
          technology, we offer a comprehensive suite of cutting-edge sources
          meticulously curated to revolutionize operational effectiveness and
          pressure unheard of productiveness across numerous sectors. Our
          commitment to excellence is clear in each component of our offerings,
          ensuring that your experience with AI integration is not best seamless
          but additionally transformative.
        </p>
        <p className="text-xl text-justify mt-[10vh] lg:mx-[20vh]">
          At the coronary heart of BigWigMedia.Ai lies a dedication to
          facilitating a smooth transition into the arena of AI, empowering
          agencies to navigate the complexities of the digital panorama with
          self assurance. Our group of experts is dedicated to imparting
          customized support and guidance each step of the way, ensuring that
          your company maximizes the capacity of AI to attain its dreams.
          Whether you are seeking to streamline approaches, optimize workflows,
          or benefit precious insights from statistics, we have the equipment
          and expertise to help you be triumphant.
        </p>
        <p className="text-xl text-justify mt-[10vh] lg:mx-[20vh]">
          Partnering with BigWigMedia.Ai approach extra than simply gaining
          access to cutting-edge technology; it is about embarking on a
          collaborative journey closer to innovation and growth. Together, we
          are able to flip formidable visions into realistic realities,
          harnessing the energy of AI to pressure significant exchange and
          create lasting effect. Join us at the leading edge of the AI
          revolution and find out the endless opportunities that watch for when
          you choose BigWigMedia.Ai as your relied on companion in innovation.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
