import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminAction,
  AdminActionType,
  ExpertApplication,
  FlaggedVerification,
  UnclaimedProposalAlert,
  EscalationDepartment
} from '../types/admin';
import { Proposal } from '../types';

// Supabase client instance (if env variables exist)
const env = (import.meta as unknown as { env?: Record<string, string | undefined> })?.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const JHARKHAND_DEPARTMENTS: EscalationDepartment[] = [
  {
    id: 'dept_dwss',
    name: 'Drinking Water & Sanitation Department (DWSD)',
    nameHindi: 'पेयजल एवं स्वच्छता विभाग',
    nodalOfficer: 'Sri Sanjeev Kumar, IAS (Principal Secretary)',
    contactEmail: 'sec-dws-jhr@nic.in',
    domain: 'water'
  },
  {
    id: 'dept_rcd',
    name: 'Road Construction Department (RCD)',
    nameHindi: 'पथ निर्माण विभाग',
    nodalOfficer: 'Sri Sunil Kumar, IAS (Secretary)',
    contactEmail: 'secretary-rcd-jhr@nic.in',
    domain: 'infrastructure'
  },
  {
    id: 'dept_agri',
    name: 'Department of Agriculture, Animal Husbandry & Cooperative',
    nameHindi: 'कृषि, पशुपालन एवं सहकारिता विभाग',
    nodalOfficer: 'Dr. Chandrashekhar, IAS (Secretary)',
    contactEmail: 'agri.jharkhand@gmail.com',
    domain: 'agriculture'
  },
  {
    id: 'dept_health',
    name: 'Department of Health, Medical Education & Family Welfare',
    nameHindi: 'स्वास्थ्य, चिकित्सा शिक्षा एवं परिवार कल्याण विभाग',
    nodalOfficer: 'Sri Arun Kumar Singh, IAS (Addl. Chief Secy)',
    contactEmail: 'healthdept.jharkhand@gmail.com',
    domain: 'health'
  },
  {
    id: 'dept_energy',
    name: 'Jharkhand Urja Vikas Nigam Ltd (JUVNL) & JREDA',
    nameHindi: 'ऊर्जा विभाग एवं झारखंड अक्षय ऊर्जा विकास एजेंसी',
    nodalOfficer: 'Sri Avinash Kumar, IAS (CMD JUVNL)',
    contactEmail: 'cmd.juvnl@jharkhand.gov.in',
    domain: 'power'
  },
  {
    id: 'dept_rural',
    name: 'Rural Development Department (JSLPS / MGNREGA)',
    nameHindi: 'ग्रामीण विकास विभाग',
    nodalOfficer: 'Smt. Nancy Sahay, IAS (CEO JSLPS)',
    contactEmail: 'jslps.ranchi@gmail.com',
    domain: 'sanitation'
  },
  {
    id: 'dept_edu',
    name: 'Department of School Education and Literacy',
    nameHindi: 'स्कूली शिक्षा एवं साक्षरता विभाग',
    nodalOfficer: 'Sri K. Ravi Kumar, IAS (Secretary)',
    contactEmail: 'secy-schooledu@jharkhand.gov.in',
    domain: 'education'
  }
];

