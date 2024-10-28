"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface MessageReturnProps {
  avatar: string | null;
  username: string | null;
  messages: Message[];
}

interface Message {
  _id: string;
  messageText: string;
  timestamp: Date;
  isRead: boolean;
}

export const MessageFetchData = (): MessageReturnProps => {
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessageData = async () => {
      if (!session?.user?.email) {
        return;
      }

      try {
        const { data } = await axios.get(`/api/message/${session.user.email}`);
        const { user } = data;
        const userMessages = user.messages;
        if (messages) {
          setAvatar(user.avatarURL);
          setUsername(user.username);
          setMessages(userMessages);
        }
      } catch (error: any) {}
    };
    fetchMessageData();
  }, [session]);
  return { avatar, username, messages };
};
