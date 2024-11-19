"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import { MessageFetchData } from "@/lib/messageFetchData";
import MessageBox from "@/components/atoms/messageBox";
import Link from "next/link";
import { userFetchData } from "@/lib/userFetchData";
import SendMsgInput from "../molecules/sendMsg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { io } from "socket.io-client";
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
  const socket = io("http://localhost:3000");
  const { user } = userFetchData();
  const { data: session } = useSession();
  const bottomChatRef = useRef<HTMLDivElement>(null);

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
    fetchInitialMessages();
  }, [session, user]);
  //PUSHER WAY
  // useEffect(() => {
  //   if (user?.messageRoomId) {
  //     pusherClient.subscribe(user.messageRoomId);

  //     const handleMessage = (data: MessageProps) => {
  //       setTotalMessages((prevMessage) => ({
  //         ...prevMessage,
  //         messages: [...prevMessage.messages, data],
  //       }));
  //     };

  //     pusherClient.bind("new-message", handleMessage);

  //     return () => {
  //       pusherClient.unbind("new-message", handleMessage);
  //       pusherClient.unsubscribe(user.messageRoomId);
  //     };
  //   }
  // }, [user?.messageRoomId]);

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

    const handleReceiveMessage = (data: MessageProps) => {
      setTotalMessages((prevMessages) => ({
        messages: [...prevMessages.messages, data],
      }));
    };

    socket.on("receive_msg", handleReceiveMessage);

    return () => {
      socket.off("receive_msg", handleReceiveMessage); // Clean up the listener when the component unmounts or roomId changes
    };
  }, [user?.messageRoomId]); // This will trigger when user?.messageRoomId changes

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalMessages]);

  return (
    <div className="chatLayout">
      <div className="DashboardContainer">
        <Link className="Dashboard" href={"/"}>
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