// Initial Seed Data for Seed/Fallback State
const INITIAL_EXPERT_APPLICATIONS: ExpertApplication[] = [
  {
    id: 'app_001',
    userId: 'usr_applicant_01',
    fullName: 'Dr. Rakesh Kumar Mahato',
    email: 'rakesh.mahato@bitmesra.ac.in',
    emailDomain: 'bitmesra.ac.in',
    isDomainInstitutional: true,
    institution: 'Birla Institute of Technology (BIT) Mesra, Ranchi',
    designation: 'Associate Professor, Civil & Environmental Engineering',
    domain: 'water',
    experienceYears: 14,
    credentialsSummary: 'Ph.D. in Hydrogeology from IIT Roorkee. 18 peer-reviewed publications on fluoride & arsenic adsorption kinetics in Chota Nagpur plateau aquifers.',
    idProofUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    publishedPapersOrProjects: 'Assessment of High Fluoride Contamination in Tamar Groundwater: Mechanisms and Remediation (2025, Journal of Hydrology)',
    status: 'pending',
    submittedAt: '2026-08-27T08:30:00Z'
  },
  {
    id: 'app_002',
    userId: 'usr_applicant_02',
    fullName: 'Dr. Sunita Hansda',
    email: 'sunita.hansda@nitjsr.ac.in',
    emailDomain: 'nitjsr.ac.in',
    isDomainInstitutional: true,
    institution: 'National Institute of Technology (NIT) Jamshedpur',
    designation: 'Head, Renewable Energy & Microgrid Lab',
    domain: 'power',
    experienceYears: 11,
    credentialsSummary: 'Expert in off-grid solar micro-grids and battery storage systems for tribal residential schools (KGBV) across Kolhan division.',
    idProofUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    publishedPapersOrProjects: 'Decentralized Solar-Lithium Microgrids in Remote Jharkhand Villages: A Field Reliability Audit (2024)',
    status: 'pending',
    submittedAt: '2026-08-26T14:15:00Z'
  },
  {
    id: 'app_003',
    userId: 'usr_applicant_03',
    fullName: 'Pankaj Kumar Tiwary',
    email: 'pktiwary.expert@gmail.com',
    emailDomain: 'gmail.com',
    isDomainInstitutional: false,
    institution: 'Private Civil Consulting Agency, Dhanbad',
    designation: 'Senior Bridge Consultant',
    domain: 'infrastructure',
    experienceYears: 8,
    credentialsSummary: 'Chartered Engineer with experience in rural culvert design and PMSGY bridge surveys.',
    idProofUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    status: 'pending',
    submittedAt: '2026-08-25T19:40:00Z'
  },
  {
    id: 'app_004',
    userId: 'usr_applicant_04',
    fullName: 'Dr. Vandana Verma',
    email: 'v.verma@icar.gov.in',
    emailDomain: 'icar.gov.in',
    isDomainInstitutional: true,
    institution: 'ICAR-RCER Research Centre, Plandu, Ranchi',
    designation: 'Principal Scientist (Horticulture & Post-Harvest)',
    domain: 'agriculture',
    experienceYears: 16,
    credentialsSummary: 'Lead researcher in solar-assisted zero-energy cool chambers (ZECC) and phase-change thermal storage for perishable crops.',
    idProofUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
    submittedAt: '2026-08-10T11:00:00Z',
    reviewedBy: 'usr_admin_01',
    reviewedAt: '2026-08-11T15:30:00Z'
  }
];

const INITIAL_FLAGGED_VERIFICATIONS: FlaggedVerification[] = [
  {
    id: 'flag_001',
    proposalId: 'prop_03',
    problemId: 'prob_03',
    problemTitle: 'Frequent Power Outages Halting Computer Education at KGBV Girls Residential School',
    proposalTitle: '5 kW Rooftop Hybrid Solar-Lithium Power System for KGBV ICT Lab',
    domain: 'power',
    district: 'Ranchi',
    flagReason: '4 out of 4 quorum votes recorded from identical IP subnet (103.24.188.*) within 38 seconds.',
    flagCode: 'SAME_IP_BURST',
    severity: 'high',
    voteCount: 4,
    anomalyDetails: {
      ipSubnet: '103.24.188.0/24',
      submissionDurationSeconds: 38,
      suspiciousVoterIds: ['usr_002', 'usr_005', 'usr_006', 'usr_007']
    },
    status: 'pending',
    detectedAt: '2026-08-27T16:22:00Z'
  },
  {
    id: 'flag_002',
    proposalId: 'prop_01b',
    problemId: 'prob_01',
    problemTitle: 'Severe Groundwater Arsenic & Fluoride Contamination in Tamar Block',
    proposalTitle: 'Deep Hydrogeological Rainwater Harvesting Injection Well Recharge',
    domain: 'water',
    district: 'Ranchi',
    flagReason: 'Geo-mismatch: 2 voters registered in Dhanbad (pincode 826004) submitted quorum votes for Tamar (835225) without geo-proximity proof.',
    flagCode: 'GEO_MISMATCH',
    severity: 'medium',
    voteCount: 3,
    anomalyDetails: {
      geoDistanceKm: 142,
      registeredPincode: '826004',
      votingPincode: '835225',
      suspiciousVoterIds: ['usr_005', 'usr_006']
    },
    status: 'pending',
    detectedAt: '2026-08-26T11:05:00Z'
  }
];

