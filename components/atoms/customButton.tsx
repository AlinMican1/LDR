import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import "./customButton.css";

interface CustomButtonProps {
  icon?: any;
  link: string;
  name?: string;
  isActive?: boolean; // Prop to check if this button is active
  onClick?: () => void; // Prop to handle click
}

const CustomButton = ({
  icon,
  link,
  name,
  isActive,
  onClick,
}: CustomButtonProps) => {
  return (
    <div>
      <Link href={link}>
        <button
          className={`customButtonContainer ${isActive ? "active" : ""}`}
          onClick={onClick}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
          {name}
        </button>
      </Link>
    </div>
  );
};
export default CustomButton;
