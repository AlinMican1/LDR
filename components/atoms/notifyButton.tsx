"use client";
import { userFetchData } from "@/lib/userFetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./notifyButton.css";
import { io } from "socket.io-client";

interface NotifyButtonProps {
  icon?: any;
  link: string;
  name?: string;
  isActive?: boolean; // Prop to check if this button is active
  onClick?: () => void; // Prop to handle click
}

export function NotifyButton({
  icon,
  link,
  name,
  isActive,
  onClick,
}: NotifyButtonProps) {
  const { data: session } = useSession();
  const { user } = userFetchData() || {};
  const [hasNewMessage, setHasNewMessage] = useState(false);

  //   useEffect(() => {
  //     // Only subscribe if there's a valid user and messageRoomId
  //     if (!session?.user?.id || !user?.messageRoomId) return;

  //     const channel = pusherClient.subscribe(`room-${user.messageRoomId}`);
  //     channel.bind("new-message", (data: any) => {
  //       setHasNewMessage(true); // New message received, mark as unread
  //     });

  //     // Clean up on component unmount or user/messageRoomId change
  //     return () => {
  //       channel.unbind_all();
  //       channel.unsubscribe();
  //     };
  //   }, [session?.user?.id, user?.messageRoomId]); // Dependency array ensures this only runs on session/user changes

  //   if (!user?.messageRoomId) return null; // Early return if there's no messageRoomId

  useEffect(() => {
    const socket = io("http://localhost:3000");
    if (!session?.user?.id || !user?.messageRoomId) return;

    // Join the socket room
    socket.emit("join_room", user.messageRoomId);

    // Listen for incoming messages in the room
    socket.on("receive_msg", (data) => {
      setHasNewMessage(true); // New message received, mark as unread
    });
    return () => {
      socket.off("receive_msg"); // Remove the listener when the component unmounts
      socket.emit("leave_room", user.messageRoomId); // Optionally leave the room when unmounted
    };
  }, [session?.user?.id, user?.messageRoomId]);

  const handleButtonClick = async () => {
    setHasNewMessage(false); // Mark as read on click
    if (onClick) onClick();
  };

  return (
    <div>
      <Link href={link}>
        <button
          className={`customButtonContainer ${hasNewMessage ? "notify" : ""}`}
          onClick={handleButtonClick}
        >
          {icon && (
            <div style={{ position: "relative" }}>
              <FontAwesomeIcon icon={icon} />
              {hasNewMessage && <span className="notificationSymbol"></span>}
            </div>
          )}
          {name}
        </button>
      </Link>
    </div>
  );
}
