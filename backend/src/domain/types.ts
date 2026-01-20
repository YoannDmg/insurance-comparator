// === REIMBURSEMENT TYPES ===

export type PercentageReimbursement = {
  type: 'percentage';
  rate: number;
  socialSecurityDeduction?: boolean;
  loyaltyBonus?: {
    after1Year?: number;
    after2Years?: number;
  };
};

export type FixedReimbursement = {
  type: 'fixed';
  amount: number;
  unit: string;
  perPeriod?: string;
  limit?: {
    count: number;
    unit: string;
  };
};

export type RealCostsReimbursement = {
  type: 'real_costs';
  ceiling?: number;
};

export type Reimbursement =
  | PercentageReimbursement
  | FixedReimbursement
  | RealCostsReimbursement;

// === CATEGORIES ===

export type Category =
  | 'general_care'
  | 'hospitalization'
  | 'optical'
  | 'dental'
  | 'hearing_aids'
  | 'prevention';

// === MAIN MODELS ===

export interface Guarantee {
  category: Category;
  name: string;
  normalizedKey: string;
  reimbursement: Reimbursement;
  conditions?: string[];
  notes?: string[];
}

export interface Plan {
  level: number;
  name: string;
  guarantees: Guarantee[];
}

export interface Insurer {
  name: string;
  brand: string;
  plans: Plan[];
  metadata?: {
    loyaltyBonus?: boolean;
    modularity?: boolean;
    modules?: string[];
  };
}
