"use client";
import { useState } from "react";
import InputField from "../atoms/inputField";
import React from "react";
import Logo from "../atoms/logo";
import { useRouter } from "next/navigation";
import { EmailChecker, PasswordChecker } from "@/lib/inputFieldChecker";
import { signIn } from "next-auth/react";
import "./login&registration.css";
import ContainerRound from "../atoms/containerRound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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

  const router = useRouter();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMainError(false); // Hide the main error before login attempt
    setMainErrorMsg("");
    // First value is a boolean second value is a string
    setEmailError(EmailChecker(user.email)[0]);
    setEmailErrorMsg(EmailChecker(user.email)[1]);
    errorEmail = EmailChecker(user.email)[0];

    setPasswordError(PasswordChecker(user.password, false)[0]);
    setPasswordErrorMsg(PasswordChecker(user.password, false)[1]);
    errorPassword = PasswordChecker(user.password, false)[0];

    if (errorEmail === false && errorPassword === false) {
      try {
        const signInData = await signIn("credentials", {
          redirect: false,
          email: user.email,
          password: user.password,
        });

        if (!signInData?.error) {
          router.push("/");
        } else {
          setMainError(true);
          setMainErrorMsg("Credentials are incorrect");
        }
      } catch (error: any) {
        setMainError(true);
        setMainErrorMsg("Something went wrong, please try again!");
      }
    }
  };

  return (
    <div>
      <div className="logoPosition">
        <Logo />
      </div>

      <ContainerRound>
        <div className="container">
          <h1>Sign In</h1>
          <InputField
            type="text"
            label="Email"
            value={user.email}
            name="name"
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
          <Link href="/register" className="forgotPasswordLink">
            <p className="forgotPassword">Forgot Password</p>
          </Link>
          {mainError && <p className="mainErrorMsg">{mainErrorMsg}</p>}
          <button className="submitButton" onClick={onLogin}>
            LogIn
          </button>
          <h3 className="accountInfo">
            I don't have an account
            <Link className="textLink" href={"/register"}>
              Register
            </Link>
          </h3>
          <span className="line"></span>
        </div>
      </ContainerRound>
    </div>
  );
};
export default Login;
