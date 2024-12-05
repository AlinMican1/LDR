import { useEffect, useState } from "react";
import "./modal.css";
import { SetButton } from "../atoms/customButton";

interface ModalProps {
  children?: React.ReactNode;
  buttonName?: string;
}

const Modal = ({ children, buttonName }: ModalProps) => {
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
              <SetButton name={"cancel"} onclick={openModal}></SetButton>
              {/* <button onClick={openModal}>Cancel</button> */}
            </div>
          </div>
        </div>
      ) : (
        <SetButton name={buttonName} onclick={openModal}></SetButton>
      )}
    </>
  );
};
export default Modal;