const INITIAL_UNCLAIMED_ALERTS: UnclaimedProposalAlert[] = [
  {
    proposalId: 'prop_01',
    problemId: 'prob_01',
    title: 'Community-scale Solar Powered Low-Cost Arsenic-Fluoride Adsorption Filter Plant',
    problemTitle: 'Severe Groundwater Arsenic & Fluoride Contamination in Tamar Block',
    domain: 'water',
    district: 'Ranchi',
    block: 'Tamar',
    verifiedAt: '2026-08-17T15:20:00Z',
    daysUnclaimed: 11,
    estimatedCost: '₹3,40,000',
    recommendedDepartment: 'Drinking Water & Sanitation Department (DWSD)',
    escalationStatus: 'not_escalated'
  },
  {
    proposalId: 'prop_unclaimed_02',
    problemId: 'prob_04',
    title: 'Bi-weekly Mobile Veterinary Clinic & Vaccination Drive with Solar Cold Chain',
    problemTitle: 'Livestock Foot-and-Mouth Disease Outbreak in Latehar Block',
    domain: 'agriculture',
    district: 'Latehar',
    block: 'Latehar Sadar',
    verifiedAt: '2026-08-05T09:00:00Z',
    daysUnclaimed: 23,
    estimatedCost: '₹2,75,000',
    recommendedDepartment: 'Department of Agriculture, Animal Husbandry & Cooperative',
    escalationStatus: 'not_escalated'
  }
];

const INITIAL_ADMIN_ACTIONS: AdminAction[] = [
  {
    id: 'act_001',
    adminId: 'usr_admin_01',
    adminName: 'Sanjay Murmu',
    adminEmail: 'admin.samadhansetu@jharkhand.gov.in',
    actionType: 'approve_expert_application',
    targetId: 'app_004',
    targetType: 'expert_application',
    justification: 'Verified government research scientist credentials from ICAR Plandu faculty directory and reviewed published field trials.',
    metadata: { applicantName: 'Dr. Vandana Verma', domain: 'agriculture' },
    createdAt: '2026-08-11T15:30:00Z'
  },
  {
    id: 'act_002',
    adminId: 'usr_admin_01',
    adminName: 'Sanjay Murmu',
    adminEmail: 'admin.samadhansetu@jharkhand.gov.in',
    actionType: 'force_verify_proposal',
    targetId: 'prop_05',
    targetType: 'proposal',
    justification: 'Emergency public safety override: Chandil bridge collapse cut off 5 villages from primary healthcare centre. Endorsed by District Collector emergency memo DC/RCH/2026/891.',
    metadata: { proposalTitle: 'High-Level 4-Span RCC Box Culvert bridge', district: 'Seraikela Kharsawan' },
    createdAt: '2026-07-20T10:15:00Z'
  }
];

// Local Storage Helper Keys
const LS_EXPERT_APPS = 'samadhan_setu_expert_applications';
const LS_FLAGGED = 'samadhan_setu_flagged_verifications';
const LS_ACTIONS = 'samadhan_setu_admin_actions';
const LS_UNCLAIMED = 'samadhan_setu_unclaimed_alerts';

