import { userFetchData } from "@/lib/userFetchData";
import SetAndDisplayMeet from "./setAndDisplayMeet";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/clientSocket";
import UserAvatar from "../atoms/userAvatar";
import "./homeUnlocked.css";

const HomeUnlocked = () => {
  const { user, lover } = userFetchData();
  const [test1, setTest] = useState("");

  if (user) {
    socket.emit("join_via_connectionID", {
      connectionId: user.connection,
    });
    console.log("Client connection ID:", user.connection);
  }
  useEffect(() => {
    socket.connect();
    socket.on("display_meetDate", (data) => {
      console.log("hi", data);
      setTest(data);
    });
  }, [socket]);
  console.log(test1);
  console.log(user?.meetDate);
  return (
    <div className="avatarAndMeetDate">
      <UserAvatar avatarPic={user?.avatarURL} loverPic={lover?.avatarURL} />
      <SetAndDisplayMeet meetDate={test1 || user?.meetDate} />
    </div>
  );
};
export default HomeUnlocked;
