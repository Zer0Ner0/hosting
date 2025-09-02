'use client'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";

type Money = {
  currency: string;
  registration: number;
  renewal: number;
  transfer: number;
  restore: number;
};

type Suggestion = {
  sld: string;
  tld: string;
  domain: string;
  score: number;
  premium: boolean;
  available: boolean;
  price?: Money;
};

type SuggestOk = {
  query: string;
  searchTerm: string;
  tlds: string;
  count: number;
  suggestions: Suggestion[];
};
type SuggestErr = { error: string };
type SuggestResp = SuggestOk | SuggestErr;

const DEFAULT_TLDS = ["com", "net", "org", "io", "co", "xyz", "online", "site", "store", "tech", "app", "blog", "shop", "info", "biz"];

type Props = {
  /** Default = 'default' renders the blue band; 'hero' makes it transparent for dark hero headers */
  variant?: "default" | "hero";
};

/** Format as e.g. USD 9.99 or RM 9.99 */
function fmtMoney(amount: number, currency: string): string {
  const cur = (currency || "USD").toUpperCase();
  if (!Number.isFinite(amount)) return `${cur} —`;
  // Avoid Intl for bundle size; simple fixed-2 works for our price preview
  return `${cur} ${amount.toFixed(2)}`;
}

const TldChip = memo(function TldChip({
  tld,
  active,
  isHero,
  onToggle,
}: {
  tld: string;
  active: boolean;
  isHero: boolean;
  onToggle: (t: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onToggle(tld)}
      className={`rounded-full border px-3 py-1 text-sm ${
        active
          ? `${isHero ? "bg-white/10 border-white/30 text-white" : "bg-black text-white"}`
          : `${isHero ? "bg-white text-black" : "bg-white text-black hover:bg-gray-100"}`
      }`}
    >
      .{tld}
    </button>
  );
});

const SuggestionCard = memo(function SuggestionCard({
  s,
  onAdd,
  onMoreLikeThis,
}: {
  s: Suggestion;
  onAdd: (s: Suggestion) => void;
  onMoreLikeThis: (sld: string) => void;
}) {
  return (
    <li className="rounded-xl border p-4" role="listitem">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{s.domain}</div>
          <div className="mt-1 text-xs text-neutral-500">
            Score {Math.round(s.score)}
            {s.premium ? " · Premium" : ""}
          </div>
        </div>
        <span className={`text-xs ${s.available ? "text-blue-800" : "text-rose-600"}`}>
          {s.available ? "Available" : "Taken"}
        </span>
      </div>
      {s.available && s.price && (
        <div className="mt-2 text-sm">
          Reg price: {fmtMoney(s.price.registration, s.price.currency)}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onAdd(s)}
          disabled={!s.available}
          className={`rounded-md px-3 py-2 text-sm ${
            s.available
              ? "bg-blue-900 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!s.available}
        >
          {s.available ? "Add to cart" : "Unavailable"}
        </button>
        <button
          type="button"
          onClick={() => onMoreLikeThis(s.sld)}
          className="text-xs text-neutral-500 hover:underline"
          title="Search variations of this SLD"
        >
          More like this
        </button>
      </div>
    </li>
  );
});

export default function DomainSearchBox({ variant = "default" }: Props): JSX.Element {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resp, setResp] = useState<SuggestResp | null>(null);
  const [selectedTlds, setSelectedTlds] = useState<string[]>(DEFAULT_TLDS);
  const abortRef = useRef<AbortController | null>(null);

  const tldString = useMemo(() => selectedTlds.join(","), [selectedTlds]);

  const toggleTld = useCallback((tld: string) => {
    setSelectedTlds((cur) => (cur.includes(tld) ? cur.filter((x) => x !== tld) : [...cur, tld]));
  }, []);

  // Convert registration price (major units) -> cents (minor units)
  function priceCents(s: Suggestion): number {
    if (s.available && s.price && typeof s.price.registration === "number") {
      return Math.round(s.price.registration * 100);
    }
    return 999; // fallback $9.99
  }

  const addDomainToCart = useCallback((s: Suggestion) => {
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
    if (typeof window !== "undefined") window.location.href = "/cart";
  }, []);

  const onSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResp(null);
    setError(null);
    // cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";
      const url = `${API_BASE}/api/domain/suggest2/?q=${encodeURIComponent(
        query.trim()
      )}&tlds=${encodeURIComponent(tldString)}&max=40&spinType=0&price=1`;
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: SuggestResp = await r.json();
      setResp(data);
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Failed to get suggestions";
      setError(msg);
      setResp({ error: "Failed to get suggestions" });
    } finally {
      setLoading(false);
    }
  }, [query, tldString]);

  // cleanup on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const isHero = variant === "hero";
  return (
    <section className={isHero ? "py-0" : "bg-blue-900 py-10"} aria-label="Domain search">
      <div className={`w-full ${isHero ? "max-w-none" : "max-w-4xl"} mx-auto`} >
        {/* Search */}
        <form onSubmit={onSearch} className="flex gap-2" role="search" aria-label="Domain search form">
          <label htmlFor="domain-search" className="sr-only">Domain name</label>
          <input
            id="domain-search"
            type="text"
            placeholder="Find your new domain name"
            className={`w-full rounded-xl border px-4 py-3 ${isHero
                ? "bg-white/95 text-black placeholder:text-gray-500"
                : "bg-white"
              }`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-describedby="domain-search-help"
          />
          <button
            type="submit"
            className={`rounded-xl px-5 py-3 text-white hover:opacity-90 disabled:opacity-50 ${isHero ? "bg-emerald-600" : "bg-orange-500 hover:bg-orange-600"
              }`}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <p id="domain-search-help" className={`mt-2 text-xs ${isHero ? "text-white/80" : "text-blue-100"}`}>
          Enter a name (e.g. <span className="font-mono">mybrand</span>) and pick TLDs below.
        </p>

        {/* TLD chips */}
        <div className={`mt-3 flex flex-wrap gap-2 ${isHero ? "justify-center" : ""}`}>
          {DEFAULT_TLDS.map((tld) => (
            <TldChip
              key={tld}
              tld={tld}
              active={selectedTlds.includes(tld)}
              isHero={isHero}
              onToggle={toggleTld}
            />
          ))}
        </div>

        {/* Status */}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

        {/* Results */}
        {resp && !("error" in resp) && (
          <div className={`mt-5 ${isHero ? "bg-white/90 rounded-xl p-4" : ""}`} aria-live="polite">
            <h3 className="mb-3 text-base font-semibold">
              Suggestions for “{resp.searchTerm}”
            </h3>
            {resp.suggestions.length === 0 ? (
              <p className="text-sm text-neutral-600">No suggestions found. Try a different name or TLD set.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
                {resp.suggestions.slice(0, 18).map((s) => (
                  <SuggestionCard
                    key={s.domain}
                    s={s}
                    onAdd={addDomainToCart}
                    onMoreLikeThis={(sld) => setQuery(sld)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
        {!resp && loading && (
          <p className={`mt-4 text-sm ${isHero ? "text-white/80" : "text-blue-100"}`}>Fetching suggestions…</p>
        )}
      </div>
    </section>
  );
}
