'use client'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

type IconType = 'text' | 'check' | 'times'

type Spec = {
  label: string
  value: string
  icon: IconType
  order: number
}

type PlanWithSpecs = {
  id: number
  name: string
  specs: Spec[]
}

type PlanPrice = {
  id: number
  name: string
  price: string | number
  billing_cycle: string
  // Optional (shown if your API returns them)
  originalPrice?: string | number
  savePercentage?: string
}

const CATEGORY_TITLES: Record<'web' | 'wordpress' | 'email' | 'woocommerce', string> = {
  web: 'Web Hosting',
  wordpress: 'WordPress Hosting',
  email: 'Email Hosting',
  woocommerce: 'WooCommerce Hosting',
}

/** Icons */
const CheckIcon = memo(function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.6a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" className="fill-orange-500" />
    </svg>
  )
})

const CrossIcon = memo(function CrossIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path d="M14.7 5.3a1 1 0 0 1 0 1.4L11.4 10l3.3 3.3a1 1 0 1 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 1.4-1.4L10 8.6l3.3-3.3a1 1 0 0 1 1.4 0z" className="fill-orange-500" />
    </svg>
  )
})

/** Small cell renderer */
const SpecCell = memo(function SpecCell({ spec }: { spec: Spec }) {
  if (spec.icon === 'check') return <CheckIcon />
  if (spec.icon === 'times') return <CrossIcon />
  return <span className="text-gray-800">{spec.value}</span>
})

/** Helpers */
function currency(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(n)) return String(amount)
  // Adjust currency symbol if you want USD instead.
  return `RM ${n.toFixed(2)}`
}

function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}

function TableSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] rounded-2xl ring-1 ring-gray-200 bg-white p-8">
      <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200" />
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    </div>
  )
}

