import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const planIdParam = useMemo(() => {
    if (!router.isReady) return null;
    const raw = router.query.plan_id;
    return Array.isArray(raw) ? raw[0] : raw ?? null;
  }, [router.isReady, router.query.plan_id]);

  const domainParam = useMemo(() => {
    if (!router.isReady) return undefined;
    const raw = router.query.domain;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [router.isReady, router.query.domain]);

  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  async function handleCheckout() {
    const appToken = (session as any)?.appToken as string | undefined;
    if (!appToken) return setCheckoutStatus('Not authenticated.');
    if (!planIdParam) return setCheckoutStatus('Missing plan_id.');

    const plan_id = Number(planIdParam);
    if (Number.isNaN(plan_id)) return setCheckoutStatus('Invalid plan_id.');

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000';
      const res = await fetch(`${API_BASE}/api/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${appToken}`,
        },
        body: JSON.stringify({ plan_id, domain: domainParam }),
      });

      if (!res.ok) {
        const text = await res.text();
        setCheckoutStatus(text || 'Checkout failed.');
        return;
      }
      await res.json();
      setCheckoutStatus('success');
    } catch (err) {
      console.error(err);
      setCheckoutStatus('Error connecting to server.');
    }
  }

  useEffect(() => {
    if (router.isReady && status === 'authenticated' && planIdParam) {
      handleCheckout();
    }
  }, [router.isReady, status, planIdParam]);

  if (!router.isReady) return null;
  if (status === 'loading') return <p>Checking login...</p>;

  if (status === 'unauthenticated') {
    // Send user to Google and back here
    signIn('google', { callbackUrl: router.asPath });
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Processing Checkout</h1>
      {checkoutStatus === 'success' ? (
        <p className="text-green-600">✅ Checkout completed successfully!</p>
      ) : checkoutStatus ? (
        <p className="text-red-600">❌ {checkoutStatus}</p>
      ) : (
        <p>🔄 Completing your order...</p>
      )}
    </div>
  );
}
