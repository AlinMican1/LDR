import React from "react";
import UploadComponent from "../atoms/uploadAvatar";
import { GenerateQR } from "@/lib/generateQR";
import { isMobile } from "react-device-detect";

const UploadImage = () => {
  return (
    <div className="ContentContainer">
      {isMobile ? (
        <UploadComponent />
      ) : (
        <div className={`${"roboto-font"} ${"subContentContainerColumn"}`}>
          <p>Scan to upload a picture.</p>
          <img src={GenerateQR()} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
