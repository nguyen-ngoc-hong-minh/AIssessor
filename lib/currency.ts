const USD_RATE: Record<"USD" | "AUD" | "VND", number> = { USD: 1, AUD: 0.65, VND: 0.000038 };

export function budgetToUsd(amount: number | null, currency: keyof typeof USD_RATE) {
  return amount === null ? null : Number((amount * USD_RATE[currency]).toFixed(2));
}
