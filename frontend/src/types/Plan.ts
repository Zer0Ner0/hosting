// frontend/src/types/Plan.ts
export type Plan = {
  id: string;            // keep as-is if your UI layer expects string IDs
  name: string;
  description: string;
  originalPrice: string;
  currentPrice: string;
  savePercentage: string;
  term: string;
  renewalPrice: string;
  features: PricingFeature[];
  isPopular: boolean;
  buttonVariant: 'outline' | 'filled';
  buttonText?: string;
  onSelectPlan?: (planId: string) => void;
  billing_cycle?: "monthly" | "yearly";
  category?: string;
};

export interface PricingFeature {
  text: string;
  included: boolean;
  bold?: string;
  underlined?: boolean;
}

export interface EnhancedResponsivePricingCardsProps {
  plans: Plan[];
  title?: string;
  subtitle?: string;
  className?: string;
  showFeatureLimit?: number;
}
