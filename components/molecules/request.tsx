"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import "./request.css";
import {
  AcceptLoverRequestButton,
  RejectLoverRequestButton,
} from "../atoms/customButton";
import RequestCard from "../atoms/requestCard";
import { userFetchRequest } from "@/lib/userFetchRequest";
import InputField from "../atoms/inputField";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import LoverTag from "../atoms/loverTag";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { LoadingSkeleton1 } from "../atoms/loadingSkeletons";
import { getSocket } from "@/app/socket";


const Request = () => {
  const { requestData, name, title, avatar, accept, paragraph, isLoading } =
    userFetchRequest();

  const { data: session } = useSession();
  const [addLover, setAddLover] = useState({
    sender: "",
    receiver: "",
  });

  //Real time fetching variables
 
  const [realTimeRequest, setRealTimeRequest] = useState(requestData);
  const [requestReceived, setRequestReceived] = useState(false);
  const [socket, setSocket] = useState(() => getSocket());

  // Error states
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mainError, setMainError] = useState(false);
  const [mainErrorMsg, setMainErrorMsg] = useState("");

  let addLoverError = false;

  const AddLover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addLover.receiver === addLover.sender) {
      setError(true);
      setErrorMsg("You can't add yourself silly!");
      addLoverError = true;
    } else {
      setError(false);
      setErrorMsg("");
      addLoverError = false;
    }

    let hasLover = false;
    if (!addLoverError) {
      const data = {
        senderLoverTag: addLover.sender,
        receiverLoverTag: addLover.receiver,
      };

      //CHECK IF USER ALREADY HAS LOVER
      try {
        const response = await axios.get(
          `/api/users/matchrequest/${encodeURIComponent(addLover.receiver)}`
        );
        if (response.status === 200) {
          hasLover = false;
        }
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          if (status === 403) {
            hasLover = true;
            setError(true);
            setErrorMsg("The user already has a lover!");
            setMainError(false);
            setMainErrorMsg("");
            return;
          } else {
            setMainError(true);
            setMainErrorMsg("An unexpected error occurred");
          }
        }
      }
      if (!hasLover) {
        try {
          
          const response = await axios.post("/api/users/matchrequest", data);
          if (response.status === 200) {
            setError(false);
            setErrorMsg("");
            setMainError(false);
            setMainErrorMsg("");
            // window.location.reload();
            socket.emit("send_lover_request", {
              senderEmail: session?.user.email, // Send sender's email
              receiverLoverTag: addLover.receiver,
              
            });
            socket.emit("test" , {
              loverTag: addLover.receiver
            });
          }
        } catch (error: any) {
          if (error.response) {
            const status = error.response.status;

            if (status === 403) {
              setError(true);
              setErrorMsg("The user already has an active request");
              setMainError(false);
              setMainErrorMsg("");
            } else if (status === 404) {
              setError(true);
              setErrorMsg("The user does not exist!");
              setMainError(false);
              setMainErrorMsg("");
            }
          } else {
            setMainError(true);
            setMainErrorMsg("An unexpected error occurred");
          }
        }
      }
    }
  };
  //Send request
  useEffect(() => {
    if (session?.user?.loverTag) {
      setAddLover((prev) => ({
        ...prev,
        sender: session.user.loverTag,
      }));
    }
  }, [session]);

 
  useEffect(() => {
    // Join room based on user's loverTag
    if (session?.user?.loverTag) {
      const loverTag = session.user.loverTag;
      // socket.connect();
      socket.emit("join_room_loverTag", loverTag);

      // Listen for real-time updates
      socket.on("receive_lover_request", (data) => {
        //Check if there is a sender and since we are use interface requestData, we have to declare it the same
        setRealTimeRequest({
          avatarURL: data.sender.avatarURL,
          username: data.sender.username,
          _id: data.sender._id,
        });
        if (data.sender) {
          setRequestReceived(true);
        }
        
      });
      socket.on("update_sender_request", (data) => {
        setRealTimeRequest({
          avatarURL: data.sender.request.to.avatarURL,
          username: data.sender.request.to.username,
          _id: data.sender.request.to._id,
        });
      
      });
      socket.on("lover_request_cancelled", () => {
        console.log("Lover request canceled:")
        setRealTimeRequest(null)
      })
      
    }
    return () => {
      socket.off("receive_lover_request");
      socket.off("update_sender_request");
      socket.off("lover_request_cancelled");
      socket.disconnect();
    };
  }, [AddLover,socket]);

  const activeRequest = realTimeRequest || requestData;

  return (
    <div>
      {/* Show loading state at the very top */}
      {isLoading ? (
        <LoadingSkeleton1 /> // Show a loading state until delay is over and requestData is fetched
      ) : activeRequest && session ? (
        <RequestCard>
          <h1 className="requestCardTitle">{title}</h1>
          <p className="inter-font">{paragraph}</p>

          <Image
            className="avatarLover"
            src={activeRequest.avatarURL}
            width={200}
            height={200}
            alt="hi"
          />

          <h2 className="requestCardName">{activeRequest.username}</h2>

          <div>
            {requestReceived || accept ? (
              <div>
                {/* <p>New lover request received!</p> */}
                <AcceptLoverRequestButton senderId={activeRequest._id} />
                <RejectLoverRequestButton
                  loverTag={session?.user.loverTag}
                  name="No, Remove Request"
                />
              </div>
            ) : (
              <div>
                <div className="line"></div>
                <RejectLoverRequestButton
                  loverTag={session?.user.loverTag}
                  name="Cancel Request"
                />
              </div>
            )}
          </div>
        </RequestCard>
      ) : (
        <div className="subContentContainer">
          <div className="brokenHeart">
            {<FontAwesomeIcon icon={faHeartBroken} />}
          </div>
          <h1 className={`${"titleLocked"} ${"roboto-font"}`}>
            Features are locked!
          </h1>
          <p className={`${"paragraphLocked"} ${"inter-font"}`}>
            To unlock the app to its full extent, add your significant other!
          </p>
          {requestData ? (
            <Request />
          ) : (
            <div>
              <InputField
                type="text"
                label="Add Lover"
                value={addLover.receiver}
                name="request"
                error={error}
                onChange={(e) =>
                  setAddLover({ ...addLover, receiver: e.target.value })
                }
                errorMsg={errorMsg}
                placeholder="Name#12345"
                icon={<FontAwesomeIcon icon={faHeart} />}
              />
              <button className="submitButton" onClick={AddLover}>
                Send Request!
              </button>
              {mainError && <p className="mainErrorMsg">{mainErrorMsg}</p>}
              <div className="line"></div>
              <div className="subContentContainerColumn">
                <h1 className={`${"titleLocked"} ${"roboto-font"}`}>
                  Give your tag instead?
                </h1>
                <LoverTag />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Request;
