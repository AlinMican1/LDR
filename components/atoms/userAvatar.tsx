import { useSession } from "next-auth/react";
import Image from "next/image";
import "./userAvatar.css";

const UserAvatar = () => {
  const { data: session } = useSession();
  return (
    <div>
      {!session?.user.avatarURL ? (
        <h1>BYE</h1>
      ) : (
        <Image
          className="avatarImage"
          width={200}
          height={200}
          src={session?.user.avatarURL}
          alt="nothing"
        />
      )}
    </div>
  );
};
export default UserAvatar;
