import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const Request = () => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState("");
  const [deliver, setDeliver] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
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
          console.log(request);
          if (request.to) {
            setRequestData(request.to);
            setDeliver("To:");
            setName(request.to.username);
            setAvatar(request.to.avatarURL);
          } else {
            setRequestData(request.from); // Save the full user object for 'from'
            setDeliver("From:");
            setName(request.from.username); // Extract the username
            setAvatar(request.from.avatarURL);
          }
        } catch (error) {
          console.error("Error fetching user requests:", error);
        }
      }
    };

    // Only fetch the avatar if it’s not already in the session

    fetchAvatar();
  }, [session]);

  return (
    <div>
      <h1>Match Request Data</h1>
      {/* Render the request data if it exists */}
      {requestData ? (
        <div>
          <p>
            <strong>{deliver}</strong>
          </p>
          <p>{name}</p>
          <Image src={avatar} width={200} height={200} alt="hi" />
        </div>
      ) : (
        <p>No Request Yet!</p>
      )}
    </div>
  );
};
export default Request;
