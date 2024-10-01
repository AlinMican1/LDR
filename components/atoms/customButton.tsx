"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import "./customButton.css";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface NavBarButtonProps {
  icon?: any;
  link: string;
  name?: string;
  isActive?: boolean; // Prop to check if this button is active
  onClick?: () => void; // Prop to handle click
}

export function NavBarButton({
  icon,
  link,
  name,
  isActive,
  onClick,
}: NavBarButtonProps) {
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
}

export function LogOutButton() {
  const router = useRouter();

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login"); // Manually redirect to login page
  };

  return (
    <div>
      <button className="customButtonContainer" onClick={logout}>
        <div className="customLogOutButton">
          <FontAwesomeIcon icon={faRightFromBracket} />
          <div className="symbolAndTextSpace">Sign Out</div>
        </div>
      </button>
    </div>
  );
}
