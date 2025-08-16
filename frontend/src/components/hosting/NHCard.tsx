import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  id: number;
  name: string;
  desc?: string;
  price?: number | null;
  cycle: string;              // "monthly" | "yearly" | string
  features: string[];
  checkoutHref: string;       // e.g. `/checkout?plan_id=...`
  promoSavePercent?: number;  // e.g. 50 -> shows "Save 50%" + strike-through
  icon?: ReactNode;           // optional top icon
};

export default function NHCard({
  id, name, desc, price, cycle, features, checkoutHref, promoSavePercent = 0, icon,
}: Props) {
  const hasPromo = promoSavePercent > 0 && typeof price === "number";
  const compareAt = hasPromo ? Number((price! / (1 - promoSavePercent / 100)).toFixed(2)) : null;

  return (
    <div className="rounded-xl border bg-white shadow-md transition hover:shadow-lg">
      <div className="p-5">
        <div className="mb-3 flex items-center justify-center">{icon ?? <DefaultIcon />}</div>
        <h4 className="text-lg font-semibold">{name}</h4>
        {desc && <p className="package__desc mt-2 text-sm text-gray-600">{desc}</p>}

        {hasPromo && (
          <div className="package__discount mt-4 flex items-center gap-3">
            <span className="package__discount--before line-through text-gray-500" aria-label={`Previous price was $${compareAt}`}>
              ${compareAt!.toFixed(2)}
            </span>
            <span className="package__discount--save text-[var(--nh-orange)] font-semibold">
              Save {promoSavePercent}%
            </span>
          </div>
        )}

        <div className="package__price mt-1">
          <span className="package__price--price text-3xl font-bold">${typeof price === "number" ? price.toFixed(2) : "-"}</span>
          <span className="package__price--cycle text-gray-500">/mo</span>
        </div>

        {/* Features */}
        <ul className="package__features mt-5 space-y-2 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg className="mt-1 h-4 w-4 text-[var(--nh-orange)]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" fill="currentColor" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="package__footer p-5 pt-0">
        <Link
          href={checkoutHref}
          className="btn btn--primary btn--block inline-flex w-full items-center justify-center rounded-lg bg-[var(--nh-orange)] px-4 py-2 font-medium text-white hover:brightness-95"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}

function DefaultIcon() {
  // simple mail icon (original, not copied)
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" aria-hidden="true" className="text-[var(--nh-blue)]">
      <rect x="2" y="6" width="60" height="40" rx="6" fill="currentColor" opacity="0.08" />
      <path d="M6 10l26 18L58 10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
