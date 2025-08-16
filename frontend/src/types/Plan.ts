export type Plan = {
  id: number;
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  category: string;
  is_popular: boolean;
  feature_list: string[];
};

 /**
 * Optional UI decorations you may derive on the client when mapping a Plan
 * to a pricing-card shape (originalPrice, renewalPrice, etc).
 */
export type PlanDecorations = {
  originalPrice?: string;
  renewalPrice?: string;
  monthsFree?: string;
  uiDescription?: string;
};

/**
 * Helper to compute typical UI prices from the base plan price.
 * (Keeps this logic consistent anywhere we render plan cards.)
 */
export function deriveUiPricing(price: string) {
  const p = parseFloat(price || '0') || 0;
  const originalPrice = (p * 1.5).toFixed(2);
  const renewalPrice = (p * 1.2).toFixed(2);
  const savePct = Math.max(0, Math.round((1 - p / parseFloat(originalPrice)) * 100));
  const savePercentageLabel = `Save ${savePct}%`;
  return { originalPrice, renewalPrice, savePercentageLabel, currentPrice: p.toFixed(2) };
}