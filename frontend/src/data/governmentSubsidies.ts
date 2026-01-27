/**
 * Static Government Subsidy Schemes Database
 * Frontend-only data for displaying applicable government schemes
 * Based on common Indian agricultural subsidies and schemes
 */

export interface SubsidyScheme {
  id: string;
  schemeName: string;
  crops: string[];
  states: string[];
  seasons: string[];
  benefitType: 'Direct Income Support' | 'Crop Insurance' | 'Input Subsidy' | 'Equipment Subsidy' | 'Irrigation Support' | 'Organic Farming' | 'Pest Management';
  benefitValue: string;
  description: string;
  source: string;
  icon: string;
  eligibility?: string;
}

/**
 * Comprehensive government subsidy schemes database
 * This data is INDICATIVE and REPRESENTATIVE
 * Actual schemes, eligibility, and amounts may vary by year and guidelines
 */
export const governmentSubsidies: SubsidyScheme[] = [
  // ==================== PM-KISAN ====================
  {
    id: 'pm-kisan-001',
    schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Banana'],
    states: ['Gujarat', 'Punjab', 'Maharashtra', 'Madhya Pradesh', 'Karnataka', 'All States'],
    seasons: ['All'],
    benefitType: 'Direct Income Support',
    benefitValue: '₹6,000 per year (₹2,000 per installment, 3 times)',
    description:
      'Direct income support to eligible farmer families. Provides financial benefit of ₹6,000 per annum in three installments.',
    source: 'Government of India - Ministry of Agriculture & Farmers Welfare',
    icon: '💰',
    eligibility: 'Small and marginal farmers with land holding up to 2 hectares'
  },

  // ==================== PMFBY ====================
  {
    id: 'pmfby-001',
    schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka', 'Punjab', 'All States'],
    seasons: ['Kharif', 'Rabi'],
    benefitType: 'Crop Insurance',
    benefitValue: 'Low premium insurance (1.5%-7.5% of sum insured)',
    description:
      'Comprehensive crop insurance scheme. Protects farmers against crop loss due to natural calamities, pests, and diseases. Premium shared between government and farmer.',
    source: 'Ministry of Agriculture & Farmers Welfare',
    icon: '🛡️',
    eligibility: 'All farmers (landholding and tenant farmers)'
  },

  // ==================== RWBHF ====================
  {
    id: 'rwbhf-001',
    schemeName: 'Rashtriya Gokul Mission (Livestock)',
    crops: ['All', 'Sugarcane', 'Maize'],
    states: ['Gujarat', 'Maharashtra', 'Punjab', 'All States'],
    seasons: ['All'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹5,000-₹10,000 per animal',
    description:
      'Provides subsidy for high-yielding cattle breeds and fodder production. Promotes livestock integration with crop farming.',
    source: 'Ministry of Animal Husbandry',
    icon: '🐄',
    eligibility: 'Farmer-breeders engaged in dairy and cattle rearing'
  },

  // ==================== IFFCO NANO ====================
  {
    id: 'iffco-nano-001',
    schemeName: 'IFFCO Nano Fertilizer Subsidy',
    crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Banana'],
    states: ['Gujarat', 'Maharashtra', 'Punjab', 'Karnataka'],
    seasons: ['All'],
    benefitType: 'Input Subsidy',
    benefitValue: '30-40% subsidy on nano fertilizer cost',
    description:
      'Government subsidy for nano fertilizers. Improves nutrient use efficiency and reduces fertilizer quantity while maintaining productivity.',
    source: 'State Agriculture Department',
    icon: '🌾',
    eligibility: 'All farmers purchasing through registered dealers'
  },

  // ==================== SUBSIDY ON TRACTORS ====================
  {
    id: 'tractor-subsidy-001',
    schemeName: 'Subsidy on Farm Machinery (Tractors & Equipment)',
    crops: ['All'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka', 'Punjab'],
    seasons: ['All'],
    benefitType: 'Equipment Subsidy',
    benefitValue: '₹50,000-₹3,00,000 (20-50% of cost)',
    description:
      'Financial assistance for purchase of tractors and agricultural implements. Helps improve mechanization of farming.',
    source: 'State Agriculture Department & NABARD',
    icon: '🚜',
    eligibility: 'Small/marginal farmers with landholding ≥ 0.5 hectare'
  },

  // ==================== DRIP IRRIGATION ====================
  {
    id: 'drip-irrig-001',
    schemeName: 'Per Drop More Crop (PDMC) - Drip Irrigation Subsidy',
    crops: ['Cotton', 'Sugarcane', 'Banana', 'Maize'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['All'],
    benefitType: 'Irrigation Support',
    benefitValue: '50-70% subsidy on drip system cost',
    description:
      'Subsidizes drip irrigation systems installation. Reduces water consumption by 40-50% while increasing productivity.',
    source: 'Ministry of Jal Shakti & State Departments',
    icon: '💧',
    eligibility: 'Farmers in water-scarce areas with suitable land'
  },

  // ==================== RAJIV GANDHI SCHEME ====================
  {
    id: 'rg-krishi-001',
    schemeName: 'Rajiv Gandhi Scheme for Agricultural Development',
    crops: ['Rice', 'Wheat', 'Maize'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['Kharif', 'Rabi'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹1,000-₹5,000 per acre',
    description:
      'Provides subsidies on improved seeds, fertilizers, and plant protection chemicals. Promotes adoption of improved agricultural practices.',
    source: 'State Agriculture Department',
    icon: '🌱',
    eligibility: 'Small and marginal farmers'
  },

  // ==================== ORGANIC FARMING ====================
  {
    id: 'organic-farm-001',
    schemeName: 'Paramparagat Krishi Vikas Yojana (PKVY) - Organic Farming',
    crops: ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka', 'Punjab'],
    seasons: ['All'],
    benefitType: 'Organic Farming',
    benefitValue: '₹500-₹1,000 per acre for 3 years',
    description:
      'Incentivizes organic farming practices. Includes subsidy for vermicompost, neem spray, and organic certification.',
    source: 'Ministry of Agriculture & Farmers Welfare',
    icon: '🌿',
    eligibility: 'Farmers willing to adopt organic farming for min. 3 years'
  },

  // ==================== COTTON PRODUCTION ====================
  {
    id: 'cotton-001',
    schemeName: 'Technology, Quality & Productivity Enhancement in Cotton (TQPC)',
    crops: ['Cotton'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['Kharif'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹600-₹1,200 per hectare',
    description:
      'Subsidy for improved seeds, nutrients, and pest management technologies. Enhances productivity and quality of cotton.',
    source: 'Ministry of Agriculture',
    icon: '🤍',
    eligibility: 'Cotton farmers in notified cotton growing areas'
  },

  // ==================== SOIL HEALTH CARD ====================
  {
    id: 'soil-health-001',
    schemeName: 'Soil Health Card Scheme',
    crops: ['All'],
    states: ['All States'],
    seasons: ['All'],
    benefitType: 'Input Subsidy',
    benefitValue: 'Free soil testing & card generation',
    description:
      'Provides soil testing at subsidized/free rates. Generates soil health card with recommendations for balanced nutrient application.',
    source: 'Ministry of Agriculture & Farmers Welfare',
    icon: '📋',
    eligibility: 'All farmers in registered villages'
  },

  // ==================== SUGARCANE PROMOTION ====================
  {
    id: 'sugarcane-001',
    schemeName: 'Enhanced Sugarcane Production Subsidy (State)',
    crops: ['Sugarcane'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['Rabi', 'Spring'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹2,000-₹5,000 per hectare',
    description:
      'Supports improved sugarcane varieties, certified seeds, and tissue culture plants. Promotes timely planting and harvesting.',
    source: 'State Agriculture Department',
    icon: '🥒',
    eligibility: 'Farmers in sugarcane producing regions'
  },

  // ==================== BANANA CULTIVATION ====================
  {
    id: 'banana-001',
    schemeName: 'Horticulture Mission - Banana Cultivation Support',
    crops: ['Banana'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['All'],
    benefitType: 'Equipment Subsidy',
    benefitValue: '₹1,50,000-₹2,00,000 per hectare for planting material & setup',
    description:
      'Subsidizes high-quality tissue culture plants, irrigation setup, and initial cultivation support for banana farming.',
    source: 'National Horticulture Mission (NHM)',
    icon: '🍌',
    eligibility: 'Farmers interested in commercial banana cultivation'
  },

  // ==================== WHEAT PRODUCTIVITY ====================
  {
    id: 'wheat-001',
    schemeName: 'Wheat Production Enhancement Program',
    crops: ['Wheat'],
    states: ['Punjab', 'Gujarat', 'Maharashtra'],
    seasons: ['Rabi'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹800-₹1,500 per hectare',
    description:
      'Provides subsidies for improved wheat varieties, quality seeds, and nutrient management. Focuses on yield enhancement.',
    source: 'Ministry of Agriculture',
    icon: '🌾',
    eligibility: 'Wheat farmers in designated production zones'
  },

  // ==================== RICE PRODUCTIVITY ====================
  {
    id: 'rice-001',
    schemeName: 'Rice Productivity Enhancement Scheme (RPES)',
    crops: ['Rice'],
    states: ['Gujarat', 'Karnataka', 'Maharashtra'],
    seasons: ['Kharif', 'Rabi'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹1,000-₹2,000 per hectare',
    description:
      'Supports adoption of improved varieties, better nursery management, and scientific cultivation practices.',
    source: 'State Agriculture Department',
    icon: '🍚',
    eligibility: 'Rice farmers in production zones'
  },

  // ==================== MAIZE PRODUCTION ====================
  {
    id: 'maize-001',
    schemeName: 'Maize Productivity Mission',
    crops: ['Maize'],
    states: ['Gujarat', 'Maharashtra', 'Karnataka'],
    seasons: ['Kharif', 'Rabi'],
    benefitType: 'Input Subsidy',
    benefitValue: '₹600-₹1,200 per hectare',
    description:
      'Promotes hybrid maize varieties, quality seed certification, and modern cultivation techniques for improved yields.',
    source: 'Ministry of Agriculture',
    icon: '🌽',
    eligibility: 'Maize farmers registered with agricultural department'
  },

  // ==================== IPM - PEST MANAGEMENT ====================
  {
    id: 'ipm-001',
    schemeName: 'Integrated Pest Management (IPM) Subsidy',
    crops: ['Rice', 'Wheat', 'Cotton', 'Maize'],
    states: ['All States'],
    seasons: ['All'],
    benefitType: 'Pest Management',
    benefitValue: '₹200-₹500 per hectare for IPM components',
    description:
      'Subsidizes eco-friendly pest control measures including bio-agents, pheromone traps, and organic pesticides.',
    source: 'Directorate of Plant Protection',
    icon: '🦠',
    eligibility: 'Farmers adopting IPM practices in certified villages'
  },
];

/**
 * Helper function to filter schemes by crop, state, and season
 * @param crop - Selected crop name
 * @param state - Selected state
 * @param season - Selected season ('Kharif', 'Rabi', or both)
 * @returns Array of applicable schemes
 */
export function getApplicableSchemes(
  crop: string,
  state: string,
  season?: string
): SubsidyScheme[] {
  return governmentSubsidies.filter((scheme) => {
    // Check if crop is applicable (crop name or 'All')
    const cropMatch =
      scheme.crops.includes(crop) || scheme.crops.includes('All');

    // Check if state is applicable (state name or 'All States')
    const stateMatch =
      scheme.states.includes(state) || scheme.states.includes('All States');

    // Check if season is applicable (only if season is provided)
    let seasonMatch = true;
    if (season) {
      seasonMatch =
        scheme.seasons.includes(season) || scheme.seasons.includes('All');
    }

    return cropMatch && stateMatch && seasonMatch;
  });
}

/**
 * Group schemes by benefit type for organized display
 */
export function groupSchemesByType(
  schemes: SubsidyScheme[]
): Record<string, SubsidyScheme[]> {
  return schemes.reduce(
    (acc, scheme) => {
      if (!acc[scheme.benefitType]) {
        acc[scheme.benefitType] = [];
      }
      acc[scheme.benefitType].push(scheme);
      return acc;
    },
    {} as Record<string, SubsidyScheme[]>
  );
}
