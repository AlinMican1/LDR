import React from "react";
import { isMobile } from "react-device-detect";
import UploadImage from "@/components/molecules/uploadImage";
const Upload = () => {
  return (
    <div>
      {/* UPLOAD PAGE <img src={QrCode} /> {sessionId} */}
      <UploadImage />
    </div>
  );
};

export default Upload;
