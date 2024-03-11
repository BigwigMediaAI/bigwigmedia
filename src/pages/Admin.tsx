import { BASE_URL2 } from '@/utils/funcitons'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { emails } from '@/utils/email'
import { toast } from 'sonner'
import OpenAI from 'openai';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button'

type Props = {}

const Admin = (props: Props) => {
  const [users, setusers] = useState<{ clerkId: string, name: string, email: string, image: string, current_limit: number }[]>([])
  const { isLoaded, isSignedIn, user } = useUser();
  const [access, setAccess] = useState(false)
  const [Open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>("")
  

  const navigate = useNavigate()


  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL2}/user/get/all`)
      setusers(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/login");
      toast.error("Login to continue...");
    }
    if (isSignedIn) {
      let canAccess = false
      user.emailAddresses?.forEach(e => {
        if (emails.includes(e.emailAddress)) canAccess = true
      })
      if (!canAccess) {
        navigate("/")
        toast.error("Cannot access ")
        return;
      }
      getUsers()

      setAccess(canAccess)

    }
  }, [isLoaded, isSignedIn]);
  if (!access) return <></>
  return (
    <>
      <Table className="my-20 max-w-[800px] border mx-auto rounded-lg bg-sky-100">
        <TableCaption>A list of All Users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Credits</TableHead>
            <TableHead className="text-right">Add</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.clerkId}>
              <TableCell className="font-medium">{user.clerkId}</TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="font-medium">
                {user.current_limit}
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
      </Table>
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
                    { userId: selectedUser,credit: parseInt(credit), days:parseInt(days) }
                  );
                  if (res.status===200) {
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
    </>
  );
}

export default Admin