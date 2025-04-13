import { useState, useEffect, Suspense } from "react";
import UserAvatar from "../atoms/userAvatar";
import { userFetchData } from "@/lib/userFetchData";
import HomeLocked from "../organisms/homeLocked";
import HomeUnlocked from "../organisms/homeUnlocked";
import UploadComponent from "../atoms/uploadAvatar";
import PickDateParent from "../molecules/pickDateParent";
import Modal from "../molecules/modal";
// import VibrateAction from "../atoms/vibrateAction";
const Home = () => {
  const { lover, isLoading, user } = userFetchData(); // Get loading state

  // Show a loading indicator until the data is fully fetched
  // if (isLoading) {
  //   return <div>afDAFSHAH</div>; // Replace with a loading spinner or any indicator you prefer
  // }

  return (
    <div className="ContentContainer">
      {/* <UploadComponent /> */}
      {/* {isLoading ? (
        <p>ARFARFARF.</p> // Show this when data is still loading
      ) : ( */}
      {/* <VibrateAction /> */}
      <div>
        <Suspense fallback={<p>Loading feed...</p>}>
          {/* <UserAvatar avatarPic={user?.avatarURL} loverPic={lover?.avatarURL} /> */}
          {lover ? <HomeUnlocked /> : <HomeLocked />}
        </Suspense>
      </div>
      {/* )} */}
    </div>
  );
};

export default Home;
