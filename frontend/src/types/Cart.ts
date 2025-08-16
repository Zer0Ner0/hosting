export type CartItem = {
  item_type: 'plan' | 'domain';
  name: string;
  sku: string;                 // plan_id or domain name
  quantity: number;
  unit_amount_cents: number;   // e.g. 299 -> $2.99
  currency: string;            // 'usd'
};
