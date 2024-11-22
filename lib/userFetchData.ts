import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

interface User {
  _id: string;
  username: string;
  avatarURL: string;
  meetDate: string | null;
  messageRoomId: string;
  messageLastRead: Date;
}

interface Lover {
  _id: string;
  username: string;
  avatarURL: string;
}

interface UserFetchDataResult {
  errorMsg: string | null;
  lover: Lover | null;
  user: User | null;
  isLoading: boolean;
}

export const userFetchData = (): UserFetchDataResult => {
  const { data: session, status: sessionStatus } = useSession();
  // const [user, setUser] = useState<User | null>(null);
  // const [lover, setLover] = useState<Lover | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (session?.user?.email) {
      const { data } = await axios.get(`/api/users/${session.user.email}`);
      return data;
    }
    return { user: null, lover: null };
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", , session?.user?.email],
    queryFn: fetchData,
    enabled: sessionStatus === "authenticated" && !!session?.user?.email, // Only enable query if email exists in the session
    staleTime: 1000 * 60 * 5,
  });
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (!session?.user?.email) {
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const { data } = await axios.get(`/api/users/${session.user.email}`);
  //       const { user, lover: loverData } = data;

  //       if (user) {
  //         setUser({
  //           _id: user._id,
  //           username: user.username,
  //           avatarURL: user.avatarURL,
  //           meetDate: user.meetDate,
  //           messageRoomId: user.messageRooms[0],
  //           messageLastRead: user.messageLastRead,
  //         });
  //       }

  //       if (loverData) {
  //         setLover({
  //           _id: loverData._id,
  //           username: loverData.username,
  //           avatarURL: loverData.avatarURL,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       setError("Failed to fetch user data.");
  //     } finally {
  //       setIsLoading(false); // Set loading to false once data has been fetched
  //     }
  //   };

  //   fetchUserData();
  // }, [session]);
  //Extract Data
  const userData = data?.user;
  const loverData = data?.lover;

  //Construct Objects
  const user: User | null = userData
    ? {
        _id: userData._id,
        username: userData.username,
        avatarURL: userData.avatarURL,
        meetDate: userData.meetDate || null,
        messageRoomId: userData.messageRooms?.[0] || "",
        messageLastRead: new Date(userData.messageLastRead),
      }
    : null;

  const lover: Lover | null = loverData
    ? {
        _id: loverData._id,
        username: loverData.username,
        avatarURL: loverData.avatarURL,
      }
    : null;

  const errorMsg = error ? "Failed to fetch user data." : null;
  return { user, lover, errorMsg, isLoading };
};
