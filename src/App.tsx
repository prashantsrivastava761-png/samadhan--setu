import React, { useState } from 'react';
import {
  Problem,
  Proposal,
  Comment,
  ProgressUpdate,
  User,
  UserTier,
  DomainType
} from './types';
import {
  INITIAL_PROBLEMS,
  INITIAL_PROPOSALS,
  INITIAL_COMMENTS,
  INITIAL_PROGRESS_UPDATES,
  MOCK_USERS
} from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SessionGuard } from './components/auth/SessionGuard';
import { LoginScreen } from './components/auth/LoginScreen';
import { Navbar } from './components/navigation/Navbar';
import { ProblemFeed } from './components/feed/ProblemFeed';
import { ProblemDetail } from './components/detail/ProblemDetail';
import { UniversityDashboard } from './components/dashboard/UniversityDashboard';
import { GovtAnalyticsDashboard } from './components/dashboard/GovtAnalyticsDashboard';
import { ProfileTrustPage } from './components/profile/ProfileTrustPage';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Modals
import { LocationVerificationModal } from './components/auth/LocationVerificationModal';
import { ExpertVerificationModal } from './components/auth/ExpertVerificationModal';
import { FileProblemWizard } from './components/file-problem/FileProblemWizard';
import { ProposeSolutionModal } from './components/proposals/ProposeSolutionModal';
import { PostProgressModal } from './components/detail/PostProgressModal';

