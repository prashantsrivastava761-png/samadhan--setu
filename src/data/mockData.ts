import { Problem, Proposal, Comment, ProgressUpdate, User, DomainType } from '../types';

export const JHARKHAND_DISTRICTS = [
  'Ranchi',
  'Dhanbad',
  'East Singhbhum (Jamshedpur)',
  'Bokaro',
  'Hazaribagh',
  'Deoghar',
  'Giridih',
  'Palamu',
  'Dumka',
  'West Singhbhum (Chaibasa)',
  'Khunti',
  'Ramgarh',
  'Latehar',
  'Godda',
  'Gumla',
  'Simdega',
  'Lohardaga',
  'Garhwa',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Pakur',
  'Sahebganj',
  'Seraikela Kharsawan'
];

export const DOMAIN_CONFIG: Record<DomainType, {
  label: string;
  hindi: string;
  color: string;
  bgLight: string;
  textDark: string;
  border: string;
  iconName: string;
}> = {
  water: {
    label: 'Water & Irrigation',
    hindi: 'जल एवं सिंचाई',
    color: '#0284c7', // Sky-600
    bgLight: 'bg-sky-50',
    textDark: 'text-sky-800',
    border: 'border-sky-200',
    iconName: 'Droplet'
  },
  health: {
    label: 'Public Health',
    hindi: 'स्वास्थ्य एवं चिकित्सा',
    color: '#e11d48', // Rose-600
    bgLight: 'bg-rose-50',
    textDark: 'text-rose-800',
    border: 'border-rose-200',
    iconName: 'HeartPulse'
  },
  education: {
    label: 'Education & Schools',
    hindi: 'शिक्षा एवं विद्यालय',
    color: '#7c3aed', // Violet-600
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-800',
    border: 'border-purple-200',
    iconName: 'GraduationCap'
  },
  agriculture: {
    label: 'Agriculture & Forest',
    hindi: 'कृषि एवं वन संपदा',
    color: '#16a34a', // Green-600
    bgLight: 'bg-emerald-50',
    textDark: 'text-emerald-800',
    border: 'border-emerald-200',
    iconName: 'Sprout'
  },
  infrastructure: {
    label: 'Roads & Bridges',
    hindi: 'सड़क एवं पुल निर्माण',
    color: '#d97706', // Amber-600
    bgLight: 'bg-amber-50',
    textDark: 'text-amber-900',
    border: 'border-amber-200',
    iconName: 'Construction'
  },
  power: {
    label: 'Electricity & Solar',
    hindi: 'बिजली एवं सौर ऊर्जा',
    color: '#ca8a04', // Yellow-600
    bgLight: 'bg-yellow-50',
    textDark: 'text-yellow-900',
    border: 'border-yellow-200',
    iconName: 'Zap'
  },
  sanitation: {
    label: 'Sanitation & Waste',
    hindi: 'स्वच्छता एवं अपशिष्ट',
    color: '#0d9488', // Teal-600
    bgLight: 'bg-teal-50',
    textDark: 'text-teal-900',
    border: 'border-teal-200',
    iconName: 'Trash2'
  },
  environment: {
    label: 'Mining & Environment',
    hindi: 'पर्यावरण एवं खनन प्रभाव',
    color: '#475569', // Slate-600
    bgLight: 'bg-slate-100',
    textDark: 'text-slate-800',
    border: 'border-slate-300',
    iconName: 'Trees'
  }
};

