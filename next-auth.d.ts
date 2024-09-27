import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    isAdmin: boolean;
    avatarURL: string;
  }

  interface Session {
    user: User & {
      username: string;
      isAdmin: boolean;
      avatarURL: string;
    };
    token: {
      username: string;
      isAdmin: boolean;
      avatarURL: string;
    };
    // address: string;
  }
}
