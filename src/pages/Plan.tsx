import Nav from "@/components/Nav";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { BASE_URL2 } from "@/utils/funcitons";
import logo from "../assets/bigwig-img.jpg";

import SideImg from "../assets/image 7.png";
import One from "../assets/image 5.png";
import Two from "../assets/image 6.png";
import { ModeToggle } from "../components/ui/mode-toggle";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
// import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "../components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SignOutButton,
  // SignInButton,
  SignIn,
  useAuth,
  SignedOut,
} from "@clerk/clerk-react";
import { PlanProps } from "@/utils/plans";
import { toast } from "sonner";
import Footer from "@/components/Footer";


type Props = {};

const Plan = (props: Props) => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const navigate = useNavigate();
  const [isScroll, setIsScroll] = useState(false);
  const [plans, setplans] = useState<PlanProps[]>([]);

  const [credits, setCredits] = useState<{
    current_limit: number;
    max_limit: number;
    plan: string;
  } | null>();
  // let plansToShow = [];

  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    //@ts-ignore
    if (ref?.current?.scrollWidth > ref?.current?.clientWidth) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }

    const handleReSize = () => {
      //@ts-ignore
      if (ref?.current?.scrollWidth > ref?.current?.clientWidth) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("resize", handleReSize);

    return () => {
      window.removeEventListener("resize", handleReSize);
    };
  }, []);

  const getPlans = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/plans?clerkId=${userId}`);
      if (res.status === 200) {
        console.log(res)
        // @ts-ignore
        if (res.showTop){
              const arr = res.data.data;
              setplans([arr.TOPUP, arr.YEARLY]);
        }
        else{
          const arr = res.data.data
          setplans([arr.MONTHLY,arr.YEARLY]);
        }
        //  setplans(Object.values(res.data.data));
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isLoaded ) {
      if(isSignedIn){

        getPlans();
      }
      else{
        navigate("/login")
      }
    }
  }, [isLoaded]);

  // const key =
  //   "pk_live_51OnzNaSDyCQHDHHU8Ppp4kpMRyHHLZqRapD6xZRjBVexHGwbuz02217MQHQcKCI4o5MrJvdQPgYjiUmgvYJ0p4iX00y0uK6Qdz";

  const key =
    "pk_live_51OnzNaSDyCQHDHHU8Ppp4kpMRyHHLZqRapD6xZRjBVexHGwbuz02217MQHQcKCI4o5MrJvdQPgYjiUmgvYJ0p4iX00y0uK6Qdz";

  const buyPlan = async (index: any) => {
    try {
      const obj = plans[index];
      const stripe = await loadStripe(key);

      const resp = await axios.post(
        `${BASE_URL2}/payment/create-checkout-session?clerkId=${userId}`,
        {
          product: {
            ...obj,
          },
        }
      );
      //  console.log( resp.data.id);
          // const link = document.createElement("a");
          // link.href = resp.data.id;
          // // link.target = "_blank";
          // // link.download = "image.jpg"; // You can customize the downloaded filename here
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);

      stripe?.redirectToCheckout({
        sessionId: resp.data.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
      toast.error("Login to continue...");
    }
    isSignedIn && getCredits();
  }, [isLoaded, isSignedIn]);

  const getCredits = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/limits?clerkId=${userId}`);
      if (res.status === 200) {
        setCredits(res.data.data);
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };

  return (
    <div className="w-screen h-screen overflow-x-hidden bg-black">
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
      <div className="z-50 absolute top-0 w-full">
        <nav className="sticky top-0 z-50 bg-white/30 dark:bg-zinc-800/70 backnavdrop  shadow-md dark:shadow-black">
          <div className="h-10vh flex justify-between z-50 text-black dark:text-white lg:py-5 px-9 md:px-14  lg:px-24 mx-auto py-4  border-b items-center">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                alt="bigwig-logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
              />
              <span className=" hidden md:block text-white  font-outfit text-2xl font-semibold">
                BigWigMedia.ai
              </span>
            </div>

            <div className="flex flex-row items-center">
              <div className="flex  gap-4 items center justify-end front-normal ">
                <div className=" justify-center   flex random">
                  <div id="google_translate_element" className=""></div>
                </div>

                {!isSignedIn && (
                  <button
                    className="hidden md:flex px-4 py-2 justify-center items-center text-white font-outfit text-base font-semibold gap-2 rounded-3xl hover:bg-gray-800 bg-gray-900 shadow-md "
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                )}
              </div>

              <div className="ml-4">
                <ModeToggle />
              </div>
              <div className=" mx-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="p-0 bg-transparent">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        className="dark:invert"
                      >
                        <path
                          d="M7.79199 25.5416H28.2087M7.79199 18.25H28.2087M7.79199 10.9583H28.2087"
                          stroke="black"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    <DropdownMenuSeparator />
                    {isSignedIn && (
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        Profile
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem>
                      {!isSignedIn ? (
                        <button
                          className="flex px-4 py-2 justify-center items-center text-white font-outfit text-base font-semibold gap-2 rounded-3xl hover:bg-gray-800 bg-gray-900 shadow-md "
                          onClick={() => {
                            navigate("/login");
                          }}
                        >
                          Login
                        </button>
                      ) : (
                        <button className="flex px-4 py-2 justify-center items-center text-white font-outfit text-base font-semibold gap-2 rounded-3xl hover:bg-gray-800 bg-gray-900 shadow-md ">
                          <SignOutButton />
                        </button>
                      )}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>Sign Up</DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
        <div className=" dark:!text-white flex flex-col  min-h-[calc(100vh-90px)] w-full h-full justify-center items-center px-5">
          {/*  @ts-ignore */}
          <div
            ref={ref}
            className={cn(
              "w-full snap-always  overflow-y-hidden snap-center  h-full flex flex-row gap-3 justify-center items-center  max-w-[1200px]  ",
              isScroll &&
                "overflow-x-scroll  snap-x px-5 justify-start scroll-smooth snap-mandatory 	"
            )}
          >
            {isLoaded &&
              plans.map((ite, index) => (
                <div
                  className="flex border-gradient-2 dark:bg-[#262626
] z-10 w-[200px] h-[320px] flex-col justify-between p-[23px] gap-[10px] shrink-0 border-2 "
                >
                  <div className="text-black dark:text-white font-Outfit text-lg font-semibold leading-normal">
                    <span className="capitalize">{ite.expairy} days</span>
                  </div>
                  <div className="text-black dark:text-white font-Outfit text-sm font-medium leading-normal">
                    <div className="w-full flex flex-col gap-3">
                      <div className="text-black dark:text-white font-Outfit text-5xl font-medium leading-normal text-center">
                        ${ite.price}
                      </div>
                      <div className="text-black dark:text-white font-Outfit text-3xl font-medium leading-normal text-center">
                        {ite.limit} Credits
                      </div>
                    </div>
                  </div>
                  <button
                    className=" z-50 w-full h-[40px] inline-flex p-[2px] items-center justify-center gap-[4px] rounded-[32px] bt-gradient text-white font-Outfit text-sm font-medium leading-normal cursor-pointer"
                    onClick={() => buyPlan(index)}
                  >
                    Buy
                  </button>
                  <div className="absolute w-full h-full rounded-[13px]  background-gradient  -z-10 top-1 left-1"></div>
                  <div className="absolute w-full h-full rounded-[13px] dark:bg-[#262626] bg-white -z-[5] top-0 left-0"></div>
                </div>
              ))}
            -
          </div>
          
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Plan;
