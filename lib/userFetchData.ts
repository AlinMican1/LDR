import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  username: string;
  avatarURL: string;
  meetDate: string | null;
}

interface Lover {
  _id: string;
  username: string;
  avatarURL: string;
}

interface UserFetchDataResult {
  error: string | null;
  lover: Lover | null;
  user: User | null;
  isLoading: boolean;
}

export const userFetchData = (): UserFetchDataResult => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [lover, setLover] = useState<Lover | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`/api/users/${session.user.email}`);
        const { user, lover: loverData } = data;

        if (user) {
          setUser({
            _id: user._id,
            username: user.username,
            avatarURL: user.avatarURL,
            meetDate: user.meetDate,
          });
        }

        if (loverData) {
          setLover({
            _id: loverData._id,
            username: loverData.username,
            avatarURL: loverData.avatarURL,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      } finally {
        setIsLoading(false); // Set loading to false once data has been fetched
      }
    };

    fetchUserData();
  }, [session]);

  return { user, lover, error, isLoading };
};
