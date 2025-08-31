import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/lib/validation/signupSchema";
import { phoneCountryCodes, countries } from "@/lib/data/countryData";
import Link from "next/link";
import { registerAccount } from "@/lib/api"; // add this import
import { useRouter } from "next/router";     // add this import


export default function SignUpPage() {
  const [serverMessage, setServerMessage] = useState<null | { type: "ok" | "error"; text: string }>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      phoneCountryCode: "+60",
      country: "Malaysia",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: SignupFormValues) => {
    setServerMessage(null);
    try {
      await registerAccount(values);
      setServerMessage({ type: "ok", text: "Account created! Redirecting to login..." });
      setTimeout(() => router.push("/login"), 900);
    } catch (e: any) {
      setServerMessage({ type: "error", text: e?.message || "Something went wrong" });
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up • Hosting</title>
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-800 hover:underline">
                Log in
              </Link>
            </div>
          </div>

          {/* OAuth quick path removed */}
          {/* OAuth quick path
          <div className="mb-8">
            <button
              onClick={() => signIn("google")}
              className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm hover:bg-gray-50"
              type="button"
            >
              Continue with Google
            </button>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase tracking-wide text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div> */}

          {serverMessage && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-sm ${serverMessage.type === "ok"
                ? "border-blue-300 bg-blue-50 text-blue-900"
                : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
            >
              {serverMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Personal Information */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="First Name *" error={errors.firstName?.message}>
                  <input {...register("firstName")} className="input" placeholder="John" />
                </Field>
                <Field label="Last Name *" error={errors.lastName?.message}>
                  <input {...register("lastName")} className="input" placeholder="Doe" />
                </Field>
                <Field label="Email Address *" error={errors.email?.message} className="sm:col-span-2">
                  <input {...register("email")} type="email" className="input" placeholder="you@example.com" />
                </Field>

                <div className="sm:col-span-2">
                  <label className="label">Phone Number *</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    <div className="col-span-2 sm:col-span-2">
                      <select {...register("phoneCountryCode")} className="input">
                        <option value="">Select code</option>
                        {phoneCountryCodes.map((c) => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                      {errors.phoneCountryCode?.message && (
                        <p className="error">{errors.phoneCountryCode.message}</p>
                      )}
                    </div>
                    <div className="col-span-4 sm:col-span-4">
                      <input
                        {...register("phoneNumber")}
                        className="input"
                        inputMode="numeric"
                        placeholder="123456789"
                      />
                      {errors.phoneNumber?.message && <p className="error">{errors.phoneNumber.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Address */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-semibold">Billing Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Company Name (Optional)">
                  <input {...register("company")} className="input" placeholder="Your Company Sdn Bhd" />
                </Field>
                <div />
                <Field label="Street Address *" error={errors.street1?.message} className="sm:col-span-2">
                  <input {...register("street1")} className="input" placeholder="123 Main St" />
                </Field>
                <Field label="Street Address 2 (Optional)" className="sm:col-span-2">
                  <input {...register("street2")} className="input" placeholder="Unit, suite, etc." />
                </Field>
                <Field label="City *" error={errors.city?.message}>
                  <input {...register("city")} className="input" />
                </Field>
                <Field label="State *" error={errors.state?.message}>
                  <input {...register("state")} className="input" />
                </Field>
                <Field label="Postcode *" error={errors.postcode?.message}>
                  <input {...register("postcode")} className="input" />
                </Field>
                <Field label="Country *" error={errors.country?.message}>
                  <select {...register("country")} className="input">
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            {/* Additional Information */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-semibold">
                Additional Information <span className="text-gray-500 text-sm">(fields marked with *)</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="How did you find us? (Optional)">
                  <input {...register("referral")} className="input" placeholder="Google, a friend, ads..." />
                </Field>
                <Field
                  label="Support PIN (Optional)"
                  hint="4-digit number used to verify identity on phone/chat (e.g. 1234)"
                  error={errors.supportPin?.message}
                >
                  <input {...register("supportPin")} className="input" inputMode="numeric" placeholder="1234" />
                </Field>
              </div>
            </section>

            {/* Account Security */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-lg font-semibold">Account Security</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Password *" error={errors.password?.message} hint="Min 8 chars. Use upper, lower, number & symbol.">
                  <input {...register("password")} type="password" className="input" />
                </Field>
                <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" className="input" />
                </Field>
              </div>
            </section>

            <div className="flex items-center justify-end gap-3">
              <Link href="/" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:underline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <style jsx global>{`
        .label { @apply block text-sm font-medium text-gray-700 mb-1; }
        .input { @apply w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600; }
        .error { @apply mt-1 text-xs text-rose-600; }
      `}</style>
    </>
  );

  function Field({
    label,
    children,
    error,
    hint,
    className = "",
  }: {
    label: string;
    children: React.ReactNode;
    error?: string;
    hint?: string;
    className?: string;
  }) {
    return (
      <div className={className}>
        <label className="label">{label}</label>
        {children}
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }
}