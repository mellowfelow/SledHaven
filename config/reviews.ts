export type ReviewCategory =
  | 'Product Quality'
  | 'Delivery Promptness'
  | 'Customer Service'
  | 'Post-Purchase Follow-Up';

export interface CustomerReview {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: string;
  location: string;
  dateOfExperience: string;
  relativeDate: string;
  category: ReviewCategory;
  productPurchased: string;
  verified: boolean;
  dealershipReply?: {
    date: string;
    body: string;
  };
}

export interface RatingDistributionRow {
  stars: 5 | 4 | 3 | 2 | 1;
  label: string;
  count: number;
  percent: number;
}

export const REVIEW_SUMMARY = {
  totalReviews: 2438,
  averageRating: 4.5,
  verdict: 'Excellent',
  distribution: [
    { stars: 5, label: '5-star', count: 1780, percent: 73 },
    { stars: 4, label: '4-star', count: 366, percent: 15 },
    { stars: 3, label: '3-star', count: 146, percent: 6 },
    { stars: 2, label: '2-star', count: 73, percent: 3 },
    { stars: 1, label: '1-star', count: 73, percent: 3 },
  ] as RatingDistributionRow[],
};

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    rating: 5,
    title: 'Crated delivery to Bozeman arrived spotless and ready to ride',
    body: 'Ordered the Alpine Summit 850 Turbo R with BTC for the 10% savings. SledHaven confirmed the wire hash inside 40 minutes, dispatched the steel crate on Monday, and the liftgate driver rolled it straight into my heated bay on Thursday with the MCO packet sealed inside.',
    author: 'Caleb Henderson',
    location: 'Bozeman, MT',
    dateOfExperience: 'February 18, 2026',
    relativeDate: '3 days ago',
    category: 'Delivery Promptness',
    productPurchased: 'Alpine Summit 850 Turbo R',
    verified: true,
  },
  {
    id: 'rev-02',
    rating: 5,
    title: 'Build finish on the Trail 900 GT exceeded dealership expectations',
    body: 'I was skeptical buying a $16k sled online without sitting on it first, but the chassis fitment, Fox QS3 valving, and cold-crank start at -14°F are immaculate. Every fastener was torque-marked from pre-delivery inspection.',
    author: 'Rachel Kowalski',
    location: 'Marquette, MI',
    dateOfExperience: 'February 14, 2026',
    relativeDate: '1 week ago',
    category: 'Product Quality',
    productPurchased: 'Vanguard Trail 900 GT',
    verified: true,
  },
  {
    id: 'rev-03',
    rating: 5,
    title: 'Called me two weeks after delivery to verify my state registration',
    body: 'Most online dealerships disappear the minute your transfer clears. SledHaven followed up after my first 100-mile break-in ride, checked my clutching elevation notes for Park City, and sent a spare copy of the notarized bill of sale the same afternoon.',
    author: 'Derrick Vance',
    location: 'Park City, UT',
    dateOfExperience: 'February 09, 2026',
    relativeDate: '2 weeks ago',
    category: 'Post-Purchase Follow-Up',
    productPurchased: 'Cascade Grand Touring 1000',
    verified: true,
  },
  {
    id: 'rev-04',
    rating: 4,
    title: 'Outstanding mountain sled, minor 24-hour liftgate reschedule',
    body: 'The Timberline 850 Pro climbs steeper lines than anything else in our group and arrived without a single scuff. Knocking off one star only because the local LTL terminal pushed our liftgate window back by one day due to a blizzard on I-80.',
    author: 'Trevor Halvorsen',
    location: 'Jackson, WY',
    dateOfExperience: 'February 04, 2026',
    relativeDate: '2 weeks ago',
    category: 'Delivery Promptness',
    productPurchased: 'Timberline 850 Backcountry Pro',
    verified: true,
  },
  {
    id: 'rev-05',
    rating: 5,
    title: 'Pay-in-4 desk walked me through every installment clearly',
    body: 'Used the Pay-in-4 plan on a WideTrack 900 for our lodge property. Zero confusing fine print—25% locked the crate, transparent state tax calculation for Vermont, and the sales specialist answered three phone calls on a Saturday morning.',
    author: 'Hannah Lindholm',
    location: 'Stowe, VT',
    dateOfExperience: 'January 29, 2026',
    relativeDate: '3 weeks ago',
    category: 'Customer Service',
    productPurchased: 'Kodiak WideTrack 900 Utility',
    verified: true,
  },
  {
    id: 'rev-06',
    rating: 3,
    title: 'Great helmet quality, but miscommunication on parcel tracking',
    body: 'The Carbon Heated Helmet itself is featherweight and zero fog at -22°F—genuinely 5-star gear. However, my tracking email sat in queue for two days over a weekend before showing movement, so I thought it had not shipped yet. Desk cleared it up quickly once I emailed.',
    author: 'Marcus Delgado',
    location: 'Duluth, MN',
    dateOfExperience: 'January 24, 2026',
    relativeDate: '4 weeks ago',
    category: 'Customer Service',
    productPurchased: 'SledHaven Carbon Heated Helmet Kit',
    verified: true,
    dealershipReply: {
      date: 'January 26, 2026',
      body: 'Thank you for the honest note, Marcus. Our weekend carrier scan lagged behind physical pickup—we have since tightened automated scan alerts and appreciate your patience.',
    },
  },
  {
    id: 'rev-07',
    rating: 5,
    title: '10% USDT discount saved nearly $2,000 on our two-sled order',
    body: 'Ordered an Alpine Summit 850 and a Cascade Touring 1000 for our family cabin near Steamboat. The tap-to-copy payment page made settling via USDT effortless and the sales desk verified receipt in under 20 minutes.',
    author: 'Nathaniel Brooks',
    location: 'Steamboat Springs, CO',
    dateOfExperience: 'January 20, 2026',
    relativeDate: '1 month ago',
    category: 'Customer Service',
    productPurchased: 'Alpine Summit 850 Turbo R',
    verified: true,
  },
  {
    id: 'rev-08',
    rating: 2,
    title: 'Freight carrier delayed 5 days in northern storm corridor',
    body: 'The sled is solid and well-crated, no complaints on the machine itself. My frustration was waiting five extra days past the original estimate while the LTL carrier held the pallet at their regional hub during a snowstorm without updating us proactively.',
    author: 'Brenton Callahan',
    location: 'Bemidji, MN',
    dateOfExperience: 'January 15, 2026',
    relativeDate: '1 month ago',
    category: 'Delivery Promptness',
    productPurchased: 'Vanguard Trail 900 GT',
    verified: true,
    dealershipReply: {
      date: 'January 17, 2026',
      body: 'We hear you, Brenton. While DOT storm closures held the terminal, we should have called you daily with hub updates instead of waiting for carrier scans. We issued a $150 freight courtesy credit on your invoice.',
    },
  },
  {
    id: 'rev-09',
    rating: 5,
    title: 'Zero fog heated shield & fast free shipping over $500',
    body: 'Picked up two Carbon Heated Helmet Kits for my wife and me. Free nationwide parcel shipping kicked in automatically at checkout, helmets arrived in rigid protective cases in 3 business days, and the Fidlock magnetic strap works effortlessly with mitts.',
    author: 'Kelsey Drummond',
    location: 'Bend, OR',
    dateOfExperience: 'January 11, 2026',
    relativeDate: '1 month ago',
    category: 'Product Quality',
    productPurchased: 'SledHaven Carbon Heated Helmet Kit',
    verified: true,
  },
  {
    id: 'rev-10',
    rating: 4,
    title: 'Helpful post-purchase follow-up on high-elevation clutching',
    body: 'After receiving my Summit 850, I had a quick question about high-elevation break-in settings above 9,500 ft. Took about half a day to connect with the lead tech, but once on the phone he spent 25 minutes walking through everything thoroughly.',
    author: 'Owen McAllister',
    location: 'Taos, NM',
    dateOfExperience: 'January 06, 2026',
    relativeDate: '1 month ago',
    category: 'Post-Purchase Follow-Up',
    productPurchased: 'Alpine Summit 850 Turbo R',
    verified: true,
  },
  {
    id: 'rev-11',
    rating: 1,
    title: 'Holiday bank wire cutoff caused a frustrating 4-day dispatch misunderstanding',
    body: 'I sent my bank wire on a Friday afternoon expecting Monday crating, not realizing federal wire settlement would not post until Tuesday after the holiday weekend. I felt left hanging on Monday morning until someone finally called me back at 3 PM to explain the hold.',
    author: 'Gregory Petterson',
    location: 'Syracuse, NY',
    dateOfExperience: 'January 02, 2026',
    relativeDate: '1 month ago',
    category: 'Customer Service',
    productPurchased: 'Cascade Grand Touring 1000',
    verified: true,
    dealershipReply: {
      date: 'January 03, 2026',
      body: 'We apologize for the communication gap that Monday morning, Gregory. We now flag bank-holiday wire cutoffs explicitly on every payment-details email and confirmed your sled arrived safely that Friday.',
    },
  },
  {
    id: 'rev-12',
    rating: 5,
    title: 'Kodiak WideTrack pulls groomer drags effortlessly in deep drifts',
    body: 'We run three utility sleds across 40 acres of ranch access road in Idaho. The Kodiak 900 low-range gearing and articulating rear skid handle wet spring snow better than machines costing thousands more. Crating protection was heavy-duty.',
    author: 'Wyatt Sorensen',
    location: 'McCall, ID',
    dateOfExperience: 'December 28, 2025',
    relativeDate: '2 months ago',
    category: 'Product Quality',
    productPurchased: 'Kodiak WideTrack 900 Utility',
    verified: true,
  },
  {
    id: 'rev-13',
    rating: 3,
    title: 'Misunderstanding on driveway truck access, resolved cleanly',
    body: 'Our mountain driveway is narrow and icy, so the 53-ft freight truck had to meet me at the highway pull-off half a mile down instead of our garage. SledHaven helped coordinate a quick rollback transfer, though I wish we had flagged the steep grade at checkout.',
    author: 'paula_m_vermont',
    location: 'Killington, VT',
    dateOfExperience: 'December 21, 2025',
    relativeDate: '2 months ago',
    category: 'Delivery Promptness',
    productPurchased: 'Vanguard Trail 900 GT',
    verified: true,
    dealershipReply: {
      date: 'December 22, 2025',
      body: 'Thanks for sharing this, Paula. We added a dedicated freight access notes field directly inside checkout so rural and steep-grade driveways are automatically routed to straight-truck liftgate carriers.',
    },
  },
  {
    id: 'rev-14',
    rating: 5,
    title: 'MCO title packet accepted at Alaska DMV in five minutes flat',
    body: 'Shipping a brand-new sled to Anchorage usually turns into paperwork chaos. SledHaven nailed the crated barge/freight handoff and included every notarized MCO signature needed so my DMV registration was completely painless.',
    author: 'Shane Halvorson',
    location: 'Anchorage, AK',
    dateOfExperience: 'December 15, 2025',
    relativeDate: '2 months ago',
    category: 'Post-Purchase Follow-Up',
    productPurchased: 'Alpine Summit 850 Turbo R',
    verified: true,
  },
  {
    id: 'rev-15',
    rating: 4,
    title: 'Smooth Zelle settlement & immaculate crating',
    body: 'First time ordering alpine equipment online rather than driving three hours to a local dealer. Pricing was noticeably cleaner without surprise dealer prep fees, and the desk sent photos of my sled strapped into the crate before pickup.',
    author: 'Lauren Whitfield',
    location: 'Traverse City, MI',
    dateOfExperience: 'December 09, 2025',
    relativeDate: '2 months ago',
    category: 'Product Quality',
    productPurchased: 'Cascade Grand Touring 1000',
    verified: true,
  },
  {
    id: 'rev-16',
    rating: 2,
    title: 'Misread state tax line and had to wait a day for revised invoice',
    body: 'Because I was registering our ranch sled under an agricultural exemption in Montana, the automated estimate did not match my paperwork. It took a full business day of back-and-forth emails to reissue the exempt invoice before I could pay.',
    author: 'Dale Armstrong',
    location: 'Kalispell, MT',
    dateOfExperience: 'December 03, 2025',
    relativeDate: '2 months ago',
    category: 'Post-Purchase Follow-Up',
    productPurchased: 'Kodiak WideTrack 900 Utility',
    verified: true,
    dealershipReply: {
      date: 'December 04, 2025',
      body: 'Appreciate the feedback, Dale. Tax-exempt certificates require manual compliance verification, and we have since dedicated a same-day desk queue for commercial and ranch exemptions.',
    },
  },
  {
    id: 'rev-17',
    rating: 1,
    title: 'Delivered two days after our planned holiday cabin trip',
    body: 'Ordered a week before our family trip assuming 4-day transit to northern Maine would make it in time. Heavy lake-effect storms backed up the East Coast freight lane and the sled arrived Sunday after we had already driven home. Machine runs fine, just terribly timed.',
    author: 'Keith Donovan',
    location: 'Caribou, ME',
    dateOfExperience: 'November 27, 2025',
    relativeDate: '3 months ago',
    category: 'Delivery Promptness',
    productPurchased: 'Vanguard Trail 900 GT',
    verified: true,
    dealershipReply: {
      date: 'November 29, 2025',
      body: 'We are genuinely sorry the storm delay caused you to miss your trip window, Keith. We always recommend ordering 10–14 days ahead of fixed holiday departures during peak snow corridors, and we credited your expedited redelivery fee in full.',
    },
  },
  {
    id: 'rev-18',
    rating: 5,
    title: 'Best post-purchase service I have experienced from any powersports dealer',
    body: 'Three weeks after my delivery in Wisconsin, the SledHaven team checked in to see how the heated grips and belt tension felt after break-in and mailed a complimentary winter storage checklist. True concierge dealership experience.',
    author: 'Daniela Ortiz',
    location: 'Eagle River, WI',
    dateOfExperience: 'November 20, 2025',
    relativeDate: '3 months ago',
    category: 'Post-Purchase Follow-Up',
    productPurchased: 'Cascade Grand Touring 1000',
    verified: true,
  },
];
