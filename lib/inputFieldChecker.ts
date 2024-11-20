export const EmailChecker = (email: string): [boolean, string] => {
  let emailError = false;
  let emailErrorMsg = "";

  const isValidEmail = (emailValid: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailValid).toLowerCase());
  };

  if (email === "") {
    emailError = true;
    emailErrorMsg = "Email is required";
  } else if (!isValidEmail(email)) {
    emailError = true;
    emailErrorMsg = "Provide a valid email address";
  }

  return [emailError, emailErrorMsg];
};

//requirement is a parameter to check for registration case, if is for registration we add another if case
export const PasswordChecker = (
  password: string,
  requirement: boolean = true
): [boolean, string] => {
  let passwordError = false;
  let passwordMsg = "";

  if (password === "") {
    passwordError = true;
    passwordMsg = "Password is required.";
  } else if (password.length < 8 && requirement) {
    passwordError = true;
    passwordMsg = "Password must be at least 8 characters.";
  } else {
    passwordError = false;
    passwordMsg = "";
  }

  return [passwordError, passwordMsg];
};

export const UsernameChecker = (username: string): [boolean, string] => {
  let usernameError = false;
  let usernameErrorMsg = "";

  if (username === "") {
    usernameError = true;
    usernameErrorMsg = "Username is required";
  } else if (username.length > 16) {
    usernameError = true;
    usernameErrorMsg = "Username must be under 16 characters";
  } else {
    usernameError = false;
    usernameErrorMsg = "";
  }
  return [usernameError, usernameErrorMsg];
};

export const ConfirmPasswordChecker = (
  password: string,
  passwordConfirmed: string
): [boolean, string] => {
  let passwordError = false;
  let passwordErrorMsg = "";
  if (passwordConfirmed === "") {
    passwordError = true;
    passwordErrorMsg = "Please confirm your password.";
  } else if (password.length < 8) {
    passwordError = false;
    passwordErrorMsg = "";
  } else if (passwordConfirmed !== password) {
    passwordError = true;
    passwordErrorMsg = "Passwords doesn't match.";
  } else {
    passwordError = false;
    passwordErrorMsg = "";
  }
  return [passwordError, passwordErrorMsg];
};
