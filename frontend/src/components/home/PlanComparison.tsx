'use client'
import { useEffect, useMemo, useState } from 'react'

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

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.6a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" className="fill-orange-500" />
    </svg>
  )
}
function CrossIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="inline-block h-4 w-4">
      <path d="M14.7 5.3a1 1 0 0 1 0 1.4L11.4 10l3.3 3.3a1 1 0 1 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 1.4-1.4L10 8.6l3.3-3.3a1 1 0 0 1 1.4 0z" className="fill-orange-500" />
    </svg>
  )
}

function Cell({ spec }: { spec: Spec }) {
  if (spec.icon === 'check') return <CheckIcon />
  if (spec.icon === 'times') return <CrossIcon />
  return <span className="text-gray-800">{spec.value}</span>
}

function currency(amount: string | number) {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  if (Number.isNaN(n)) return String(amount)
  // Adjust currency symbol if you want USD instead.
  return `RM ${n.toFixed(2)}`
}

export default function PlanComparison({ category = 'web' }: { category?: 'web' | 'wordpress' | 'email' | 'woocommerce' }) {
  const [plansWithSpecs, setPlansWithSpecs] = useState<PlanWithSpecs[]>([])
  const [planPrices, setPlanPrices] = useState<PlanPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const [specRes, priceRes] = await Promise.all([
          fetch(`http://localhost:8000/api/plans/specs/?category=${category}`),
          fetch(`http://localhost:8000/api/plans/?category=${category}`),
        ])
        const [specData, priceData] = (await Promise.all([specRes.json(), priceRes.json()])) as [
          PlanWithSpecs[],
          PlanPrice[],
        ]
        if (!alive) return
        // Keep consistent order by specs list
        const order = specData.map(p => p.id)
        const priceMap = new Map(priceData.map(p => [p.id, p]))
        setPlansWithSpecs(specData)
        setPlanPrices(order.map(id => priceMap.get(id)).filter(Boolean) as PlanPrice[])
      } catch (e) {
        console.error('Failed to load comparison specs/prices:', e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [category])

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

  if (loading) return <p className="text-center text-[#727586]">Loading comparison…</p>
  if (!plansWithSpecs.length) return null

  return (
    <section className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[#0B2545] font-['DM_Sans']">
          Compare Our Web Hosting Packages
        </h2>

        {/* Card wrapper */}
        <div className="mt-8 overflow-x-auto">
          <div className="mx-auto max-w-[1200px] rounded-2xl shadow-xl ring-1 ring-gray-200 bg-white border-collapse border border-gray-200">
            <table className="min-w-full table-fixed border-separate border-spacing-0">
              <colgroup>
                <col className="w-[260px]" />
                {plansWithSpecs.map(p => (<col key={p.id} className="w-[235px]" />))}
              </colgroup>

              {/* Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 border-b border-r border-gray-200"></th>
                  {plansWithSpecs.map(p => (
                    <th
                      key={p.id}
                      className="px-6 py-4 text-center text-sm font-semibold text-gray-800 border-b border-r last:border-r-0 border-gray-200"
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
                      className={`px-6 py-3 text-sm ${idx === 0 ? 'font-semibold text-gray-900' : 'text-gray-700'} border-t border-r ${idx === labels.length - 1 ? 'border-b' : ''} border-gray-200`}
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
                          {spec ? <div className="text-center"><Cell spec={spec} /></div> : <span className="text-gray-300">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>

              {/* Price + CTA row */}
              <tfoot>
                <tr>
                  <td className="px-6 py-6 border-r border-gray-200"></td>
                  {planPrices.map(plan => (
                    <td key={plan.id} className="px-4 py-6 align-top border-r last:border-r-0 border-gray-200">
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
