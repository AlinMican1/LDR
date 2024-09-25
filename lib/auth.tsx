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
        console.log(userExist._id);
        return {
          username: userExist.username,
          email: userExist.email,
          isAdmin: userExist.isAdmin,
          id: userExist._id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      };
    },
  },
};

const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
