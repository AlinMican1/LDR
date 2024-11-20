import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./messageBox.css";
import "../../src/app/globals.css";
import UserAvatar from "./userAvatar";
import { format, isValid } from "date-fns";
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
  showDate: boolean; // Add this prop
  formattedDate: string | null; // Add this prop
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  currentUser_id,
  previousSessionSenderId,
  showDate,
  formattedDate,
}) => {
  // const [formattedTimestamp, setFormattedTimestamp] = useState("");

  // useEffect(() => {
  //   setFormattedTimestamp(formatTimestamp(message.timestamp));
  // }, [message.timestamp]);

  // // Function to format timestamp based on today, yesterday, or a specific date
  // const formatTimestamp = (timestamp: Date): string => {
  //   const today = new Date();
  //   const messageDate = new Date(timestamp);

  //   const isToday =
  //     today.getFullYear() === messageDate.getFullYear() &&
  //     today.getMonth() === messageDate.getMonth() &&
  //     today.getDate() === messageDate.getDate();

  //   const isYesterday =
  //     today.getFullYear() === messageDate.getFullYear() &&
  //     today.getMonth() === messageDate.getMonth() &&
  //     today.getDate() - messageDate.getDate() === 1;

  //   if (isToday) {
  //     return `Today ${format(messageDate, "p")}`;
  //   } else if (isYesterday) {
  //     return `Yesterday at ${format(messageDate, "p")}`;
  //   } else {
  //     return format(messageDate, "PP p");
  //   }
  // };
  // const [showDate, setShowDate] = useState(false);
  // const formattedDate = format(message.timestamp, "yyyy-MM-dd");

  const [messageClass, setMessageClass] = useState(""); // Define state to store class
  const isCurrentUser = currentUser_id === (message.sender._id as string);

  const timestamp = new Date(message.timestamp);
  const isTimestampValid = isValid(timestamp);
  useEffect(() => {
    const updatedClass = isCurrentUser
      ? "Message-subcontents right"
      : "Message-subcontents";
    setMessageClass(updatedClass);
  }, [isCurrentUser, message.sender._id]);
  return (
    <div>
      {showDate && (
        <div className="Message-Date-Container">
          <div className="Message-Date-SubContainer">
            <p className="Message-Date">{formattedDate}</p>
          </div>
        </div>
      )}

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
            </div>
            <div className="Message-text">
              <p>{message.messageText}</p>
              <p className="Message-time">
                {isTimestampValid ? format(timestamp, "HH:mm") : "Invalid Time"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
