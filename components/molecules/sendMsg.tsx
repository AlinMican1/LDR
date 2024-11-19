import React, { ChangeEvent } from "react";
import "./sendMsg.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
interface SendMsgProps {
  type: "text" | "number" | "email" | "password";
  value: string | number;
  name: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
}

const SendMsg = ({
  type,
  value,
  name,
  placeholder,
  onChange,
  sendMessage,
}: SendMsgProps) => {
  return (
    <div className="sendMsgContainer">
      <input
        className="sendMsgInput"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      ></input>

      <button className="sendMsgButton" onClick={sendMessage}>
        <FontAwesomeIcon icon={faArrowCircleUp} />
      </button>
    </div>
  );
};

export default SendMsg;
