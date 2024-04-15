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
        <p className="text-2xl my-4  lg:mx-[20vh] text-center ">
        Are you tired of doing all the work yourself? Introducing BigWig Media AI Tools -
         your new robotic assistant that's so smart, it can even make a cup of coffee 
         (just kidding, it can't do that... yet)! Get ready to sit back, relax, and let 
         the AI revolutionize your media game. With BigWig Media AI Tools, you'll be saying 
         'null' to stress and 'null' to endless manual tasks. It's time to let the future do 
         the heavy lifting for you. Get your hands (or should I say, circuits?) on BigWig Media 
         AI Tools today!
        </p>
        {/* <p className="text-base text-justify mt-[10vh] lg:mx-[25vh]">
        At the coronary heart of BigWigMedia.Ai lies a dedication to facilitating
         a smooth transition into the arena of AI, empowering agencies to navigate
          the complexities of the digital panorama with confidence. Our team of 
          experts is committed to providing customized support and guidance every
           step of the way, ensuring that your company maximizes the potential of 
           AI to attain its goals. Whether you are seeking to streamline processes, 
           optimize workflows, or gain valuable insights from data, we have the tools
            and expertise to help you succeed.
        </p>
        <p className="text-base text-justify mt-[10vh] lg:mx-[25vh]">
        Partnering with BigWigMedia.Ai means more than just gaining 
        access to cutting-edge technology; it is about embarking on 
        a collaborative journey toward innovation and growth. Together,
         we can turn ambitious visions into practical realities, harnessing
          the power of AI to drive meaningful change and create lasting impact.
           Join us at the leading edge of the AI revolution and discover the
            endless opportunities that await when you choose BigWigMedia.Ai
             as your trusted companion in innovation.
        </p> */}
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
