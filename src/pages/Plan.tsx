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
          console.log(arr);
          
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
    window.scrollTo(0,0);
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
      const resposedata = await axios.post(`${BASE_URL2}/Razorpay/order?clerkId=${userId}`, {
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
        "callback_url": `${BASE_URL2}/verify/payment-verification`,
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
        <div className="flex flex-col min-h-[calc(100vh-90px)] w-full h-full justify-center items-center px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {isLoaded &&
              plans.map((ite, index) => (
                <div
  key={index}
  className="flex flex-col justify-between p-8 border rounded-lg shadow-md bg-[#ECEFF1] text-[var(--primary-text-color)] hover:shadow-lg transition-all"
  style={{ minWidth: '300px', minHeight: '300px' }}
>
  <div className="text-xl font-semibold text-center">
    <span className="capitalize">{ite.expairy} days</span>
  </div>
  <div className="flex flex-col gap-4 text-center">
    <div className="text-4xl font-medium">
      &#x20B9;{ite.Displayamount}
    </div>
    <div className="text-lg">
      {ite.limit} Credits
    </div>
  </div>
  <button
    className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--teal-color)] text-white font-medium hover:bg-[var(--hover-teal-color)] transition-all"
    onClick={() => CheckoutHandler(ite)}
  >
    Buy
  </button>
</div>

              ))}
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-10 px-5 py-2 rounded-full bg-[var(--teal-color)] text-white font-medium hover:bg-[var(--hover-teal-color)] transition-all"
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
