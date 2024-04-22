import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/utils/funcitons";


// Define an interface to represent the shape of the form data
interface FormData {
  _id: string;
  name: string;
  email: string;
  tool: string;
  date: Date ;
  review: string;
  __v: number;
}

const Getfeedback = () => {
  const [formData, setFormData] = useState<FormData[]>([]); // Specify the type of formData

  useEffect(() => {
    // Fetch form data from backend API
    const fetchFormData = async () => {
      try {
        const response = await axios.get<FormData[]>(`${BASE_URL}/feedback/allfeedback`);
        console.log(response)
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
        <h1 className="text-2xl font-bold mt-8 mb-4 text-center">📝USER'S FEEDBACK📝</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded ">
            <thead>
              <tr className="border-b border-teal-500">
                <th className="text-left p-3 px-5 text-sky-600">S.NO</th>
                <th className="text-left p-3 px-5 text-sky-600">Date</th>
                <th className="text-left p-3 px-5 text-sky-600	">Name</th>
                <th className="text-left p-3 px-5 text-sky-600">Email</th>
                <th className="text-left p-3 px-5 text-sky-600">tool</th>
                <th className="text-left p-3 px-5 text-sky-600">Message</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((data, index) => (
                <tr key={data._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 px-5 text-black">{index + 1}</td>
                  <td className="p-3 px-5 text-black">{new Date(data.date).toLocaleString()}</td>
                  <td className="p-3 px-5 text-black">{data.name}</td>
                  <td className="p-3 px-5 text-black">{data.email}</td>
                  <td className="p-3 px-5 text-black">{data.tool}</td>
                  <td className="p-3 px-5 text-black whitespace-pre-line h-auto">{data.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Getfeedback;
