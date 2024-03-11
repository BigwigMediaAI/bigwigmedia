import { BASE_URL2 } from '@/utils/funcitons';
// import { Plan, arr } from '@/utils/plans';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {}

const Success = (props: Props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const plan = urlParams.get("plan");
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex justify-center items-center '>
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-zinc-800 flex flex-col justify-center items-center  ">
        <h1 className='dark:text-white text-black font-bold text-4xl'>Success</h1>
        
      </div>
      </div>
  )
}

export default Success