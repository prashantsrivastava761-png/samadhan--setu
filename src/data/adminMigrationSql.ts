export const SUPABASE_ADMIN_MIGRATION_SQL = `-- ==============================================================================
-- SAMADHAN SETU - ADMIN OVERSIGHT & VERIFICATION MODERATION SCHEMA MIGRATION
-- Platform: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. EXTEND USERS TABLE WITH IS_ADMIN COLUMN
ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Create an index on is_admin for rapid policy lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin) WHERE is_admin = TRUE;

-- 2. CREATE HELPER FUNCTION TO VERIFY CALLER IS ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.users WHERE id = auth.uid()::text LIMIT 1),
    FALSE
  );
$$;

-- 3. AUDIT LOGS TABLE: admin_actions (IMMUTABLE AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  admin_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('expert_application', 'flagged_verification', 'proposal', 'user', 'problem')),
  justification TEXT NOT NULL CHECK (length(trim(justification)) >= 5),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for timeline queries and target lookups
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON public.admin_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);

-- 4. EXPERT APPLICATIONS TABLE (Tier 3 Upgrade Requests)
CREATE TABLE IF NOT EXISTS public.expert_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  email_domain TEXT NOT NULL,
  is_domain_institutional BOOLEAN DEFAULT FALSE,
  institution TEXT NOT NULL,
  designation TEXT NOT NULL,
  domain TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  credentials_summary TEXT NOT NULL,
  id_proof_url TEXT NOT NULL,
  published_papers_or_projects TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  reviewed_by TEXT REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_expert_apps_status ON public.expert_applications(status);
CREATE INDEX IF NOT EXISTS idx_expert_apps_user ON public.expert_applications(user_id);

-- 5. FLAGGED VERIFICATIONS TABLE (Abuse, Bot & Collusion Alerts)
CREATE TABLE IF NOT EXISTS public.flagged_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id TEXT NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  problem_title TEXT NOT NULL,
  proposal_title TEXT NOT NULL,
  domain TEXT NOT NULL,
  district TEXT NOT NULL,
  flag_reason TEXT NOT NULL,
  flag_code TEXT NOT NULL CHECK (flag_code IN ('SAME_IP_BURST', 'RAPID_SUBMISSION', 'GEO_MISMATCH', 'SUSPECT_CREDENTIALS', 'VOTE_RING')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  vote_count INTEGER NOT NULL DEFAULT 0,
  anomaly_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'overridden', 'dismissed')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  resolved_by TEXT REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_flags_status ON public.flagged_verifications(status);
CREATE INDEX IF NOT EXISTS idx_flags_severity ON public.flagged_verifications(severity);

-- 6. UNCLAIMED ESCALATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.escalated_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id TEXT NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  escalated_by TEXT NOT NULL REFERENCES public.users(id),
  justification TEXT NOT NULL,
  escalated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalated_proposals ENABLE ROW LEVEL SECURITY;

-- ADMIN_ACTIONS POLICIES
CREATE POLICY "Admins can view all admin actions"
  ON public.admin_actions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert admin actions"
  ON public.admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() AND admin_id = auth.uid()::text);

-- EXPERT_APPLICATIONS POLICIES
CREATE POLICY "Users can view own application"
  ON public.expert_applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text OR public.is_admin());

CREATE POLICY "Users can submit own application"
  ON public.expert_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Admins can update application status"
  ON public.expert_applications
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- FLAGGED_VERIFICATIONS POLICIES
CREATE POLICY "Admins can view flagged verifications"
  ON public.flagged_verifications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins or service role can insert flags"
  ON public.flagged_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update flag status"
  ON public.flagged_verifications
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ESCALATED_PROPOSALS POLICIES
CREATE POLICY "Admins and institutions can view escalations"
  ON public.escalated_proposals
  FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Only admins can escalate proposals"
  ON public.escalated_proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
`;
