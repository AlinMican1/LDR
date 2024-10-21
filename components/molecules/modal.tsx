import { useState } from "react";
import "./modal.css";

interface ModalProps {
  children?: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(!open);
  };
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Check if clicked on modal container (outside the modal)
    if (e.target === e.currentTarget) {
      openModal(); // Close modal
    }
  };
  return (
    <>
      {open ? (
        <div>
          <div className="modalContainer" onClick={handleClickOutside}>
            <div className="modal">
              {children}
              <button onClick={openModal}>Close</button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={openModal}>Open</button>
      )}
    </>
  );
};
export default Modal;
