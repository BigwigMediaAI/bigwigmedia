import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import React from 'react'

type Props = {}

const Blog = (props: Props) => {
  return (
    <div className="bg-white dark:bg-[#1E1E1E]">
      <Nav/>
      <div className="p-10 text-center min-h-screen">
        <h1 className="bg-gradient text-transparent bg-clip-text  text-3xl font-bold mb-4">
          Blog
        </h1>
        <p className="text-xl my-4 lg:mx-[20vh] text-center ">
          Welcome to BigWigMedia.ai – your go-to hub for comprehensive AI
          solutions. We offer a range of cutting-edge tools designed to elevate
          efficiency and productivity across industries. At BigWigMedia.ai,
          we're committed to simplifying your AI integration journey, ensuring
          you stay ahead in the rapidly evolving digital landscape. Join us in
          transforming possibilities into realities.
        </p>
        {/* <p className="text-xl text-justify mt-[10vh] lg:mx-[20vh]">
          At BigWigMedia.ai, we're committed to simplifying your AI integration
          journey, ensuring you stay ahead in the rapidly evolving digital
          landscape. Join us in transforming possibilities into realities.
        </p> */}
      </div>
      <Footer />
    </div>
  )
}

export default Blog