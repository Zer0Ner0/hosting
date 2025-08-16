import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";

type Suggestion = {
  sld: string;
  tld: string;
  domain: string;
  score: number;
  premium: boolean;
  available: boolean;
  price?: {
    currency: string;
    registration: number;
    renewal: number;
    transfer: number;
    restore: number;
  };
};

type SuggestResp = {
  query: string;
  searchTerm: string;
  tlds: string;
  count: number;
  suggestions: Suggestion[];
} | { error: string };

const DEFAULT_TLDS = ["com", "net", "org", "io", "co", "xyz", "online", "site", "store", "tech", "app", "blog", "shop", "info", "biz"];

export default function DomainSearchBox() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<SuggestResp | null>(null);
  const [selectedTlds, setSelectedTlds] = useState<string[]>(DEFAULT_TLDS);

  const tldString = useMemo(() => selectedTlds.join(","), [selectedTlds]);

  function toggleTld(tld: string) {
    setSelectedTlds((cur) =>
      cur.includes(tld) ? cur.filter((x) => x !== tld) : [...cur, tld]
    );
  }

  // Convert registration price (major units) -> cents (minor units)
  function priceCents(s: Suggestion): number {
    if (s.available && s.price && typeof s.price.registration === "number") {
      return Math.round(s.price.registration * 100);
    }
    return 999; // fallback $9.99
  }

  function addDomainToCart(s: Suggestion) {
    if (!s.available) return;
    addToCart({
      item_type: "domain",
      name: s.domain,
      sku: s.domain,
      quantity: 1,
      unit_amount_cents: priceCents(s),
      currency: (s.price?.currency || "USD").toLowerCase(),
    });
    // Simple UX: go to cart after adding
    window.location.href = "/cart";
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResp(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE ?? "";
      const url = `${base}/api/domain/suggest2/?q=${encodeURIComponent(query)}&tlds=${encodeURIComponent(tldString)}&max=40&spinType=0&price=1`;
      const r = await fetch(url);
      const data = await r.json();
      setResp(data);
    } catch (e) {
      setResp({ error: "Failed to get suggestions" } as any);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white py-10">
      <div className="container w-full max-w-4xl">
        {/* Search */}
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search domain (e.g. amirmz.com or just 'amirmz')"
            className="w-full rounded-xl border px-4 py-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* TLD chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {DEFAULT_TLDS.map((tld) => {
            const active = selectedTlds.includes(tld);
            return (
              <button
                key={tld}
                type="button"
                onClick={() => toggleTld(tld)}
                className={`rounded-full border px-3 py-1 text-sm ${active ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
              >
                .{tld}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {resp && "error" in resp && (
          <p className="mt-3 text-sm text-red-600">{resp.error}</p>
        )}

        {resp && !("error" in resp) && (
          <div className="mt-5">
            <h3 className="mb-3 text-base font-semibold">
              Suggestions for “{resp.searchTerm}”
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resp.suggestions.slice(0, 18).map((s) => (
                <li key={s.domain} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.domain}</div>
                      <div className="mt-1 text-xs text-neutral-500">
                        Score {Math.round(s.score)}{s.premium ? " · Premium" : ""}
                      </div>
                    </div>
                    <span className={`text-xs ${s.available ? "text-emerald-600" : "text-rose-600"}`}>
                      {s.available ? "Available" : "Taken"}
                    </span>
                  </div>

                  {/* Price (if present) */}
                  {s.available && s.price && (
                    <div className="mt-2 text-sm">
                      Reg price: {s.price.currency} {s.price.registration.toFixed(2)}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => addDomainToCart(s)}
                      disabled={!s.available}
                      className={`rounded-md px-3 py-2 text-sm ${s.available ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      aria-disabled={!s.available}
                    >
                      {s.available ? "Add to cart" : "Unavailable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuery(s.sld)}
                      className="text-xs text-neutral-500 hover:underline"
                      title="Search variations of this SLD"
                    >
                      More like this
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
