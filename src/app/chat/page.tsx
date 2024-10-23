"use client";
import { useEffect } from "react";

import { useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import InputField from "@/components/atoms/inputField";

interface messageProps {
  senderImage: string | null;
  receiverImage: string | null;
  message: string;
}
const Chat = () => {
  const [message, setMessage] = useState("");
  const [totalMessages, setTotalMessages] = useState<messageProps[]>([]);
  var pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
    cluster: "eu",
  });

  var channel = pusher.subscribe("chat");
  channel.bind("send-chat", function (data: any) {
    const parsedMessage = JSON.parse(data.message);
    setTotalMessages((prev) => [...prev, parsedMessage]);
  });

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
      {totalMessages.map((msg, index) => (
        <div key={index}>
          {/* Optionally show sender/receiver images */}
          {msg.senderImage && <img src={msg.senderImage} alt="Sender" />}
          {msg.receiverImage && <img src={msg.receiverImage} alt="Receiver" />}
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
};
export default Chat;
