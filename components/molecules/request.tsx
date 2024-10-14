import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./request.css";
import {
  AcceptLoverRequestButton,
  RejectLoverRequestButton,
} from "../atoms/customButton";
import RequestCard from "../atoms/requestCard";
import { useFetchRequest } from "@/lib/userFetchRequest";
interface UserRequest {
  _id: string;
  username: string;
  avatarURL: string;
}

const Request = () => {
  const { requestData, name, title, avatar, accept } = useFetchRequest();
  const { data: session } = useSession();
  return (
    <div>
      {requestData && session ? (
        <RequestCard>
          <h1>{title}</h1>

          <Image
            className="avatarLover"
            src={avatar}
            width={200}
            height={200}
            alt="hi"
          />

          <h2>{name}</h2>

          <div>
            {accept ? (
              <div>
                {/* <p>New lover request received!</p> */}
                <AcceptLoverRequestButton senderId={requestData._id} />
                <RejectLoverRequestButton
                  loverTag={session?.user.loverTag}
                  name="No, Remove Request"
                />
              </div>
            ) : (
              <div>
                <RejectLoverRequestButton
                  loverTag={session?.user.loverTag}
                  name="Cancel Request"
                />
              </div>
            )}
          </div>
        </RequestCard>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Request;
