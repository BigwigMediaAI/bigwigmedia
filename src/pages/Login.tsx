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
  const redirect = urlParams.get("redirect") ?? "";
  const url = window.location.origin + redirect;

  return (
    <div className="flex gap-2 w-screen h-screen bg-black">
      {/* Background Images */}
      <img
        src={SideImg}
        alt="sideImg"
        className="hidden lg:block object-cover w-1/2 h-full drop-shadow-lg"
      />
      <img
        src={One}
        alt="sideImg"
        className="hidden lg:block absolute left-0 bottom-0 mix-blend-exclusion"
      />
      <img
        src={Two}
        alt="sideImg"
        className="hidden lg:block absolute right-0 top-0 mix-blend-exclusion"
      />

      {/* Right Side (Texts for Small Screens) */}
      <div className="lg:hidden flex flex-col items-center justify-center w-full h-screen">
        {/* Signing Component */}
        <div className="rounded-lg p-4 mb-4">
          <SignIn redirectUrl={redirect} />
        </div>

        {/* Texts (Aligned in a row) */}
        <div className="flex justify-center w-full">
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-lg p-4">
              <p className="text-white font-bold ">✅ Sign UP for Free</p>
            </div>
            <div className="rounded-lg p-4">
              <p className="text-white font-bold">✅ 7 days Free Trial</p>
            </div>
            <div className="rounded-lg p-4">
              <p className="text-white font-bold">✅ 30 Credits Free</p>
            </div>
            <div className="rounded-lg p-4">
              <p className="text-white font-bold">✅ No Credit Cards Required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (Left Side) */}
      <div className="hidden lg:flex justify-center items-center w-1/2 h-screen">
        <div className="absolute rounded-lg top-1/2 left-1/3 ml-28 transform -translate-x-1/2 -translate-y-1/2 p-4">
          <SignIn redirectUrl={redirect} />
        </div>

        {/* Texts for Desktop */}
        <div className="absolute grid grid-cols-1 gap-5  mr-48 mt-10 ">
          <div className="rounded-lg p-4">
            <p className="text-white font-bold">✅ Sign UP for Free</p>
          </div>
          <div className="rounded-lg p-4">
            <p className="text-white font-bold">✅ 7 days Free Trial</p>
          </div>
          <div className="rounded-lg p-4">
            <p className="text-white font-bold">✅ 100 Credits Free</p>
          </div>
          <div className="rounded-lg p-4">
            <p className="text-white font-bold">✅ No Credit Cards Required</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;