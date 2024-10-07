"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import "./userAvatar.css";
import axios from "axios";
import { useEffect, useState } from "react";

const UserAvatar = () => {
  const { data: session } = useSession();
  const [avatarPic, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (session?.user?.email) {
        try {
          const userResponse = await axios.get(
            `/api/users/${session.user.email}`
          );
          const { image } = userResponse.data;

          if (image) {
            setAvatarUrl(image);
          }
        } catch (error) {
          console.error("Error fetching user avatar:", error);
        }
      }
    };

    // Only fetch the avatar if it’s not already in the session
    if (!session?.user?.avatarURL) {
      fetchAvatar();
    } else {
      setAvatarUrl(session.user.avatarURL);
    }
  }, [session]);

  if (!session) {
    return <p>Loading...</p>; // Or some other fallback when the session isn't ready
  }

  return (
    <div>
      <p>{avatarPic}</p>
      {avatarPic ? (
        <Image
          className="avatarImage"
          width={200}
          height={200}
          src={avatarPic}
          alt="User Avatar"
        />
      ) : (
        <Image
          className="avatarImage"
          width={200}
          height={200}
          src="/default-avatar.png" // Provide a default avatar if nothing is available
          alt="User Avatar"
        />
      )}
    </div>
  );
};

export default UserAvatar;
