import { DomainType, ImplementerType, ProblemStatus, UserTier } from '../types';

export type AdminActionType =
  | 'approve_expert_application'
  | 'reject_expert_application'
  | 'override_flagged_verification'
  | 'dismiss_flagged_verification'
  | 'force_verify_proposal'
  | 'force_reject_proposal'
  | 'escalate_unclaimed_proposal'
  | 'update_user_admin_status'
  | 'reset_suspicious_votes';

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  actionType: AdminActionType;
  targetId: string;
  targetType: 'expert_application' | 'flagged_verification' | 'proposal' | 'user' | 'problem';
  justification: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface ExpertApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  emailDomain: string;
  isDomainInstitutional: boolean;
  institution: string;
  designation: string;
  domain: DomainType;
  experienceYears: number;
  credentialsSummary: string;
  idProofUrl: string;
  publishedPapersOrProjects?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export type FlagSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FlagStatus = 'pending' | 'overridden' | 'dismissed';

export interface FlaggedVerification {
  id: string;
  proposalId: string;
  problemId: string;
  problemTitle: string;
  proposalTitle: string;
  domain: DomainType;
  district: string;
  flagReason: string;
  flagCode: 'SAME_IP_BURST' | 'RAPID_SUBMISSION' | 'GEO_MISMATCH' | 'SUSPECT_CREDENTIALS' | 'VOTE_RING';
  severity: FlagSeverity;
  voteCount: number;
  anomalyDetails: {
    ipSubnet?: string;
    submissionDurationSeconds?: number;
    geoDistanceKm?: number;
    registeredPincode?: string;
    votingPincode?: string;
    suspiciousVoterIds?: string[];
  };
  status: FlagStatus;
  detectedAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface EscalationDepartment {
  id: string;
  name: string;
  nameHindi: string;
  nodalOfficer: string;
  contactEmail: string;
  domain: DomainType;
}

export interface UnclaimedProposalAlert {
  proposalId: string;
  problemId: string;
  title: string;
  problemTitle: string;
  domain: DomainType;
  district: string;
  block: string;
  verifiedAt: string;
  daysUnclaimed: number;
  estimatedCost: string;
  recommendedDepartment: string;
  escalationStatus: 'not_escalated' | 'escalated_to_dept' | 'claimed';
  lastEscalatedAt?: string;
  escalatedTo?: string;
}
