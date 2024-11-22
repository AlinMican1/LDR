import Image from "next/image";
import "./userAvatar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

interface UserAvatarProps {
  avatarPic: string | undefined; // User's avatar
  loverPic: string | undefined; // Lover's avatar
}

const UserAvatar = ({ avatarPic, loverPic }: UserAvatarProps) => {
  // If no session or avatar is available, show a fallback or nothing
  // if (!avatarPic) {
  //   return <p>Loading avatar...</p>; // Placeholder when no avatar yet
  // }

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
            <FontAwesomeIcon icon={faHeart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
