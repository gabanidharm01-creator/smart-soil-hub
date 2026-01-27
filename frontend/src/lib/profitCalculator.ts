import { CropFinance } from '@/data/cropFinanceData';

export interface ProfitResult {
  crop: string;
  suitability: number;
  avgYield: number;
  adjustedYield: number;
  cost: number;
  revenue: number;
  subsidy: number;
  netProfit: number;
  profitMargin: number;
}

export interface ProfitCalculationInput {
  crops: CropFinance[];
  suitabilityScores: Record<string, number>;
  area: number;
  state: string;
  season: string;
  minSuitability?: number;
}

export function calculateProfit({
  crops,
  suitabilityScores,
  area,
  state,
  season,
  minSuitability = 0.7
}: ProfitCalculationInput): ProfitResult[] {
  return crops
    .filter(crop => {
      const suitability = suitabilityScores[crop.crop] ?? 0.5;
      return (
        suitability >= minSuitability &&
        crop.states.includes(state) &&
        (season === 'All' || crop.season === season || crop.season === 'Year-round')
      );
    })
    .map(crop => {
      const suitability = suitabilityScores[crop.crop] ?? 0.5;

      // Adjust yield based on suitability (90% to 110% of base yield)
      const adjustedYield = crop.avgYield * (0.9 + 0.2 * suitability);

      // Calculate costs and revenues
      const cost = crop.costPerHectare * area;
      const revenue = adjustedYield * crop.pricePerTon * area;
      const subsidy = crop.subsidy * area;

      // Calculate net profit and margin
      const netProfit = revenue - cost + subsidy;
      const profitMargin = ((netProfit / revenue) * 100);

      return {
        crop: crop.crop,
        suitability: Math.round(suitability * 100) / 100,
        avgYield: Math.round(crop.avgYield * 100) / 100,
        adjustedYield: Math.round(adjustedYield * 100) / 100,
        cost: Math.round(cost),
        revenue: Math.round(revenue),
        subsidy: Math.round(subsidy),
        netProfit: Math.round(netProfit),
        profitMargin: Math.round(profitMargin * 100) / 100
      };
    })
    .sort((a, b) => b.netProfit - a.netProfit);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function getTopProfitableCrop(results: ProfitResult[]): ProfitResult | null {
  return results.length > 0 ? results[0] : null;
}

export function getTotalInvestment(results: ProfitResult[]): number {
  return results.reduce((sum, result) => sum + result.cost, 0);
}

export function getAverageReturn(results: ProfitResult[]): number {
  if (results.length === 0) return 0;
  const totalProfit = results.reduce((sum, result) => sum + result.netProfit, 0);
  return totalProfit / results.length;
}
