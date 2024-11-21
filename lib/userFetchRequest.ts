import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
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
  paragraph?: string;
  errorMsg: string | null;
  isLoading: boolean;
}

export const userFetchRequest = (): UserFetchRequestResult => {
  const { data: session, status: sessionStatus } = useSession();
  const fetchData = async () => {
    if (session?.user?.email) {
      const { data } = await axios.get(`/api/users/${session.user.email}`);
      return data;
    }
    return { user: { request: null } };
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", , session?.user?.email],
    queryFn: fetchData,
    enabled: sessionStatus === "authenticated" && !!session?.user?.email, // Only enable query if email exists in the session
    staleTime: 1000 * 60 * 5,
  });

  const request = data?.user?.request;
  const requestData = request?.to || request?.from || null;
  const name = requestData?.username || "";
  const avatar = requestData?.avatarURL || "";
  const title = request?.to ? "Match Sent!" : "Match Received!";
  const paragraph = request?.to
    ? "Now you have to wait until they accept your request!"
    : "How exciting you received a request!";
  const errorMsg = error
    ? "Failed to fetch requests."
    : !request
    ? "No requests found."
    : null;

  return {
    requestData,
    name,
    title,
    avatar,
    accept: !!request?.from,
    errorMsg,
    paragraph,
    isLoading: sessionStatus === "loading" || isLoading,
  };
};
