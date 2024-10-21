import { useState, useEffect } from "react";
import UserAvatar from "../atoms/userAvatar";
import { userFetchData } from "@/lib/userFetchData";
import HomeLocked from "../organisms/homeLocked";
import HomeUnlocked from "../organisms/homeUnlocked";

const Home = () => {
  const { lover, isLoading, user } = userFetchData(); // Get loading state

  // Show a loading indicator until the data is fully fetched
  if (isLoading) {
    return <div>Loading...</div>; // Replace with a loading spinner or any indicator you prefer
  }

  // Render content based on whether there's a lover or not
  return (
    <div className="ContentContainer">
      <UserAvatar avatarPic={user?.avatarURL} loverPic={lover?.avatarURL} />
      {lover ? <HomeUnlocked /> : <HomeLocked />}
    </div>
  );
};

export default Home;
