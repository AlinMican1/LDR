import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    isAdmin: boolean;
    avatarURL: string;
    loverTag: string;
  }

  interface Session {
    user: User & {
      username: string;
      isAdmin: boolean;
      avatarURL: string;
      loverTag: string;
    };
    token: {
      username: string;
      isAdmin: boolean;
      avatarURL: string;
      loverTag: string;
    };
    // address: string;
  }
}
