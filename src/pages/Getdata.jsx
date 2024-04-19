import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/funcitons";

import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // Fetch form data from backend API
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/contact/getdata`);
        setFormData(response.data); // Assuming response.data is an array of form data objects
      } catch (error) {
        console.error("Error fetching form data:", error);
        // Optionally, handle error fetching data
      }
    };

    fetchFormData();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-400">
      <div className="overflow-auto w-full">
        <h1 className="text-2xl font-bold mt-8 mb-4 text-center">CONTACT FORM SUBMISSION</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded ">
            <thead>
              <tr className="border-b border-teal-500">
                <th className="text-left p-3 px-5 text-black">S.NO</th>
                <th className="text-left p-3 px-5 text-black">Name</th>
                <th className="text-left p-3 px-5 text-black">Email</th>
                <th className="text-left p-3 px-5 text-black">Message</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 px-5 text-black">{index + 1}</td>
                  <td className="p-3 px-5 text-black">{data.name}</td>
                  <td className="p-3 px-5 text-black">{data.email}</td>
                  <td className="p-3 px-5 text-black text-justify w-1/4  h-auto">{data.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contact;
