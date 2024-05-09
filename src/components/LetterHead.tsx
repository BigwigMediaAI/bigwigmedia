import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

const templates:any = {
  template1: { name: "Template 1", value: "template1" },
  template2: { name: "Template 2", value: "template2" },
  template3: { name: "Template 3", value: "template3" },
};

export function LetterheadGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplate(e.target.value);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplate || !logo || !companyName || !email || !phone || !address) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("logo", logo);
      formData.append("companyName", companyName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
      console.log(selectedTemplate)
      const response = await axios.post(`http://localhost:4000/api/v1/response/generateLetterhead?templateName=${selectedTemplate}`, formData, {
        responseType: "arraybuffer",
      });

      const imageUrl = URL.createObjectURL(new Blob([response.data], { type: "image/jpeg" }));
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error("Error generating letterhead:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = previewUrl;
      downloadLink.download = "letterhead.jpg";
      downloadLink.click();
    }
  };

  return (
    <div className="m-auto w-full max-w-4xl flex">
      <div className="flex flex-col flex-1">
        <select
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">Select Template</option>
          {Object.keys(templates).map((templateKey) => (
            <option key={templateKey} value={templates[templateKey].value}>
              {templates[templateKey].name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          onChange={handleLogoChange}
        />
        <input
          type="text"
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          type="email"
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          className="mb-4 w-full rounded-md border-2 border-gray-300 p-4"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          className="text-white font-semibold py-3 px-6 rounded-md bg-blue-500 hover:bg-blue-600"
          onClick={handleSubmit}
          disabled={!selectedTemplate || !logo || !companyName || !email || !phone || !address || isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
      <div className="flex flex-col flex-1 items-center justify-center">
        {previewUrl && (
          <>
            <img src={previewUrl} alt="Letterhead Preview" className="max-w-full max-h-96 mb-4" />
            <Button
              className="text-white font-semibold py-3 px-6 rounded-md bg-blue-500 hover:bg-blue-600"
              onClick={handleDownload}
            >
              Download
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
