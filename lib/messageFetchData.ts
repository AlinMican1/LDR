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

// export const MessageFetchData = (roomId: string): MessageReturnProps => {
//   const { data: session } = useSession();
//   const [data, setData] = useState<MessageReturnProps>({
//     avatar: null,
//     username: null,
//     messages: [],
//   });

//   useEffect(() => {
//     const fetchMessageData = async () => {
//       if (!session?.user?.email || !roomId) {
//         return;
//       }

//       try {
//         const { data } = await axios.get(`/api/message/${roomId}`);
//         const userMessages = data.message;
//         // console.log(userMessages);
//         if (userMessages) {
//           setData({
//             avatar: userMessages[0]?.sender?.avatarURL ?? null,
//             username: userMessages[0]?.sender?.username ?? null,
//             messages: userMessages,
//           });
//         }
//       } catch (error: any) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessageData();
//   }, [session, roomId]); // Add roomId to dependencies

//   return data;
// };
export const MessageFetchData = async (
  roomId: string,
  userEmail: string | undefined
): Promise<MessageReturnProps> => {
  if (!userEmail || !roomId)
    return { currentUser_id: null, avatar: null, username: null, messages: [] };
  console.log(roomId);
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
