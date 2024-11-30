"use client";
import { userFetchData } from "@/lib/userFetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./notifyButton.css";

import { getSocket } from "@/app/socket";
import { MessageFetchData } from "@/lib/messageFetchData";

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
  const { user, lover } = userFetchData() || {};
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [latestMessageTime, setLatestMessageTime] = useState<Date | null>(null);
  const [socket, setSocket] = useState(() => getSocket());  //Check if user has lover, otherwise the link is for a different page
  if (!lover) {
    link = "./locked";
  }
  //Add notification for last message even if the user is logged out.
  useEffect(() => {
    const fetchLatestMessageTime = async () => {
      if (!session?.user.email || !user?.messageRoomId) return;

      try {
        // Fetch messages
        const data = await MessageFetchData(
          user.messageRoomId,
          session.user.email
        );

        // Get the timestamp of the latest message (if available)
        if (data.messages.length > 0) {
          const latestMessage = data.messages[data.messages.length - 1];
          setLatestMessageTime(new Date(latestMessage.timestamp));
        } else {
          setLatestMessageTime(null);
        }
      } catch (error) {
        console.error("Error fetching the latest message time:", error);
      }
    };

    fetchLatestMessageTime();
  }, [user?.messageRoomId, session?.user.email]);

  useEffect(() => {
    if (!user?.messageLastRead || !latestMessageTime) return;

    const messageLastRead = new Date(user.messageLastRead);
    if (latestMessageTime > messageLastRead) {
      setHasNewMessage(true); // There's a new message
    } else {
      setHasNewMessage(false); // No new messages
    }
  }, [latestMessageTime, user?.messageLastRead]);

  useEffect(() => {
    if (!user) return;
    // const socket = io("http://localhost:3000");

    // Join the socket room
    socket.connect()
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
