import React, { useEffect } from "react";
import aitools from '../assets/bigwig-img.jpg';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
      <div className={`modal-content bg-white p-0 rounded-lg shadow-lg transform transition-all ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} style={{ maxWidth: '60%', maxHeight: '70vh', width: '70vw', height: 'auto' }}>
        <button className="absolute top-2 right-5 close-button text-black z-10" onClick={onClose}>
        ✖
        </button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2">
            <img src={aitools} alt="Social Media Importance" className="modal-image w-full h-full object-cover m-0 rounded-md" />
          </div>
          <div className="w-full md:w-1/2 md:mt-0 mt-4">
            <div className="modal-content-right p-4">
              <p className="subtitle text-lg font-semibold mb-2 md:mb-6 text-black">Experience the Power of Our Tools</p>
              <ul className="mb-2 md:mb-6 text-black">
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ 7 Days Free Trial</li>
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ 100 Credits Free</li>
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ No Credit Card Required</li>
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ Access to Advanced Analytics</li>
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ Dedicated Customer Support</li>
                <li className="text-sm md:text-base mb-1 md:mb-4">✨ Real-time Performance Monitoring</li>
              </ul>
              <p className="disclaimer text-xs md:text-sm text-black">*Limited time offer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