export const MOCK_USERS: Record<string, User> = {
  citizen: {
    id: 'usr_001',
    name: 'Birsa Marandi',
    phone: '+91 94311 82910',
    district: 'Ranchi',
    block: 'Ormanjhi',
    pincode: '835219',
    tier: 'citizen',
    trustScore: 48,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    verifiedLocation: false,
    stats: {
      filedCount: 2,
      verificationsCount: 0,
      updatesCount: 1,
      upvotesGiven: 14
    }
  },
  local_verified: {
    id: 'usr_002',
    name: 'Anita Devi',
    phone: '+91 98350 44120',
    district: 'Dhanbad',
    block: 'Topchanchi',
    pincode: '828402',
    tier: 'local_verified',
    trustScore: 86,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verifiedLocation: true,
    idProofUrl: 'verified_voter_card.pdf',
    stats: {
      filedCount: 5,
      verificationsCount: 28,
      updatesCount: 9,
      upvotesGiven: 64
    }
  },
  expert: {
    id: 'usr_003',
    name: 'Dr. Alok Kumar Soren',
    phone: '+91 94317 21088',
    district: 'Ranchi',
    block: 'Kanke',
    pincode: '834006',
    tier: 'expert',
    trustScore: 97,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    expertDomain: 'water',
    expertOrg: 'Birsa Agricultural University (BAU) - Dept. of Soil & Water Eng.',
    verifiedLocation: true,
    idProofUrl: 'faculty_credential_bau.pdf',
    stats: {
      filedCount: 3,
      verificationsCount: 42,
      updatesCount: 15,
      upvotesGiven: 112
    }
  },
  institution: {
    id: 'usr_004',
    name: 'Prof. Rajeshwar Prasad',
    phone: '+91 94701 55902',
    district: 'Dhanbad',
    block: 'Sardar',
    pincode: '826004',
    tier: 'institution',
    trustScore: 99,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    expertOrg: 'IIT (ISM) Dhanbad - Rural Innovation & Technology Cell',
    verifiedLocation: true,
    stats: {
      filedCount: 1,
      verificationsCount: 65,
      updatesCount: 34,
      upvotesGiven: 88
    }
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Sanjay Murmu (Admin)',
    phone: '+91 94311 00001',
    district: 'Ranchi',
    block: 'Kanke',
    pincode: '834008',
    tier: 'expert',
    isAdmin: true,
    trustScore: 100,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    expertDomain: 'water',
    expertOrg: 'Jharkhand State e-Governance & Moderation Cell',
    verifiedLocation: true,
    stats: {
      filedCount: 12,
      verificationsCount: 180,
      updatesCount: 95,
      upvotesGiven: 320
    }
  }
};

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob_01',
    title: 'Severe arsenic contamination and failed hand pumps in 4 villages of Tamar block',
    titleHindi: 'तमाड़ प्रखंड के 4 गांवों में चापाकलों से दूषित पानी एवं आर्सेनिक की गंभीर समस्या',
    description: 'Over 1,200 tribal families across Salgadih and Sarjamdih depend on deep borewells that tested positive for high heavy metals and fluoride. 3 out of 5 solar jal minars have dry borewells. Children are showing dental fluorosis and stomach ailments.',
    descriptionHindi: 'सलगाडीह और सरजमडीह के 1200 से अधिक आदिवासी परिवारों को पीने के साफ पानी की भारी किल्लत है। 5 में से 3 सोलर जल मीनार ठप पड़े हैं। बच्चे फ्लोरोसिस से प्रभावित हो रहे हैं।',
    domain: 'water',
    status: 'verified',
    district: 'Ranchi',
    block: 'Tamar',
    pincode: '835225',
    location: {
      lat: 23.0532,
      lng: 85.6421,
      address: 'Near Salgadih Gram Panchayat, Tamar Block, Ranchi',
      district: 'Ranchi',
      block: 'Tamar',
      pincode: '835225'
    },
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-08-12T09:30:00Z',
    affectedCount: 1240,
    upvotes: 184,
    hasUpvoted: true,
    duplicatesCount: 6,
    commentsCount: 18,
    proposalsCount: 3,
    verifiedProposalId: 'prop_01',
    claimedBy: {
      id: 'inst_01',
      name: 'IIT (ISM) Dhanbad Water Tech Cell',
      type: 'university',
      claimedAt: '2026-08-20T14:00:00Z',
      targetCompletionDate: '2026-10-30'
    }
  },
  {
    id: 'prob_02',
    title: 'Lack of cold storage & broken micro-checkdam rotting seasonal tomato and capsicum harvests',
    titleHindi: 'ओरमांझी में टमाटर और शिमला मिर्च की फसल सड़ने की समस्या एवं मिनी कोल्ड स्टोरेज की जरूरत',
    description: 'Farmers in Ormanjhi produce over 40 tonnes of vegetables weekly. Without localized solar cold storage and broken canal gates on the Subarnarekha feeder stream, 30% of produce spoils before reaching Ranchi Mandi. Farmers are forced into distress sales at ₹4/kg.',
    descriptionHindi: 'ओरमांझी के किसानों की 40 टन सब्जी उचित भंडारण न होने से खराब हो रही है। ₹4/किलो औने-पौने दाम में बेचने की मजबूरी है।',
    domain: 'agriculture',
    status: 'in_progress',
    district: 'Ranchi',
    block: 'Ormanjhi',
    pincode: '835219',
    location: {
      lat: 23.4789,
      lng: 85.4821,
      address: 'Chutupalu Valley Approach, Ormanjhi, Ranchi',
      district: 'Ranchi',
      block: 'Ormanjhi',
      pincode: '835219'
    },
    photoUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_001',
      name: 'Birsa Marandi',
      tier: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-08-05T11:15:00Z',
    affectedCount: 850,
    upvotes: 215,
    duplicatesCount: 14,
    commentsCount: 29,
    proposalsCount: 2,
    verifiedProposalId: 'prop_02',
    claimedBy: {
      id: 'inst_02',
      name: 'Birsa Agricultural University & JSLPS',
      type: 'university',
      claimedAt: '2026-08-16T10:00:00Z',
      targetCompletionDate: '2026-11-15'
    }
  },
  {
    id: 'prob_03',
    title: 'KGBV Girls Residential School lab non-functional due to 14-hour load shedding',
    titleHindi: 'कस्तूरबा गांधी आवासीय बालिका विद्यालय तोपचांची में बिजली कटौती से कंप्यूटर व साइंस लैब ठप',
    description: '320 girl students at KGBV Topchanchi cannot access their ICT computer lab and science practicals due to irregular rural power supply. Low voltage burns out UPS batteries and cuts off internet during crucial matric exam prep.',
    descriptionHindi: 'तोपचांची कस्तूरबा स्कूल में 320 छात्राओं की डिजिटल पढ़ाई बिजली की लगातार कटौती के कारण बाधित हो रही है।',
    domain: 'education',
    status: 'proposed',
    district: 'Dhanbad',
    block: 'Topchanchi',
    pincode: '828402',
    location: {
      lat: 23.9022,
      lng: 86.2081,
      address: 'KGBV Campus, NH19 bypass, Topchanchi, Dhanbad',
      district: 'Dhanbad',
      block: 'Topchanchi',
      pincode: '828402'
    },
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-08-18T16:45:00Z',
    affectedCount: 320,
    upvotes: 98,
    duplicatesCount: 2,
    commentsCount: 12,
    proposalsCount: 2
  },
  {
    id: 'prob_04',
    title: 'Sub-health centre lacks vaccine cold-chain and 24/7 maternal delivery facility in Netarhat hills',
    titleHindi: 'नेतरहाट पहाड़ी क्षेत्र के उप-स्वास्थ्य केंद्र में प्रसव सुविधा व वैक्सीन रेफ्रिजरेटर का अभाव',
    description: 'Pregnant women in 11 remote forest tolas have to travel 45km across ghat roads to Mahuadanr hospital. Two emergency deliveries occurred in transit last month. Urgent need for solar cold-chain for anti-venom & vaccines plus nurse quarters.',
    descriptionHindi: '11 वन ग्रामों की गर्भवती महिलाओं को 45 किमी दूर महुआडांड़ जाना पड़ता है। सौर ऊर्जा आधारित कोल्ड-चेन व प्रसव सुविधा अत्यंत जरूरी है।',
    domain: 'health',
    status: 'discussing',
    district: 'Latehar',
    block: 'Mahuadanr',
    pincode: '822119',
    location: {
      lat: 23.4842,
      lng: 84.2711,
      address: 'Netarhat Valley Sub-centre, Latehar',
      district: 'Latehar',
      block: 'Mahuadanr',
      pincode: '822119'
    },
    photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_001',
      name: 'Sunil Toppo',
      tier: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-08-21T08:20:00Z',
    affectedCount: 3400,
    upvotes: 142,
    duplicatesCount: 4,
    commentsCount: 15,
    proposalsCount: 1
  },
  {
    id: 'prob_05',
    title: 'Subarnarekha tributary causeway submerged during rains, isolating 8 villages in Chandil',
    titleHindi: 'चांडिल में सुवर्णरेखा सहायक नदी की पुलिया बारिश में डूबने से 8 गांवों का संपर्क कटा',
    description: 'A low-lying pipe culvert gets submerged under 4 feet of water for 40+ days every monsoon. High school students cannot reach Chandil town and emergency medical vehicles cannot cross.',
    descriptionHindi: 'मानसून के दिनों में 4 फीट पानी भरने से स्कूली बच्चों और मरीजों का आना-जाना पूरी तरह बंद हो जाता है।',
    domain: 'infrastructure',
    status: 'resolved',
    district: 'Seraikela Kharsawan',
    block: 'Chandil',
    pincode: '832401',
    location: {
      lat: 22.9641,
      lng: 86.0492,
      address: 'Ghorabandha causeway, Chandil, Seraikela Kharsawan',
      district: 'Seraikela Kharsawan',
      block: 'Chandil',
      pincode: '832401'
    },
    photoUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-07-10T14:00:00Z',
    affectedCount: 5200,
    upvotes: 310,
    duplicatesCount: 9,
    commentsCount: 44,
    proposalsCount: 2,
    verifiedProposalId: 'prop_05',
    claimedBy: {
      id: 'inst_03',
      name: 'Jharkhand State Road Development Corp (JSRDC)',
      type: 'government',
      claimedAt: '2026-07-22T10:00:00Z',
      targetCompletionDate: '2026-08-20'
    }
  },
  {
    id: 'prob_06',
    title: 'Coal dust air pollution & unchecked open slurry dump near Bermo residential colony',
    titleHindi: 'बेरमो आवासीय कॉलोनी के पास कोयले की धूल एवं स्लरी डंप से सांस की बीमारियां',
    description: 'Over 6,000 residents in Bermo town are exposed to toxic PM2.5 levels exceeding 380 µg/m³. Unpaved heavy truck routes and uncovered coal transit cause chronic asthma among elderly and children.',
    descriptionHindi: 'अनकवर्ड कोयला ढुलाई और स्लरी से हवा में प्रदूषण खतरनाक स्तर पर पहुंच गया है। धूल शमन स्प्रिंकलर की तत्काल आवश्यकता है।',
    domain: 'environment',
    status: 'filed',
    district: 'Bokaro',
    block: 'Bermo',
    pincode: '829104',
    location: {
      lat: 23.7745,
      lng: 85.9521,
      address: 'Old Dhori Colliery Road, Bermo, Bokaro',
      district: 'Bokaro',
      block: 'Bermo',
      pincode: '829104'
    },
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=80',
    filedBy: {
      id: 'usr_001',
      name: 'Karan Mahato',
      tier: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    filedAt: '2026-08-24T18:10:00Z',
    affectedCount: 6200,
    upvotes: 67,
    duplicatesCount: 1,
    commentsCount: 7,
    proposalsCount: 0
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop_01',
    problemId: 'prob_01',
    title: 'Community-scale Solar Powered Low-Cost Arsenic-Fluoride Adsorption Filter Plant',
    approachSummary: 'Deploy 2 decentralized 500 LPH filtration units using activated alumina and bio-char adsorbent matrix engineered by IIT (ISM) Dhanbad. Powered by 1.5 kW rooftop solar array with IoT water quality sensors monitored on a public dashboard.',
    estimatedCost: '₹3,40,000 (Two plants)',
    estimatedTimeframe: '6 Weeks',
    implementerType: 'university',
    proposedBy: {
      id: 'usr_003',
      name: 'Dr. Alok Kumar Soren',
      tier: 'expert',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      affiliation: 'Birsa Agricultural University / IIT Water Consortium'
    },
    proposedAt: '2026-08-14T10:15:00Z',
    upvotes: 72,
    hasUpvoted: true,
    quorumVotes: 5,
    requiredQuorum: 5,
    quorumVoters: ['usr_002', 'usr_005', 'usr_006', 'usr_007', 'usr_008'],
    expertApproved: true,
    expertApprover: {
      name: 'Prof. S. K. Gupta',
      title: 'Head of Environmental Engineering',
      domain: 'water',
      organization: 'IIT (ISM) Dhanbad',
      justification: 'Validated lab efficacy: reduces fluoride from 4.2 ppm to 0.6 ppm and arsenic below WHO limits. Local Gram Sabha can easily maintain filter replacement every 8 months.',
      approvedAt: '2026-08-17T15:20:00Z'
    },
    status: 'claimed',
    claimedBy: {
      name: 'IIT (ISM) Dhanbad Rural Innovation Cell',
      type: 'university',
      claimedAt: '2026-08-20T14:00:00Z'
    },
    keyMilestones: [
      'Geotechnical water chemical profile completed',
      'Gram Sabha site allocation passed',
      'Procurement of solar inverters & nano-alumina cartridges',
      'Installation & Village Jal Samiti training'
    ]
  },
  {
    id: 'prop_01b',
    problemId: 'prob_01',
    title: 'Deep Hydrogeological Rainwater Harvesting Injection Well Recharge',
    approachSummary: 'Construct 4 recharge shafts along natural drainage contours to dilute aquifer arsenic concentration and recharge the falling water table by 2.4 meters annually.',
    estimatedCost: '₹1,90,000',
    estimatedTimeframe: '4 Weeks',
    implementerType: 'government',
    proposedBy: {
      id: 'usr_004',
      name: 'Prof. Rajeshwar Prasad',
      tier: 'institution',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    proposedAt: '2026-08-15T12:00:00Z',
    upvotes: 34,
    quorumVotes: 3,
    requiredQuorum: 5,
    quorumVoters: ['usr_002', 'usr_005', 'usr_006'],
    expertApproved: false,
    status: 'open',
    keyMilestones: [
      'Survey of natural water run-off contours',
      'Civil excavation of percolation pits'
    ]
  },
  {
    id: 'prop_02',
    problemId: 'prob_02',
    title: '5-MT Farmer Cooperative Solar Micro-Cold Room & Solar Canal Lift Pump',
    approachSummary: 'Install a 5 Metric Ton thermal-energy-storage cold room using Phase Change Material (PCM) requiring zero grid power, run by a Women SHG (Sakhi Mandal). Replaces diesel pump with 3HP solar lift pump for canal feeder.',
    estimatedCost: '₹5,20,000 (Subsidy matchable)',
    estimatedTimeframe: '8 Weeks',
    implementerType: 'university',
    proposedBy: {
      id: 'usr_003',
      name: 'Dr. Alok Kumar Soren',
      tier: 'expert',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      affiliation: 'BAU Rural Tech'
    },
    proposedAt: '2026-08-08T11:30:00Z',
    upvotes: 89,
    hasUpvoted: true,
    quorumVotes: 5,
    requiredQuorum: 5,
    quorumVoters: ['usr_001', 'usr_002', 'usr_009', 'usr_010', 'usr_011'],
    expertApproved: true,
    expertApprover: {
      name: 'Dr. Vandana Verma',
      title: 'Principal Scientist - Post Harvest Technology',
      domain: 'agriculture',
      organization: 'ICAR-RCER Farming System Research Centre, Ranchi',
      justification: 'PCM thermal battery preserves vegetables up to 21 days without grid power. Will boost farmer realization from ₹4/kg to ₹18/kg in off-peak hours.',
      approvedAt: '2026-08-11T16:00:00Z'
    },
    status: 'in_progress',
    claimedBy: {
      name: 'Birsa Agricultural University & JSLPS',
      type: 'university',
      claimedAt: '2026-08-16T10:00:00Z'
    },
    keyMilestones: [
      'Land demarcation at Ormanjhi Weekly Haat',
      'PCM Cold Storage Unit Delivered from Ranchi',
      'Electrical testing of 3HP Solar Array',
      'Handover to "Ujjwal Mahila Krishak Samiti"'
    ]
  },
  {
    id: 'prop_03',
    problemId: 'prob_03',
    title: '5 kW Rooftop Hybrid Solar-Lithium Power System for KGBV ICT Lab',
    approachSummary: 'Install a 5kW monocrystalline solar system with 10kWh LiFePO4 battery storage, dedicated automatic transfer switch, and surge protection for 25 computer terminals.',
    estimatedCost: '₹3,10,000',
    estimatedTimeframe: '3 Weeks',
    implementerType: 'industry_ngo',
    proposedBy: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    proposedAt: '2026-08-19T09:00:00Z',
    upvotes: 45,
    quorumVotes: 4,
    requiredQuorum: 5,
    quorumVoters: ['usr_002', 'usr_005', 'usr_006', 'usr_007'],
    expertApproved: false,
    status: 'open',
    keyMilestones: [
      'Load calculation and roof structural audit',
      'Vendor quotation vetting via CSR portal',
      'Installation and student digital hour resumption'
    ]
  },
  {
    id: 'prop_05',
    problemId: 'prob_05',
    title: 'High-Level 4-Span RCC Box Culvert with Upstream Flood Baffle Walls',
    approachSummary: 'Replace submerged 900mm Hume pipes with 4-span high-level RCC box culvert raised 2.2 meters above High Flood Level (HFL) with concrete approach ramps and guard rails.',
    estimatedCost: '₹14,80,000',
    estimatedTimeframe: '12 Weeks',
    implementerType: 'government',
    proposedBy: {
      id: 'usr_004',
      name: 'Prof. Rajeshwar Prasad',
      tier: 'institution',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    proposedAt: '2026-07-15T11:00:00Z',
    upvotes: 140,
    quorumVotes: 5,
    requiredQuorum: 5,
    quorumVoters: ['usr_001', 'usr_002', 'usr_003', 'usr_005', 'usr_006'],
    expertApproved: true,
    expertApprover: {
      name: 'Er. Hemant Kispotta',
      title: 'Superintending Engineer (Retd.)',
      domain: 'infrastructure',
      organization: 'Jharkhand Road Construction Department',
      justification: 'Hydraulic design meets 25-year flood return frequency. Solves all-weather lifeline connectivity for 5,200 residents.',
      approvedAt: '2026-07-20T10:00:00Z'
    },
    status: 'resolved',
    claimedBy: {
      name: 'Jharkhand State Road Development Corp (JSRDC)',
      type: 'government',
      claimedAt: '2026-07-22T10:00:00Z'
    },
    keyMilestones: [
      'Hydraulic clearance survey',
      'Foundation raft concrete curing',
      'Deck slab casting and crash barriers',
      'Commissioning & public opening by Gram Mukhia'
    ]
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm_01',
    problemId: 'prob_01',
    author: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      district: 'Ranchi'
    },
    text: 'हमारे गांव सलगाडीह में 4 चापाकल पूरी तरह से जंग और लाल रंग का पानी उगल रहे हैं। हम पिछले महीने प्रखंड विकास पदाधिकारी (BDO) को भी पत्र सौंप चुके हैं।',
    createdAt: '2026-08-12T11:20:00Z',
    upvotes: 24,
    hasUpvoted: true
  },
  {
    id: 'comm_02',
    problemId: 'prob_01',
    author: {
      id: 'usr_003',
      name: 'Dr. Alok Kumar Soren',
      tier: 'expert',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      district: 'Ranchi'
    },
    text: 'I have reviewed the water sample reports from Tamar. The fluoride level is 3.8 mg/L (permissible is 1.0 mg/L). Normal boiling will NOT remove fluoride or arsenic. We must deploy adsorption beds immediately.',
    createdAt: '2026-08-13T08:15:00Z',
    upvotes: 38,
    hasUpvoted: false
  },
  {
    id: 'comm_03',
    problemId: 'prob_01',
    author: {
      id: 'usr_001',
      name: 'Birsa Marandi',
      tier: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      district: 'Ranchi'
    },
    text: 'IIT Dhanbad team visited yesterday with test kits. We local youth will help during civil foundation work for the filtration shed!',
    createdAt: '2026-08-21T16:40:00Z',
    upvotes: 19
  },
  {
    id: 'comm_04',
    problemId: 'prob_02',
    author: {
      id: 'usr_001',
      name: 'Birsa Marandi',
      tier: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      district: 'Ranchi'
    },
    text: 'पिछली फसल में मैंने 20 क्विंटल शिमला मिर्च लगाई थी। मंडी में दाम न मिलने से आधी फसल खेत में ही फेंकनी पड़ी। कोल्ड रूम से हम 2 हफ्ते रोक कर बेहतर दाम में बेच सकेंगे।',
    createdAt: '2026-08-05T14:30:00Z',
    upvotes: 31
  }
];

export const INITIAL_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'prog_01',
    problemId: 'prob_01',
    author: {
      id: 'inst_01',
      name: 'IIT (ISM) Rural Innovation Team',
      tier: 'institution',
      roleTitle: 'Project Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    date: '2026-08-22',
    title: 'Water chemical profiling and soil foundation testing completed',
    description: 'Our engineering field unit took 8 core samples in Tamar. The civil foundation slab for the 1.5kW solar shed has been marked and Gram Panchayat has granted NOC.',
    photoProofUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    geoTag: {
      lat: 23.0532,
      lng: 85.6421,
      locationName: 'Salgadih Gram Panchayat, Tamar'
    },
    stage: 'survey',
    verifiedByQuorum: true
  },
  {
    id: 'prog_02',
    problemId: 'prob_01',
    author: {
      id: 'usr_002',
      name: 'Anita Devi',
      tier: 'local_verified',
      roleTitle: 'Community Monitor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    date: '2026-08-24',
    title: 'Solar panels and dual-stage filtration vessels delivered on site',
    description: 'The delivery truck arrived this afternoon. Local villagers helped unload the nano-alumina cartridges and solar inverter safely into the panchayat store room.',
    photoProofUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=800&auto=format&fit=crop&q=80',
    geoTag: {
      lat: 23.0535,
      lng: 85.6425,
      locationName: 'Panchayat Bhawan, Salgadih'
    },
    stage: 'procurement',
    verifiedByQuorum: true
  },
  {
    id: 'prog_03',
    problemId: 'prob_02',
    author: {
      id: 'usr_003',
      name: 'Dr. Alok Kumar Soren',
      tier: 'expert',
      roleTitle: 'Technical Advisor (BAU)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    date: '2026-08-19',
    title: 'Solar Cold Room assembly completed with Phase Change Material panels',
    description: 'Tested cooling curve down to 4°C solely on solar energy. Thermal battery maintains temperature for 18 hours without sunlight.',
    photoProofUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    geoTag: {
      lat: 23.4789,
      lng: 85.4821,
      locationName: 'Ormanjhi Kisan Haat'
    },
    stage: 'groundwork',
    verifiedByQuorum: true
  },
  {
    id: 'prog_04',
    problemId: 'prob_05',
    author: {
      id: 'usr_004',
      name: 'Er. Hemant Kispotta',
      tier: 'institution',
      roleTitle: 'Executive Engineer JSRDC',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    date: '2026-08-20',
    title: 'High-Level 4-Span Box Culvert bridge opened for traffic',
    description: 'All 4 spans completed, approach road tarred, and crash barriers installed. School buses and ambulances crossed seamlessly even during heavy rain yesterday.',
    photoProofUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    geoTag: {
      lat: 22.9641,
      lng: 86.0492,
      locationName: 'Ghorabandha Bridge, Chandil'
    },
    stage: 'completed',
    verifiedByQuorum: true
  }
];

export const AI_SUGGESTION_KEYWORDS: Record<string, DomainType> = {
  water: 'water',
  pani: 'water',
  jal: 'water',
  handpump: 'water',
  borewell: 'water',
  arsenic: 'water',
  drinking: 'water',
  pond: 'water',
  drainage: 'water',
  canal: 'water',
  
  health: 'health',
  hospital: 'health',
  doctor: 'health',
  swasthya: 'health',
  vaccine: 'health',
  ambulance: 'health',
  medicine: 'health',
  davai: 'health',
  clinic: 'health',
  
  education: 'education',
  school: 'education',
  teacher: 'education',
  vidyalaya: 'education',
  lab: 'education',
  books: 'education',
  student: 'education',
  computer: 'education',
  
  agriculture: 'agriculture',
  kisan: 'agriculture',
  crop: 'agriculture',
  vegetable: 'agriculture',
  storage: 'agriculture',
  soil: 'agriculture',
  irrigation: 'agriculture',
  mandi: 'agriculture',
  fasal: 'agriculture',
  
  road: 'infrastructure',
  bridge: 'infrastructure',
  sadak: 'infrastructure',
  pul: 'infrastructure',
  culvert: 'infrastructure',
  pothole: 'infrastructure',
  transport: 'infrastructure',
  
  electricity: 'power',
  bijli: 'power',
  solar: 'power',
  voltage: 'power',
  transformer: 'power',
  power: 'power',
  light: 'power',
  
  kachra: 'sanitation',
  waste: 'sanitation',
  drain: 'sanitation',
  toilet: 'sanitation',
  safai: 'sanitation',
  sewage: 'sanitation',
  
  pollution: 'environment',
  dust: 'environment',
  mining: 'environment',
  forest: 'environment',
  jungle: 'environment',
  tree: 'environment'
};
