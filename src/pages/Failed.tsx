import React from 'react'

type Props = {}

const Failed = (props: Props) => {

  return (
    <div className='w-full h-screen flex justify-center items-center '>
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-zinc-800 flex flex-col justify-center items-center  ">
        <h1 className='dark:text-white text-black font-bold text-4xl'>Failed</h1>
        
      </div>
    </div>
  )
}

export default Failed