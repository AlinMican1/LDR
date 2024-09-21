"use client";
import InputField from "@/components/atoms/inputField";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Registration = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [passwordConfirmErrorMsg, setPasswordConfirmErrorMsg] = useState("");

  const [mainError, setMainError] = useState(false);
  const [mainErrorMsg, setMainErrorMsg] = useState<string | null>(null);

  let errorUserName: boolean = false;
  let errorEmail: boolean = false;
  let errorPassword: boolean = false;
  let errorPasswordConfirm: boolean = false;

  const isValidEmail = (emailValid: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValid).toLowerCase());
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user.email === "") {
      setEmailError(true);
      errorEmail = true;
      setEmailErrorMsg("Email is required");
    } else if (!isValidEmail(user.email)) {
      setEmailError(true);
      errorEmail = true;
      setEmailErrorMsg("Provide a valid email address");
    } else {
      setEmailError(false);
      errorEmail = false;
      setEmailErrorMsg("");
    }

    if (user.username === "") {
      setNameError(true);
      errorUserName = true;
      setNameErrorMsg("Username is required");
    } else if (user.username.length > 16) {
      setNameError(true);
      errorUserName = true;
      setNameErrorMsg("Username must be under 16 characters");
    } else {
      setNameError(false);
      errorUserName = false;
      setNameErrorMsg("");
    }

    if (user.password === "") {
      setPasswordError(true);
      errorPassword = true;
      setPasswordErrorMsg("Password is required");
    } else if (user.password.length < 8) {
      setPasswordError(true);
      errorPassword = true;
      setPasswordErrorMsg("Password must be at least 8 characters.");
    } else {
      setPasswordError(false);
      errorPassword = false;
      setPasswordErrorMsg("");
    }

    if (user.passwordConfirm === "") {
      setPasswordConfirmError(true);
      errorPasswordConfirm = true;
      setPasswordConfirmErrorMsg("Please confirm your password.");
    } else if (user.passwordConfirm !== user.password) {
      setPasswordConfirmError(true);
      errorPasswordConfirm = true;
      setPasswordConfirmErrorMsg("Passwords doesn't match.");
    } else {
      setPasswordConfirmError(false);
      errorPasswordConfirm = false;
      setPasswordConfirmErrorMsg("");
    }

    if (
      errorEmail === false &&
      errorPassword === false &&
      errorPasswordConfirm === false &&
      errorUserName === false
    ) {
      try {
        const response = await axios.post("/api/users/register", user);
        if (response.status === 200) {
          setMainError(false);
          setMainErrorMsg("");
          router.push("/login");
        }
      } catch (error: any) {
        const errorData = error.response?.data?.errors;

        setMainError(true);
        setMainErrorMsg(/*(await res.json()).error*/ errorData);
      }
    }
  };

  return (
    <div>
      <h1>Registration Page</h1>
      <InputField
        type="text"
        label="UserName"
        value={user.username}
        name="username"
        error={nameError}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        errorMsg={nameErrorMsg}
        placeholder="Please enter your Username"
      />
      <InputField
        type="text"
        label="Email"
        value={user.email}
        name="email"
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
      <InputField
        type="text"
        label="Confirm Password"
        value={user.passwordConfirm}
        name="passwordConfirm"
        error={passwordConfirmError}
        onChange={(e) => setUser({ ...user, passwordConfirm: e.target.value })}
        errorMsg={passwordConfirmErrorMsg}
        placeholder="Please enter your Password"
      />
      {mainError && <p>{mainErrorMsg}</p>}
      <button onClick={onRegister}>Register</button>
    </div>
  );
};

export default Registration;
