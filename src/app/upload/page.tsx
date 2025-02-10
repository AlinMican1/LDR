import React from "react";

const Upload = () => {
  const sessionId = crypto.randomUUID();
  const QrCode = `https://api.qrserver.com/v1/create-qr-code/?size=84x84&data=http://localhost:3000/upload/${sessionId}`;

  return (
    <div>
      UPLOAD PAGE <img src={QrCode} /> {sessionId}
    </div>
  );
};

export default Upload;
