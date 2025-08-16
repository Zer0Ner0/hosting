import { useEffect, useState } from 'react';
import { getCart, removeFromCart, totalCents, clearCart } from '@/lib/cart';
import { CartItem } from '@/types/Cart';
import { useSession } from 'next-auth/react';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => { setItems(getCart()); }, []);

  const onRemove = (sku: string, item_type: CartItem['item_type']) => {
    removeFromCart(sku, item_type);
    setItems(getCart());
  };

  const cents = totalCents(items);
  const dollars = (cents / 100).toFixed(2);

  const checkout = async () => {
    if (!session) {
      window.location.href = '/login?next=/cart';
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/hosting/checkout/session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(session as any)?.accessToken || ''}`,
      },
      body: JSON.stringify({
        items,
        success_url: `${window.location.origin}/checkout?success=1&order_id={ORDER_ID}`,
        cancel_url: `${window.location.origin}/cart?canceled=1`,
      }),
    });
    if (!res.ok) {
      alert('Failed to start checkout');
      return;
    }
    const data = await res.json();
    clearCart();
    window.location.href = data.checkout_url;
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y rounded-lg border">
            {items.map((i) => (
              <li key={`${i.item_type}-${i.sku}`} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-gray-500">{i.item_type} • {i.sku}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="tabular-nums">${(i.unit_amount_cents / 100).toFixed(2)} × {i.quantity}</span>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onRemove(i.sku, i.item_type)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold tabular-nums">${dollars}</span>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}
