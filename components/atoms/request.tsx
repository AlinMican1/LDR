import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Request = () => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState("");
  const [deliver, setDeliver] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      if (session?.user?.email) {
        try {
          const userResponse = await axios.get(
            `/api/users/matchrequest/${encodeURIComponent(
              session.user.loverTag
            )}`
          );
          const { request } = userResponse.data;
          if (request.to) {
            setRequestData(request.to);
            setDeliver("To:");
          } else {
            setRequestData(request.from);
            setDeliver("From:");
          }
        } catch (error) {
          console.error("Error fetching user requests:", error);
        }
      }
    };

    // Only fetch the avatar if it’s not already in the session

    fetchAvatar();

    // else {
    //   setAvatarUrl(session.user.avatarURL);
    // }
  }, [session]);

  return (
    <div>
      <h1>Match Request Data</h1>
      {/* Render the request data if it exists */}
      {requestData ? (
        <div>
          <p>
            <strong>{deliver}</strong> {requestData}
          </p>
          {/* <p>
            <strong>To:</strong> {requestData}
          </p>
          <p>
            <strong>Status:</strong> {requestData}
          </p> */}
        </div>
      ) : (
        <p>Loading request data...</p>
      )}
    </div>
  );
};
export default Request;