export class SupabaseAdminService {
  // 1. Audit Logging (Guaranteed logged for EVERY action)
  static async logAdminAction(
    admin: { id: string; name: string; email: string },
    actionType: AdminActionType,
    targetId: string,
    targetType: 'expert_application' | 'flagged_verification' | 'proposal' | 'user' | 'problem',
    justification: string,
    metadata?: Record<string, any>
  ): Promise<AdminAction> {
    if (!justification || justification.trim().length < 5) {
      throw new Error('An explicit justification of at least 5 characters is required for regulatory audit compliance.');
    }

    const newAction: AdminAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      actionType,
      targetId,
      targetType,
      justification: justification.trim(),
      metadata: metadata || {},
      createdAt: new Date().toISOString()
    };

    // If real Supabase is configured, write to supabase
    if (supabase) {
      try {
        await supabase.from('admin_actions').insert({
          id: newAction.id,
          admin_id: newAction.adminId,
          admin_name: newAction.adminName,
          admin_email: newAction.adminEmail,
          action_type: newAction.actionType,
          target_id: newAction.targetId,
          target_type: newAction.targetType,
          justification: newAction.justification,
          metadata: newAction.metadata,
          created_at: newAction.createdAt
        });
      } catch (err) {
        console.warn('Supabase DB write fallback to local storage:', err);
      }
    }

    // Save to local cache
    const current = this.getAdminActions();
    const updated = [newAction, ...current];
    localStorage.setItem(LS_ACTIONS, JSON.stringify(updated));

