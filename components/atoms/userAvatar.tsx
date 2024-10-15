"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import "./userAvatar.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface UserData {
  user?: {
    avatarURL: string; // User's avatar
  };
  lover?: {
    avatarURL: string; // Lover's avatar
  };
}

const UserAvatar = () => {
  const { data: session } = useSession();
  const [avatarPic, setAvatarUrl] = useState<string | null>(null);
  const [loverPic, setLoverAvatarURL] = useState<string | null>(null);

  // Helper function to fetch user data
  const fetchUserData = async (url: string): Promise<UserData> => {
    try {
      const response = await axios.get<UserData>(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return {}; // Return an empty object in case of error
    }
  };

  useEffect(() => {
    if (!session?.user?.email) return;

    const { email } = session.user as {
      email: string;
    };

    const fetchData = async () => {
      const avatarURLRequest = fetchUserData(`/api/users/${email}`);

      // Fetch both avatar and lover avatar concurrently
      const [avatarData] = await Promise.all([avatarURLRequest]);
      //Update states after both requests are complete
      if (avatarData.user?.avatarURL) setAvatarUrl(avatarData.user?.avatarURL);
      if (avatarData.lover?.avatarURL) {
        setLoverAvatarURL(avatarData.lover?.avatarURL);
      } else {
        setLoverAvatarURL(null); // Ensure loverPic is null if there's no lover
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return <p>Loading...</p>; // Or some other fallback when the session isn't ready
  }

  return (
    <div className="avatarsContainer">
      {avatarPic && (
        <Image
          className="avatarImage"
          width={200}
          height={200}
          src={avatarPic}
          alt="User Avatar"
        />
      )}

      {loverPic && (
        <div>
          <Image
            className="avatarImage loverAvatar"
            width={200}
            height={200}
            src={loverPic}
            alt="Lover Avatar"
          />
          <div className="heart">
            <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
