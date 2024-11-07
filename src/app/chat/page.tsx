"use client";
import { useEffect, useRef } from "react";

import { useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import InputField from "@/components/atoms/inputField";
import { MessageFetchData } from "@/lib/messageFetchData";
import MessageBox from "@/components/atoms/messageBox";
import Link from "next/link";

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
  const [totalMessages, setTotalMessages] = useState<TotalMessages>({
    messages: [],
  });

  const roomId = "672ba95d35edcad4876800c0";
  const { data: session } = useSession();

  const fetchInitialMessages = async () => {
    if (!session?.user?.email) return;

    const initialData = await MessageFetchData(roomId, session.user.email);
    console.log(initialData.messages);
    setTotalMessages({ messages: initialData.messages });
  };

  useEffect(() => {
    fetchInitialMessages();
  }, [session]);
  useEffect(() => {
    pusherClient.subscribe(roomId);

    const handleMessage = async (data: any) => {
      setTotalMessages((prevMessage) => {
        return {
          ...prevMessage,
          messages: [...prevMessage.messages, data],
        };
      });
    };
    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(roomId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, []);

  const messageData = {
    email: session?.user.email,
    message,
    roomId,
  };
  const sendMessage = async () => {
    try {
      const response = await axios.post("api/message", messageData);
    } catch (error: any) {
      console.log(error);
    }
  };
  let previousSenderId: any = null;
  const bottomChatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalMessages]);
  return (
    <div>
      <div>
        <Link className="textLink" href={"/"}>
          {" "}
          GO TO DASHBOARD
        </Link>
      </div>
      <div className="chatContainer">
        {totalMessages.messages.map((msg, index) => {
          // Determine if we should show profile info for the current message
          const showProfileInfo = msg.sender._id !== previousSenderId;

          const messageBox = (
            <MessageBox
              key={index}
              message={msg}
              currentUser_id={session?.user?.id}
              showProfileInfo={showProfileInfo}
            />
          );

          // Update previousSenderId to the current message's sender
          previousSenderId = msg.sender._id;
          return messageBox;
        })}
        <div ref={bottomChatRef} />
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
export default Chat;
