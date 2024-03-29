import { BASE_URL2 } from "@/utils/funcitons";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { emails } from "@/utils/email";
import { toast } from "sonner";

import Button from '@mui/material/Button';
import '../App.css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


import DataTable, { TableColumn } from 'react-data-table-component';
interface DataItem {
  _id: number;
  name: string;
  email: string;
  planHistory:string;
  plan: {
    currentLimit: number;
  };
  
}


type Props = {};

const Admin = (props: Props) => {
  const [users, setusers] = useState<
    {
      _id: number;
      name: string;
      email: string;
      image: string;
      planHistory: string;
      current_limit: number;
      plan?: {
        currentLimit: number;
        maxLimit?: number;
        expairyDate: string;
      };
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
 

  const [searchKeyword, setSearchKeyword] = useState('');

  const [search, setsearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<DataItem[]>([]);
  const [pending, setPending] = React.useState(true);
  const [history, setHistory] = useState([]);
  const [OpenHistory, setOpenHistory] = useState(false);

  interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    customStyles: any; // Define the type for customStyles here
  }

  const columns: TableColumn<DataItem>[] = [
    {
      name: 'Sl',
      cell: (row: DataItem, index: number) => <div>{index + 1}</div>,
      sortable: true,
      width: '80px',
      style: {
      textAlign: 'center', // Align cell content horizontally to center
     
    },
      
    },
    {
      name: 'Name',
      selector: (row: DataItem) => row.name,
      sortable: true,
      width: '270px',
      
    },
    {
      name: 'Email',
      selector: (row: DataItem) => row.email,
      sortable: true,
      width: '320px'
    },
    {
      name: 'Credits',
      selector: (row: DataItem) => row.plan.currentLimit,
      sortable: true,
      width: '120px'
    },
    {
      name: 'See Plan',
      cell: (row: DataItem) => (
        
        <Button
        onClick={() => {
          setOpenHistory(true);
          // @ts-ignore
          setHistory(row.planHistory);
        }}
        variant="contained"
      >
          See Plan
        </Button>
      ),
      sortable: true,
      width: '200px'
    },
    {
      name: 'Add',
      cell: (row: DataItem) => (
        <Button
          variant="contained"
          onClick={() => handleAddButtonClick(row)}
        >
          Add
        </Button>
      ),
      sortable: true,
    },
    // Add more columns as needed
  ];
  

  const handleAddButtonClick = (user: DataItem) => {
    setOpen(true);
    setSelectedUser(String(user._id)); // Convert to string before passing
  };


  // useEffect(() => {
  

  //   // Check if users array is defined and not empty
  //   if (Array.isArray(users) && users.length > 0) {
  //     const result = users.filter(user => {
  //       // Check if user is defined and has a name property
  //       if (user && (user.name || user.email)) {
  //         const nameMatch = user.name && user.name.toLowerCase().includes(search.toLowerCase());
  //         const emailMatch = user.email && user.email.toLowerCase().includes(search.toLowerCase());
  //         const creaditMatch = user.plan && user.plan.currentLimit && user.plan.currentLimit.toString().includes(search.toLowerCase());

  //         return nameMatch || emailMatch || creaditMatch;
  //       }
  //       return false;
  //     });
  //     setFilteredUsers(result);
  //   } else {
  //     setFilteredUsers([]); // Set filtered users to an empty array if users array is undefined or empty
  //   }
  // }, [search, users]);

  useEffect(() => {
    // Check if users array is defined and not empty
    if (Array.isArray(users) && users.length > 0) {
      const result = users.filter(user => {
        // Check if user is defined and has a name property
        if (user && (user.name || user.email)) {
          const nameMatch = user.name && user.name.toLowerCase().includes(search.toLowerCase());
          const emailMatch = user.email && user.email.toLowerCase().includes(search.toLowerCase());
          const creaditMatch = user.plan && user.plan.currentLimit && user.plan.currentLimit.toString().includes(search.toLowerCase());
  
          return nameMatch || emailMatch || creaditMatch;
        }
        return false;
      });
  
      // Prepare the filtered data to match the structure of DataItem
      const filteredData: DataItem[] = result.map(user => ({
        _id: user._id, // Assuming clerkId can be used as _id
        name: user.name,
        email: user.email,
        planHistory:user.planHistory,
        plan: user.plan ? { // Ensure user.plan exists before accessing its properties
          currentLimit: user.plan.currentLimit,
          maxLimit: user.plan.maxLimit !== undefined ? user.plan.maxLimit : undefined
         
        } : { currentLimit: 0 }, // Provide default values for plan if it's undefined
      }));
  
      setFilteredUsers(filteredData);
    } else {
      setFilteredUsers([]); // Set filtered users to an empty array if users array is undefined or empty
    }
  }, [search, users]);
  


  const generatePageButtons = () => {
    const MAX_PAGE_BUTTONS = 5;

    const totalPagesCount = total?.pages ?? 0;
    const currentPage = page + 1; // Adding 1 because page numbers usually start from 1

    // If the total pages are less than or equal to the maximum buttons, return all pages
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

    // Add first and last page buttons if not already included
    if (pageButtons.length < MAX_PAGE_BUTTONS) {
      if (startPage !== 1) {
        pageButtons.unshift(1); // Add first page button
      }
      if (endPage !== totalPagesCount) {
        pageButtons.push(totalPagesCount); // Add last page button
      }
    } else {
      // Replace first/last button placeholders with actual page numbers
      if (startPage > 2) {
        pageButtons[0] = 1; // Replace placeholder with the first page number
      }
      if (endPage < totalPagesCount - 1) {
        pageButtons[MAX_PAGE_BUTTONS - 1] = totalPagesCount; // Replace placeholder with the last page number
      }
    }

    return pageButtons;
  };
 


 
  const navigate = useNavigate();

  const getUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL2}/admin/all?limit=20&page=${page}`
      );
      console.log(res);
      setusers(res.data.data.users);
      setFilteredUsers(res.data.data.users)
      setPending(false);
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
      if (search) {

      }
      else {

        getUsers();
      }

      setAccess(canAccess);
    }
  }, [isLoaded, isSignedIn, page]);
  if (!access) return <></>;

 

  return (
    <div className="p-4">
     
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
                variant="contained"
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
      <Dialog open={OpenHistory} onOpenChange={setOpenHistory}>
          <DialogContent className="w-fit">
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
                    <TableHead className="w-[100px]">Plan Name</TableHead>
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
     <div  className="my-20 max-w-[1100px] mx-auto rounded-lg overflow-hidden bg-white shadow-md">
      <DataTable<DataItem>
       className="data-table"
      title="User Details"
      columns={columns}
      data={filteredUsers}
      pagination
      fixedHeader
      fixedHeaderScrollHeight="1000px"
      highlightOnHover
      subHeader
      subHeaderComponent={<input type="text" placeholder="Search Here"
      className="form-input rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-indigo-500 w-full mx-4 my-2"
      onChange={(e)=>setsearch(e.target.value)}
     
     
      />}
     
    />
    </div>
    </div>
  );
};

export default Admin;
