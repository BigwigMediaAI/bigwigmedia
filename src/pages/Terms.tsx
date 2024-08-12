import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import React,{useState,useEffect} from 'react';
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    
      <Nav/>
      <div className="max-w-7xl mx-auto px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-[var(--primary-text-color)] text-2xl cursor-pointer hover:text-[var(--gray-color)]"
          onClick={handleBackClick}
        />
      </div>
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <ol className="list-decimal pl-6">
        <li>
          <h2 className="text-lg font-semibold mb-2">Acceptance of Terms</h2>
          <p>
            By accessing or using the Portal, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use the Portal.
          </p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Use of the Portal</h2>
          <p>2.1 License: We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Portal for its intended purpose.
            2.2 User Account: To access certain features of the Portal, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account information.
            2.3 Prohibited Activities: You agree not to engage in any activity that may disrupt or interfere with the functioning of the Portal. Prohibited activities include but are not limited to hacking, scraping, or any unauthorized access to our systems.</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Intellectual Property</h2>
          <p>3.1 Ownership: All content, trademarks, and intellectual property on the Portal are the property of <a href="https://bigwigmedia.ai/" className="text-blue-500">bigwigmedia.ai</a>. or its licensors. You may not use, reproduce, or distribute any content from the Portal without our express written permission.
            3.2 User-generated Content: By submitting content to the Portal, you grant bigwigmedia.ai a non-exclusive, royalty-free, worldwide license to use, modify, and display the content for the purpose of providing and promoting the Portal.</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Privacy</h2>
          <p>Our Privacy Policy governs the collection, use, and disclosure of your personal information. By using the Portal, you consent to the terms of our Privacy Policy.
</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Disclaimers</h2>
          <p>5.1 No Warranty: The Portal is provided "as is" without any warranty, either express or implied. We do not guarantee the accuracy, completeness, or reliability of the content on the Portal.
            5.2 Limitation of Liability: <a href="https://bigwigmedia.ai/" className="text-blue-500">bigwigmedia.ai</a> will not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the Portal.</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Modifications</h2>
          <p>We reserve the right to modify or update these Terms and Conditions at any time. Your continued use of the Portal after any changes indicates your acceptance of the modified terms.</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Termination</h2>
          <p>We reserve the right to terminate or suspend your access to the Portal without notice for any reason, including a breach of these Terms and Conditions.
</p>
        </li>
        <li>
          <h2 className="text-lg font-semibold mb-2">Governing Law</h2>
          <p>These Terms and Conditions are governed by and construed in accordance with the laws of DELHI/NCR.
            By using this Portal, you agree to these Terms and Conditions. If you have any questions or concerns, please contact us at
            vipul@bigwigmedia.in.</p>
        </li>
      </ol>
      <p className="mt-8">If you have any questions or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p>
    </div>
      <Footer/>
    </>
  );
}

export default Terms;
