import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import React from 'react'
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Props = {}

const Legal = (props: Props) => {
  window.scrollTo(0,0)
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <Nav />
    <div className="max-w-7xl mx-auto px-2 pt-6 flex mb-4">
        <FiArrowLeft
          className="text-[var(--primary-text-color)] text-2xl cursor-pointer hover:text-[var(--gray-color)]"
          onClick={handleBackClick}
        />
      </div>
      <div className=" max-w-4xl mx-auto text-center py-8 px-4">
        <h1 className='text-3xl font-bold'>Corporate And Billing Details

</h1>

        <h2 className="text-lg font-semibold mb-2">Corporate Office Address:</h2>
        <p>
S-1, 3rd Floor,
Janta Market, Rajouri Garden
New Delhi - 110027
cancellation policy


        </p>
       <p>
       BIGWIG MEDIA AND EVENTS PRIVATE LIMITED <br />
CIN: U72900DL2016PTC304726 <br />
PAN Number: AAGCB8474N <br />
GST Number: 07AAGCB8474N1Z0 <br />

       </p>
        <h2 className="text-lg font-semibold mb-2">Bank Details:
</h2>

<p>
Bank Name: Axis Bank Ltd <br />
Bank Account No. – 916020053249038 <br />
IFSC Code: UTIB0000371 <br />
SWIFT Code - AXISINBBA23 <br />
Branch: Rohini, New Delhi-110085 <br />

</p>
<p>
Bank Name: Standard Chartered Bank
<br />
Bank account No. – 52505141422
 <br />
 IFSC Code: SCBL0036027
 <br />
 SWIFT Code : SCBLINBBDEL
<br />
Branch : 10 Sansad Marg, New Delhi 110001 <br />

</p>

        <p className="mt-8">If you have any questions or concerns, please contact us at <a href="mailto:vipul@bigwigmedia.in" className="text-blue-500">vipul@bigwigmedia.in</a>.</p> 
      </div>

      <Footer /></div>
  )
}

export default Legal