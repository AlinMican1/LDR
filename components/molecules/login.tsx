"use client";
import { useState } from "react";
import InputField from "../atoms/inputField";
import React from "react";
import axios from "axios";
import router from "next/router";
import { EmailChecker, PasswordChecker } from "@/lib/inputFieldChecker";

const Login = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const [mainError, setMainError] = useState(true);
  const [mainErrorMsg, setMainErrorMsg] = useState("");
  let errorEmail: boolean = false;
  let errorPassword: boolean = false;
  const isValidEmail = (emailValid: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValid).toLowerCase());
  };
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMainError(false);
    setMainErrorMsg("");

    // if (user.email === "") {
    //   setEmailError(true);
    //   errorEmail = true;
    //   setEmailErrorMsg("Email is required");
    // } else if (!isValidEmail(user.email)) {
    //   setEmailError(true);
    //   errorEmail = true;
    //   setEmailErrorMsg("Provide a valid email address");
    // } else {
    //   setEmailError(false);
    //   errorEmail = false;
    //   setEmailErrorMsg("");
    // }

    // First value is a boolean second value is a string
    setEmailError(EmailChecker(user.email)[0]);
    setEmailErrorMsg(EmailChecker(user.email)[1]);
    errorEmail = EmailChecker(user.email)[0];
    setPasswordError(PasswordChecker(user.password, false)[0]);
    setPasswordErrorMsg(PasswordChecker(user.password, false)[1]);
    errorPassword = PasswordChecker(user.password, false)[0];

    if (errorEmail === false && errorPassword === false) {
      try {
        const response = await axios.post("/api/users/login", user);
        if (response.status === 200) {
          setMainError(false);
          setMainErrorMsg("");
          router.push("/");
        }
      } catch (error: any) {
        const errorData = error.response?.data?.errors || {
          message: "Credentials incorrect",
        };
        const errorMessages =
          Object.values(errorData).flat().join(", ") || errorData.message;
        setMainError(true);
        setMainErrorMsg(/*(await res.json()).error*/ errorMessages);
      }
    }
  };

  return (
    <div>
      <h1>Login Page</h1>
      <InputField
        type="text"
        label="Email"
        value={user.email}
        name="name"
        error={emailError}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        errorMsg={emailErrorMsg}
        placeholder="Please enter your Email"
      />

      <InputField
        type="text"
        label="Password"
        value={user.password}
        name="password"
        error={passwordError}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        errorMsg={passwordErrorMsg}
        placeholder="Please enter your Password"
      />

      {mainError && <p>{mainErrorMsg}</p>}
      <button onClick={onLogin}>Register</button>
    </div>
  );
};
export default Login;
