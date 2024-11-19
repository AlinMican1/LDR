import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    isAdmin: boolean;
    avatarURL: string;
    loverTag: string;
    // request: {
    //   from: string | null; // ObjectId reference to User
    //   to: string | null; // ObjectId reference to User
    //   status: "pending" | "accepted" | "rejected";
    // };
  }

  interface Session {
    user: User & {
      id: string;
      username: string;
      isAdmin: boolean;
      avatarURL: string;
      loverTag: string;
      // request: {
      //   from: string | null; // ObjectId reference to User
      //   to: string | null; // ObjectId reference to User
      //   status: "pending" | "accepted" | "rejected";
      // };
    };
    token: {
      id: string;
      username: string;
      isAdmin: boolean;
      avatarURL: string;
      loverTag: string;
      // request: {
      //   from: string | null; // ObjectId reference to User
      //   to: string | null; // ObjectId reference to User
      //   status: "pending" | "accepted" | "rejected";
      // };
    };
    // address: string;
  }
}
