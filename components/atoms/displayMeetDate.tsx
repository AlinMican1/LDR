import React, { useEffect, useState } from "react";
import { userFetchData } from "@/lib/userFetchData";
import "./displayMeetDate.css";
interface DisplayMeetDateProps {
  meetDate: string | null | undefined;
}
const DisplayMeetDate = ({ meetDate }: DisplayMeetDateProps) => {
  const { user, lover } = userFetchData();
  const [dateCounter, setDateCounter] = useState("");
  const [dayCounter, setDayCounter] = useState("");
  const [hourCounter, setHourCounter] = useState("");
  const [minCounter, setMinCounter] = useState("");
  const [secCounter, setSecCounter] = useState("");
  const meetDateCounter = ({ meetDate }: any) => {
    const currentTime = new Date().getTime();
    const meetTime = new Date(meetDate).getTime();
    let remainingTime = meetTime - currentTime;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const meetTime = new Date(meetDate as string).getTime();
      let remainingTime = meetTime - currentTime;

      if (remainingTime > 0) {
        // Convert remainingTime to days, hours, minutes, and seconds
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Set the remaining time in a readable format
        setDateCounter(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        setDayCounter(`${days}`);
        setHourCounter(`${hours}`);
        setMinCounter(`${minutes}`);
        setSecCounter(`${seconds}`);
      } else {
        setDateCounter("Time has passed!");
        clearInterval(interval); // Stop the interval if the time has passed
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [meetDate]);

  return (
    // <div className="ContentContainer">
    <div>
      {/* <p className="mainText">
        {user?.username} & {lover?.username}
      </p> */}
      <p className="mainText">Meet On {meetDate}</p>
      <div className={`${"contentContainerDates"} ${"roboto-font"} `}>
        <div className="counterBox">
          <span className={`${"dayText"} ${"inter-font"}`}>{dayCounter}</span>
          <p className="mainText">Day</p>
        </div>
        <div className="counterBox">
          <span className={`${"dayText"} ${"inter-font"}`}>{hourCounter}</span>
          <p className="mainText">Hour</p>
        </div>
        <div className="counterBox">
          <span className={`${"dayText"} ${"inter-font"}`}>{minCounter}</span>
          <p className="mainText">Min</p>
        </div>
        <div className="counterBox">
          <span className={`${"dayText"} ${"inter-font"}`}>{secCounter}</span>
          <p className="mainText">Sec</p>
        </div>

        {/* {meetDate} */}
      </div>
      {/* {meetDate} */}
    </div>
  );
};
{
  `${"error"} ${"inter-font"}`;
}

export default DisplayMeetDate;
