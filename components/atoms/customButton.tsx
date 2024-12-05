"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import "./customButton.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getSocket } from "@/app/socket";
import { useState } from "react";
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
    window.location.reload();
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
  const { data: session } = useSession();
  const [socket, setSocket] = useState(() => getSocket());
  const acceptRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let receiverId;
      if (session) {
        const { data: senderData } = await axios.get(
          `/api/users/${session.user.email}`
        );
        receiverId = session.user.id;
      }

      const response = await axios.put("/api/users/matchrequest", {
        senderId: senderId,
      });
      if (response.status === 200 && session) {
        socket.connect();
        socket.emit("accept_lover_request", {
          senderId: senderId,
          receiverId: receiverId,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <button className="acceptRequestButton" onClick={acceptRequest}>
      Accept
    </button>
  );
}

interface RejectLoverRequestProps {
  name: string;
  loverTag: string;
  receiverLoverTag: string;
}

export function RejectLoverRequestButton({
  name,
  loverTag,
  receiverLoverTag,
}: RejectLoverRequestProps) {
  const [socket, setSocket] = useState(() => getSocket());
  const { data: session } = useSession();
  const rejectRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //REAL TIME FETCHING
      let senderId;
      let receiverId;
      if (session) {
        const { data: senderData } = await axios.get(
          `/api/users/${session.user.email}`
        );
        senderId = senderData.user._id;
        receiverId =
          (senderData.user.request.to && senderData.user.request.to._id) ||
          (senderData.user.request.from && senderData.user.request.from._id) ||
          null;
      }
      const response = await axios.delete(
        `/api/users/matchrequest/${encodeURIComponent(loverTag)}`
      );
      if (response.status === 200 && session) {
        socket.connect();
        socket.emit("cancel_lover_request", {
          senderId: senderId,
          receiverId: receiverId,
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };
  return (
    <button
      className={`${"inter-font"} ${"rejectButton"}`}
      onClick={rejectRequest}
    >
      {name}
    </button>
  );
}

interface SetButtonProps {
  icon?: any;
  onclick?: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void;
  name?: string;
}
export function SetButton({ icon, onclick, name }: SetButtonProps) {
  return (
    <button className={`${"setButton"} ${"roboto-font"}`} onClick={onclick}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {name}
    </button>
  );
}
