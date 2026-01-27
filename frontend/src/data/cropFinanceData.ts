export interface CropFinance {
  crop: string;
  states: string[];
  season: string;
  avgYield: number;          // tons per hectare
  costPerHectare: number;    // ₹
  pricePerTon: number;       // ₹ MSP / avg market price
  subsidy: number;           // ₹ per hectare (assumed)
}

export const cropFinanceData: CropFinance[] = [
  {
    crop: "Rice",
    states: ["Gujarat", "Maharashtra", "Punjab"],
    season: "Kharif",
    avgYield: 3.5,
    costPerHectare: 45000,
    pricePerTon: 23000,
    subsidy: 6000
  },
  {
    crop: "Wheat",
    states: ["Gujarat", "Punjab", "Haryana"],
    season: "Rabi",
    avgYield: 3.2,
    costPerHectare: 42000,
    pricePerTon: 21500,
    subsidy: 5000
  },
  {
    crop: "Maize",
    states: ["Gujarat", "Karnataka", "Maharashtra"],
    season: "Kharif",
    avgYield: 2.8,
    costPerHectare: 30000,
    pricePerTon: 19000,
    subsidy: 4000
  },
  {
    crop: "Chickpea",
    states: ["Gujarat", "Maharashtra"],
    season: "Rabi",
    avgYield: 1.8,
    costPerHectare: 28000,
    pricePerTon: 24000,
    subsidy: 4500
  },
  {
    crop: "Cotton",
    states: ["Gujarat", "Maharashtra"],
    season: "Kharif",
    avgYield: 1.5,
    costPerHectare: 35000,
    pricePerTon: 28000,
    subsidy: 5500
  },
  {
    crop: "Sugarcane",
    states: ["Gujarat", "Maharashtra"],
    season: "Kharif",
    avgYield: 60,
    costPerHectare: 120000,
    pricePerTon: 2900,
    subsidy: 8000
  },
  {
    crop: "Banana",
    states: ["Gujarat", "Karnataka"],
    season: "Year-round",
    avgYield: 50,
    costPerHectare: 250000,
    pricePerTon: 8000,
    subsidy: 10000
  },
  {
    crop: "Mango",
    states: ["Gujarat", "Maharashtra", "Karnataka"],
    season: "Summer",
    avgYield: 12,
    costPerHectare: 180000,
    pricePerTon: 15000,
    subsidy: 7000
  }
];
