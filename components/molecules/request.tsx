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

const Request = () => {
  const { requestData, name, title, avatar, accept, paragraph, isLoading } =
    userFetchRequest();
  const { data: session } = useSession();
  const [addLover, setAddLover] = useState({
    sender: "",
    receiver: "",
  });

  // Loading state for the request
  const [loading, setLoading] = useState(true);
  // Add a delay state to simulate waiting for the data
  const [delayOver, setDelayOver] = useState(false);

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
            window.location.reload();
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

  // Simulate a delay (e.g., 1 second) before rendering
  // useEffect(() => {
  //   const fetchTimeout = setTimeout(() => {
  //     setDelayOver(true); // Delay is over after 1 second
  //   }, 1000); // 1 second delay

  //   return () => clearTimeout(fetchTimeout); // Cleanup timeout if the component unmounts
  // }, []);

  // Update loading state based on requestData fetch
  useEffect(() => {
    if (requestData !== undefined) {
      setLoading(false); // Stop loading when requestData is fetched
    }
  }, [requestData]);

  return (
    <div>
      {/* Show loading state at the very top */}
      {isLoading ? (
        <LoadingSkeleton1 /> // Show a loading state until delay is over and requestData is fetched
      ) : requestData && session ? (
        <RequestCard>
          <h1 className="requestCardTitle">{title}</h1>
          <p className="inter-font">{paragraph}</p>

          <Image
            className="avatarLover"
            src={avatar}
            width={200}
            height={200}
            alt="hi"
          />

          <h2 className="requestCardName">{name}</h2>

          <div>
            {accept ? (
              <div>
                {/* <p>New lover request received!</p> */}
                <AcceptLoverRequestButton senderId={requestData._id} />
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
