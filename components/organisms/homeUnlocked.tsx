"use client";
import { userFetchData } from "@/lib/userFetchData";
import SetAndDisplayMeet from "./setAndDisplayMeet";
import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
const HomeUnlocked = () => {
  const { user } = userFetchData();
  const [socket, setSocket] = useState(() => getSocket());
  const [test, setTest] = useState("");
  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit("join_via_connectionID", {
        connectionId: user.connection,
      });
      socket.on("display_meetDate", async (data) => {
        setTest(data.meetDate);
      });
    }

    return () => {
      socket.off("display_meetDate");
      socket.disconnect();
    };
  }, [socket, test]);
  console.log(test);
  return (
    <div>
      <p>{test}</p>
      <SetAndDisplayMeet meetDate={test} />
    </div>
  );
};
export default HomeUnlocked;
