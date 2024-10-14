import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface UserRequest {
  _id: string;
  username: string;
  avatarURL: string;
}

interface UseFetchRequestResult {
  requestData: UserRequest | null;
  name: string;
  title: string;
  avatar: string;
  accept: boolean;
  error: string | null;
}

export const useFetchRequest = (): UseFetchRequestResult => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState<UserRequest | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      if (session?.user?.loverTag) {
        try {
          const userResponse = await axios.get(
            `/api/users/matchrequest/${encodeURIComponent(
              session.user.loverTag
            )}`
          );
          const { request } = userResponse.data;
          if (!request) return;

          if (request.to) {
            setRequestData(request.to);
            setName(request.to?.username || "");
            setAvatar(request.to?.avatarURL || "");
            setTitle("Match Sent!");
          } else if (request.from) {
            setRequestData(request.from);
            setAccept(true);
            setName(request.from?.username || "");
            setAvatar(request.from?.avatarURL || "");
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
