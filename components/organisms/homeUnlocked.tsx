import { userFetchData } from "@/lib/userFetchData";
import SetAndDisplayMeet from "./setAndDisplayMeet";
import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
import { useSession } from "next-auth/react";
const HomeUnlocked = () => {
  const { data: session } = useSession();
  const { user, refetch } = userFetchData();
  const [socket, setSocket] = useState(() => getSocket());
  const [test1, setTest] = useState("");
  const [time, setTime] = useState(new Date());

  const [pressedFlag, setPressedFlag] = useState(false);
  const pressed = () => {
    setPressedFlag((prev) => !prev);
  };

  useEffect(() => {
    // if (user?.connection) {
    //   socket.emit("join_via_connectionID", {
    //     connectionId: user.connection,
    //   });
    //   console.log("Client connection ID:", user.connection);
    // }
    if (session?.user.id) {
      socket.emit("join_via_connectionID", {
        connectionId: session?.user.id,
      });
      console.log("Client connection ID:", session?.user.id);
    }

    socket.connect();
    socket.on("display_meetDate", (data) => {
      console.log("hi", data);
      setTest(data);
    });

    // const interval = setInterval(() => {
    //   setTime(new Date());
    // }, 1000);

    // return () => clearInterval(interval);

    return () => {
      socket.off("display_meetDate");
      socket.disconnect();
    };
  }, [socket, session]);

  console.log(test1);
  return (
    <div>
      <SetAndDisplayMeet meetDate={test1} test={pressed} />
    </div>
  );
};
export default HomeUnlocked;
