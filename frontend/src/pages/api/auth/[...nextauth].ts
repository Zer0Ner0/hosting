import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) { if (account) token.accessToken = account.access_token; return token; },
    async session({ session, token }) { (session as any).accessToken = (token as any).accessToken; return session; },
  },
  secret: process.env.NEXTAUTH_SECRET,
});