import Head from "next/head";
import TrustBar from "@/components/home/TrustBar";
import FAQ from "@/components/common/FAQ";
import BenefitsStrip from "@/components/common/BenefitsStrip";
import PlansCompareMatrix from "@/components/hosting/PlansCompareMatrix";
import { EMAIL_FEATURE_TOOLTIPS } from "@/content/tooltips/email";

export default function EmailHostingPage() {
  const faqs = [
    {
      q: "Can I use my custom domain?",
      a: "Yes. Use a new domain or connect an existing one. We’ll guide you through simple DNS (MX/SPF/DMARC) setup.",
    },
    {
      q: "How much storage do I get?",
      a: "Choose a plan with the mailbox size you need. You can add users or upgrade storage any time.",
    },
    {
      q: "Is spam and phishing filtered?",
      a: "Advanced spam filtering and malware scanning help keep your inbox clean and protected.",
    },
    {
      q: "Do you support mobile & desktop apps?",
      a: "Yes. IMAP/SMTP access works with popular clients (iOS, Android, macOS, Windows). Webmail is available too.",
    },
  ];

  const benefits = [
    { title: "Custom domain mail", desc: "Looks professional, builds trust." },
    { title: "Spam & malware guard", desc: "Advanced filtering out of the box." },
    { title: "IMAP/SMTP everywhere", desc: "Works with all major clients." },
    { title: "Simple DNS helpers", desc: "Guided MX, SPF, DKIM & DMARC." },
  ];

  const emailTooltips: Record<string, string> = {
    "POP3/IMAP/SMTP":
      "Standard email protocols: POP3 downloads mail, IMAP syncs across devices, SMTP sends mail.",
    "Web Based Email":
      "Check email in any browser with a responsive webmail UI—no app install required.",
    "Superior Spam Protection":
      "Layered filtering and reputation checks reduce junk mail. You can whitelist/blacklist senders.",
    "Premium Email Deliverability":
      "SPF, DKIM, and DMARC guidance to help your messages land in the inbox instead of spam.",
    "Integrated Calendar":
      "Plan and share events from the same account. Works with common calendar clients.",
    "FREE Migration":
      "We’ll help move existing mailboxes and messages from your current provider.",
    "30-Day Money-Back":
      "Try us for 30 days. Refunds per policy; third-party/domain fees are typically excluded.",
  };

  return (
    <>
      <Head>
        <title>Email Hosting — Professional Mailboxes | YourBrand</title>
        <meta
          name="description"
          content="Custom domain email with spam protection, generous storage, and mobile access."
        />
      </Head>

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Email Hosting</h1>
              <p className="mt-4 text-lg text-gray-600">
                Branded mailboxes, calendar & contacts sync, and powerful anti-spam.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <img src="/images/hero-hosting.svg" alt="Email hosting" className="w-full max-w-lg" />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <BenefitsStrip items={benefits} />

      <PlansCompareMatrix
        category="email"
        title="Email Hosting plans & features"
        subtitle="Pick a plan and compare what's included."
        features={[
          "Email Storage",
          "Email Accounts",
          "POP3/IMAP/SMTP",
          "Web Based Email",
          "Superior Spam Protection",
          "Premium Email Deliverability",
          "Integrated Calendar",
          "FREE Migration",
          "30-Day Money-Back",
        ]}
        featureTooltips={EMAIL_FEATURE_TOOLTIPS}
        enableBillingToggle={true}
      />


      <FAQ items={faqs} heading="Email Hosting FAQs" subheading="Everything you need to know to get set up." />
    </>
  );
}
