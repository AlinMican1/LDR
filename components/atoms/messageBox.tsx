import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./messageBox.css";
import UserAvatar from "./userAvatar";
import { format } from "date-fns";
interface MessageProps {
  messageText: string;
  timestamp: Date;
  isRead: boolean;

  sender: {
    username: string;
    avatarURL: string | null;
    _id: string;
  };
}

interface MessageBoxProps {
  message: MessageProps;
  currentUser_id?: string;
  showProfileInfo: boolean;
  previousSessionSenderId?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  currentUser_id,
  showProfileInfo,
  previousSessionSenderId,
}) => {
  //   const [formattedTimestamp, setFormattedTimestamp] = useState("");

  //   useEffect(() => {
  //     setFormattedTimestamp(formatTimestamp(message.timestamp));
  //   }, [message.timestamp]);

  //   // Function to format timestamp based on today, yesterday, or a specific date
  //   const formatTimestamp = (timestamp: Date): string => {
  //     const today = new Date();
  //     const messageDate = new Date(timestamp);

  //     const isToday =
  //       today.getFullYear() === messageDate.getFullYear() &&
  //       today.getMonth() === messageDate.getMonth() &&
  //       today.getDate() === messageDate.getDate();

  //     const isYesterday =
  //       today.getFullYear() === messageDate.getFullYear() &&
  //       today.getMonth() === messageDate.getMonth() &&
  //       today.getDate() - messageDate.getDate() === 1;

  //     if (isToday) {
  //       return `Today at ${format(messageDate, "p")}`;
  //     } else if (isYesterday) {
  //       return `Yesterday at ${format(messageDate, "p")}`;
  //     } else {
  //       return format(messageDate, "PP p");
  //     }
  //   };

  return (
    <div className="Message-contents">
      {showProfileInfo && (
        <div className="Message-subcontents">
          <UserAvatar
            avatarPic={message.sender.avatarURL || ""}
            loverPic={undefined}
          />
          <div className="Message-info">
            <div className="Message-headings">
              <h4>{message.sender.username}</h4>
              <p>date</p> {/* Display formatted date */}
            </div>
            <div className="Message-text">
              <p>{message.messageText}</p>
            </div>
          </div>
        </div>
      )}
      {!showProfileInfo && (
        <div className="Message-text-only">
          <p>{message.messageText}</p>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
