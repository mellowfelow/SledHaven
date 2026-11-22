export interface ProductSpec {
  engine: string;
  displacement: string;
  horsepower: string;
  track: string;
  suspension: string;
  dryWeight: string;
  fuelCapacity: string;
  starting: string;
}

export interface BrandInfo {
  slug: string;
  name: string;
  origin: string;
  discipline: string;
  summary: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categoryName: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  badge: 'Premium' | 'Popular' | 'New' | 'Best Value' | 'Sale' | null;
  isVehicle: boolean;
  shortDescription: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  inStock: boolean;
  sku: string;
  year: number;
  specs: ProductSpec;
}

export interface Category {
  slug: string;
  name: string;
  shortTitle: string;
  description: string;
  image: string;
  subcategories: { slug: string; name: string }[];
}

export const CATEGORIES: Category[] = [
  {
    slug: 'mountain',
    name: 'Mountain Snowmobiles',
    shortTitle: 'Mountain',
    description:
      'High-altitude deep-powder machines built with carbon chassis geometry, long lug tracks, and turbo-boosted power for steep technical terrain.',
    image: '/images/sled-mountain-turbo.jpg',
    subcategories: [
      { slug: 'deep-powder', name: 'Deep Powder' },
      { slug: 'turbo-backcountry', name: 'Turbo Backcountry' },
    ],
  },
  {
    slug: 'trail',
    name: 'Trail & Performance',
    shortTitle: 'Trail',
    description:
      'Precision-calibrated groomed-trail snowmobiles engineered for razor-sharp cornering, electronic damping, and high-speed stability.',
    image: '/images/sled-trail-gt.jpg',
    subcategories: [
      { slug: 'high-speed-trail', name: 'High-Speed Trail' },
      { slug: 'rough-trail-race', name: 'Rough-Trail Race' },
    ],
  },
  {
    slug: 'crossover',
    name: 'Crossover Snowmobiles',
    shortTitle: 'Crossover',
    description:
      'Wide-stance, deeper-lug machines built for mixed trail-and-backcountry riding — ready when the groomed corridor ends.',
    image: '/images/sled-trail-gt.jpg',
    subcategories: [
      { slug: 'trail-performance-crossover', name: 'Trail-Performance Crossover' },
      { slug: 'backcountry-crossover', name: 'Backcountry Utility-Crossover' },
    ],
  },
  {
    slug: 'touring',
    name: 'Touring & Luxury',
    shortTitle: 'Touring',
    description:
      'Refined two-up grand touring sleds featuring heated sculpted seating, whisper-quiet four-stroke powerplants, and integrated hard luggage.',
    image: '/images/sled-touring-luxury.jpg',
    subcategories: [
      { slug: 'grand-touring-2up', name: '2-Up Grand Touring' },
      { slug: 'expedition-luxury', name: 'Expedition Luxury' },
    ],
  },
  {
    slug: 'utility',
    name: 'Utility & Alpine Gear',
    shortTitle: 'Utility & Gear',
    description:
      'Heavy-duty wide-track workhorses for ranch, resort, and expedition haulage alongside carbon-fiber heated rider protection.',
    image: '/images/sled-utility-widetrack.jpg',
    subcategories: [
      { slug: 'heavy-duty-utility', name: 'Heavy-Duty Utility' },
      { slug: 'heated-gear', name: 'Heated Gear & Cargo' },
    ],
  },
];

