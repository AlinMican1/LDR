"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import "./customButton.css";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

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
interface IconButtonProps {
  icon: any;
  onclick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void;
}

export function IconButton({ icon, onclick }: IconButtonProps) {
  return (
    <div>
      <button className="iconButton" onClick={onclick}>
        {icon && <FontAwesomeIcon icon={icon} />}
      </button>
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

interface AcceptLoverRequestProps {
  senderId: string;
}

export function AcceptLoverRequestButton({
  senderId,
}: AcceptLoverRequestProps) {
  const acceptRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put("/api/users/matchrequest", {
        senderId: senderId,
      });
      if (response.status === 200) {
        //Refresh page
      }
    } catch (error: any) {}
  };
  return (
    <button className="acceptButton" onClick={acceptRequest}>
      Accept
    </button>
  );
}

interface RejectLoverRequestProps {
  name: string;
  loverTag: string;
}

export function RejectLoverRequestButton({
  name,
  loverTag,
}: RejectLoverRequestProps) {
  const acceptRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        `/api/users/matchrequest/${encodeURIComponent(loverTag)}`
      );
      if (response.status === 200) {
        //Refresh page
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <button className="rejectButton" onClick={acceptRequest}>
      {name}
    </button>
  );
}
