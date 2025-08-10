import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // scope defaults include email+profile; no changes needed
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 }, // 30 days
  callbacks: {
    async jwt({ token, account, profile }) {
      // On first sign-in, add a few fields from Google
      if (account && profile) {
        token.email = (profile as any).email ?? token.email;
        token.name = (profile as any).name ?? token.name;
        token.picture = (profile as any).picture ?? token.picture;
        token.sub = token.sub ?? (profile as any).sub; // Google user id
      }
      return token;
    },
    async session({ session, token }) {
      // Expose minimal user info
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).picture = token.picture as string;
        (session.user as any).id = token.sub as string;
      }
      // Mint a short-lived **app token** (HS256) for Django to verify
      const appToken = await new SignJWT({
        sub: token.sub,
        email: token.email,
        name: token.name,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuer("nextauth")
        .setAudience("django")
        .setExpirationTime("8h")
        .sign(secret);

      (session as any).appToken = appToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
