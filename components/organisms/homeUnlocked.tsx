import { userFetchData } from "@/lib/userFetchData";
import SetAndDisplayMeet from "./setAndDisplayMeet";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { socket } from "@/lib/clientSocket";
import UserAvatar from "../atoms/userAvatar";
import "./homeUnlocked.css";

const HomeUnlocked = () => {
  const { user, lover } = userFetchData();
  const [meetData, setMeetData] = useState("");
  const [addedDate, setAddedDate] = useState(false);
  const pressed = () => {
    setAddedDate(!addedDate);
  };

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
      setMeetData(data);
    });
  }, [socket, pressed]);
  return (
    <div className="avatarAndMeetDate">
      <UserAvatar avatarPic={user?.avatarURL} loverPic={lover?.avatarURL} />
      <SetAndDisplayMeet
        meetDate={meetData || user?.meetDate}
        addDate={pressed}
      />
    </div>
  );
};
export default HomeUnlocked;
