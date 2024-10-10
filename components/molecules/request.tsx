import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./request.css";

const Request = () => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");
  //Set the according buttons

  const [accept, setAccept] = useState(false);

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

            setName(request.to.username);
            setAvatar(request.to.avatarURL);
            setTitle("Match Sent!");
          } else {
            setRequestData(request.from); // Save the full user object for 'from'
            setAccept(true);
            setName(request.from.username); // Extract the username
            setAvatar(request.from.avatarURL);
            setTitle("Match Received!");
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
      {/* <h1>Match Request Data</h1> */}
      {/* Render the request data if it exists */}
      {requestData ? (
        <div className="subContentContainerColumn">
          <h1>{title}</h1>
          <Image
            className="avatarFriend"
            src={avatar}
            width={200}
            height={200}
            alt="hi"
          />

          <p>{name}</p>
          <div>
            {accept ? (
              <div className="subContentContainerRow">
                <p>Reject</p> <p>Accept</p>
              </div>
            ) : (
              <p>Cancel Request</p>
            )}
          </div>
        </div>
      ) : (
        <p>No Request Yet!</p>
      )}
    </div>
  );
};
export default Request;
