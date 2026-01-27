export function calculateProfit({ crops, suitabilityScores, area, state, season }) {
  return crops
    .filter(
      (crop) =>
        suitabilityScores[crop.crop] >= 0.7 &&
        crop.states.includes(state) &&
        crop.season === season,
    )
    .map((crop) => {
      const suitability = suitabilityScores[crop.crop];

      const adjustedYield = crop.avgYield * (0.9 + 0.2 * suitability);

      const cost = crop.costPerHectare * area;
      const revenue = adjustedYield * crop.pricePerTon * area;
      const subsidy = crop.subsidy * area;

      const netProfit = revenue - cost + subsidy;

      return {
        crop: crop.crop,
        suitability,
        cost,
        revenue,
        subsidy,
        netProfit,
      };
    })
    .sort((a, b) => b.netProfit - a.netProfit);
}


