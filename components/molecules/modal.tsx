import { useState } from "react";
import "./modal.css";
import { userFetchRequest } from "@/lib/userFetchRequest";

interface ModalProps {
  children?: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const [open, setOpen] = useState(false);
  const openModal = () => {
    setOpen(!open);
  };
  return (
    <>
      {open ? (
        <div>
          <div className="modalContainer">
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
