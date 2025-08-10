import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    appToken?: string;
    user?: DefaultSession["user"] & {
      id?: string;
      picture?: string;
    };
  }
}