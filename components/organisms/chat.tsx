"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MessageFetchData } from "@/lib/messageFetchData";
import MessageBox from "@/components/atoms/messageBox";
import Link from "next/link";
import { userFetchData } from "@/lib/userFetchData";
import SendMsgInput from "../molecules/sendMsg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { getSocket } from "@/app/socket";
import "./chat.css";

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

interface TotalMessages {
  messages: MessageProps[];
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageDate, setMessageDate] = useState(Date());
  const [totalMessages, setTotalMessages] = useState<TotalMessages>({
    messages: [],
  });

  const { user } = userFetchData();
  const { data: session } = useSession();
  const bottomChatRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState(() => getSocket());

  const fetchInitialMessages = async () => {
    if (!session?.user?.email) return;
    if (!user?.messageRoomId) return;
    const initialData = await MessageFetchData(
      user?.messageRoomId,
      session.user.email
    );
    setTotalMessages({ messages: initialData.messages });
  };
  useEffect(() => {
    if (session?.user?.email && user?.messageRoomId) {
      fetchInitialMessages();
    }
  }, [session?.user?.email, user?.messageRoomId]);

  //Function to update last read message, to help with notification when logged out.
  const updateLastRead = async () => {
    try {
      const response = await axios.put(`api/message/${user?.messageRoomId}`, {
        userId: session?.user.id,
      });
      if (response.status === 200) {
        socket.emit("update_latest_messageTimestamp", {
          email: session?.user.email,
          userId: session?.user.id,
          roomId: user?.messageRoomId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const messageData = {
        email: session?.user?.email,
        messageText: message,
        timestamp: new Date(),
        roomId: user?.messageRoomId,
        sender: {
          _id: user?._id,
        },
      };
      // Add the message locally
      // setTotalMessages((prevMessages: any) => ({
      //   messages: [...prevMessages.messages, messageData],
      // }));

      await axios.post("api/message", {
        email: session?.user.email,
        message,
        messageTime: Date(),
        roomId: user?.messageRoomId,
      }); // Send message to server

      socket.emit("send_msg", messageData); // Emit message via Socket.io
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (user?.messageRoomId) {
      socket.emit("join_room", user.messageRoomId);
    }
    socket.connect();
    const handleReceiveMessage = (data: MessageProps) => {
      setTotalMessages((prevMessages) => ({
        messages: [...prevMessages.messages, data],
      }));
    };

    socket.on("receive_msg", handleReceiveMessage);

    return () => {
      socket.off("receive_msg", handleReceiveMessage); // Clean up the listener when the component unmounts or roomId changes
      socket.disconnect();
    };
  }, [user?.messageRoomId]); // This will trigger when user?.messageRoomId changes

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalMessages]);

  return (
    <div className="chatLayout">
      <div className="DashboardContainer">
        <Link onClick={() => updateLastRead()} className="Dashboard" href={"/"}>
          <FontAwesomeIcon icon={faAngleLeft} />
          Dashboard
        </Link>
      </div>
      <div className="chatContainer">
        {totalMessages.messages.map((msg, index) => {
          const currMsgDate = msg.timestamp
            ? format(new Date(msg.timestamp), "yyyy-MM-dd")
            : null;
          const prevMsgDate =
            index > 0
              ? format(
                  new Date(totalMessages.messages[index - 1].timestamp),
                  "yyyy-MM-dd"
                )
              : null;

          const showDate = currMsgDate !== prevMsgDate;

          return (
            <MessageBox
              key={index}
              message={msg}
              currentUser_id={session?.user?.id}
              showDate={showDate}
              formattedDate={currMsgDate}
            />
          );
        })}
        <div ref={bottomChatRef} />
      </div>

      <SendMsgInput
        type="text"
        value={message}
        name="text"
        placeholder="Send a message"
        onChange={(e) => setMessage(e.target.value)}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
