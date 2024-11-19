import "@testing-library/jest-dom";
import {
  EmailChecker,
  PasswordChecker,
  UsernameChecker,
  ConfirmPasswordChecker,
} from "@/lib/inputFieldChecker";

describe("Email Checker", () => {
  it("Check Valid Email Regex", () => {
    const validEmail = "test2@gmail.com";
    expect(EmailChecker(validEmail)).toEqual([false, ""]);
  });

  it("Check Invalid Email Regex", () => {
    const invalidEmails = ["test2@gmail", "test2gma", "test2@", "test2@.com"];
    invalidEmails.forEach((invalidEmail) => {
      expect(EmailChecker(invalidEmail)).toEqual([
        true,
        "Provide a valid email address",
      ]);
    });
  });
  it("Check Empty Email Field", () => {
    const emptyEmail = "";
    expect(EmailChecker(emptyEmail)).toEqual([true, "Email is required"]);
  });
});

describe("Password Checker", () => {
  it("Check Valid Password", () => {
    const validPasswords = ["IamBatman", "12345678", "testing1@"];
    validPasswords.forEach((validPassword) => {
      expect(PasswordChecker(validPassword, false)).toEqual([false, ""]);
    });
  });
  it("Check Invalid Password", () => {
    const invalidPasswords = ["IamBat", "1234567", "test#@"];
    invalidPasswords.forEach((invalidPassword) => {
      expect(PasswordChecker(invalidPassword, true)).toEqual([
        true,
        "Password must be at least 8 characters.",
      ]);
    });
  });
  it("Check Empty Password", () => {
    const emptyPassword = "";
    expect(PasswordChecker(emptyPassword, false)).toEqual([
      true,
      "Password is required.",
    ]);
  });
});

describe("Username Checker", () => {
  it("Check Valid Usernames", () => {
    const validUsernames = ["Batlina", "B", "12$%", "BatlinaBatlina12"];
    validUsernames.forEach((validUsername) => {
      expect(UsernameChecker(validUsername)).toEqual([false, ""]);
    });
  });
  it("Check Invalid Username", () => {
    const invalidUsername = "BatlinaBatlina123";
    expect(UsernameChecker(invalidUsername)).toEqual([
      true,
      "Username must be under 16 characters",
    ]);
  });
  it("Check Empty Username", () => {
    const emptyUsername = "";
    expect(UsernameChecker(emptyUsername)).toEqual([
      true,
      "Username is required",
    ]);
  });
});

describe("Confirm Password Checker", () => {
  it("Check Valid Confirm Password", () => {
    const validPassword1 = "testing1";
    const validPassword2 = "testing1";
    expect(ConfirmPasswordChecker(validPassword1, validPassword2)).toEqual([
      false,
      "",
    ]);
  });
  it("Check Invalid Confirm Password", () => {
    const invalidPassword1 = "testing1";
    const invalidPassword2 = "testing10";
    expect(ConfirmPasswordChecker(invalidPassword1, invalidPassword2)).toEqual([
      true,
      "Passwords doesn't match.",
    ]);
  });

  it("Check Empty Confirm Password", () => {
    const validPassword = "testing1";
    const emptyPassword = "";
    expect(ConfirmPasswordChecker(validPassword, emptyPassword)).toEqual([
      true,
      "Please confirm your password.",
    ]);
  });

  it("Check Both Empty Confirm Password", () => {
    const validPassword = "";
    const emptyPassword = "";
    expect(ConfirmPasswordChecker(validPassword, emptyPassword)).toEqual([
      true,
      "Please confirm your password.",
    ]);
  });
});