export default function PlanComparison({
  category = 'web',
}: {
  category?: 'web' | 'wordpress' | 'email' | 'woocommerce',
}) {
  const [plansWithSpecs, setPlansWithSpecs] = useState<PlanWithSpecs[]>([])
  const [planPrices, setPlanPrices] = useState<PlanPrice[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000'
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // cancel any in-flight fetch
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    // 1) Try sessionStorage cache first (instant render)
    if (typeof window !== 'undefined') {
      try {
        const cachedSpecs = sessionStorage.getItem(`preload:specs:${category}`)
        const cachedPrices = sessionStorage.getItem(`preload:prices:${category}`)
        if (cachedSpecs && cachedPrices) {
          const specData = JSON.parse(cachedSpecs) as PlanWithSpecs[]
          const priceData = JSON.parse(cachedPrices) as PlanPrice[]
          const order = specData.map(p => p.id)
          const priceMap = new Map(priceData.map(p => [p.id, p]))
          setPlansWithSpecs(specData)
          setPlanPrices(order.map(id => priceMap.get(id)).filter(Boolean) as PlanPrice[])
          setLoading(false)
        }
      } catch { /* ignore */ }
    }
    // 2) Fetch fresh data in background and refresh cache
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const [specRes, priceRes] = await Promise.all([
          fetch(`${API_BASE}/api/plans/specs/?category=${category}`, { signal: ctrl.signal }),
          fetch(`${API_BASE}/api/plans/?category=${category}`, { signal: ctrl.signal }),
        ])
        if (!specRes.ok || !priceRes.ok) {
          throw new Error(`Failed to load: specs ${specRes.status}, prices ${priceRes.status}`)
        }
        const [specData, priceData] = (await Promise.all([specRes.json(), priceRes.json()])) as [
          PlanWithSpecs[],
          PlanPrice[],
        ]
        if (ctrl.signal.aborted) return
        // Keep consistent order by specs list
        const order = specData.map(p => p.id)
        const priceMap = new Map(priceData.map(p => [p.id, p]))
        setPlansWithSpecs(specData)
        setPlanPrices(order.map(id => priceMap.get(id)).filter(Boolean) as PlanPrice[])
        // refresh cache so next visit is instant
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`preload:specs:${category}`, JSON.stringify(specData))
          sessionStorage.setItem(`preload:prices:${category}`, JSON.stringify(priceData))
        }
      } catch (e) {
        console.error('Failed to load comparison specs/prices:', e)
        if ((e as any)?.name !== 'AbortError') {
          setError(e instanceof Error ? e.message : 'Failed to load comparison')
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    })()
    return () => { ctrl.abort() }
  }, [API_BASE, category])

  // Build left column (labels) from union of labels, sorted by min order
  const labels = useMemo(() => {
    const map = new Map<string, number>()
    plansWithSpecs.forEach(p => p.specs.forEach(s => {
      map.set(s.label, Math.min(map.get(s.label) ?? s.order, s.order))
    }))
    return [...map.entries()].sort((a,b) => a[1]-b[1]).map(([label]) => label)
  }, [plansWithSpecs])

  const getSpec = (plan: PlanWithSpecs, label: string) =>
    plan.specs.find(s => s.label === label)

  // Always render the anchor section so hash links can scroll even while loading.
  if (loading || !plansWithSpecs.length) {
    return (
      <section id={`${category}-comparison`} className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12" aria-live="polite">
          <p className="text-center text-[#727586]">Loading comparison…</p>
          <div className="mt-6"><TableSkeleton /></div>
        </div>
      </section>
    )
  }

  return (
    <section id={`${category}-comparison`} className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#0B2545] font-['DM_Sans']">
          Compare Our {CATEGORY_TITLES[category]} Packages
        </h2>
        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Card wrapper */}
        <div className="mt-8 overflow-x-auto">
          <div className="mx-auto max-w-[1200px] rounded-2xl shadow-xl ring-1 ring-gray-200 bg-white border-collapse border border-gray-200">
            <table className="min-w-full table-fixed border-separate border-spacing-0" role="table">
              <caption className="sr-only">Side-by-side hosting plan comparison</caption>
              <colgroup>
                <col className="w-[260px]" />
                {plansWithSpecs.map(p => (<col key={p.id} className="w-[235px]" />))}
              </colgroup>

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="sticky left-0 z-20 bg-gray-50 px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-200">
                    <SrOnly>Specification</SrOnly>
                  </th>
                  {plansWithSpecs.map(p => (
                    <th
                      scope="col"
                      key={p.id}
                      className="sticky top-0 z-10 bg-gray-50 px-6 py-4 text-center text-sm font-semibold text-gray-800 border-b border-r last:border-r-0 border-gray-200"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {labels.map((label, idx) => (
                  <tr key={label} className="bg-white">
                    <td
                      className={`sticky left-0 z-10 bg-white px-6 py-3 text-sm ${idx === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'} border-t border-r ${idx === labels.length - 1 ? 'border-b' : ''} border-gray-200`}
                      scope="row"
                    >
                      {label}
                    </td>
                    {plansWithSpecs.map(p => {
                      const spec = getSpec(p, label)
                      return (
                        <td
                          key={p.id}
                          className={`px-6 py-3 text-sm text-gray-900 border-t border-r last:border-r-0 ${idx === labels.length - 1 ? 'border-b' : ''} border-gray-200`}
                        >
                          {spec ? <div className="text-center"><SpecCell spec={spec} /></div> : <span className="text-gray-300">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>

              {/* Price + CTA row */}
              <tfoot>
                <tr>
                  <td className="px-6 py-6 border-t border-r border-gray-200"></td>
                  {planPrices.map(plan => (
                    <td key={plan.id} className="px-4 py-6 align-top border-t border-r last:border-r-0 border-gray-200">
                      <div className="mx-auto w-full max-w-[220px] bg-white p-4 text-center">
                        {(plan.originalPrice || plan.savePercentage) && (
                          <div className="mb-2">
                            {plan.originalPrice && (
                              <span className="text-sm text-[#727586] line-through mr-2">
                                {currency(plan.originalPrice)}
                              </span>
                            )}
                            {plan.savePercentage && (
                              <span className="inline-block rounded-full bg-[#FFEED6] px-2 py-0.5 text-xs font-semibold text-orange-700">
                                Save {plan.savePercentage}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mb-1">
                          <span className="text-3xl font-extrabold text-[#0B2545] font-['DM_Sans']">
                            {currency(plan.price)}
                          </span>
                          <span className="ml-1 align-top text-sm text-[#727586]">/mo</span>
                        </div>
                        <a
                          href={`/checkout?plan_id=${plan.id}`}
                          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#1D4ED8] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#1a43bb] focus:outline-none"
                          aria-label={`Order ${plan.name} at ${currency(plan.price)} per month`}
                        >
                          Order now
                        </a>
                      </div>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
