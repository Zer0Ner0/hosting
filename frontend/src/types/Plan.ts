export type Plan = {
  id: number;
  name: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  category: string;
  is_popular: boolean;
  feature_list: string[];
};