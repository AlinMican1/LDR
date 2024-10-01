"use client";
import InputField from "@/components/atoms/inputField";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ContainerRound from "../atoms/containerRound";
import "./login&registration.css";
import { faEnvelope, faLock, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ConfirmPasswordChecker,
  EmailChecker,
  PasswordChecker,
  UsernameChecker,
} from "@/lib/inputFieldChecker";
import Link from "next/link";

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

  const [agreement, setAgreement] = useState(false);

  let errorUserName: boolean = false;
  let errorEmail: boolean = false;
  let errorPassword: boolean = false;
  let errorPasswordConfirm: boolean = false;

  const handleAgreement = () => {
    setAgreement(!agreement);
  };

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
      if (agreement === false) {
        setMainError(true);
        setMainErrorMsg("Please agree to terms and conditions");
      } else {
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
    }
  };

  return (
    <div>
      <ContainerRound>
        <div className="container">
          <h1>Register</h1>
          <InputField
            type="text"
            label="UserName"
            value={user.username}
            name="username"
            error={nameError}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            errorMsg={nameErrorMsg}
            placeholder="Username..."
            icon={<FontAwesomeIcon icon={faPen} />}
          />
          <InputField
            type="text"
            label="Email"
            value={user.email}
            name="email"
            error={emailError}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            errorMsg={emailErrorMsg}
            placeholder="Email..."
            icon={<FontAwesomeIcon icon={faEnvelope} />}
          />
          <InputField
            type="text"
            label="Password"
            value={user.password}
            name="password"
            error={passwordError}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            errorMsg={passwordErrorMsg}
            placeholder="Password..."
            icon={<FontAwesomeIcon icon={faLock} />}
          />
          <InputField
            type="text"
            label="Confirm Password"
            value={user.passwordConfirm}
            name="passwordConfirm"
            error={passwordConfirmError}
            onChange={(e) =>
              setUser({ ...user, passwordConfirm: e.target.value })
            }
            errorMsg={passwordConfirmErrorMsg}
            placeholder="Confirm Password..."
            icon={<FontAwesomeIcon icon={faLock} />}
          />
          {mainError && <p className="mainErrorMsg">{mainErrorMsg}</p>}
          <div className="agreementContainer">
            <input
              className="checkmark"
              type="checkbox"
              checked={agreement}
              onChange={handleAgreement}
            />
            <p>Please agree to terms and conditions</p>
          </div>
          <button className="submitButton" onClick={onRegister}>
            Register
          </button>
          <h3 className="accountInfo">
            I don't have an account{" "}
            <Link className="textLink" href={"/login"}>
              {" "}
              Log In
            </Link>
          </h3>
        </div>
      </ContainerRound>
    </div>
  );
};

export default Registration;
