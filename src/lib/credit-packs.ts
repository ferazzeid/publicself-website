/**
 * Public credit-pack numbers for the marketing site only.
 * Must stay in sync with `stepin/src/lib/creditPacks.ts` (names, USD, credits, per-credit display).
 */

export type MarketingCreditPack = {
  name: string;
  usd: number;
  credits: number;
  /** Per-credit price in USD for optional display (e.g. 0.15) */
  perCreditUsd: number;
};

export const CREDIT_PACKS_LIST: MarketingCreditPack[] = [
  {
    name: "PublicSelf Starter",
    usd: 15,
    credits: 100,
    perCreditUsd: 0.15,
  },
  {
    name: "PublicSelf Studio",
    usd: 79,
    credits: 600,
    perCreditUsd: 0.132,
  },
];
