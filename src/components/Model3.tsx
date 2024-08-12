import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import aitools from '../assets/bigwig-img.jpg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditLimitModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && event.target instanceof HTMLElement && !event.target.closest(".modal-content")) {
        onClose();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center modal-overlay backdrop-filter backdrop-blur-sm ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`modal-content bg-white p-0 rounded-lg shadow-lg transform transition-all ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ maxWidth: '50%', maxHeight: '90vh', height: 'auto', width: '90vw' }}>
        <button className="absolute top-2 right-5 close-button text-black z-10" onClick={onClose}>
          ✖
        </button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2">
            <img src={aitools} alt="Credit Limit Exceeded" className="modal-image w-full h-full object-cover m-0 rounded-md" />
          </div>
          <div className="w-full md:w-1/2 md:mt-0 mt-4 flex flex-col justify-between">
            <div className="modal-content-right p-4">
              <p className="subtitle text-lg font-semibold mb-4 text-black">Credit Limit Exceeded</p>
              <p className="text-black mb-4 hidden md:block">Your credit limit is over. To get more credit, buy our plan.</p>
              <p className="text-black mb-4">To continue using our services, please purchase additional credit.</p>
            </div>
            <div className="w-full flex justify-center pb-4 pl-4 pr-4">
              <Link to="/plan" className="text-white text-center font-outfit md:text-lg font-semibold flex relative text-base py-3 px-10 justify-center items-center gap-4 flex-shrink-0 rounded-full bg-[var(--teal-color)] disabled:opacity-60 hover:bg-[var(--hover-teal-color)] w-full">Buy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditLimitModal;
