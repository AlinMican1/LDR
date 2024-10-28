"use client";
import { useEffect } from "react";

import { useState } from "react";
import PusherClient from "@/lib/pusherClient";
import axios from "axios";
import { useSession } from "next-auth/react";
import InputField from "@/components/atoms/inputField";
import { MessageFetchData } from "@/lib/messageFetchData";

interface messageProps {
  senderImage: string | null;
  receiverImage: string | null;
  message: string;
  username: string;
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [totalMessages, setTotalMessages] = useState<messageProps[]>([]);

  useEffect(() => {
    const channel = PusherClient.subscribe("chat");
    channel.bind("send-chat", function (data: messageProps) {
      // const parsedMessage = JSON.parse(data.message);
      setTotalMessages((prev) => [...prev, data]);
    });
    return () => {
      PusherClient.unsubscribe("chat");
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

  //Testing
  // const [oldmessage, setOldMessage] = useState();
  // const { messages } = MessageFetchData();
  // console.log(messages);

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button onClick={sendMessage}>Send</button>
      {totalMessages.map((msg, index) => (
        <div key={index}>
          {/* Optionally show sender/receiver images */}
          {msg.senderImage && <img src={msg.senderImage} alt="Sender" />}
          {msg.receiverImage && <img src={msg.receiverImage} alt="Receiver" />}
          <p>{msg.username}</p>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
};
export default Chat;