function AppContent() {
  const {
    currentUser,
    login,
    logout,
    switchUser,
    updateCurrentUser,
    language,
    setLanguage
  } = useAuth();

  // Global Data State
  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>(INITIAL_PROGRESS_UPDATES);

  // Navigation State
  const [currentView, setCurrentView] = useState<'feed' | 'detail' | 'university' | 'analytics' | 'profile' | 'admin'>('feed');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Modals visibility
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [showFileProblemWizard, setShowFileProblemWizard] = useState<boolean>(false);
  const [showProposeModal, setShowProposeModal] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);

  // Active target problem for modals
  const activeProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  // Active user safe fallback
  const user = currentUser || MOCK_USERS.citizen;

  // ================= ACTION HANDLERS =================

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblemId(problem.id);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
  };

  // Upvote a Problem
  const handleUpvoteProblem = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const hasUpvoted = !p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUpvoted ? p.upvotes + 1 : Math.max(0, p.upvotes - 1),
            hasUpvoted
          };
        }
        return p;
      })
    );
  };

  // Submit a new Problem
  const handleSubmitNewProblem = (newProblemData: Partial<Problem>) => {
    const newProblem: Problem = {
      id: `prob_${Date.now()}`,
      title: newProblemData.title || '',
      titleHindi: newProblemData.titleHindi || newProblemData.title || '',
      description: newProblemData.description || '',
      descriptionHindi: newProblemData.descriptionHindi || newProblemData.description || '',
      domain: newProblemData.domain || 'water',
      status: 'filed',
      district: newProblemData.district || user.district,
      block: newProblemData.block || user.block,
      pincode: newProblemData.pincode || user.pincode,
      location: newProblemData.location || {
        lat: 23.3441,
        lng: 85.3096,
        address: `${user.block}, ${user.district}`,
        district: user.district,
        block: user.block,
        pincode: user.pincode
      },
      photoUrl:
        newProblemData.photoUrl ||
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      filedBy: {
        id: user.id,
        name: user.name,
        tier: user.tier,
        avatar: user.avatar
      },
      affectedCount: newProblemData.affectedCount || 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1,
      hasUpvoted: true,
      quorumRequired: 5,
      quorumCurrent: 1,
      evidenceMedia: newProblemData.evidenceMedia || []
    };

    setProblems((prev) => [newProblem, ...prev]);
    updateCurrentUser({
      ...user,
      trustScore: Math.min(100, user.trustScore + 10),
      stats: { ...user.stats, filedCount: user.stats.filedCount + 1 }
    });
    setSelectedProblemId(newProblem.id);
    setCurrentView('detail');
  };

  // Join an existing problem
  const handleJoinExistingProblem = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return {
            ...p,
            upvotes: p.upvotes + 1,
            hasUpvoted: true,
            affectedCount: p.affectedCount + 5
          };
        }
        return p;
      })
    );
    const target = problems.find((p) => p.id === problemId);
    if (target) {
      setSelectedProblemId(problemId);
      setCurrentView('detail');
    }
  };

  // Submit a Proposal
  const handleSubmitProposal = (proposalData: any) => {
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      problemId: proposalData.problemId,
      title: proposalData.title,
      description: proposalData.description,
      proposedBy: {
        id: user.id,
        name: user.name,
        tier: user.tier,
        avatar: user.avatar,
        institution: user.expertOrg || 'Community Proposer'
      },
      implementerType: proposalData.implementerType,
      estimatedCost: proposalData.estimatedCost,
      timelineMonths: proposalData.timelineMonths,
      upvotes: 1,
      hasUpvoted: true,
      technicalFeasibilityScore: proposalData.technicalFeasibilityScore || 85,
      materialsSpec: proposalData.materialsSpec || [],
      maintenancePlan: proposalData.maintenancePlan || 'Community led routine checkups.',
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    setProposals((prev) => [newProposal, ...prev]);
    // update problem status
    setProblems((prev) =>
      prev.map((p) => (p.id === proposalData.problemId ? { ...p, status: 'proposed' } : p))
    );
  };

  // Add Comment
  const handleAddComment = (text: string) => {
    if (!activeProblem) return;
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      problemId: activeProblem.id,
      user: {
        id: user.id,
        name: user.name,
        tier: user.tier,
        avatar: user.avatar,
        isLocalVoter: user.verifiedLocation
      },
      text,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      hasUpvoted: false
    };

    setComments((prev) => [...prev, newComment]);
  };

  // Upvote Comment
  const handleUpvoteComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hasUpvoted = !c.hasUpvoted;
          return {
            ...c,
            upvotes: hasUpvoted ? c.upvotes + 1 : Math.max(0, c.upvotes - 1),
            hasUpvoted
          };
        }
        return c;
      })
    );
  };

  // Upvote Proposal
  const handleUpvoteProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((pr) => {
        if (pr.id === proposalId) {
          const hasUpvoted = !pr.hasUpvoted;
          return {
            ...pr,
            upvotes: hasUpvoted ? pr.upvotes + 1 : Math.max(0, pr.upvotes - 1),
            hasUpvoted
          };
        }
        return pr;
      })
    );
  };

  // Quorum Vote
  const handleCastQuorumVote = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((pr) => {
        if (pr.id === proposalId) {
          const nextCount = (pr.quorumCount || 0) + 1;
          const isQuorumReached = nextCount >= 5;
          return {
            ...pr,
            quorumCount: nextCount,
            hasQuorumVoted: true,
            status: isQuorumReached ? 'verified' : pr.status
          };
        }
        return pr;
      })
    );

    updateCurrentUser({
      ...user,
      trustScore: Math.min(100, user.trustScore + 5),
      stats: { ...user.stats, verificationsCount: user.stats.verificationsCount + 1 }
    });
  };

  // Tier 3 Expert Approval
  const handleApproveAsExpert = (proposalId: string, notes: string) => {
    setProposals((prev) =>
      prev.map((pr) => {
        if (pr.id === proposalId) {
          return {
            ...pr,
            expertApproved: true,
            expertApprovalNotes: notes,
            status: 'verified',
            verifiedAt: new Date().toISOString()
          };
        }
        return pr;
      })
    );

    if (activeProblem) {
      setProblems((prev) =>
        prev.map((p) => (p.id === activeProblem.id ? { ...p, status: 'verified' } : p))
      );
    }

    updateCurrentUser({
      ...user,
      trustScore: Math.min(100, user.trustScore + 15),
      stats: { ...user.stats, verificationsCount: user.stats.verificationsCount + 1 }
    });
  };

  // Claim Proposal
  const handleClaimProposal = (proposalId: string, institutionName: string) => {
    setProposals((prev) =>
      prev.map((pr) => {
        if (pr.id === proposalId) {
          return {
            ...pr,
            claimedBy: {
              id: user.id,
              name: institutionName,
              claimedAt: new Date().toISOString()
            },
            status: 'in_progress'
          };
        }
        return pr;
      })
    );

    if (activeProblem) {
      setProblems((prev) =>
        prev.map((p) => (p.id === activeProblem.id ? { ...p, status: 'in_progress' } : p))
      );
    }
  };

  // Submit Progress Update
  const handleSubmitProgressUpdate = (updateData: any) => {
    const newUpdate: ProgressUpdate = {
      id: `upd_${Date.now()}`,
      problemId: updateData.problemId,
      proposalId: updateData.proposalId,
      title: updateData.title,
      description: updateData.description,
      photoUrl: updateData.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600',
      timestamp: new Date().toISOString(),
      phase: updateData.phase || 'Execution Phase',
      geoVerified: true,
      postedBy: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    };

    setProgressUpdates((prev) => [newUpdate, ...prev]);
    updateCurrentUser({
      ...user,
      trustScore: Math.min(100, user.trustScore + 8),
      stats: { ...user.stats, updatesCount: user.stats.updatesCount + 1 }
    });
  };

  // Relevant sub-collections for active problem
  const problemProposals = proposals.filter((p) => p.problemId === activeProblem?.id);
  const problemComments = comments.filter((c) => c.problemId === activeProblem?.id);
  const problemProgress = progressUpdates.filter((u) => u.problemId === activeProblem?.id);

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col selection:bg-teal-700 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSwitchUser={switchUser}
        onOpenFileProblem={() => setShowFileProblemWizard(true)}
        onOpenAuthModal={() => setShowLoginScreen(true)}
        onLogout={logout}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      />

      {/* Main Content Body with Session & Admin Guards */}
      <main className="flex-1 pt-4 sm:pt-6">
        {/* VIEW 1: Problem Feed & Map View */}
        {currentView === 'feed' && (
          <ProblemFeed
            problems={problems}
            onSelectProblem={handleSelectProblem}
            onUpvoteProblem={handleUpvoteProblem}
            onOpenFileProblem={() => setShowFileProblemWizard(true)}
          />
        )}

        {/* VIEW 2: Problem Detail View */}
        {currentView === 'detail' && activeProblem && (
          <ProblemDetail
            problem={activeProblem}
            proposals={problemProposals}
            comments={problemComments}
            progressUpdates={problemProgress}
            currentUser={user}
            onBack={handleBackToFeed}
            onUpvoteProblem={handleUpvoteProblem}
            onAddComment={handleAddComment}
            onUpvoteComment={handleUpvoteComment}
            onUpvoteProposal={handleUpvoteProposal}
            onCastQuorumVote={handleCastQuorumVote}
            onApproveAsExpert={handleApproveAsExpert}
            onClaimProposal={handleClaimProposal}
            onOpenProposeModal={() => setShowProposeModal(true)}
            onOpenProgressModal={() => setShowProgressModal(true)}
            onRequestUpgradeToLocal={() => setShowLocationModal(true)}
            onRequestUpgradeToExpert={() => setShowExpertModal(true)}
          />
        )}

        {/* VIEW 3: University & Implementer Dashboard */}
        {currentView === 'university' && (
          <UniversityDashboard
            problems={problems}
            proposals={proposals}
            currentUser={user}
            onSelectProblem={handleSelectProblem}
            onClaimProposal={handleClaimProposal}
            onOpenProposeModal={(probId) => {
              setSelectedProblemId(probId);
              setShowProposeModal(true);
            }}
          />
        )}

        {/* VIEW 4: Government Analytics Dashboard */}
        {currentView === 'analytics' && (
          <GovtAnalyticsDashboard
            problems={problems}
            proposals={proposals}
            onSelectProblem={handleSelectProblem}
          />
        )}

        {/* VIEW 5: Admin Moderation & Verification Oversight (Protected by SessionGuard) */}
        {currentView === 'admin' && (
          <SessionGuard requireAdmin onNavigateHome={() => setCurrentView('feed')}>
            <AdminDashboard
              currentUser={user}
              proposals={proposals}
              problems={problems}
              onUpdateProposalStatus={(proposalId, newStatus) => {
                setProposals((prev) =>
                  prev.map((p) => (p.id === proposalId ? { ...p, status: newStatus } : p))
                );
              }}
              onNavigateToProblem={(problemId) => {
                const p = problems.find((item) => item.id === problemId);
                if (p) handleSelectProblem(p);
              }}
            />
          </SessionGuard>
        )}

        {/* VIEW 6: Profile & Civic Trust Score */}
        {currentView === 'profile' && (
          <SessionGuard onNavigateHome={() => setCurrentView('feed')}>
            <ProfileTrustPage
              currentUser={user}
              problems={problems}
              proposals={proposals}
              progressUpdates={progressUpdates}
              onSelectProblem={handleSelectProblem}
              onRequestUpgradeToLocal={() => setShowLocationModal(true)}
              onRequestUpgradeToExpert={() => setShowExpertModal(true)}
              onUserUpdated={updateCurrentUser}
              onLoggedOut={() => setCurrentView('feed')}
              language={language}
            />
          </SessionGuard>
        )}
      </main>

      {/* LOGIN & AUTH MODAL */}
      {showLoginScreen && (
        <LoginScreen
          onSuccess={(loggedInUser) => {
            login(loggedInUser);
            setShowLoginScreen(false);
          }}
          onCancel={() => setShowLoginScreen(false)}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      <LocationVerificationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentDistrict={user.district}
        onVerified={(pincode, district) => {
          updateCurrentUser({
            ...user,
            tier: 'local_verified',
            pincode,
            district,
            verifiedLocation: true,
            trustScore: Math.min(100, user.trustScore + 25)
          });
        }}
      />

      <ExpertVerificationModal
        isOpen={showExpertModal}
        onClose={() => setShowExpertModal(false)}
        onVerified={(domain, org) => {
          updateCurrentUser({
            ...user,
            tier: 'expert',
            expertDomain: domain,
            expertOrg: org,
            trustScore: Math.min(100, user.trustScore + 35)
          });
        }}
      />

      <FileProblemWizard
        isOpen={showFileProblemWizard}
        onClose={() => setShowFileProblemWizard(false)}
        currentUser={user}
        existingProblems={problems}
        onSubmitNewProblem={handleSubmitNewProblem}
        onJoinExistingProblem={handleJoinExistingProblem}
      />

      {activeProblem && (
        <ProposeSolutionModal
          isOpen={showProposeModal}
          onClose={() => setShowProposeModal(false)}
          problemId={activeProblem.id}
          problemTitle={activeProblem.title}
          currentUser={user}
          onSubmitProposal={handleSubmitProposal}
        />
      )}

      {activeProblem && (
        <PostProgressModal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          problemId={activeProblem.id}
          problemTitle={activeProblem.title}
          currentUser={user}
          onSubmitUpdate={handleSubmitProgressUpdate}
        />
      )}

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-slate-200">
              Samadhan Setu (समाधान सेतु) • Government of Jharkhand Civic Innovation Initiative
            </p>
            <p className="text-[11px] text-slate-500">
              A verifiable public problem-solving network powered by local quorums, IIT (ISM) Dhanbad, BAU Ranchi & Panchayati Raj.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-teal-400">
            <span>24 Districts Connected</span>
            <span>•</span>
            <span>Zero Slop Verification</span>
            <span>•</span>
            <span>Open Civic Protocol</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

