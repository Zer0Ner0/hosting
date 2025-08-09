import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { plan_id } = router.query;
  const { data: session, status } = useSession();
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!session?.accessToken || !plan_id) return;
    try {
      const res = await fetch('http://localhost:8000/api/checkout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ plan_id }),
      });
      const data = await res.json();
      if (res.ok) setCheckoutStatus('success'); else setCheckoutStatus(data.error || 'Checkout failed.');
    } catch (err) {
      console.error(err);
      setCheckoutStatus('Error connecting to server.');
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && plan_id) handleCheckout();
  }, [status, plan_id]);

  if (status === 'loading') return <p>Checking login...</p>;
  if (status === 'unauthenticated') { router.replace('/login'); return null; }

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Processing Checkout</h1>
      {checkoutStatus === 'success' ? (<p className="text-green-600">✅ Checkout completed successfully!</p>)
        : checkoutStatus ? (<p className="text-red-600">❌ {checkoutStatus}</p>)
        : (<p>🔄 Completing your order...</p>)}
    </div>
  );
}