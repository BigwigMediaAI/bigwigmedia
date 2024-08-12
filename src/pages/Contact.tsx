import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";
import { toast } from "sonner";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ContactUs: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic
    await axios.post(`${BASE_URL}/contact/form`, {
      name,
      email,
      message,
    });
    toast("Your message has been sent successfully.");

    window.location.href = `mailto:marketing@bigwigmedia.in?subject=Contact%20Form&body=Name:%20${name}%0AEmail:%20${email}%0AMessage:%20${message}`;
    // Reset form fields after submission (optional)
    setName("");
    setEmail("");
    setMessage("");
    console.log(name, email, message);
  };
  window.scrollTo(0,0)
  return (
    <div className="bg-white  text-gray-900">
      <Nav />
      <div className="max-w-7xl mx-auto px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-[var(--primary-text-color)] text-2xl cursor-pointer hover:text-[var(--gray-color)]"
          onClick={handleBackClick}
        />
      </div>
      <div className="flex flex-col px-4 justify-center items-center text-center">
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
                className="text-[var(--primary-text-color)]"
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
          className="w-full max-w-lg bg-white shadow-md shadow-[var(--primary-text-color)] rounded-lg p-8"
        >
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-semibold text-start">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-input px-4 py-2 w-full rounded-md border border-[var(--primary-text-color)]  bg-gray-50 "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold text-start">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="form-input px-4 py-2 w-full rounded-md border border-[var(--primary-text-color)]  bg-gray-50 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-semibold text-start">
              Message:
            </label>
            <textarea
              id="message"
              className="form-textarea px-4 py-2 w-full rounded-md border border-[var(--primary-text-color)]  bg-gray-50 "
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[var(--teal-color)] hover:bg-[var(--hover-teal-color)] text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
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
