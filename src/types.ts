export type Category = 'groceries' | 'dining' | 'delivery' | 'gas' | 'transit' | 'bills' | 'drugstores' | 'entertainment' | 'home' | 'furniture' | 'hotels' | 'games' | 'fitness' | 'other';
export type Budget = Partial<Record<Category, number>>;
export interface RewardGroup { categories: Category[]; rate: number; cap?: number; period?: 'monthly' | 'annual'; totalSpendCap?: number }
export interface Card { id: string; issuer: string; name: string; fee: number; feePeriod: 'annual' | 'monthly'; base: number; color: string; groups: RewardGroup[]; selectable?: boolean; sources: { label: string; url: string }[]; verified: string; note: string }
export interface Configuration { selected?: Category[]; savings?: boolean; feeWaived?: boolean }
