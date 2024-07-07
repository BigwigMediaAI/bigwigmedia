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
  useUser,
} from "@clerk/clerk-react";
import { PlanProps } from "@/utils/plans";
import { toast } from "sonner";
import Footer from "@/components/Footer";

type Props = {};

const Plan = (props: Props) => {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();

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
        console.log(res);
        // @ts-ignore
        if (res.showTop) {
          const arr = res.data.data;
          setplans([arr.TOPUP, arr.YEARLY]);
        } else {
          const arr = res.data.data;
          setplans([arr.MONTHLY, arr.YEARLY]);
        }
        //  setplans(Object.values(res.data.data));
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        getPlans();
      } else {
        navigate("/login");
      }
    }
  }, [isLoaded]);

  // const key =
  //   "pk_live_51OnzNaSDyCQHDHHU8Ppp4kpMRyHHLZqRapD6xZRjBVexHGwbuz02217MQHQcKCI4o5MrJvdQPgYjiUmgvYJ0p4iX00y0uK6Qdz";

  // const key =
    // "pk_live_51OnzNaSDyCQHDHHU8Ppp4kpMRyHHLZqRapD6xZRjBVexHGwbuz02217MQHQcKCI4o5MrJvdQPgYjiUmgvYJ0p4iX00y0uK6Qdz";

  // const buyPlan = async (index: any) => {
  //   const { isLoaded, isSignedIn, user } = useUser();
  //   try {
  //     const obj = plans[index];
  //     const stripe = await loadStripe(key);

  //     const resp = await axios.post(
  //       `${BASE_URL2}/payment/create-checkout-session?clerkId=${userId}`,
  //       {
  //         product: {
  //           ...obj,
  //         },
  //       }
  //     );
     
  //     stripe?.redirectToCheckout({
  //       sessionId: resp.data.id,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const CheckoutHandler = async (ite: PlanProps) => {
    try {
      console.log(ite)
      const { name, price } = ite; 
      const resposedata = await axios.post(`https://bigwigmedia-backend.onrender.com/api/v2/Razorpay/order?clerkId=${userId}`, {
        name:name,
        amount:price 
      });
      console.log(resposedata)
      const options = {
        "key": "rzp_live_p29OihE6B2QSvA", 
        "amount":Number(resposedata.data.order.amount*100), 
        "currency": "INR",
        "name":"PLAN"+"-"+ite.name,
        "description": "Test Transaction",
        "image": "https://bigwigmedia.ai/assets/bigwig-img-pvLFkfcL.jpg",
        "order_id": "", 
        "callback_url": "https://bigwigmedia-backend.onrender.com/api/v2/verify/payment-verification",
        "prefill": {
            "name": user,
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
            // console.log(ite.price)
            // console.log(userId)
            console.log(cn)

      console.log(resposedata);
      console.log(options);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error occurred during checkout");
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
    } catch (error) {

    }
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
        <Nav />
        <div className=" dark:!text-white flex flex-col  min-h-[calc(100vh-90px)] w-full h-full justify-center items-center px-5">
          {/*  @ts-ignore */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {isLoaded &&
              plans.map((ite, index) => (
                <div  key={index}
                  className="flex border-gradient-2 dark:bg-[#262626
] z-10 w-[200px] h-[320px] flex-col justify-between p-[23px] gap-[10px] shrink-0 border-2 "
                >
                  <div className="text-black dark:text-white font-Outfit text-lg font-semibold leading-normal text-center">
                    <span className="capitalize">{ite.expairy} days</span>
                  </div>
                  <div className="text-black dark:text-white font-Outfit text-sm font-medium leading-normal">
                    <div className="w-full flex flex-col gap-3">
                      <div className="text-black dark:text-white font-Outfit text-3xl font-medium leading-normal text-center">
                      &#x20B9;{ite.Displayamount}
                      </div>
                      <div className="text-black dark:text-white font-Outfit text-base font-outfit leading-normal text-center">
                        {ite.limit} Credits
                      </div>
                    </div>
                  </div>
                  <button
                    className=" z-50 w-full h-[40px] inline-flex p-[2px] items-center justify-center gap-[4px] rounded-[32px] bt-gradient text-white font-Outfit text-sm font-medium leading-normal cursor-pointer"
                    onClick={() => CheckoutHandler(ite)}
                  >
                    Buy
                  </button>
                  <div className="absolute w-full h-full rounded-[13px]  background-gradient  -z-10 top-1 left-1"></div>
                  <div className="absolute w-full h-full rounded-[13px] dark:bg-[#262626] bg-white -z-[5] top-0 left-0"></div>
                </div>
              ))}
            -
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-[5vh] border-gradient-2 px-5 py-2 rounded-[32px] text-white font-Outfit text-sm font-medium leading-normal cursor-pointer"
          >
            Back to Profile
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Plan;
