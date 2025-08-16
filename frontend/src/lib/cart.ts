import { CartItem } from "@/types/Cart";

const KEY = "cart.items.v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

export function setCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const items = getCart();
  const idx = items.findIndex(
    (i) => i.sku === item.sku && i.item_type === item.item_type
  );
  if (idx >= 0) {
    items[idx].quantity += item.quantity;
  } else {
    items.push(item);
  }
  setCart(items);
}

export function removeFromCart(sku: string, item_type: CartItem["item_type"]) {
  const items = getCart().filter(
    (i) => !(i.sku === sku && i.item_type === item_type)
  );
  setCart(items);
}

export function clearCart() {
  setCart([]);
}

export function totalCents(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.unit_amount_cents * i.quantity, 0);
}
