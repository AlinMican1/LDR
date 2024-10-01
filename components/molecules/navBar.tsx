"use client";
import "./navBar.css";
import CustomButton from "../atoms/customButton";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
const NavBar = () => {
  const [activeButton, setActiveButton] = useState<string>("home"); // To track the active button
  const path = usePathname();

  useEffect(() => {
    if (path === "/") {
      setActiveButton("home");
    } else if (path === "/settings") {
      setActiveButton("settings");
    } else if (path === "/register") {
      setActiveButton("register");
    }
    // Add more routes as needed
  }, [path]); // This useEffect runs every time the path changes

  if (path === "/login") {
    return null; // Do not render the NavBar on login or register routes
  }

  // Update the active button and store the value in local storage
  // const handleButtonClick = (buttonName: string) => {
  //   setActiveButton(buttonName);
  //   localStorage.setItem("activeButton", buttonName); // Store the active button state in local storage
  // };

  return (
    <div className="navbarContainer">
      <CustomButton
        link="/"
        icon={faHome}
        isActive={activeButton === "home"}
        onClick={() => setActiveButton("home")}
      ></CustomButton>
      <CustomButton
        link="/register"
        icon={faBars}
        isActive={activeButton === "register"} // Check if this button is active
        onClick={() => setActiveButton("register")}
      ></CustomButton>
    </div>
  );
};
export default NavBar;
