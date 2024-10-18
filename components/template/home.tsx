import { useState, useEffect } from "react";
import UserAvatar from "../atoms/userAvatar";
import { userFetchData } from "@/lib/userFetchData";
import HomeLocked from "../organisms/homeLocked";
import HomeUnlocked from "../organisms/homeUnlocked";

const Home = () => {
  const { lover, isLoading } = userFetchData(); // Get loading state

  // Use a timeout to delay the rendering logic
  const [delayComplete, setDelayComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayComplete(true);
    }, 500); // 500ms delay to allow data fetching

    return () => clearTimeout(timer);
  }, []);

  // Show loading indicator or nothing until the data is loaded
  if (isLoading || !delayComplete) {
    return <div>Loading...</div>; // Replace with a loader or empty state if you prefer
  }

  return (
    <div className="ContentContainer">
      <UserAvatar />
      {lover ? <HomeUnlocked /> : <HomeLocked />}
    </div>
  );
};

export default Home;
