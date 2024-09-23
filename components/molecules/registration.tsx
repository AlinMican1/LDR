"use client";
import InputField from "@/components/atoms/inputField";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ConfirmPasswordChecker,
  EmailChecker,
  PasswordChecker,
  UsernameChecker,
} from "@/lib/inputFieldChecker";

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

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setMainError(false);
    setMainErrorMsg("");

    setNameError(UsernameChecker(user.username)[0]);
    setNameErrorMsg(UsernameChecker(user.username)[1]);
    errorUserName = UsernameChecker(user.username)[0];
    // First value is a boolean second value is a string
    setEmailError(EmailChecker(user.email)[0]);
    setEmailErrorMsg(EmailChecker(user.email)[1]);
    errorEmail = EmailChecker(user.email)[0];

    setPasswordError(PasswordChecker(user.password, true)[0]);
    setPasswordErrorMsg(PasswordChecker(user.password, true)[1]);
    errorPassword = PasswordChecker(user.password, true)[0];

    setPasswordConfirmError(
      ConfirmPasswordChecker(user.password, user.passwordConfirm)[0]
    );
    setPasswordConfirmErrorMsg(
      ConfirmPasswordChecker(user.password, user.passwordConfirm)[1]
    );
    errorPassword = ConfirmPasswordChecker(
      user.password,
      user.passwordConfirm
    )[0];

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
        const errorMessages =
          Object.values(errorData).flat().join(", ") || errorData.message;
        setMainError(true);
        setMainErrorMsg(/*(await res.json()).error*/ errorMessages);
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
