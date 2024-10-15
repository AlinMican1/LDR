import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface UserRequest {
  _id: string;
  username: string;
  avatarURL: string;
}

interface UserFetchRequestResult {
  requestData: UserRequest | null;
  name: string;
  title: string;
  avatar: string;
  accept: boolean;
  error: string | null;
}

export const userFetchRequest = (): UserFetchRequestResult => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState<UserRequest | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (session?.user?.email) {
        try {
          const userResponse = await axios.get(
            `/api/users/${session.user.email}`
          );
          //   `/api/users/matchrequest/${encodeURIComponent(
          //     session.user.loverTag
          //   )}`
          // );
          const { user } = userResponse.data;

          if (!user.request) return;

          if (user.request.to) {
            setRequestData(user.request.to);
            setName(user.request.to?.username || "");
            setAvatar(user.request.to?.avatarURL || "");
            setTitle("Match Sent!");
          } else if (user.request.from) {
            setRequestData(user.request.from);
            setAccept(true);
            setName(user.request.from?.username || "");
            setAvatar(user.request.from?.avatarURL || "");
            setTitle("Match Received!");
          }
        } catch (error) {
          console.error("Error fetching user requests:", error);
          setError("Failed to fetch requests.");
        }
      }
    };

    fetchRequest();
  }, [session]);

  return { requestData, name, title, avatar, accept, error };
};
