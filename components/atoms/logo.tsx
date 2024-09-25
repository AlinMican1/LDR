import HeartBridge from "@/images/HeartBridge.png";
import Image from "next/image";

const Logo = () => {
  return (
    <Image
      priority={true}
      height={75}
      width={220}
      src={HeartBridge}
      alt="test"
    />
  );
};
export default Logo;
