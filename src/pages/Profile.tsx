// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import Ellipse51 from "../assets/Ellipse51.png";
import Nav from "../components/Nav";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { Card } from "@/pages/Landing";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Plan, arr } from "@/utils/plans";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Transaction from "./Transaction";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Profile = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [bookmarks, setbookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState<{
    currentLimit: number;
    maxLimit: number;
    plan: string;
  } | null>();
  const { user, isSignedIn, isLoaded } = useUser();

  const getBookMarks = async (bool = false) => {
    if (!isSignedIn) {
      toast.error("Please sign in to view your bookmarks");
      return;
    }
    const res = await axios.get(`${BASE_URL}/bookmarks?clerkId=${user.id}`);
    const cards = res.data.data.map((card: Card) => ({
      ...card,
      isBookmarked: true,
    }));

    setbookmarks(cards);
  };

  const getCredits = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL2}/plans/current?clerkId=${user!.id}`
      );
      if (res.status === 200) {
        setCredits(res.data.data);
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
      toast.error("Login to continue...");
    }
    isSignedIn && getBookMarks();
    isSignedIn && getCredits();
    isSignedIn && handleTransaction();
  }, [isLoaded, isSignedIn]);

  const handleBookmarkToggle = async (id: string) => {
    if (!isSignedIn) {
      toast.error("Please sign in to bookmark this template");
      return navigate("/login");
    }

    const res = await axios.post(
      `${BASE_URL}/bookmarks/add-remove/${id}?clerkId=${user.id}`,
      {}
    );
    if (res.status === 200) {
      const arr = bookmarks.filter((b: any) => b._id !== id);
      setbookmarks(arr);
    }
  };

  const handleTransaction = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL2}/plans/history?clerkId=${user!.id}`
      );
      if (res.status === 200) {
        console.log(res.data.data, "transaction");
        setHistory(res.data.data);
      } else {
        toast.error("Error Occured activating account");
      }
    } catch (error) {}
  };

  console.log(credits);

  return (
    <>
      <Nav />
      <div className=" dark:!text-white flex flex-col min-w-screen min-h-[calc(100vh-90px)] w-full h-full justify-center items-center px-5">
        <div className="relative w-full h-full flex flex-col justify-center items-center  max-w-[867px] ">
          <div className="w-full flex flex-col mt-10 lg:mt-0 lg:flex-row justify-center items-center gap-[14px] ">
            <div className="flex flex-col gap-3 w-full sm:w-[325px] min-h-[506px]   py-5 justify-center items-center rounded-xl bg-white dark:bg-[#262626] shadow-accordian px-4 flex-grow flex-shrink">
              <div className="text-center text-black w-full  dark:text-white  self-start font-Outfit text-3xl font-semibold leading-normal mb-2">
                Your Profile
              </div>
              <div className="w-[146px] h-[146px] rounded-full  bg-center bg-cover bg-lightgray">
                <img src={user?.imageUrl} alt="" className="rounded-full" />
              </div>
              <div className="text-black dark:text-white font-Outfit text-xl font-semibold leading-normal">
                {user?.fullName}
              </div>
              <div className="flex felx-row justify-between gap-[12px]">
                <div className="text-black dark:text-white font-Outfit text-base font-normal leading-normal w-full line-clamp-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>

              <div className="relative flex items-center border-white w-[298px] flex-col p-[23px] gap-[10px] shrink-0 border-2 rounded-2xl text-center">
                {credits?.plan === "free" && (
                  <>You are currently on trial plan for 7 days</>
                )}
                <Link
                  className="w-[154px] h-[40px] inline-flex p-[2px] items-center justify-center gap-[4px] rounded-[32px] bt-gradient mt-5"
                  to="/plan"
                >
                  <div className="text-white font-Outfit text-sm font-medium leading-normal">
                    Upgrade Plan
                  </div>
                </Link>
                <div className="absolute w-full h-full rounded-[13px]  background-gradient  -z-10 top-1 left-1"></div>
                <div className="absolute w-full h-full rounded-[13px] dark:bg-[#262626] bg-white -z-[5] top-0 left-0"></div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between  items-start gap-[14px] shadow-accordian rounded-xl  dark:bg-[#262626] bg-white  flex-grow flex-shrink">
              <div className="flex flex-row w-full justify-between rounded-md   p-5 pb-0">
                <div className="text-black dark:text-white font-Outfit text-2xl font-semibold leading-normal">
                  Your Bookmarks
                </div>
                <button
                  className=" flex items-center text-black dark:text-white font-Outfit text-base  leading-normal cursor-pointer font-bold"
                  onClick={() => {
                    navigate({
                      pathname: "/",
                      search: "?selectedButton=My Tools",
                    });
                  }}
                >
                  View All
                  <svg
                    width="7"
                    height="13"
                    viewBox="0 0 7 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="dark:invert my-auto ml-3"
                  >
                    <path
                      d="M0.66626 1.5L5.66626 6.5L0.66626 11.5"
                      stroke="black"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="w-full h-fit flex  gap-5 flex-row justify-start px-3 flex-wrap">
                {bookmarks.slice(0, 4).map((p: any) => (
                  <div className="flex w-[calc(47%)] min-w-[236px] flex-col  gap-3 px-3 py-4 text-gray-700 shadow-accordian rounded-xl   mx-auto max-w-[260px] dark:bg-[#262626] bg-white  dark:border dark:border-zinc-600 ">
                    <div className="flex flex-row gap-5 line-clamp-2 justify-between items-center ">
                      <img src={p.logo} alt="" className="" />

                      <div
                        className=" flex items-center text-base text-black dark:text-white line-clamp-2 max-h-[56px]  font-outfit  font-semibold break-words"
                        title={p.name}
                      >
                        {p.name.length > 28
                          ? p.name.slice(0, 28) + "..."
                          : p.name}
                      </div>
                    </div>

                    <div className="flex items-start justify-center  pt-0 gap-5">
                      <button
                        className="flex w-full p-1 md:p-2 justify-center my-auto gap-2.26 rounded-full bg-gray-900  text-white font-outfit text-base font-medium px-10 mx-auto bt-gradient"
                        onClick={() => {
                          // Using window.open to navigate to a new page in a new tab
                          const newPath = `/generate?id=${p._id}`;
                          window.open(newPath, "_blank");
                        }}
                      >
                        Generate
                      </button>
                      <div
                        className={cn(
                          "flex w-fit p-1 my-auto hover:invert h-fit bg-white justify-center items-center cursor-pointer  rounded-full border border-gray-900 invert"
                          // isBookmarked && "invert hover:invert-0"
                        )}
                        onClick={() => handleBookmarkToggle(p._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="self-center w-4 h-4"
                          viewBox="0 0 17 16"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2.83362 3.48541C2.83362 2.961 3.04194 2.45807 3.41275 2.08725C3.78357 1.71644 4.2865 1.50812 4.81091 1.50812H11.4019C11.9263 1.50812 12.4292 1.71644 12.8 2.08725C13.1708 2.45807 13.3792 2.961 13.3792 3.48541V14.0494C13.3792 14.8535 12.4696 15.3215 11.8158 14.8542L8.10639 12.2046L4.39699 14.8542C3.74251 15.3221 2.83362 14.8541 2.83362 14.0501V3.48541Z"
                            fill="#1E1E1E"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 ">
                {credits && (
                  <div className=" px-5 w-full  flex shrink-0 flex-col">
                    <div className="flex shrink-0 text-black dark:text-white font-Outfit text-xl font-semibold leading-normal">
                      Credits
                    </div>
                    <div> </div>
                    <div className="flex shrink-0 text-black dark:text-white font-Outfit text-base font-medium leading-normal ">
                      {credits?.currentLimit} of {credits?.maxLimit} left
                    </div>
                  </div>
                )}

                <div className="  flex-row justify-start w-[calc(100%-16px)] px-5 m-4 py-2 rounded-lg flex shrink-0  bg-white dark:bg-[#262626] shadow-accordian">
                  <div className="flex flex-row gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      viewBox="0 0 34 34"
                      fill="none"
                      className="text-red-500 h-7 w-7"
                    >
                      <path
                        d="M7.08333 29.75C6.30417 29.75 5.63739 29.4728 5.083 28.9184C4.52861 28.364 4.25094 27.6968 4.25 26.9167V7.08333C4.25 6.30417 4.52767 5.63739 5.083 5.083C5.63833 4.52861 6.30511 4.25094 7.08333 4.25H17V7.08333H7.08333V26.9167H17V29.75H7.08333ZM22.6667 24.0833L20.7188 22.0292L24.3312 18.4167H12.75V15.5833H24.3312L20.7188 11.9708L22.6667 9.91667L29.75 17L22.6667 24.0833Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="text-red-500 cursor-pointer my-auto font-Outfit text-lg font-normal leading-normal">
                    <SignOutButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-10" variant="outline">
              Transaction History
            </Button>
          </DialogTrigger>
          <DialogContent className="my-auto min-w-[80vw]">
            <DialogHeader>
              <DialogTitle>Transaction History</DialogTitle>
              <DialogDescription>
                All the history of your Transaction Lies here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Valid Till</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((his, ind) => (
                    <TableRow key={ind}>
                      {/* @ts-ignore */}
                      <TableCell className="font-medium">{his.name}</TableCell>
                      {/* @ts-ignore */}
                      <TableCell>{his.createdAt}</TableCell>
                      {/* @ts-ignore */}
                      <TableCell>{his.validTill}</TableCell>
                      {/* @ts-ignore */}
                      <TableCell className="text-right">{his.price}</TableCell>
                      <TableCell className="text-right">
                        {/* @ts-ignore */}
                        {his.creditOptained}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
