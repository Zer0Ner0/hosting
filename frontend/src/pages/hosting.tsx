"use client";

import { useEffect, useState } from "react";
import HostingPlanList from "@/components/hosting/HostingPlanList";
import type { Plan } from "@/types/Plan";
import fetchJson, { type ApiError } from "@/lib/api";

const categories = [
  { key: "web", label: "Web Hosting" },
  { key: "wordpress", label: "WordPress Hosting" },
  { key: "woocommerce", label: "WooCommerce Hosting" },
  { key: "email", label: "Email Hosting" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];
type Billing = "monthly" | "yearly";

export default function HostingPage() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("web");
  const [billingCycle, setBillingCycle] = useState<Billing>("monthly");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchJson<Plan[]>("/api/plans/");
        if (mounted) setPlans(data);
      } catch (e) {
        const msg = (e as ApiError)?.message ?? "Load failed";
        // eslint-disable-next-line no-console
        console.error("Failed to fetch hosting plans:", e);
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPlans = plans.filter(
    (p) => p.category === activeTab && p.billing_cycle === billingCycle
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Hosting</h1>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-2 rounded-full border transition ${billingCycle === "monthly"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Monthly Billing
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-4 py-2 rounded-full border transition ${billingCycle === "yearly"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Yearly Billing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 flex-wrap gap-2">
        {categories.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${activeTab === tab.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans */}
      {loading ? (
        <p className="text-center text-gray-600">Loading hosting plans...</p>
      ) : error ? (
        <p className="text-center text-red-600" role="alert">
          {error}. Check <code className="font-mono">NEXT_PUBLIC_API_BASE</code> and that the backend is running.
        </p>
      ) : filteredPlans.length === 0 ? (
        <p className="text-center text-gray-600">No plans match the selected filters.</p>
      ) : (
        <HostingPlanList plans={filteredPlans} />
      )}
    </div>
  );
}
