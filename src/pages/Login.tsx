// import { useState } from "react";
import SideImg from "../assets/image 7.png";
import One from "../assets/image 5.png";
import Two from "../assets/image 6.png";
// import logo from "../assets/Logo.png";
// import { Button, Input, Modal, ModalContent } from "@nextui-org/react";
import {
  // SignOutButton,
  // SignInButton,
  SignIn,
  // SignedOut,
} from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";

// type Props = {};

const Login = () => {

  const { userId } = useAuth();
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams)
    const redirect = urlParams.get("redirect") ??"";
    console.log(redirect)
    // let data="https://bigwigmedia.ai/generate?id=6628c6bd6213ba01b08276c0"
    const url = window.location.origin + redirect;
    console.log("redirect", window.location.origin);
  return (
    <div className="flex  gap-2 w-screen h-screen bg-black">
      <img
        src={SideImg}
        alt="sideImg"
        className=" object-cover lg:flex w-screen h-screen drop-shadow-lg"
      />
      <img
        src={One}
        alt="sideImg"
        className="absolute hidden lg:flex left-0 bottom-0  mix-blend-exclusion"
      />
      <img
        src={Two}
        alt="sideImg"
        className="absolute hidden lg:flex right-0 top-0 mix-blend-exclusion"
      />
 
      <div className="absolute bg-white rounded-lg top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 items-center gap-4 cursor-pointer flex">
        <SignIn redirectUrl={redirect} />
        
      </div>
       
    </div>
  );
};

export default Login;
