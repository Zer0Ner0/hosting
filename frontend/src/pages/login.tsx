import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { useMemo, useState } from "react";

type Props = {
  callbackUrl: string;
  error?: string | null;
};

const ERROR_COPY: Record<string, string> = {
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCallback: "Sign-in was cancelled or failed. Please try again.",
  OAuthAccountNotLinked:
    "This email is linked to a different provider. Try the original sign-in method.",
  EmailCreateAccount: "Account creation is currently disabled.",
  EmailSignin: "Email sign-in is currently disabled.",
  CredentialsSignin: "Invalid email or password.",
  Default: "Something went wrong. Please try again.",
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // If already logged in, bounce to callbackUrl or home
  const callbackUrl =
    (typeof ctx.query.callbackUrl === "string" && ctx.query.callbackUrl) || "/";
  if (session) {
    return {
      redirect: { destination: callbackUrl, permanent: false },
    };
  }

  const errorParam =
    (typeof ctx.query.error === "string" && ctx.query.error) || null;

  return {
    props: {
      callbackUrl,
      error: errorParam,
    },
  };
};

export default function Login({ callbackUrl, error: errorParam }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Define error state (fixes "setError is not defined")
  const [error, setError] = useState<string | null>(null);

  // Map any query error to copy once on first render
  useMemo(() => {
    if (errorParam) {
      const msg = ERROR_COPY[errorParam] || ERROR_COPY.Default;
      setError(msg);
    }
  }, [errorParam]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // avoid redirect on error; show inline message instead
        callbackUrl: callbackUrl || "/",
      });

      if (!res) {
        setError(ERROR_COPY.Default);
        setSubmitting(false);
        return;
      }
      if (res.error) {
        // 401 from backend bubbles here as CredentialsSignin
        setError(ERROR_COPY.CredentialsSignin);
        setSubmitting(false);
        return;
      }
      // Success
      window.location.href = res.url || "/";
    } catch {
      setError(ERROR_COPY.Default);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <main className="min-h-screen bg-slate-50">

        {/* Content */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          {/* Left: form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold">Welcome back</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-200 focus:ring"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-emerald-200 focus:ring"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-70"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <p className="pt-2 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-emerald-700 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
          </section>
          {/* Right: support / trust */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800">
                Why choose us
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  NVMe + LiteSpeed stack for top performance
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Free SSL & weekly backups
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  30-day money-back guarantee
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
