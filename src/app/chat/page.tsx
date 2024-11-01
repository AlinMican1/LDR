"use client";
import { useEffect } from "react";

import { useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import InputField from "@/components/atoms/inputField";
import { MessageFetchData } from "@/lib/messageFetchData";

interface MessageProps {
  messageText: string;
  timestamp: Date;
  isRead: boolean;
  sender: {
    username: string;
    avatarURL: string | null;
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
  const roomId = "6724e10eb0cf5d4b9eebd037";
  const fetchInitialMessages = async () => {
    const { username, avatar, messages } = await MessageFetchData(roomId);
    const enrichedMessages = messages.map((msg: any) => ({
      ...msg,
      sender: {
        username, // Assuming username is fetched for every message
        avatarURL: avatar, // Assuming avatar is fetched for every message
      },
    }));
    setTotalMessages({ messages: enrichedMessages });
  };
  useEffect(() => {
    fetchInitialMessages();
  }, [roomId]);
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

  const { data: session } = useSession();

  const messageData = {
    email: session?.user.email,
    message,
  };
  const sendMessage = async () => {
    try {
      const response = await axios.post("api/message", messageData);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button onClick={sendMessage}>Send</button>

      {totalMessages.messages.map((msg, index) => (
        <div key={index}>
          {/* Optionally show sender/receiver images */}
          {/* {msg.senderImage && <img src={msg.senderImage} alt="Sender" />}
          {msg.receiverImage && <img src={msg.receiverImage} alt="Receiver" />} */}
          <p>{msg.sender.username}</p>
          <p>{msg.messageText}</p>
        </div>
      ))}
    </div>
  );
};
export default Chat;
