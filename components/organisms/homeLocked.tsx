"use client";
import "./homeLocked.css";
import UserAvatar from "../atoms/userAvatar";
import { useSession } from "next-auth/react";
import LoverTag from "../atoms/loverTag";
import { useEffect, useState } from "react";
import InputField from "../atoms/inputField";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Request from "../molecules/request";
import { useFetchRequest } from "@/lib/userFetchRequest";

const HomeLocked = () => {
  const { data: session } = useSession();
  const [addLover, setAddLover] = useState({
    sender: "",
    receiver: "",
  });
  useEffect(() => {
    if (session?.user?.loverTag) {
      setAddLover((prev) => ({
        ...prev,
        sender: session.user.loverTag,
      }));
    }
  }, [session]);
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
    if (addLoverError === false) {
      const data = {
        senderLoverTag: addLover.sender,
        receiverLoverTag: addLover.receiver,
      };
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
            setMainError(true);
            setMainErrorMsg("The user already has an active request");
          }
          if (status === 404) {
            setError(true);
            setErrorMsg("The user does not exist!");
          }
        } else {
          // Handle any other errors
          setMainError(true);
          setMainErrorMsg("An unexpected error occurred");
        }
      }
    }
  };

  const { requestData } = useFetchRequest();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (requestData) {
      setLoading(false); // Set loading to false once data is fetched
    }
  }, [requestData]);
  return (
    <div className="ContentContainer">
      <UserAvatar />

      <div className="subContentContainer">
        <h2>Features are locked!</h2>
        <p>
          To unlock the app to it's full extend add your significant other!{" "}
        </p>
        {loading ? ( // Show loading indicator until data is fetched
          <div>Loading...</div>
        ) : requestData ? (
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
            <button
              className="submitButton"
              style={{ borderRadius: "5px", marginTop: "2px", width: "80vw" }}
              onClick={AddLover}
            >
              Send Request!
            </button>
            {mainError && <p className="mainErrorMsg">{mainErrorMsg}</p>}
            <span className="line"></span>
            <div
              className="subContentContainerColumn"
              style={{ backgroundColor: "transparent" }}
            >
              <h3>Give your tag instead?</h3>
              <LoverTag />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeLocked;