export const BRANDS: BrandInfo[] = [
  {
    slug: 'alpine-works',
    name: 'Alpine Works',
    origin: 'Mountain West Engineering',
    discipline: 'Deep Powder & Turbo Backcountry',
    summary:
      'High-altitude carbon-tunnel mountain chassis engineered for zero-fade forced induction above 10,000 feet.',
    image: '/images/sled-mountain-turbo.jpg',
  },
  {
    slug: 'kodiak-alpine',
    name: 'Kodiak Alpine',
    origin: 'Northern Rockies Division',
    discipline: 'Lightweight Technical Backcountry',
    summary:
      'Naturally aspirated, factory-blueprinted mountain and ridge sleds tuned for immediate throttle snap in steep timber.',
    image: '/images/sled-mountain-turbo.jpg',
  },
  {
    slug: 'vanguard-motors',
    name: 'Vanguard Motors',
    origin: 'Great Lakes Performance',
    discipline: 'High-Speed Trail & Crossover',
    summary:
      'Precision groomed-trail and rough-bump chassis featuring semi-active electronic damping and race-grade Brembo braking.',
    image: '/images/sled-trail-gt.jpg',
  },
  {
    slug: 'glacier-reserve',
    name: 'Glacier Reserve',
    origin: 'New England & Alpine Touring',
    discipline: 'Two-Up Luxury & Expedition',
    summary:
      'Whisper-quiet four-stroke grand touring sleds appointed with independent heated seating, air-ride suspension, and lockable panniers.',
    image: '/images/sled-touring-luxury.jpg',
  },
  {
    slug: 'yukon-heavy',
    name: 'Yukon Heavy',
    origin: 'Northern Utility & Estate',
    discipline: 'Wide-Track Utility & Haulage',
    summary:
      '20-inch articulating wide-track workhorses built with High/Low/Reverse gearboxes and 1,500 lb Class-II towing hardware.',
    image: '/images/sled-utility-widetrack.jpg',
  },
  {
    slug: 'sledhaven-gear',
    name: 'SledHaven Equipment',
    origin: 'USA Alpine Protection',
    discipline: 'Carbon Heated Helmets & Cargo',
    summary:
      'DOT/ECE aerospace 3K carbon-fiber helmets and sub-zero heated visor protection qualifying for free US parcel shipping.',
    image: '/images/gear-carbon-helmet.jpg',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'sh-mtn-850tr',
    slug: 'alpine-summit-850-turbo-r',
    name: 'Alpine Summit 850 Turbo R',
    brand: 'Alpine Works',
    brandSlug: 'alpine-works',
    category: 'mountain',
    categoryName: 'Mountain Snowmobiles',
    subcategory: 'Turbo Backcountry',
    subcategorySlug: 'turbo-backcountry',
    price: 16799,
    badge: 'Premium',
    isVehicle: true,
    shortDescription:
      'Factory-turbocharged 849cc deep-powder flagship with carbon tunnel and Kashima coil-over suspension.',
    description:
      'Engineered for high-elevation bowls and steep timber lines above 10,000 feet, the Alpine Summit 850 Turbo R maintains full sea-level output without lag. Finished in matte obsidian with burnished bronze anodized rail hardware, a 165-inch 3.0-inch lug track, and narrow 34-inch ski stance for effortless side-hilling.',
    highlights: [
      '180 hp factory-calibrated two-stroke turbocharger with zero altitude fade',
      'Carbon-reinforced short tunnel reduces drag in deep snow',
      'Kashima-coated high/low-speed compression adjustable coil-over shocks',
      'Ships crated nationwide with Manufacturer Certificate of Origin (MCO)',
    ],
    image: '/images/sled-mountain-turbo.jpg',
    imageAlt: 'Alpine Summit 850 Turbo R matte black and bronze mountain snowmobile',
    inStock: true,
    sku: 'SH-MTN-850TR',
    year: 2026,
    specs: {
      engine: '2-Stroke Liquid-Cooled Turbo',
      displacement: '849 cc',
      horsepower: '180 HP',
      track: '165" x 15" x 3.0" PowderMax',
      suspension: 'Kashima Coil-Over Front / tMotion Rear',
      dryWeight: '434 lbs',
      fuelCapacity: '9.5 gal',
      starting: 'SHOT Capacitor / Electric',
    },
  },
  {
    id: 'sh-mtn-9r155',
    slug: 'kodiak-peak-9r-155',
    name: 'Kodiak Peak 9R 155',
    brand: 'Kodiak Alpine',
    brandSlug: 'kodiak-alpine',
    category: 'mountain',
    categoryName: 'Mountain Snowmobiles',
    subcategory: 'Deep Powder',
    subcategorySlug: 'deep-powder',
    price: 16699,
    badge: 'Popular',
    isVehicle: true,
    shortDescription:
      'Naturally aspirated 900cc lightweight mountain chassis tuned for technical tree riding and instant throttle response.',
    description:
      'Built for riders who prioritize razor-fast spool and ultra-low rotational mass over forced induction. The Kodiak Peak 9R 155 pairs a factory blueprinted 899cc twin with a tapered forged aluminum bulkhead and 155-inch 2.75-inch lug track.',
    highlights: [
      'Factory-lightened crank and billet intake for instantaneous throttle snap',
      '155-inch agile length excels in tight technical timber',
      'LED alpine projection headlights and heated mountain grab strap',
      'Full 50-state MCO paperwork included with every crated dispatch',
    ],
    image: '/images/sled-mountain-turbo.jpg',
    imageAlt: 'Kodiak Peak 9R 155 mountain snowmobile in studio lighting',
    inStock: true,
    sku: 'SH-MTN-9R155',
    year: 2026,
    specs: {
      engine: '2-Stroke Liquid-Cooled Twin',
      displacement: '899 cc',
      horsepower: '172 HP',
      track: '155" x 15" x 2.75" Series 8',
      suspension: 'Walker Evans Velocity Hi-Lo',
      dryWeight: '418 lbs',
      fuelCapacity: '11.0 gal',
      starting: 'Electric & Manual Recoil',
    },
  },
  {
    id: 'sh-mtn-650pro',
    slug: 'teton-ridge-650-pro',
    name: 'Teton Ridge 650 Pro',
    brand: 'Kodiak Alpine',
    brandSlug: 'kodiak-alpine',
    category: 'mountain',
    categoryName: 'Mountain Snowmobiles',
    subcategory: 'Deep Powder',
    subcategorySlug: 'deep-powder',
    price: 14699,
    badge: 'Best Value',
    isVehicle: true,
    shortDescription:
      'Balanced 650cc backcountry sled offering crisp mid-range torque, predictable handling, and all-day durability.',
    description:
      'The Teton Ridge 650 Pro delivers confident deep-snow maneuverability without intimidating power spikes. Ideal for riders stepping into Rocky Mountain powder or navigating mixed meadow-and-chute terrain.',
    highlights: [
      'Ultra-reliable 650cc direct-injection twin with low oil consumption',
      'Narrow running boards clear snow pack instantly',
      'Selectable rider ergonomics with adjustable riser block',
      'Eligible for Pay-in-4 financing or 10% instant cryptocurrency savings',
    ],
    image: '/images/sled-mountain-turbo.jpg',
    imageAlt: 'Teton Ridge 650 Pro backcountry snowmobile',
    inStock: true,
    sku: 'SH-MTN-650P',
    year: 2026,
    specs: {
      engine: '2-Stroke Direct Injection',
      displacement: '650 cc',
      horsepower: '135 HP',
      track: '154" x 15" x 2.5" FlexEdge',
      suspension: 'KYB 36 Gas Cell Piggyback',
      dryWeight: '429 lbs',
      fuelCapacity: '10.5 gal',
      starting: 'Electric Start Standard',
    },
  },
  {
    id: 'sh-trl-900gt',
    slug: 'vanguard-gt-900-turbo',
    name: 'Vanguard GT 900 Turbo',
    brand: 'Vanguard Motors',
    brandSlug: 'vanguard-motors',
    category: 'trail',
    categoryName: 'Trail & Performance',
    subcategory: 'High-Speed Trail',
    subcategorySlug: 'high-speed-trail',
    price: 16799,
    badge: 'New',
    isVehicle: true,
    shortDescription:
      '180hp 4-stroke turbocharged precision trail cruiser with semi-active electronic suspension and 10.25-inch GPS display.',
    description:
      'Command northern lakes and sweeping groomed corridors with refined four-stroke composure. The Vanguard GT 900 Turbo pairs a whisper-smooth 900cc triple turbo with real-time electronically damped suspension that reads terrain 100 times per second.',
    highlights: [
      'Three-mode semi-active electronic suspension (Comfort, Sport, Track)',
      '10.25-inch panoramic color touchscreen with built-in US trail maps',
      'Heated thumb throttle, grips, and pilot seat with dual-zone control',
      'Precision 4-piston hydraulic race brake with braided stainless line',
    ],
    image: '/images/sled-trail-gt.jpg',
    imageAlt: 'Vanguard GT 900 Turbo pearl silver and graphite trail snowmobile',
    inStock: true,
    sku: 'SH-TRL-900GT',
    year: 2026,
    specs: {
      engine: '4-Stroke 3-Cylinder Turbo',
      displacement: '899 cc',
      horsepower: '180 HP',
      track: '137" x 15" x 1.25" Ice Ripper XT',
      suspension: 'Smart-Shox Semi-Active Electronic',
      dryWeight: '509 lbs',
      fuelCapacity: '9.5 gal',
      starting: 'Push-Button Electric',
    },
  },
  {
    id: 'sh-xcr-850',
    slug: 'monashee-crossover-850-xc',
    name: 'Monashee Crossover 850 XC',
    brand: 'Vanguard Motors',
    brandSlug: 'vanguard-motors',
    category: 'crossover',
    categoryName: 'Crossover Snowmobiles',
    subcategory: 'Trail-Performance Crossover',
    subcategorySlug: 'trail-performance-crossover',
    price: 15999,
    badge: 'New',
    isVehicle: true,
    shortDescription:
      'Wide-stance, long-travel crossover built to run groomed corridors all morning and duck off-trail into ungroomed powder by afternoon without a trailer change.',
    description:
      'The Monashee Crossover 850 XC pairs a deeper-lug 146-inch track with a widened 42-inch ski stance and long-travel rear suspension, so the same machine that carves a groomed trail corridor stays composed when the trail ends and the snow gets deep. Where the Vanguard GT 900 Turbo is built to stay on-trail, the Monashee is built to leave it.',
    highlights: [
      '146" x 16" x 1.6" deeper-lug track for mixed trail-and-powder traction',
      '42" wide ski stance for off-trail stability without sacrificing trail agility',
      'Long-travel rear suspension: 9.5" front / 16" rear wheel travel',
      'Eligible for Pay-in-4 financing or 10% instant cryptocurrency savings',
    ],
    image: '/images/sled-trail-gt.jpg',
    imageAlt: 'Monashee Crossover 850 XC wide-stance crossover snowmobile at the treeline',
    inStock: true,
    sku: 'SH-XCR-850',
    year: 2026,
    specs: {
      engine: '4-Stroke 2-Cylinder Turbo',
      displacement: '849 cc',
      horsepower: '165 HP',
      track: '146" x 16" x 1.6" Cross-Country Lug',
      suspension: 'Long-Travel rMotion X — 9.5" Front / 16" Rear Travel',
      dryWeight: '519 lbs',
      fuelCapacity: '10.8 gal',
      starting: 'Push-Button Electric',
    },
  },
  {
    id: 'sh-trl-850xrs',
    slug: 'adirondack-apex-850-xrs',
    name: 'Adirondack Apex 850 XRS',
    brand: 'Vanguard Motors',
    brandSlug: 'vanguard-motors',
    category: 'trail',
    categoryName: 'Trail & Performance',
    subcategory: 'Rough-Trail Race',
    subcategorySlug: 'rough-trail-race',
    price: 16499,
    badge: 'Popular',
    isVehicle: true,
    shortDescription:
      'Race-bred rough-trail machine with reinforced chassis rails, KYB Pro 40 dampers, and dual-stage Brembo braking.',
    description:
      'Built for late-afternoon stutter bumps and aggressive weekend mileage across New England and the Upper Midwest. Reinforced bulkhead bracing and competition-spec valving keep skis planted through every apex.',
    highlights: [
      'KYB Pro 40 aluminum piggyback shocks with external clicker adjustments',
      'Pre-studded 137-inch Ice Ripper track for confident corner bite',
      'Adjustable forward-steering post and race-grade gripper seat cover',
      'Zero-haggle dealership pricing with transparent state freight calculation',
    ],
    image: '/images/sled-trail-gt.jpg',
    imageAlt: 'Adirondack Apex 850 XRS performance trail snowmobile',
    inStock: true,
    sku: 'SH-TRL-850XRS',
    year: 2026,
    specs: {
      engine: '2-Stroke Direct Injection Twin',
      displacement: '849 cc',
      horsepower: '165 HP',
      track: '137" x 15" x 1.25" RipSaw II',
      suspension: 'KYB Pro 40 External Reservoir',
      dryWeight: '468 lbs',
      fuelCapacity: '9.5 gal',
      starting: 'Electric Start Standard',
    },
  },
  {
    id: 'sh-trg-900ltd',
    slug: 'glacier-reserve-limited-900',
    name: 'Glacier Reserve Limited 900',
    brand: 'Glacier Reserve',
    brandSlug: 'glacier-reserve',
    category: 'touring',
    categoryName: 'Touring & Luxury',
    subcategory: '2-Up Grand Touring',
    subcategorySlug: 'grand-touring-2up',
    price: 15999,
    badge: 'Premium',
    isVehicle: true,
    shortDescription:
      'Flagship two-up grand touring sled with heated leather-trimmed seats, silent-drive track, and 45L hard panniers.',
    description:
      'Designed for multi-day lodge-to-lodge expeditions in uncompromised comfort. Both rider and passenger enjoy independent heated seating, heated visor power outlets, wind-tunnel sculpted fairing protection, and lockable weather-sealed hard saddlebags.',
    highlights: [
      'Independent rider and passenger heated ergonomic seats with lumbar backrest',
      'Silent-Drive II track architecture cuts cabin vibration by 65%',
      '45-liter color-matched lockable hard panniers plus rear top trunk',
      'Push-button air-controlled rear suspension adapts instantly for 1-up or 2-up',
    ],
    image: '/images/sled-touring-luxury.jpg',
    imageAlt: 'Glacier Reserve Limited 900 dark slate luxury two-up touring snowmobile',
    inStock: true,
    sku: 'SH-TRG-900LTD',
    year: 2026,
    specs: {
      engine: '4-Stroke 3-Cylinder Turbo',
      displacement: '899 cc',
      horsepower: '130 HP',
      track: '137" x 15" x 1.25" Silent-Drive II',
      suspension: 'ACS Air-Controlled 5-Stage Rear',
      dryWeight: '548 lbs',
      fuelCapacity: '10.6 gal',
      starting: 'Electric + Heated Visor Ports',
    },
  },
  {
    id: 'sh-trg-600gt',
    slug: 'cascade-grand-touring-600',
    name: 'Cascade Grand Touring 600',
    brand: 'Glacier Reserve',
    brandSlug: 'glacier-reserve',
    category: 'touring',
    categoryName: 'Touring & Luxury',
    subcategory: 'Expedition Luxury',
    subcategorySlug: 'expedition-luxury',
    price: 13950,
    badge: null,
    isVehicle: true,
    shortDescription:
      'Whisper-quiet four-stroke touring snowmobile with tall wind protection, electric start, and effortless fuel range.',
    description:
      'A refined, approachable touring companion built for scenic alpine highways and groomed state park networks. Delivers over 200 miles per tank with silky throttle modulation and plush dual-passenger comfort.',
    highlights: [
      'Ultra-clean 600cc four-stroke engine with 22+ mpg touring efficiency',
      'High-coverage sculpted polycarbonate windshield with side deflectors',
      'Quick-detach passenger seat converts to solo cargo deck in 30 seconds',
      'Backed by SledHaven nationwide crated delivery and title support',
    ],
    image: '/images/sled-touring-luxury.jpg',
    imageAlt: 'Cascade Grand Touring 600 touring snowmobile',
    inStock: true,
    sku: 'SH-TRG-600GT',
    year: 2026,
    specs: {
      engine: '4-Stroke Twin Cylinder',
      displacement: '600 cc',
      horsepower: '85 HP',
      track: '137" x 15" x 1.25" QuietTrack',
      suspension: 'Hydraulic Dual-Tube Comfort',
      dryWeight: '496 lbs',
      fuelCapacity: '10.6 gal',
      starting: 'Electric Start Standard',
    },
  },
  {
    id: 'sh-utl-900wt',
    slug: 'yukon-hauler-widetrack-900',
    name: 'Yukon Hauler WideTrack 900',
    brand: 'Yukon Heavy',
    brandSlug: 'yukon-heavy',
    category: 'utility',
    categoryName: 'Utility & Alpine Gear',
    subcategory: 'Heavy-Duty Utility',
    subcategorySlug: 'heavy-duty-utility',
    price: 15799,
    badge: 'Popular',
    isVehicle: true,
    shortDescription:
      '20-inch wide articulating track utility sled with High/Low/Reverse gearbox, 1,500 lb tow rating, and steel cargo deck.',
    description:
      'Built for mountain estates, backcountry lodges, and timber operations where failure is not an option. The Yukon Hauler WideTrack 900 pairs a massive 20-inch footprint with an articulated rear skid that climbs backwards out of deep drifts effortlessly.',
    highlights: [
      'Synchronized 2-speed High / Low / Reverse transmission for heavy towing',
      '1,500 lb Class-II receiver hitch with integrated heavy-duty steel bumper',
      '20-inch x 154-inch Cobra wide track maximizes flotation in unpacked snow',
      'Auxiliary 650W alternator supports LED lightbars, heated gear, and winch',
    ],
    image: '/images/sled-utility-widetrack.jpg',
    imageAlt: 'Yukon Hauler WideTrack 900 heavy-duty utility snowmobile',
    inStock: true,
    sku: 'SH-UTL-900WT',
    year: 2026,
    specs: {
      engine: '4-Stroke 3-Cylinder High-Torque',
      displacement: '899 cc',
      horsepower: '95 HP',
      track: '154" x 20" x 1.5" Cobra WT',
      suspension: 'SC-5U Articulating Lockable Rear',
      dryWeight: '612 lbs',
      fuelCapacity: '11.1 gal',
      starting: 'Heavy-Duty Cold-Crank Electric',
    },
  },
  {
    id: 'sh-gear-ch01',
    slug: 'sledhaven-carbon-heated-helmet',
    name: 'SledHaven Carbon Heated Helmet Kit',
    brand: 'SledHaven Equipment',
    brandSlug: 'sledhaven-gear',
    category: 'utility',
    categoryName: 'Utility & Alpine Gear',
    subcategory: 'Heated Gear & Cargo',
    subcategorySlug: 'heated-gear',
    price: 649,
    badge: 'Best Value',
    isVehicle: false,
    shortDescription:
      'DOT/ECE 3K woven carbon-fiber alpine helmet with bronze mirrored dual-pane heated magnetic shield.',
    description:
      'Featherweight protection engineered for sub-zero visibility. Constructed from hand-laid 3K aerospace carbon fiber with an anti-fog dual-pane electric shield, magnetic RCA quick-disconnect cord, and cold-weather silicone breath deflector. Qualifies automatically for Free US Parcel Shipping (orders $500+).',
    highlights: [
      'Hand-laid 3K matte carbon-fiber shell weighing just 1,320 grams',
      'Bronze mirrored dual-pane electric heated shield prevents icing down to -40°F',
      'Fidlock magnetic chin strap operable with thick insulated gauntlets',
      'Qualifies for Free Nationwide US Shipping on gear orders over $500',
    ],
    image: '/images/gear-carbon-helmet.jpg',
    imageAlt: 'SledHaven Carbon Heated Helmet with bronze mirrored visor',
    inStock: true,
    sku: 'SH-GR-CH01',
    year: 2026,
    specs: {
      engine: 'N/A — Protective Gear',
      displacement: 'DOT / ECE 22.06 Certified',
      horsepower: '12V Heated Shield Harness',
      track: '3K Matte Carbon Fiber Shell',
      suspension: 'Multi-Density EPS Liner',
      dryWeight: '2.9 lbs (1,320 g)',
      fuelCapacity: 'Includes 12V RCA & RCA-to-RCA Kit',
      starting: 'Sizes S / M / L / XL / 2XL',
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export interface StateShippingRule {
  code: string;
  name: string;
  vehicleFreight: number;
  parcelFee: number;
  estimatedTaxRate: number; // Decimal e.g. 0.0625
  transitDays: string;
  regulatoryNote: string;
}

export const US_STATES_SHIPPING: StateShippingRule[] = [
  { code: 'AK', name: 'Alaska', vehicleFreight: 1150, parcelFee: 45, estimatedTaxRate: 0.0, transitDays: '9–14 business days', regulatoryNote: 'Port-to-door crated barge/air freight; 0% state sales tax.' },
  { code: 'AL', name: 'Alabama', vehicleFreight: 790, parcelFee: 25, estimatedTaxRate: 0.04, transitDays: '5–8 business days', regulatoryNote: 'Insured liftgate crated freight; MCO provided.' },
  { code: 'AR', name: 'Arkansas', vehicleFreight: 740, parcelFee: 25, estimatedTaxRate: 0.065, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight with state MCO packet.' },
  { code: 'AZ', name: 'Arizona', vehicleFreight: 690, parcelFee: 25, estimatedTaxRate: 0.056, transitDays: '4–6 business days', regulatoryNote: 'Insured liftgate crated freight.' },
  { code: 'CA', name: 'California', vehicleFreight: 680, parcelFee: 25, estimatedTaxRate: 0.0725, transitDays: '4–6 business days', regulatoryNote: 'CARB-compliant off-highway MCO documentation included.' },
  { code: 'CO', name: 'Colorado', vehicleFreight: 450, parcelFee: 20, estimatedTaxRate: 0.029, transitDays: '2–4 business days', regulatoryNote: 'Mountain West priority dispatch; CPW registration ready.' },
  { code: 'CT', name: 'Connecticut', vehicleFreight: 760, parcelFee: 25, estimatedTaxRate: 0.0635, transitDays: '5–7 business days', regulatoryNote: 'Northeast insured crated freight.' },
  { code: 'DE', name: 'Delaware', vehicleFreight: 740, parcelFee: 25, estimatedTaxRate: 0.0, transitDays: '5–7 business days', regulatoryNote: '0% state sales tax; insured crated freight.' },
  { code: 'FL', name: 'Florida', vehicleFreight: 850, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '6–9 business days', regulatoryNote: 'Insured liftgate freight; MCO supplied.' },
  { code: 'GA', name: 'Georgia', vehicleFreight: 780, parcelFee: 25, estimatedTaxRate: 0.04, transitDays: '5–8 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'HI', name: 'Hawaii', vehicleFreight: 1290, parcelFee: 45, estimatedTaxRate: 0.04, transitDays: '10–15 business days', regulatoryNote: 'Ocean crated container freight to port.' },
  { code: 'IA', name: 'Iowa', vehicleFreight: 560, parcelFee: 20, estimatedTaxRate: 0.06, transitDays: '3–5 business days', regulatoryNote: 'Midwest regional carrier; Iowa DNR MCO included.' },
  { code: 'ID', name: 'Idaho', vehicleFreight: 460, parcelFee: 20, estimatedTaxRate: 0.06, transitDays: '2–4 business days', regulatoryNote: 'Mountain West priority dispatch; Idaho Parks & Rec MCO ready.' },
  { code: 'IL', name: 'Illinois', vehicleFreight: 590, parcelFee: 20, estimatedTaxRate: 0.0625, transitDays: '3–5 business days', regulatoryNote: 'Midwest regional liftgate freight.' },
  { code: 'IN', name: 'Indiana', vehicleFreight: 620, parcelFee: 20, estimatedTaxRate: 0.07, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'KS', name: 'Kansas', vehicleFreight: 590, parcelFee: 20, estimatedTaxRate: 0.065, transitDays: '3–5 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'KY', name: 'Kentucky', vehicleFreight: 680, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'LA', name: 'Louisiana', vehicleFreight: 790, parcelFee: 25, estimatedTaxRate: 0.0445, transitDays: '5–8 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'MA', name: 'Massachusetts', vehicleFreight: 760, parcelFee: 25, estimatedTaxRate: 0.0625, transitDays: '5–7 business days', regulatoryNote: 'New England crated delivery with MCO.' },
  { code: 'MD', name: 'Maryland', vehicleFreight: 720, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '4–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'ME', name: 'Maine', vehicleFreight: 780, parcelFee: 25, estimatedTaxRate: 0.055, transitDays: '5–7 business days', regulatoryNote: 'Maine IFW registration-ready MCO included.' },
  { code: 'MI', name: 'Michigan', vehicleFreight: 550, parcelFee: 20, estimatedTaxRate: 0.06, transitDays: '3–5 business days', regulatoryNote: 'Great Lakes priority crated freight; SOS MCO included.' },
  { code: 'MN', name: 'Minnesota', vehicleFreight: 520, parcelFee: 20, estimatedTaxRate: 0.06875, transitDays: '3–5 business days', regulatoryNote: 'Northwoods priority carrier; MN DNR MCO included.' },
  { code: 'MO', name: 'Missouri', vehicleFreight: 610, parcelFee: 20, estimatedTaxRate: 0.04225, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'MS', name: 'Mississippi', vehicleFreight: 770, parcelFee: 25, estimatedTaxRate: 0.07, transitDays: '5–8 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'MT', name: 'Montana', vehicleFreight: 420, parcelFee: 20, estimatedTaxRate: 0.0, transitDays: '2–4 business days', regulatoryNote: '0% state sales tax; Mountain West priority crated freight.' },
  { code: 'NC', name: 'North Carolina', vehicleFreight: 740, parcelFee: 25, estimatedTaxRate: 0.0475, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'ND', name: 'North Dakota', vehicleFreight: 510, parcelFee: 20, estimatedTaxRate: 0.05, transitDays: '3–5 business days', regulatoryNote: 'Northern Plains crated carrier; ND Parks MCO included.' },
  { code: 'NE', name: 'Nebraska', vehicleFreight: 540, parcelFee: 20, estimatedTaxRate: 0.055, transitDays: '3–5 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'NH', name: 'New Hampshire', vehicleFreight: 750, parcelFee: 25, estimatedTaxRate: 0.0, transitDays: '5–7 business days', regulatoryNote: '0% state sales tax; NH Fish & Game MCO ready.' },
  { code: 'NJ', name: 'New Jersey', vehicleFreight: 740, parcelFee: 25, estimatedTaxRate: 0.06625, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'NM', name: 'New Mexico', vehicleFreight: 580, parcelFee: 20, estimatedTaxRate: 0.05125, transitDays: '3–5 business days', regulatoryNote: 'Southwest crated carrier.' },
  { code: 'NV', name: 'Nevada', vehicleFreight: 590, parcelFee: 20, estimatedTaxRate: 0.0685, transitDays: '3–5 business days', regulatoryNote: 'Sierra / Basin crated freight.' },
  { code: 'NY', name: 'New York', vehicleFreight: 720, parcelFee: 25, estimatedTaxRate: 0.04, transitDays: '4–7 business days', regulatoryNote: 'NY DMV snowmobile registration MCO packet included.' },
  { code: 'OH', name: 'Ohio', vehicleFreight: 640, parcelFee: 20, estimatedTaxRate: 0.0575, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'OK', name: 'Oklahoma', vehicleFreight: 670, parcelFee: 25, estimatedTaxRate: 0.045, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'OR', name: 'Oregon', vehicleFreight: 540, parcelFee: 20, estimatedTaxRate: 0.0, transitDays: '3–5 business days', regulatoryNote: '0% state sales tax; Pacific Northwest crated carrier.' },
  { code: 'PA', name: 'Pennsylvania', vehicleFreight: 690, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '4–6 business days', regulatoryNote: 'PA DCNR snowmobile MCO packet included.' },
  { code: 'RI', name: 'Rhode Island', vehicleFreight: 760, parcelFee: 25, estimatedTaxRate: 0.07, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'SC', name: 'South Carolina', vehicleFreight: 760, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'SD', name: 'South Dakota', vehicleFreight: 490, parcelFee: 20, estimatedTaxRate: 0.042, transitDays: '3–5 business days', regulatoryNote: 'Black Hills priority carrier; MCO included.' },
  { code: 'TN', name: 'Tennessee', vehicleFreight: 720, parcelFee: 25, estimatedTaxRate: 0.07, transitDays: '4–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'TX', name: 'Texas', vehicleFreight: 740, parcelFee: 25, estimatedTaxRate: 0.0625, transitDays: '5–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'UT', name: 'Utah', vehicleFreight: 470, parcelFee: 20, estimatedTaxRate: 0.061, transitDays: '2–4 business days', regulatoryNote: 'Wasatch priority crated carrier; Utah DMV MCO included.' },
  { code: 'VA', name: 'Virginia', vehicleFreight: 720, parcelFee: 25, estimatedTaxRate: 0.053, transitDays: '4–7 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'VT', name: 'Vermont', vehicleFreight: 760, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '5–7 business days', regulatoryNote: 'VAST trail-ready MCO paperwork included.' },
  { code: 'WA', name: 'Washington', vehicleFreight: 550, parcelFee: 20, estimatedTaxRate: 0.065, transitDays: '3–5 business days', regulatoryNote: 'Cascades priority carrier; WA DOL MCO included.' },
  { code: 'WI', name: 'Wisconsin', vehicleFreight: 530, parcelFee: 20, estimatedTaxRate: 0.05, transitDays: '3–5 business days', regulatoryNote: 'WI DNR registration-ready MCO included.' },
  { code: 'WV', name: 'West Virginia', vehicleFreight: 700, parcelFee: 25, estimatedTaxRate: 0.06, transitDays: '4–6 business days', regulatoryNote: 'Insured crated freight.' },
  { code: 'WY', name: 'Wyoming', vehicleFreight: 410, parcelFee: 20, estimatedTaxRate: 0.04, transitDays: '2–4 business days', regulatoryNote: 'Mountain West priority dispatch; WY State Trails MCO ready.' },
];

export function getStateShippingRule(stateCode: string): StateShippingRule {
  return (
    US_STATES_SHIPPING.find((s) => s.code === stateCode.toUpperCase()) ||
    US_STATES_SHIPPING.find((s) => s.code === 'CO')!
  );
}
