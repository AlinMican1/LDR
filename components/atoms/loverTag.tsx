"use client";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useSession } from "next-auth/react";
const LoverTag = () => {
  const { data: session } = useSession();
  const [textToCopy, setTextToCopy] = useState(""); // The text you want to copy
  const [copyStatus, setCopyStatus] = useState(false);

  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
  };
  return (
    <div>
      <p>{session?.user.loverTag}</p>
      <CopyToClipboard
        text={session?.user.loverTag as string}
        onCopy={onCopyText}
      >
        <button>Copy to Clipboard</button>
      </CopyToClipboard>
      {copyStatus && <p>Text copied to clipboard!</p>}
    </div>
  );
};
export default LoverTag;
