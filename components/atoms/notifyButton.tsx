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
  const [firstLogin, setFirstLogin] = useState<Date | null>(null);
  const [socket, setSocket] = useState(() => getSocket());
  //Check if user has lover, otherwise the link is for a different page
  if (!lover) {
    link = "./locked";
  }

  //Add notification for last message even if the user is logged out.
  // useEffect(() => {
  //   const fetchLatestMessageTime = async () => {
  //     if (!session?.user.email || !user?.messageRoomId) return;

  //     try {
  //       // Fetch messages

  //       const data = await MessageFetchData(
  //         user.messageRoomId,
  //         session.user.email
  //       );

  //       // Get the timestamp of the latest message (if available)
  //       if (data.messages.length > 0) {
  //         const latestMessage = data.messages[data.messages.length - 1];
  //         setLatestMessageTime(new Date(latestMessage.timestamp));
  //       } else {
  //         setLatestMessageTime(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching the latest message time:", error);
  //     }
  //     // setTest(user?.messageLastRead);
  //   };

  //   fetchLatestMessageTime();
  // }, [user?.messageRoomId, session?.user.email]);
  //offline Functionality
  // This code is fucked but idea is the first time u log in check if there is a latestmessage from db is bigger than users
  // lastest message read, if so set the notification to true, after that use realtime to get the latest message timestamp.
  useEffect(() => {
    if (!user?.messageLastRead || !latestMessageTime) return;

    // const messageLastRead = new Date(user.messageLastRead);
    console.log(latestMessageTime);
    console.log("LLL", user.messageLastRead);

    if (latestMessageTime > user.messageLastRead && !firstLogin) {
      setHasNewMessage(true);
    }
  }, [user?.messageLastRead, latestMessageTime]);

  useEffect(() => {
    if (!user || !socket) return;

    socket.connect();

    // Join the user to their message room
    socket.emit("join_room", user.messageRoomId);

    // Listen for real-time updates
    socket.on("receive_msg", (data) => {
      if (data?.timestamp) {
        const newMessageTime = new Date(data.timestamp);

        // Check if this new message is after the user's last read time
        if (user.messageLastRead && newMessageTime > user.messageLastRead) {
          setHasNewMessage(true);
        }

        // Update the latest message time
        setLatestMessageTime(newMessageTime);
      }
    });

    // Fetch the last read time on first load
    socket.on("get_last_messageTimestamp", (data) => {
      if (data?.lastRead) {
        setFirstLogin(data.lastRead);
      }
    });

    return () => {
      socket.off("receive_msg");
      socket.off("get_last_messageTimestamp");
      socket.emit("leave_room", user.messageRoomId);
      socket.disconnect();
    };
  }, [user, socket]);

  const handleButtonClick = async () => {
    setHasNewMessage(false); // Mark as read on click
    // if (onClick) onClick();
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
