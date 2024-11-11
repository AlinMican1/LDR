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
  previousSessionSenderId?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  currentUser_id,
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

  const [messageClass, setMessageClass] = useState(""); // Define state to store class
  const isCurrentUser = currentUser_id === (message.sender._id as string);
  useEffect(() => {
    const updatedClass = isCurrentUser
      ? "Message-subcontents right"
      : "Message-subcontents";
    setMessageClass(updatedClass);
  }, [isCurrentUser, message.sender._id]); // Add any dependency you want to track
  // const messageClass = isCurrentUser
  //   ? "Message-subcontents right"
  //   : "Message-subcontents";
  // const [showAvatar, setShowAvatar] = useState(true);
  // useEffect(() => {
  //   setShowAvatar(message.sender._id !== previousSessionSenderId);
  // }, [message.sender._id, previousSessionSenderId]);
  return (
    <div className="Message-contents">
      <div className={messageClass}>
        {/* {!isCurrentUser && showAvatar && (
          // <UserAvatar
          //   avatarPic={message.sender.avatarURL || ""}
          //   loverPic={undefined}
          // />
          // <h4>{message.sender.username}</h4>
          
        )} */}

        <div className="Message-info">
          <div className="Message-headings">
            {/* {!isCurrentUser && <h4>{message.sender.username}</h4>} */}

            <p>date</p>
          </div>
          <div className="Message-text">
            <p>{message.messageText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
