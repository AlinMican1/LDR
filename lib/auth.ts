import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "./database";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import User from "@/models/user";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDB();
        const userExist = await User.findOne({ email: credentials?.email });

        if (!userExist) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          userExist.password
        );
        if (!passwordMatch) {
          return null;
        }

        return {
          username: userExist.username,
          email: userExist.email,
          isAdmin: userExist.isAdmin,
          avatarURL: userExist.avatarURL,
          id: userExist._id,
          loverTag: userExist.loverTag,
          request: userExist.request,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);
      if (user) {
        return {
          ...token,
          username: user.username,
          isAdmin: user.isAdmin,
          avatarURL: user.avatarURL,
          loverTag: user.loverTag,
          request: user.request,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          email: token.email, // Keep email if you need it
          username: token.username, // Add username
          isAdmin: token.isAdmin,
          avatarURL: token.avatarURL,
          loverTag: token.loverTag,
          request: token.request,
        },
      };
    },
  },
};

const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
