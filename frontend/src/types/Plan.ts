// Backend (API) shape as returned by Django
export type BackendPlanRaw = {
  id: number | string;
  name: string;
  category: string;
  billing_cycle: "monthly" | "yearly";
  price?: number | string;
  originalPrice?: number | string;
  is_popular?: boolean;          // ← from API
  feature_list: string[];        // ← from API
};

// UI feature/type for pricing cards
export type PricingFeature = {
  text: string;
  included: boolean;
  bold?: string;
  underlined?: boolean;
};

// UI plan type for pricing cards
export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  originalPrice: string;
  currentPrice: string;
  savePercentage: string;
  term: string;
  renewalPrice: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonVariant: "outline" | "filled";
  buttonText?: string;
  onSelectPlan?: (planId: string) => void;
};

// Props for the pricing cards wrapper
export interface EnhancedResponsivePricingCardsProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
  className?: string;
  showFeatureLimit?: number;
}
