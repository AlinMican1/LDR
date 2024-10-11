import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./request.css";
import { AcceptLoverRequestButton } from "../atoms/customButton";

interface UserRequest {
  _id: string;
  username: string;
  avatarURL: string;
}

const Request = () => {
  const { data: session } = useSession();
  const [requestData, setRequestData] = useState<UserRequest | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [avatar, setAvatar] = useState("");
  //Set the according buttons
  const [test, setTest] = useState("");
  const [accept, setAccept] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      if (session?.user?.email) {
        try {
          const userResponse = await axios.get(
            `/api/users/matchrequest/${encodeURIComponent(
              session.user.loverTag
            )}`
          );
          const { request } = userResponse.data;
          if (!request) {
            return;
          }
          if (request.to) {
            setRequestData(request.to);
            setName(request.to?.username || ""); // Check for undefined
            setAvatar(request.to?.avatarURL || ""); // Check for undefined
            setTitle("Match Sent!");
          } else if (request.from) {
            // Add a check for `request.from`
            setRequestData(request.from); // Save the full user object for 'from'
            setAccept(true);
            setName(request.from?.username || ""); // Check for undefined
            setAvatar(request.from?.avatarURL || ""); // Check for undefined
            setTitle("Match Received!");
          }
        } catch (error) {
          console.error("Error fetching user requests:", error);
        }
      }
    };

    // Only fetch the avatar if it’s not already in the session

    fetchRequest();
  }, [session]);

  return (
    <div>
      {/* <h1>Match Request Data</h1> */}
      {/* Render the request data if it exists */}
      {requestData && session ? (
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
          <p>{test}</p>
          <div>
            {accept ? (
              <div className="subContentContainerRow">
                {/* <p>Reject</p> <p>{requestData._id}</p> */}
                <AcceptLoverRequestButton senderId={requestData._id} />
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
