import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Message {
  _id: string;
  messageText: string;
  timestamp: Date;
  isRead: boolean;
  sender: {
    username: string;
    avatarURL: string | null;
    _id: string;
  };
}

interface MessageReturnProps {
  avatar: string | null;
  username: string | null;
  currentUser_id: string | null;
  messages: Message[];
}

export const MessageFetchData = async (
  roomId: string,
  userEmail: string | undefined
): Promise<MessageReturnProps> => {
  if (!userEmail || !roomId)
    return { currentUser_id: null, avatar: null, username: null, messages: [] };

  try {
    const { data } = await axios.get(`/api/message/${roomId}`);
    const userMessages = data.message;

    return {
      avatar: userMessages[0]?.sender?.avatarURL ?? null,
      username: userMessages[0]?.sender?.username ?? null,
      currentUser_id: userMessages[0]?.sender?._id ?? null,
      messages: userMessages,
    };
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return { currentUser_id: null, avatar: null, username: null, messages: [] };
  }
};
