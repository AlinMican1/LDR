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
  const router = useRouter();
  const acceptRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.put("/api/users/matchrequest", {
        senderId: senderId,
      });
      if (response.status === 200) {
        router.refresh();
      }
    } catch (error: any) {}
  };
  return <button onClick={acceptRequest}>Accept</button>;
}

interface RejectLoverRequestProps {
  name: string; // Prop to handle click
}

export function RejectLoverRequestButton({ name }: RejectLoverRequestProps) {
  return {};
}
