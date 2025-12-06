export interface CropInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
}

export interface CropRecommendation {
  crop: string;
  emoji: string;
  confidence: number;
  reasons: string[];
  fertilizers: {
    name: string;
    ratio: string;
    timing: string;
  }[];
  tips: string[];
}

const crops = [
  {
    name: 'Rice',
    emoji: '🌾',
    requirements: {
      nitrogen: { min: 40, max: 80 },
      phosphorus: { min: 20, max: 50 },
      potassium: { min: 100, max: 250 },
      moisture: { min: 50, max: 80 },
      temperature: { min: 22, max: 32 },
      humidity: { min: 60, max: 85 },
    },
    fertilizers: [
      { name: 'Urea', ratio: '46-0-0', timing: 'Apply at transplanting and tillering stage' },
      { name: 'DAP', ratio: '18-46-0', timing: 'Basal application before transplanting' },
    ],
    tips: [
      'Maintain 2-5cm standing water during vegetative growth',
      'Apply nitrogen in split doses for better absorption',
      'Monitor for leaf blast disease in humid conditions',
    ],
  },
  {
    name: 'Wheat',
    emoji: '🌿',
    requirements: {
      nitrogen: { min: 30, max: 70 },
      phosphorus: { min: 25, max: 55 },
      potassium: { min: 80, max: 200 },
      moisture: { min: 35, max: 55 },
      temperature: { min: 15, max: 25 },
      humidity: { min: 40, max: 70 },
    },
    fertilizers: [
      { name: 'NPK Complex', ratio: '12-32-16', timing: 'Apply at sowing time' },
      { name: 'Urea', ratio: '46-0-0', timing: 'Top dressing after first irrigation' },
    ],
    tips: [
      'Sow seeds at optimal depth of 5-6cm',
      'First irrigation critical at crown root initiation',
      'Avoid waterlogging during grain filling stage',
    ],
  },
  {
    name: 'Cotton',
    emoji: '🏵️',
    requirements: {
      nitrogen: { min: 50, max: 90 },
      phosphorus: { min: 30, max: 60 },
      potassium: { min: 150, max: 300 },
      moisture: { min: 40, max: 65 },
      temperature: { min: 25, max: 35 },
      humidity: { min: 50, max: 75 },
    },
    fertilizers: [
      { name: 'MOP', ratio: '0-0-60', timing: 'Apply during boll development' },
      { name: 'Urea', ratio: '46-0-0', timing: 'Split application at flowering' },
    ],
    tips: [
      'Maintain adequate potassium for fiber quality',
      'Monitor for bollworm during flowering',
      'Defoliation may be needed before harvest',
    ],
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    requirements: {
      nitrogen: { min: 35, max: 65 },
      phosphorus: { min: 40, max: 70 },
      potassium: { min: 180, max: 320 },
      moisture: { min: 50, max: 70 },
      temperature: { min: 20, max: 30 },
      humidity: { min: 50, max: 80 },
    },
    fertilizers: [
      { name: 'Calcium Nitrate', ratio: '15.5-0-0', timing: 'Weekly during fruiting' },
      { name: 'NPK', ratio: '10-26-26', timing: 'At transplanting' },
    ],
    tips: [
      'Stake plants for better air circulation',
      'Consistent watering prevents blossom end rot',
      'Remove suckers for larger fruits',
    ],
  },
  {
    name: 'Maize',
    emoji: '🌽',
    requirements: {
      nitrogen: { min: 45, max: 85 },
      phosphorus: { min: 20, max: 45 },
      potassium: { min: 100, max: 220 },
      moisture: { min: 45, max: 70 },
      temperature: { min: 20, max: 32 },
      humidity: { min: 50, max: 80 },
    },
    fertilizers: [
      { name: 'Urea', ratio: '46-0-0', timing: 'Side dressing at knee-high stage' },
      { name: 'DAP', ratio: '18-46-0', timing: 'At sowing' },
    ],
    tips: [
      'Critical irrigation at tasseling stage',
      'Maintain proper plant spacing for pollination',
      'Watch for fall armyworm during vegetative growth',
    ],
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    requirements: {
      nitrogen: { min: 15, max: 40 },
      phosphorus: { min: 30, max: 55 },
      potassium: { min: 80, max: 180 },
      moisture: { min: 40, max: 60 },
      temperature: { min: 22, max: 30 },
      humidity: { min: 50, max: 75 },
    },
    fertilizers: [
      { name: 'Gypsum', ratio: 'Calcium supplement', timing: 'At flowering for pod development' },
      { name: 'SSP', ratio: '0-16-0', timing: 'Basal application' },
    ],
    tips: [
      'Calcium critical for peg penetration',
      'Avoid excess nitrogen - reduces nodulation',
      'Light earthing up after flowering',
    ],
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    requirements: {
      nitrogen: { min: 60, max: 100 },
      phosphorus: { min: 25, max: 50 },
      potassium: { min: 150, max: 280 },
      moisture: { min: 55, max: 80 },
      temperature: { min: 24, max: 35 },
      humidity: { min: 60, max: 85 },
    },
    fertilizers: [
      { name: 'Urea', ratio: '46-0-0', timing: 'Split doses - at planting, tillering, grand growth' },
      { name: 'MOP', ratio: '0-0-60', timing: 'At planting and earthing up' },
    ],
    tips: [
      'Trash mulching conserves moisture',
      'Intercropping possible in early stages',
      'Ratoon management for successive crops',
    ],
  },
  {
    name: 'Potato',
    emoji: '🥔',
    requirements: {
      nitrogen: { min: 40, max: 70 },
      phosphorus: { min: 50, max: 80 },
      potassium: { min: 200, max: 350 },
      moisture: { min: 60, max: 80 },
      temperature: { min: 15, max: 22 },
      humidity: { min: 60, max: 85 },
    },
    fertilizers: [
      { name: 'NPK Complex', ratio: '10-26-26', timing: 'At planting' },
      { name: 'Potassium Sulfate', ratio: '0-0-50', timing: 'During tuber initiation' },
    ],
    tips: [
      'Hilling up critical for tuber development',
      'Avoid frost damage - cover young plants',
      'Cut irrigation before harvest for skin set',
    ],
  },
];

