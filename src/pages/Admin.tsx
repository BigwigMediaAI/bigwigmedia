import { BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { emails } from "@/utils/email";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {};

const Admin = (props: Props) => {
  const [users, setusers] = useState<
    {
      clientId: string;
      name: string;
      email: string;
      image: string;
      current_limit: number;
    }[]
  >([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [access, setAccess] = useState(false);
  const [Open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [total, setTotal] = useState<{ total: number; pages: number }>({
    total: 0,
    pages: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [issLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [creditRange, setCreditRange] = useState([0, 1000]);
  const [search, setsearch] = useState<boolean>(false)

   const generatePageButtons = () => {
  const MAX_PAGE_BUTTONS = 5;

     const totalPagesCount = total?.pages ?? 0;
     const currentPage = page + 1; 
     if (totalPagesCount <= MAX_PAGE_BUTTONS) {
       return Array.from({ length: totalPagesCount }, (_, i) => i + 1);
     }

     let startPage = Math.max(
       currentPage - Math.floor(MAX_PAGE_BUTTONS / 2),
       1
     );
     let endPage = Math.min(startPage + MAX_PAGE_BUTTONS - 1, totalPagesCount);

     if (endPage - startPage + 1 < MAX_PAGE_BUTTONS) {
       startPage = Math.max(endPage - MAX_PAGE_BUTTONS + 1, 1);
     }

     const pageButtons = Array.from(
       { length: endPage - startPage + 1 },
       (_, i) => startPage + i
     );

     if (pageButtons.length < MAX_PAGE_BUTTONS) {
       if (startPage !== 1) {
         pageButtons.unshift(1); 
       }
       if (endPage !== totalPagesCount) {
         pageButtons.push(totalPagesCount);
       }
     } else {
       if (startPage > 2) {
         pageButtons[0] = 1; 
       }
       if (endPage < totalPagesCount - 1) {
         pageButtons[MAX_PAGE_BUTTONS - 1] = totalPagesCount; 
       }
     }

     return pageButtons;
   };
    const pageButtons = generatePageButtons();
  const handleSearch = async () => {
   
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL2}/admin/search?limit=20&page=${page}`,
        {
          params: {
            email,
            name,
            creditGreaterThan: creditRange[0],
            creditLessThan: creditRange[1],
          },
        }
      );
      console.log(res);
      setusers(res.data.data.users);
      setTotal({
        total: res.data.data.userCount,
        pages: res.data.data.numberOfPages,
      });
      setsearch(true)
    } catch (error) {
      console.log(error);
    } finally {
      
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL2}/admin/all?limit=20&page=${page}`
      );
      setusers(res.data.data.users);
      setTotal({
        total: res.data.data.userCount,
        pages: res.data.data.numberOfPages,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
      }
    }, 100);
  }, []);
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
      toast.error("Login to continue...");
    }
    if (isSignedIn) {
      let canAccess = false;
      user.emailAddresses?.forEach((e) => {
        if (emails.includes(e.emailAddress)) canAccess = true;
      });
      if (!canAccess) {
        navigate("/");
        toast.error("Cannot access ");
        return;
      }
      if(search){

      }
      else{
        getUsers();
      }
      setAccess(canAccess);
    }
  }, [isLoaded, isSignedIn, page]);
  if (!access) return <></>;
  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 max-w-96 mx-auto">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label
          htmlFor="creditRange"
          className="block text-sm font-medium text-gray-700"
        >
          Credit Range
        </label>
        <Slider
          defaultValue={[creditRange[0], creditRange[1]]}
          max={100}
          step={2}
          onValueChange={(value) => setCreditRange(value)}
        />
        <button
          onClick={handleSearch}
          className="mt-4 bg-indigo-500 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
      <Table className="my-20 max-w-[800px] border mx-auto rounded-lg bg-sky-100">
        <TableCaption>
          A list of {total.total} Users. page {page} of {total.pages}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Credits</TableHead>
            <TableHead className="text-right">Add</TableHead>
          </TableRow>
        </TableHeader>

        {issLoading ? (
          <div className="w-full h-20 flex justify-center items-center">
            Loading...
          </div>
        ) : (
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.clientId}>
                <TableCell className="font-medium">{user.clientId}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell className="font-medium">
                  {/* @ts-ignore */}
                  {user.plan.currentLimit}
                </TableCell>
                <TableCell className="font-medium">
                  <Button
                    onClick={() => {
                      setOpen(true);
                      // @ts-ignore
                      setSelectedUser(user._id);
                    }}
                  >
                    Add
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <div className="flex flex-row gap-1 w-full justify-center items-center mt-4">
        <button
          className="bg-white p-1 border "
          disabled={page === 0}
          onClick={() => setPage(page)}
        >
          {"Prev"}
        </button>
        {pageButtons.map((button) => (
          <button
            className="bg-white p-1 border "
            onClick={() => setPage(button)}
            key={button}
          >
            {button}
          </button>
        ))}
        <button
          className="bg-white p-1 border "
          onClick={() => setPage(page + 1)}
          disabled={page === total?.pages}
        >
          {"Next"}
        </button>
      </div>

      <Dialog open={Open} onOpenChange={setOpen}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Credits</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="credits"
                name="credits"
                id="credits"
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="valid for days"
                name="days"
                id="days"
                className="w-full p-2 border rounded-lg"
              />
              <Button
                onClick={async () => {
                  const credit = (
                    document.getElementById("credits") as HTMLInputElement
                  ).value;
                  const days = (
                    document.getElementById("credits") as HTMLInputElement
                  ).value;
                  const res = await axios.post(
                    `${BASE_URL2}/admin/addCreditManual`,
                    {
                      userId: selectedUser,
                      credit: parseInt(credit),
                      days: parseInt(days),
                    }
                  );
                  if (res.status === 200) {
                    setOpen(false);
                    getUsers();
                    toast.success("Added Credits");
                  } else {
                    toast.error("Failed to add credits");
                  }
                }}
              >
                Add
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
