import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import React from 'react'
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Props = {}

const Cancellation  = (props: Props) => {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div className='flex flex-col gap-2'><Nav />
    <div className="max-w-4xl px-3  md:px-12 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-[var(--primary-text-color)] text-2xl cursor-pointer hover:text-[var(--gray-color)]"
          onClick={handleBackClick}
        />
      </div>
      <div className="flex flex-col gap-3 max-w-4xl mx-auto py-8 px-4">
        <h1 className='text-3xl font-bold'>Refund and Cancellation Policy.</h1>

        <h2 className="text-lg font-semibold mb-2">Refund Policy for <a href="https://bigwigmedia.ai/">bigwigmedia.ai :</a></h2>
        <p>
        Welcome to BigwigMedia.ai. We appreciate your decision to use our services to explore the capabilities of generative AI. Please read our refund policy carefully to understand the conditions under which refunds are handled.
</p>
<h2 className="text-lg font-semibold mb-2">    

No Refund Policy :
</h2> <p>
At BigwigMedia.ai, we offer a "No Refund" policy, which applies to all subscription services purchased on our website. We provide this policy due to the nature of our digital services and the significant value offered through our advance credits system.


       </p>
        <h2 className="text-lg font-semibold mb-2">Advance Credits :

</h2>

<p>
To ensure that our users are confident in their purchase, we offer 7 days free test generations to all new subscribers before any payment is required. These test credits allow you to fully explore the functionalities and benefits of our services without any initial cost. This trial opportunity is provided to help you make an informed decision about our subscription.


</p>
<h2 className="text-lg font-semibold mb-2">Subscription Services :


</h2>
<p>
When you purchase a subscription, you acknowledge that: <br />
- No refunds will be issued once your paid subscription begins. <br />
- Subscriptions are billed in advance on a recurring basis (monthly or annually, depending on your chosen payment plan) and will continue until you cancel.


</p>
<h2 className="text-lg font-semibold mb-2">Cancellation Policy :


</h2>
<p>You may cancel your subscription at any time via your account dashboard. Upon cancellation, your subscription will remain active until the end of the current paid billing period. You will not be charged for the next billing cycle.
</p>
<h2 className="text-lg font-semibold mb-2">Modifications to Services :</h2>

<p>BigwigMedia.ai reserves the right to modify or discontinue, temporarily or permanently, the services (or any part thereof) with or without notice. Prices of all services are subject to change. Notice of price changes will be provided on our website or through direct communication to you.

</p>

<h2 className="text-lg font-semibold mb-2">Contact Us :
</h2>
<p >If you have any questions or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p> 
<p>By subscribing to and using our services, you agree to the terms outlined in this Refund Policy. Thank you for choosing BigwigMedia.ai.</p>

<p className='font-semibold'>Bigwigmedia.ai is a company owned by Bigwig Media and Events Pvt. Ltd.</p>
      </div>

      <Footer /></div>
  )
}

export default Cancellation 