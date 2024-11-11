"use client";

import { useEffect, useRef, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import InputField from "@/components/atoms/inputField";
import { MessageFetchData } from "@/lib/messageFetchData";
import MessageBox from "@/components/atoms/messageBox";
import Link from "next/link";
import { userFetchData } from "@/lib/userFetchData";

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

  useEffect(() => {
    if (user?.messageRoomId) {
      pusherClient.subscribe(user.messageRoomId);

      const handleMessage = (data: MessageProps) => {
        setTotalMessages((prevMessage) => ({
          ...prevMessage,
          messages: [...prevMessage.messages, data],
        }));
      };

      pusherClient.bind("new-message", handleMessage);

      return () => {
        pusherClient.unbind("new-message", handleMessage);
        pusherClient.unsubscribe(user.messageRoomId);
      };
    }
  }, [user?.messageRoomId]);

  const sendMessage = async () => {
    try {
      await axios.post("api/message", {
        email: session?.user.email,
        message,
        roomId: user?.messageRoomId,
      });
      setMessage(""); // Clear input field after sending
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalMessages]);

  return (
    <div>
      <div>
        <Link className="textLink" href={"/"}>
          GO TO DASHBOARD
        </Link>
      </div>
      <div className="chatContainer">
        {totalMessages.messages.map((msg, index) => {
          // const previousSenderId =
          //   index > 0 ? totalMessages.messages[index - 1].sender._id : null;

          return (
            <MessageBox
              key={index}
              message={msg}
              currentUser_id={session?.user?.id}
              // previousSessionSenderId={previousSenderId as string} // Pass previous sender ID
            />
          );
        })}
        <div ref={bottomChatRef} />
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
