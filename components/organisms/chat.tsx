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
    console.log("hh", Date());
    try {
      await axios.post("api/message", {
        email: session?.user.email,
        message,
        messageTime: Date(),
        roomId: user?.messageRoomId,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    bottomChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalMessages]);

  return (
    <div className="chatLayout">
      <div className="DashboardContainer">
        <Link className="Dashboard" href={"/"}>
          <FontAwesomeIcon icon={faAngleLeft} />
          DashBoard
        </Link>
      </div>
      <div className="chatContainer">
        {totalMessages.messages.map((msg, index) => {
          const currMsgDate = msg.timestamp
            ? format(new Date(msg.timestamp), "yyyy-MM-dd")
            : null;
          const prevMsgDate =
            index > 0 && totalMessages.messages[index - 1].timestamp
              ? format(
                  new Date(totalMessages.messages[index - 1].timestamp),
                  "yyyy-MM-dd"
                )
              : null;

          let showDate = false;
          if (currMsgDate != prevMsgDate) {
            showDate = true;
          } else {
            showDate = false;
          }

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
