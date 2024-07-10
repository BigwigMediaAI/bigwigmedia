import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import React,{useEffect} from 'react'
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Props = {}

const Privacy = (props: Props) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    
    <div>
      <Nav />
      <div className="max-w-6xl mx-auto px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-white text-2xl cursor-pointer hover:text-blue-700"
          onClick={handleBackClick}
        />
      </div>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p>
          This privacy notice for WWW.BIGWIGMEDIA.AI ("we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
        </p>

        <ul className="list-disc pl-6">
          <li>Visit our website at <a href="https://www.bigwigmedia.ai" className="text-blue-500">https://www.bigwigmedia.ai</a>, or any website of ours that links to this privacy notice</li>
          <li>Engage with us in other related ways, including any sales, marketing, or events</li>
        </ul>

        <p>Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:AIENQUIRY@BIGWIGMEDIA.IN" className="text-blue-500">AIENQUIRY@BIGWIGMEDIA.IN</a>.</p>

        <h2 className="text-lg font-semibold mb-2">SUMMARY OF KEY POINTS</h2>
        <p>
          This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
        </p>

        <h2 className="text-2xl font-bold mb-4">WHAT INFORMATION DO WE COLLECT?</h2>
        <div className="mb-4">
          <p className="font-bold">Personal information you disclose to us</p>
          <p className="italic">In Short: We collect personal information that you provide to us.</p>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          <p className="font-bold">Personal Information Provided by You.</p>
          <p className="ml-4">
            The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc ml-8">
            <li>names</li>
            <li>phone numbers</li>
            <li>email addresses</li>
            <li>mailing addresses</li>
            <li>job titles</li>
            <li>billing addresses</li>
            <li>debit/credit card numbers</li>
            <li>contact preferences</li>
            <li>contact or authentication data</li>
          </ul>
          <p className="font-bold">Sensitive Information:</p>
          <p className="ml-4">We do not process sensitive information.</p>
          <p className="font-bold">Payment Data.</p>
          <p className="ml-4">
            We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe Inc. and Chargebee. You may find their privacy notice link(s) here:
            <a href="https://stripe.com/en-in/privacy" className="text-blue-500">Stripe Privacy</a> and
            <a href="https://www.chargebee.com/privacy/" className="text-blue-500">Chargebee Privacy</a>.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Information automatically collected</h2>
          <p className="italic mb-2">In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
          <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services and for our internal analytics and reporting purposes.</p>
          <p>Like many businesses, we also collect information through cookies and similar technologies.</p>
          <h3 className="text-lg font-bold mt-4 mb-2">The information we collect includes:</h3>
          <ul className="list-disc ml-8 mb-2">
            <li>Log and Usage Data</li>
            <li>Device Data</li>
            <li>Location Data</li>
          </ul>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Account Information</h2>
          <p>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
          <ul className="list-disc ml-8 mb-4">
            <li>Log in to your account settings and update your user account.</li>
            <li>Contact us using the contact information provided.</li>
          </ul>
          <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms, and/or comply with applicable legal requirements.</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Cookies and similar technologies</h2>
          <p>Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Controls for Do-Not-Track Features</h2>
          <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.</p>
        </div>
        <div className="max-w-3xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</h2>
          <p><em>In Short:</em> If you are a resident of California, Colorado, Connecticut, Utah, or Virginia, you are granted specific rights regarding access to your personal information.</p>

          <p>We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under the age of 18, please contact us at <a href="mailto:AIENQUIRY@BIGWIGMEDIA.IN" className="text-blue-500">AIENQUIRY@BIGWIGMEDIA.IN</a>.</p>
        </div>

        <h2 className="text-2xl font-bold mb-4">How do we use and share your personal information?</h2>

        <p>Learn about how we use your personal information in the section, "<a href="#process-information" className="text-blue-500">HOW DO WE PROCESS YOUR INFORMATION?</a>"</p>

        <h3 className="text-xl font-bold mt-4 mb-2">Will your information be shared with anyone else?</h3>

        <p>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information in the section, "<a href="#share-information" className="text-blue-500">WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a>"</p>

        <p>We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be the "selling" of your personal information.</p>

        <p>We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers.</p>

        <h2 className="text-2xl font-bold mb-4">California Residents</h2>

        <p>California Civil Code Section 1798.83, also known as the "Shine The Light" law permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.</p>

        <p>If you are under 18 years of age, reside in California, and have a registered account with the Services, you have the right to request the removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">CCPA Privacy Notice</h2>

        <p>This section applies only to California residents. Under the California Consumer Privacy Act (CCPA), you have the rights listed below.</p>

        <p>The California Code of Regulations defines a "resident" as</p>

        <ol className="list-decimal ml-8 mb-4">
          <li>every individual who is in the State of California for other than a temporary or transitory purpose and</li>
          <li>every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose</li>
        </ol>

        <p>All other individuals are defined as "non-residents."</p>

        <p>If this definition of "resident" applies to you, we must adhere to certain rights and obligations regarding your personal information.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Your rights with respect to your personal data</h2>
        {/* You can list the rights here */}

        <h2 className="text-2xl font-bold mt-8 mb-4">Your rights with respect to your personal data</h2>

        <h3 className="text-xl font-bold mb-2">Right to request deletion of the data — Request to delete</h3>
        <p>You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.</p>

        <h3 className="text-xl font-bold mt-4 mb-2">Right to be informed — Request to know</h3>
        <p>Depending on the circumstances, you have a right to know:</p>
        <ul className="list-disc ml-8 mb-4">
          <li>whether we collect and use your personal information;</li>
          <li>the categories of personal information that we collect;</li>
          <li>the purposes for which the collected personal information is used;</li>
          <li>whether we sell or share personal information to third parties;</li>
          <li>the categories of personal information that we sold, shared, or disclosed for a business purpose;</li>
          <li>the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;</li>
          <li>the business or commercial purpose for collecting, selling, or sharing personal information; and</li>
          <li>the specific pieces of personal information we collected about you.</li>
        </ul>
        <p>In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.</p>

        <h3 className="text-xl font-bold mt-4 mb-2">Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights</h3>
        <p>We will not discriminate against you if you exercise your privacy rights.</p>

        <h3 className="text-xl font-bold mt-4 mb-2">Right to Limit Use and Disclosure of Sensitive Personal Information</h3>
        <p>We do not process consumers' sensitive personal information.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Verification process</h2>

  <p>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with the information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.</p>

  <p>We will only use the personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additional information as soon as we finish verifying you.</p>

  <h3 className="text-xl font-bold mt-4 mb-2">Other privacy rights</h3>
  <ul className="list-disc ml-8 mb-4">
    <li>You may object to the processing of your personal information.</li>
    <li>You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.</li>
    <li>You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent who does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.</li>
    <li>You may request to opt-out from future selling or sharing of your personal information with third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the request submission date.</li>
  </ul>

  <p>To exercise these rights, you can contact us by email at <a href="mailto:AIENQUIRY@BIGWIGMEDIA.IN" className="text-blue-500">AIENQUIRY@BIGWIGMEDIA.IN</a>, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?</h2>

        <h3 className="text-xl font-bold mt-4 mb-2">Australia and New Zealand</h3>
        <p>We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).</p>
        <p>This privacy notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information.</p>
        <p>If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular:</p>
        <ul className="list-disc ml-8 mb-4">
          <li>Offer you the products or services that you want</li>
          <li>Respond to or help with your requests</li>
          <li>Manage your account with us</li>
          <li>Confirm your identity and protect your account</li>
        </ul>
        <p>At any time, you have the right to request access to or correction of your personal information. If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the Office of the Australian Information Commissioner and a breach of New Zealand's Privacy Principles to the Office of New Zealand Privacy Commissioner.</p>

        <h3 className="text-xl font-bold mt-4 mb-2">Republic of South Africa</h3>
        <p>At any time, you have the right to request access to or correction of your personal information. If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:</p>
        <p>The Information Regulator (South Africa)</p>
        <ul className="list-disc ml-8 mb-4">
          <li>General enquiries: <a href="mailto:enquiries@inforegulator.org.za" className="text-blue-500">enquiries@inforegulator.org.za</a></li>
          <li>Complaints (complete POPIA/PAIA form 5): <a href="mailto:PAIAComplaints@inforegulator.org.za" className="text-blue-500">PAIAComplaints@inforegulator.org.za</a> & <a href="mailto:POPIAComplaints@inforegulator.org.za" className="text-blue-500">POPIAComplaints@inforegulator.org.za</a></li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">DO WE MAKE UPDATES TO THIS NOTICE?</h2>
        <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
        <p>If you have questions or comments about this notice, you may email us at <a href="mailto:AIENQUIRY@BIGWIGMEDIA.IN" className="text-blue-500">AIENQUIRY@BIGWIGMEDIA.IN</a> or contact us by post at:</p>

        <h2 className="text-2xl font-bold mt-8 mb-4">HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
        <p>Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please submit a request form by clicking <a href="https://www.bigwigmedia.ai/contact" className="text-blue-500">here</a>. We will respond to your request within 30 days.</p>
      </div>


      <Footer />
    </div>
  )
}

export default Privacy;