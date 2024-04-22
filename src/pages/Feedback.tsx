import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { BASE_URL, BASE_URL2 } from "@/utils/funcitons";

import axios from "axios";

const Feedback: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [selectedTool, setSelectedTool] = useState(""); // New state for selected tool
  const [tools, setTools] = useState([]); // State to store tools fetched from API

  useEffect(() => {
    // Fetch tools from your API when component mounts
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await axios.get(`${BASE_URL2}/objects/getObjects`);
      // Extract names from the response data
      console.log(response)
      const toolNames = response.data.message.map((tool: any) => tool.name);
      setTools(toolNames);
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle form submission logic
    await axios.post(`${BASE_URL}/feedback/add-feedback`, {
      name,
      email,
      review,
      tool: selectedTool // Include selected tool in the submission
    });
    alert(`Feedback Submitted!`);

    // Reset form fields after submission (optional)
    setName("");
    setEmail("");
    setReview("");
    setSelectedTool(""); // Reset selected tool
  };

  return (
    <div className="bg-white dark:bg-[#121212] text-gray-900 dark:text-gray-100">
      <Nav />
      <div className="p-10 flex flex-col justify-center items-center text-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Feedback Form 📝</h1>

        <form
          onSubmit={handleFormSubmit}
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
            <label htmlFor="tool" className="block mb-2 font-semibold">
              Select Tool
            </label>
            <select
              id="tool"
              className="form-select px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              required
            >
              <option value="">Select a Tool</option>
              {tools.map((tool: string) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-semibold">
              Review
            </label>
            <textarea
              id="message"
              className="form-textarea px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
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

        <p className="mt-10">
          Thank you for taking the time to share your thoughts with us. Your
          feedback is invaluable in helping us improve our services.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Feedback;