    return newAction;
  }

  // 2. Fetch Audit Logs
  static getAdminActions(): AdminAction[] {
    try {
      const stored = localStorage.getItem(LS_ACTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse admin actions from localStorage', e);
    }
    localStorage.setItem(LS_ACTIONS, JSON.stringify(INITIAL_ADMIN_ACTIONS));
    return INITIAL_ADMIN_ACTIONS;
  }

  // 3. Expert Applications
  static getExpertApplications(): ExpertApplication[] {
    try {
      const stored = localStorage.getItem(LS_EXPERT_APPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(LS_EXPERT_APPS, JSON.stringify(INITIAL_EXPERT_APPLICATIONS));
    return INITIAL_EXPERT_APPLICATIONS;
  }

  static async reviewExpertApplication(
    admin: { id: string; name: string; email: string },
    applicationId: string,
    decision: 'approved' | 'rejected',
    justification: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; application: ExpertApplication }> {
    const apps = this.getExpertApplications();
    const appIndex = apps.findIndex((a) => a.id === applicationId);

    if (appIndex === -1) {
      throw new Error(`Application ${applicationId} not found`);
    }

    const app = apps[appIndex];
    app.status = decision;
    app.reviewedBy = admin.id;
    app.reviewedAt = new Date().toISOString();
    if (decision === 'rejected') {
      app.rejectionReason = rejectionReason || justification;
    }

    apps[appIndex] = app;
    localStorage.setItem(LS_EXPERT_APPS, JSON.stringify(apps));

    // Log to audit table
    await this.logAdminAction(
      admin,
      decision === 'approved' ? 'approve_expert_application' : 'reject_expert_application',
      app.id,
      'expert_application',
      justification,
      {
        applicantName: app.fullName,
        applicantEmail: app.email,
        institution: app.institution,
        domain: app.domain,
        decision,
        rejectionReason: app.rejectionReason
      }
    );

    // If Supabase is connected, update table
    if (supabase) {
      try {
        await supabase
          .from('expert_applications')
          .update({
            status: decision,
            reviewed_by: admin.id,
            reviewed_at: app.reviewedAt,
            rejection_reason: app.rejectionReason
          })
          .eq('id', applicationId);
      } catch (err) {
        console.warn('Supabase update fallback:', err);
      }
    }

    return { success: true, application: app };
  }

  // 4. Flagged Verifications
  static getFlaggedVerifications(): FlaggedVerification[] {
    try {
      const stored = localStorage.getItem(LS_FLAGGED);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(LS_FLAGGED, JSON.stringify(INITIAL_FLAGGED_VERIFICATIONS));
    return INITIAL_FLAGGED_VERIFICATIONS;
  }

  static async resolveFlaggedVerification(
    admin: { id: string; name: string; email: string },
    flagId: string,
    resolution: 'overridden' | 'dismissed',
    justification: string
  ): Promise<{ success: boolean; flag: FlaggedVerification }> {
    const flags = this.getFlaggedVerifications();
    const flagIndex = flags.findIndex((f) => f.id === flagId);

    if (flagIndex === -1) {
      throw new Error(`Flag ${flagId} not found`);
    }

    const flag = flags[flagIndex];
    flag.status = resolution;
    flag.resolvedBy = admin.id;
    flag.resolvedAt = new Date().toISOString();
    flag.adminNotes = justification;

    flags[flagIndex] = flag;
    localStorage.setItem(LS_FLAGGED, JSON.stringify(flags));

    // Audit Log entry
    await this.logAdminAction(
      admin,
      resolution === 'overridden' ? 'override_flagged_verification' : 'dismiss_flagged_verification',
      flag.id,
      'flagged_verification',
      justification,
      {
        proposalId: flag.proposalId,
        flagCode: flag.flagCode,
        severity: flag.severity,
        resolution
      }
    );

    // Supabase update if active
    if (supabase) {
      try {
        await supabase
          .from('flagged_verifications')
          .update({
            status: resolution,
            resolved_by: admin.id,
            resolved_at: flag.resolvedAt,
            admin_notes: justification
          })
          .eq('id', flagId);
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }

    return { success: true, flag };
  }

  // 5. Unclaimed Proposals Alerts
  static getUnclaimedAlerts(): UnclaimedProposalAlert[] {
    try {
      const stored = localStorage.getItem(LS_UNCLAIMED);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(LS_UNCLAIMED, JSON.stringify(INITIAL_UNCLAIMED_ALERTS));
    return INITIAL_UNCLAIMED_ALERTS;
  }

  static async escalateUnclaimedProposal(
    admin: { id: string; name: string; email: string },
    proposalId: string,
    departmentId: string,
    departmentName: string,
    justification: string
  ): Promise<UnclaimedProposalAlert> {
    const alerts = this.getUnclaimedAlerts();
    const alertIndex = alerts.findIndex((a) => a.proposalId === proposalId);

    let updatedAlert: UnclaimedProposalAlert;
    if (alertIndex !== -1) {
      alerts[alertIndex].escalationStatus = 'escalated_to_dept';
      alerts[alertIndex].escalatedTo = departmentName;
      alerts[alertIndex].lastEscalatedAt = new Date().toISOString();
      updatedAlert = alerts[alertIndex];
    } else {
      updatedAlert = {
        proposalId,
        problemId: 'prob_escalated',
        title: 'Escalated Proposal',
        problemTitle: 'Civic Problem',
        domain: 'infrastructure',
        district: 'Ranchi',
        block: 'Central',
        verifiedAt: new Date().toISOString(),
        daysUnclaimed: 15,
        estimatedCost: 'N/A',
        recommendedDepartment: departmentName,
        escalationStatus: 'escalated_to_dept',
        escalatedTo: departmentName,
        lastEscalatedAt: new Date().toISOString()
      };
      alerts.push(updatedAlert);
    }

    localStorage.setItem(LS_UNCLAIMED, JSON.stringify(alerts));

    // Audit log
    await this.logAdminAction(
      admin,
      'escalate_unclaimed_proposal',
      proposalId,
      'proposal',
      justification,
      {
        departmentId,
        departmentName,
        escalatedAt: new Date().toISOString()
      }
    );

    return updatedAlert;
  }
}
