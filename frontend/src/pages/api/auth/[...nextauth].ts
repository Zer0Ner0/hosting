import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type BasicUser = { id: string; email: string; name?: string | null };

async function tryJson(res: Response) {
  try { return await res.json(); } catch { return null; }
}

async function loginAgainstBackend(base: string, email: string, password: string): Promise<BasicUser | null> {
  // 1) Preferred: custom /api/login/ accepting either {email,password} or {username,password}
  const candidates = [
    { url: `${base}/api/login/`, body: { email, password } },
    { url: `${base}/api/login/`, body: { username: email, password } },
  ];
  for (const c of candidates) {
    try {
      const r = await fetch(c.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c.body) });
      if (r.ok) {
        const data = await tryJson(r);
        // Accept common shapes: {id,email,name?} or {user:{...}}
        const u = data?.user ?? data;
        if (u?.email) return { id: String(u.id ?? email), email: String(u.email), name: u.name ?? null };
      } else if (r.status === 401) {
        return null; // invalid creds
      } else if (r.status === 404 || r.status === 405) {
        // endpoint missing/wrong verb → fall through to SimpleJWT
        break;
      }
    } catch { /* keep falling through */ }
  }

  // 2) Fallback: djangorestframework-simplejwt at /api/token/
  // It usually expects {username,password} and returns {access,refresh}
  try {
    const r = await fetch(`${base}/api/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });
    if (r.ok) {
      // If we don’t have a /me endpoint, synthesize a user from the email.
      // (We rely on NextAuth’s own HS256 JWT for protected API calls.)
      return { id: email, email, name: null };
    }
    if (r.status === 401) return null;
  } catch { /* ignore */ }

  return null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const base = process.env.NEXT_PUBLIC_API_BASE;
        if (!base) throw new Error("NEXT_PUBLIC_API_BASE is not set");
        const user = await loginAgainstBackend(base, credentials.email, credentials.password);
        return user; // null → NextAuth returns 401
       },
     }),
   ],
   callbacks: {
     async jwt({ token, user }) {
       // First login: attach basic profile
       if (user) {
         token.user = user;
         token.sub = (user as any).id ?? token.sub;
       }
       // Make token acceptable to Django validator (HS256 + audience/issuer)
       (token as any).aud = "django";
       (token as any).iss = "nextauth";
       return token;
     },
     async session({ session, token }) {
       session.user = (token as any).user || null;
       (session as any).aud = (token as any).aud;
       (session as any).iss = (token as any).iss;
       return session;
     },
   },
   pages: {
     signIn: "/login",
   },
 };
 
 export default NextAuth(authOptions);