import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { toast } from "sonner";


import axios from "axios";


const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFormSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle form submission logic, like sending the email.
    // You can also integrate with your backend or any email service to send the message.
    // For mailto link, it will open the default email client on the user's machine.
    await axios.post(`${BASE_URL}/contact/form`, {
      name,
      email,
      message,
    });   
    toast(`Your message has been sent successfully.`)
    
    window.location.href = `mailto:marketing@bigwigmedia.in?subject=Contact%20Form&body=Name:%20${name}%0AEmail:%20${email}%0AMessage:%20${message}`;
    // Reset form fields after submission (optional)
    setName("");
    setEmail("");
    setMessage("");
    console.log(name,email,message)
  };
  window.scrollTo(0,0)
  return (
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">
      <Nav />
      <div className="p-10 flex flex-col justify-center items-center text-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="mb-8 max-w-4xl text-lg">
          <p className="text-base text-justify mt-[2vh] mb-[2vh] lg:mx-[25vh]">
            Thank you for considering BigWigMedia.ai for your AI needs. Our team
            is dedicated to providing innovative solutions under one roof.
            Whether you have questions, need assistance, or want to explore our
            AI tools, we're here to help.
          </p>
          <div className="space-y-2">
            <p>
              Email:{" "}
              <a
                href="mailto:marketing@bigwigmedia.in"
                className="text-blue-400"
              >
                marketing@bigwigmedia.in
              </a>
            </p>
            
          </div>
        </div>
        <form
          onSubmit={handleFormSubmit}
          action="mailto:marketing@bigwigmedia.in"
          method="post"
          encType="text/plain"
          className="w-full max-w-lg bg-white dark:bg-[#222222] shadow-lg rounded-lg p-8"
        >
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              className="form-textarea px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
