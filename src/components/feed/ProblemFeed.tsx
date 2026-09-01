import React, { useState, useMemo } from 'react';
import { Problem, DomainType, ProblemStatus } from '../../types';
import { ProblemCard } from '../common/ProblemCard';
import { DomainTag } from '../common/DomainTag';
import { StatusPill, STATUS_CONFIG } from '../common/StatusPill';
import { PrimaryButton } from '../common/PrimaryButton';
import { EmptyState } from '../common/EmptyState';
import { DOMAIN_CONFIG, JHARKHAND_DISTRICTS } from '../../data/mockData';
import {
  MapPin,
  List,
  Map as MapIcon,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Layers,
  Sparkles,
  CheckCircle2,
  Navigation,
  Compass,
  ArrowUpDown
} from 'lucide-react';

interface ProblemFeedProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  onOpenFileProblem: () => void;
  onUpvoteProblem: (problemId: string) => void;
  userDistrict: string;
}

export const ProblemFeed: React.FC<ProblemFeedProps> = ({
  problems,
  onSelectProblem,
  onOpenFileProblem,
  onUpvoteProblem,
  userDistrict
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'affected' | 'upvotes'>('recent');
  const [activePinProblem, setActivePinProblem] = useState<Problem | null>(problems[0] || null);

  // Filtered and sorted problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((prob) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = prob.title.toLowerCase().includes(q) || prob.titleHindi.includes(q);
          const matchesDesc = prob.description.toLowerCase().includes(q);
          const matchesLoc = prob.district.toLowerCase().includes(q) || prob.block.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesLoc) return false;
        }
        // Domain filter
        if (selectedDomain !== 'all' && prob.domain !== selectedDomain) return false;
        // Status filter
        if (selectedStatus !== 'all' && prob.status !== selectedStatus) return false;
        // District filter
        if (selectedDistrict !== 'all' && prob.district !== selectedDistrict) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'affected') return b.affectedCount - a.affectedCount;
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        return new Date(b.filedAt).getTime() - new Date(a.filedAt).getTime();
      });
  }, [problems, searchQuery, selectedDomain, selectedStatus, selectedDistrict, sortBy]);

  const getStatusColor = (status: ProblemStatus) => {
    switch (status) {
      case 'filed':
        return '#64748b'; // Slate
      case 'discussing':
        return '#2563eb'; // Blue
      case 'proposed':
        return '#d97706'; // Amber
      case 'verified':
        return '#059669'; // Emerald
      case 'in_progress':
        return '#0891b2'; // Cyan
      case 'resolved':
        return '#0d9488'; // Teal
    }
  };

  return (
    <div id="problem-feed-page" className="space-y-4 pb-24 lg:pb-12 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Top Banner / Civic Headline */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-teal-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Jharkhand Civic Action Ledger • जन समस्या समाधान मंच
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Voices of Jharkhand. Verified Solutions.
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Report ground problems in your village or ward. Collaborate with university researchers and local experts to turn civic grievances into funded public projects.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          <PrimaryButton
            variant="accent"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={onOpenFileProblem}
            className="shadow-lg shadow-amber-900/30 w-full sm:w-auto"
          >
            Report a Problem (समस्या दर्ज करें)
          </PrimaryButton>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs space-y-3">
        {/* Search & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by issue, village, Tamar, Dhanbad, water, crop..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Controls: Sort & Map Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort selector */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-7 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="affected">Most Affected People</option>
                <option value="upvotes">Highest Citizen Upvotes</option>
              </select>
            </div>

            {/* List vs Map Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map Pin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Domain Filter Horizontal Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
              selectedDomain === 'all'
                ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Domains ({problems.length})
          </button>
          {Object.entries(DOMAIN_CONFIG).map(([domKey, domConfig]) => {
            const count = problems.filter((p) => p.domain === domKey).length;
            const isSelected = selectedDomain === domKey;
            return (
              <button
                key={domKey}
                type="button"
                onClick={() => setSelectedDomain(domKey)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-800 text-white border-teal-800 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{domConfig.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-teal-900/60 text-teal-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Row: Status & District */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-teal-700" />
            <span>Refine:</span>
          </div>

          {/* District dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
          >
            <option value="all">All Jharkhand Districts</option>
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="filed">Filed (दर्ज)</option>
            <option value="discussing">Discussing (चर्चा)</option>
            <option value="proposed">Proposed (प्रस्तावित)</option>
            <option value="verified">Verified (सत्यापित ✓)</option>
            <option value="in_progress">In Progress (प्रगति पर)</option>
            <option value="resolved">Resolved (पूर्ण)</option>
          </select>

          {(selectedDomain !== 'all' || selectedStatus !== 'all' || selectedDistrict !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedDomain('all');
                setSelectedStatus('all');
                setSelectedDistrict('all');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content: List View or Map View */}
      {viewMode === 'list' ? (
        filteredProblems.length === 0 ? (
          <EmptyState
            title="No Civic Problems Match Filters"
            description="Try changing your search terms, district selection, or domain filter."
            hindiDescription="कोई समस्या नहीं मिली। कृपया फ़िल्टर बदलें या नई समस्या दर्ज करें।"
            actionLabel="Clear All Filters"
            onAction={() => {
              setSelectedDomain('all');
              setSelectedStatus('all');
              setSelectedDistrict('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((prob) => (
              <ProblemCard
                key={prob.id}
                problem={prob}
                onClick={() => onSelectProblem(prob)}
                onUpvote={() => onUpvoteProblem(prob.id)}
              />
            ))}
          </div>
        )
      ) : (
        /* Interactive Jharkhand Geo Map View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Interactive SVG Canvas representation of Jharkhand Geographic Grid */}
            <div className="flex-1 bg-slate-900 rounded-2xl p-4 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
              {/* Map Legend */}
              <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-[11px] text-white space-y-1.5">
                <p className="font-bold flex items-center gap-1 text-slate-200">
                  <Compass className="w-3.5 h-3.5 text-teal-400" />
                  Jharkhand Civic GPS Grid
                </p>
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Verified
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> In Progress
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Proposed
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Resolved
                  </span>
                </div>
              </div>

              {/* Map Background Grid with Jharkhand outline and pins */}
              <div className="relative w-full h-full my-auto flex items-center justify-center pt-8">
                <svg
                  viewBox="0 0 800 500"
                  className="w-full h-auto max-h-[380px] drop-shadow-md select-none"
                >
                  {/* Stylized State Outline of Jharkhand */}
                  <path
                    d="M 120,180 Q 200,80 380,100 T 620,110 Q 720,180 700,280 T 560,420 Q 420,460 280,410 T 130,320 Z"
                    fill="#0f172a"
                    stroke="#1e293b"
                    strokeWidth="3"
                  />
                  {/* Internal district contour lines */}
                  <path
                    d="M 280,100 Q 300,240 380,300 T 580,400"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 380,100 Q 440,220 540,240 T 700,280"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* District text labels */}
                  <text x="350" y="220" fill="#94a3b8" fontSize="14" fontWeight="bold">RANCHI</text>
                  <text x="500" y="180" fill="#64748b" fontSize="13" fontWeight="bold">DHANBAD</text>
                  <text x="560" y="320" fill="#64748b" fontSize="13" fontWeight="bold">JAMSHEDPUR</text>
                  <text x="440" y="140" fill="#64748b" fontSize="13" fontWeight="bold">HAZARIBAGH</text>
                  <text x="200" y="200" fill="#64748b" fontSize="13" fontWeight="bold">LATEHAR</text>
                  <text x="460" y="220" fill="#64748b" fontSize="13" fontWeight="bold">BOKARO</text>

                  {/* Dynamic Problem Markers on Map */}
                  {filteredProblems.map((prob, idx) => {
                    // Map real coordinates approx to SVG layout:
                    // Lat range: 22.0 to 24.5, Lng range: 84.0 to 87.0
                    const posX = ((prob.location.lng - 84.0) / 3.0) * 560 + 120;
                    const posY = (1 - (prob.location.lat - 22.2) / 2.2) * 320 + 70;
                    const isSelected = activePinProblem?.id === prob.id;
                    const color = getStatusColor(prob.status);

                    return (
                      <g
                        key={prob.id}
                        onClick={() => setActivePinProblem(prob)}
                        className="cursor-pointer group"
                        transform={`translate(${posX}, ${posY})`}
                      >
                        {/* Ripple animation for active / verified */}
                        <circle
                          r={isSelected ? "18" : "12"}
                          fill={color}
                          opacity="0.3"
                          className="animate-ping"
                        />
                        <circle
                          r={isSelected ? "14" : "10"}
                          fill={color}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-transform group-hover:scale-125"
                        />
                        <text
                          y="-16"
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="11"
                          fontWeight="bold"
                          className="select-none bg-black"
                        >
                          {prob.block}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Map footer coordinates bar */}
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between z-10">
                <span className="font-mono">Jharkhand Geo-Bounds: 22.0°N - 24.5°N, 84.0°E - 87.0°E</span>
                <span className="text-teal-400 font-semibold">{filteredProblems.length} GPS Pinned Grievances</span>
              </div>
            </div>

            {/* Selected Pin Details Sidebar in Map Mode */}
            <div className="w-full lg:w-96 shrink-0 flex flex-col justify-between">
              {activePinProblem ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <DomainTag domain={activePinProblem.domain} size="sm" />
                    <StatusPill status={activePinProblem.status} size="sm" />
                  </div>

                  <div className="rounded-xl overflow-hidden h-36 bg-slate-900">
                    <img
                      src={activePinProblem.photoUrl}
                      alt={activePinProblem.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {activePinProblem.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {activePinProblem.description}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-teal-700" />
                      <span>{activePinProblem.location.address}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      GPS: {activePinProblem.location.lat.toFixed(4)}°N, {activePinProblem.location.lng.toFixed(4)}°E
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-700">
                      👥 {activePinProblem.affectedCount.toLocaleString()} affected
                    </span>
                    <PrimaryButton
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectProblem(activePinProblem)}
                    >
                      Open Full Solution Page
                    </PrimaryButton>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl">
                  Click on any colored map pin to inspect the ground problem.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile Users (High accessibility) */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40 lg:hidden">
        <button
          type="button"
          onClick={onOpenFileProblem}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold shadow-xl shadow-amber-900/30 border border-amber-500 transition-transform"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Report Problem</span>
        </button>
      </div>
    </div>
  );
};
