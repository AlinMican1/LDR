"use client";
import "./navBar.css";
import { NavBarButton } from "../atoms/customButton";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NotifyButton } from "../atoms/notifyButton";
const NavBar = () => {
  const [activeButton, setActiveButton] = useState<string>("home"); // To track the active button
  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      setActiveButton("home");
    } else if (path === "/settings") {
      setActiveButton("settings");
    } else if (path === "/chat") {
      setActiveButton("chat");
    }
  }, [path]); // This useEffect runs every time the path changes

  if (path === "/login" || path === "/register" || path === "/chat") {
    return null; // Do not render the NavBar on login or register routes
  }

  return (
    <div className="AvoidGoingBelowNavBar">
      <div className="navbarContainer">
        {/* <NavBarButton
          link="/chat"
          icon={faMessage}
          isActive={activeButton === "chat"} // Check if this button is active
          onClick={() => setActiveButton("chat")}
        ></NavBarButton> */}
        <NavBarButton
          link="/"
          icon={faHome}
          isActive={activeButton === "home"}
          onClick={() => setActiveButton("home")}
        ></NavBarButton>
        <NotifyButton
          link="/chat"
          icon={faMessage}
          isActive={activeButton === "chat"} // Check if this button is active
          onClick={() => setActiveButton("chat")}
        />
        <NavBarButton
          link="/settings"
          icon={faBars}
          isActive={activeButton === "settings"} // Check if this button is active
          onClick={() => setActiveButton("settings")}
        ></NavBarButton>
      </div>
    </div>
  );
};
export default NavBar;