export const getCropRecommendation = (input: CropInput): CropRecommendation | null => {
  let bestMatch = null;
  let highestScore = 0;

  for (const crop of crops) {
    let score = 0;
    const reasons: string[] = [];

    // Check each requirement
    const checks = [
      { name: 'nitrogen', value: input.nitrogen, req: crop.requirements.nitrogen },
      { name: 'phosphorus', value: input.phosphorus, req: crop.requirements.phosphorus },
      { name: 'potassium', value: input.potassium, req: crop.requirements.potassium },
      { name: 'moisture', value: input.moisture, req: crop.requirements.moisture },
      { name: 'temperature', value: input.temperature, req: crop.requirements.temperature },
      { name: 'humidity', value: input.humidity, req: crop.requirements.humidity },
    ];

    for (const check of checks) {
      if (check.value >= check.req.min && check.value <= check.req.max) {
        score += 1;
        reasons.push(`${check.name.charAt(0).toUpperCase() + check.name.slice(1)} level (${check.value}) is optimal for ${crop.name}`);
      } else if (
        check.value >= check.req.min - 10 &&
        check.value <= check.req.max + 10
      ) {
        score += 0.5;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        crop: crop.name,
        emoji: crop.emoji,
        confidence: Math.round((score / 6) * 100),
        reasons: reasons.slice(0, 4),
        fertilizers: crop.fertilizers,
        tips: crop.tips,
      };
    }
  }

  return bestMatch;
};

export const getDefaultRecommendation = (): CropRecommendation => ({
  crop: 'Mixed Vegetables',
  emoji: '🥬',
  confidence: 50,
  reasons: [
    'General soil conditions detected',
    'Multiple crops possible with amendments',
    'Consider soil testing for precise recommendations',
  ],
  fertilizers: [
    { name: 'Balanced NPK', ratio: '10-10-10', timing: 'Apply before planting' },
    { name: 'Compost', ratio: 'Organic matter', timing: 'Mix into topsoil' },
  ],
  tips: [
    'Improve soil structure with organic matter',
    'Test soil pH and adjust if necessary',
    'Start with hardy vegetables like beans or leafy greens',
  ],
});
