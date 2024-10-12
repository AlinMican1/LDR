"use client";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSession } from "next-auth/react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./loverTag.css";
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
      <div className="subContentContainerRow">
        <div className="tagDisplay">
          <h3>{session?.user.loverTag}</h3>
        </div>
        <CopyToClipboard
          text={session?.user.loverTag as string}
          onCopy={onCopyText}
        >
          <button className="copyTextButton">
            <FontAwesomeIcon icon={faCopy} />
          </button>
        </CopyToClipboard>
      </div>
      {copyStatus && <p className="copiedText">Tag Copied!</p>}
    </div>
  );
};
export default LoverTag;
