export type DomainType =
  | 'water'
  | 'health'
  | 'education'
  | 'agriculture'
  | 'infrastructure'
  | 'power'
  | 'sanitation'
  | 'environment';

export type ProblemStatus =
  | 'filed'
  | 'discussing'
  | 'proposed'
  | 'verified'
  | 'in_progress'
  | 'resolved';

export type UserTier = 'citizen' | 'local_verified' | 'expert' | 'institution';

export type ImplementerType = 'government' | 'university' | 'industry_ngo';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  district: string;
  block?: string;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  district: string;
  block: string;
  pincode: string;
  tier: UserTier;
  isAdmin?: boolean;
  trustScore: number;
  avatar: string;
  expertDomain?: DomainType;
  expertOrg?: string;
  verifiedLocation?: boolean;
  idProofUrl?: string;
  stats: {
    filedCount: number;
    verificationsCount: number;
    updatesCount: number;
    upvotesGiven: number;
  };
}

export interface Problem {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  domain: DomainType;
  status: ProblemStatus;
  district: string;
  block: string;
  pincode: string;
  location: GeoLocation;
  photoUrl: string;
  videoUrl?: string;
  voiceAudioUrl?: string;
  filedBy: {
    id: string;
    name: string;
    tier: UserTier;
    avatar: string;
  };
  filedAt: string;
  affectedCount: number;
  upvotes: number;
  hasUpvoted?: boolean;
  duplicatesCount: number;
  commentsCount: number;
  proposalsCount: number;
  verifiedProposalId?: string;
  claimedBy?: {
    id: string;
    name: string;
    type: ImplementerType;
    claimedAt: string;
    targetCompletionDate?: string;
  };
}

export interface Proposal {
  id: string;
  problemId: string;
  title: string;
  approachSummary: string;
  estimatedCost: string;
  estimatedTimeframe: string;
  implementerType: ImplementerType;
  proposedBy: {
    id: string;
    name: string;
    tier: UserTier;
    avatar: string;
    affiliation?: string;
  };
  proposedAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
  quorumVotes: number;
  requiredQuorum: number;
  quorumVoters: string[];
  expertApproved: boolean;
  expertApprover?: {
    name: string;
    title: string;
    domain: DomainType;
    organization: string;
    justification: string;
    approvedAt: string;
  };
  status: 'open' | 'verified' | 'claimed' | 'in_progress' | 'piloted' | 'resolved';
  claimedBy?: {
    name: string;
    type: ImplementerType;
    claimedAt: string;
  };
  keyMilestones: string[];
}

export interface Comment {
  id: string;
  problemId: string;
  parentId?: string;
  author: {
    id: string;
    name: string;
    tier: UserTier;
    avatar: string;
    district: string;
  };
  text: string;
  createdAt: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface ProgressUpdate {
  id: string;
  problemId: string;
  author: {
    id: string;
    name: string;
    tier: UserTier;
    roleTitle: string;
    avatar: string;
  };
  date: string;
  title: string;
  description: string;
  photoProofUrl?: string;
  geoTag: {
    lat: number;
    lng: number;
    locationName: string;
  };
  stage: 'survey' | 'procurement' | 'groundwork' | 'piloted' | 'completed';
  verifiedByQuorum: boolean;
}
