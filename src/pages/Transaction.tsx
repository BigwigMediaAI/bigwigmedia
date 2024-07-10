import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import React from 'react'

type Props = {}

const Transaction = (props: Props) => {
  window.scrollTo(0, 0);
 
  return (
    <div className='flex flex-col gap-2'><Nav />
      <div className="flex flex-col gap-3 max-w-4xl mx-auto py-8 px-4">
        <h1 className='text-3xl font-bold'>Secure Transaction Policy
</h1>

        <h2 className="text-lg font-semibold mb-2">What data do we gather and how is it utilized?</h2>
        <p>
          Upon placing an order on this website, we collect your name, email, phone number, address, and credit card details if credit card payment is selected. This information is crucial for the successful processing and fulfillment of your order.
        </p>

        <h2 className="text-lg font-semibold mb-2">How do we safeguard customer information?</h2>
        <p>
          For order placements, we employ a secure server. The software on this secure server (SSL) encrypts all inputted information before transmitting it to us. Additionally, multiple layers of encryption and security measures are in place to protect sensitive customer data and prevent unauthorized access.
        </p>

        <h2 className="text-lg font-semibold mb-2">Your Consent:</h2>
        <p>
          By utilizing our website, you express consent to the collection and utilization of this information. In the event of changes to our privacy policy, we will promptly post these modifications, ensuring that you remain informed about the information we collect, its usage, and the circumstances under which we disclose it.
        </p>

        <h2 className="text-lg font-semibold mb-2">Credit Card Details:</h2>
        <p>
          All credit card transactions are securely processed through the Payment Gateway. Credit card payment is the exclusive method for order placement. www.bigwigmedia.ai does not retain any credit card details on our servers.
        </p>

        <h2 className="text-lg font-semibold mb-2">Payment Information:</h2>
        <p>
          When you provide or update payment information, it is transmitted through an encrypted connection to the Payment Processor. The Payment Processor handles and processes your payment details in accordance with their Privacy Policy. www.bigwigmedia.ai does not store your payment information, except for your zip code and country, which are necessary for billing and compliance with tax and government regulations.
        </p>

        <p className="mt-8">If you have any questions or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p>
      </div>

      <Footer /></div>
  )
}

export default Transaction