import React, { useState, useMemo } from 'react';
import { Problem, Proposal, DomainType, ProblemStatus } from '../../types';
import { DomainTag } from '../common/DomainTag';
import { StatusPill } from '../common/StatusPill';
import { PrimaryButton } from '../common/PrimaryButton';
import { DOMAIN_CONFIG, JHARKHAND_DISTRICTS } from '../../data/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  Building2,
  Clock,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  MapPin
} from 'lucide-react';

interface GovtAnalyticsDashboardProps {
  problems: Problem[];
  proposals: Proposal[];
  onSelectProblem: (problem: Problem) => void;
}

export const GovtAnalyticsDashboard: React.FC<GovtAnalyticsDashboardProps> = ({
  problems,
  proposals,
  onSelectProblem
}) => {
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchTable, setSearchTable] = useState<string>('');

  // Top KPI calculations
  const totalFiled = problems.length;
  const resolvedCount = problems.filter((p) => p.status === 'resolved').length;
  const inProgressCount = problems.filter((p) => p.status === 'in_progress' || p.status === 'verified').length;
  const resolutionRate = Math.round((resolvedCount / (totalFiled || 1)) * 100);
  const totalAffectedSum = problems.reduce((acc, p) => acc + p.affectedCount, 0);

  // Domain Distribution Data for Recharts Bar Chart
  const domainChartData = useMemo(() => {
    return Object.entries(DOMAIN_CONFIG).map(([domKey, domConfig]) => {
      const count = problems.filter((p) => p.domain === domKey).length;
      const resolved = problems.filter((p) => p.domain === domKey && p.status === 'resolved').length;
      return {
        name: domConfig.label.split(' ')[0], // Short name
        fullName: domConfig.label,
        count,
        resolved,
        fill: domConfig.color
      };
    });
  }, [problems]);

  // Monthly Resolution Trend Data for Line Chart
  const trendChartData = [
    { month: 'Mar 2026', filed: 18, resolved: 8 },
    { month: 'Apr 2026', filed: 24, resolved: 14 },
    { month: 'May 2026', filed: 31, resolved: 19 },
    { month: 'Jun 2026', filed: 42, resolved: 27 },
    { month: 'Jul 2026', filed: 56, resolved: 39 },
    { month: 'Aug 2026', filed: 68, resolved: 48 }
  ];

  // Status breakdown for Pie Chart
  const statusPieData = [
    { name: 'Resolved', value: resolvedCount, color: '#0d9488' },
    { name: 'In Progress', value: inProgressCount, color: '#0891b2' },
    { name: 'Proposed', value: problems.filter((p) => p.status === 'proposed').length, color: '#d97706' },
    { name: 'Discussing / Filed', value: problems.filter((p) => p.status === 'filed' || p.status === 'discussing').length, color: '#64748b' }
  ];

  // Filtered table rows
  const tableData = useMemo(() => {
    return problems.filter((p) => {
      if (districtFilter !== 'all' && p.district !== districtFilter) return false;
      if (domainFilter !== 'all' && p.domain !== domainFilter) return false;
      if (searchTable.trim()) {
        const q = searchTable.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.block.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [problems, districtFilter, domainFilter, searchTable]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Problem ID', 'Title', 'Domain', 'Status', 'District', 'Block', 'Pincode', 'Affected Citizens', 'Upvotes'],
      ...tableData.map((p) => [
        p.id,
        `"${p.title.replace(/"/g, '""')}"`,
        p.domain,
        p.status,
        p.district,
        p.block,
        p.pincode,
        p.affectedCount,
        p.upvotes
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Samadhan_Setu_Jharkhand_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="govt-analytics-dashboard" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-20 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-lg border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            Jharkhand State Government Civic Intelligence Portal
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            District Governance & Resolution Analytics
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 max-w-2xl">
            Real-time public grievance resolution metrics, university partnership adoption, and cross-departmental accountability across all 24 districts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <PrimaryButton
            variant="secondary"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export Full Ledger (CSV)
          </PrimaryButton>
        </div>
      </div>

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Grievances Filed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalFiled}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% from last month
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resolution Rate</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-teal-800 tracking-tight">
            {resolutionRate}%
          </p>
          <span className="text-[11px] text-teal-700 font-medium">
            {resolvedCount} resolved • {inProgressCount} active execution
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Institutions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            14
          </p>
          <span className="text-[11px] text-purple-700 font-medium">
            IITs, BAUs, BITs & State Depts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Days to Resolution</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            21.4
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            ↓ 4.2 days faster with Quorum
          </span>
        </div>
      </div>

      {/* RECHARTS SECTION: Bar Chart & Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Domain Distribution Bar Chart */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Grievances & Resolutions by Domain
              </h3>
              <p className="text-xs text-slate-500">
                Water, Agriculture & Roads account for 68% of community filings
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="count" name="Filed Issues" radius={[6, 6, 0, 0]}>
                  {domainChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Monthly Trend Line Chart */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Resolution Velocity Trend (6-Month Trajectory)
              </h3>
              <p className="text-xs text-slate-500">
                Monthly verified filings vs completed grassroots implementations
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="filed"
                  name="Filed Issues"
                  stroke="#0284c7"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved Cases"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* FILTERABLE DISTRICT & PROPOSAL LEDGER TABLE */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              Statewide Civic Action Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Showing {tableData.length} records • Filter by district or search directly
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                placeholder="Search table..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs p-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            >
              <option value="all">All Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="text-xs p-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            >
              <option value="all">All Domains</option>
              {Object.entries(DOMAIN_CONFIG).map(([k, conf]) => (
                <option key={k} value={k}>
                  {conf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Problem / Location</th>
                <th className="p-3.5">Domain</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Impact</th>
                <th className="p-3.5">Institutional Lead</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {tableData.map((prob) => (
                <tr key={prob.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 max-w-xs">
                    <span className="font-bold text-slate-900 block line-clamp-1">
                      {prob.title}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-teal-700" />
                      {prob.block}, {prob.district} ({prob.pincode})
                    </span>
                  </td>
                  <td className="p-3.5">
                    <DomainTag domain={prob.domain} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <StatusPill status={prob.status} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <span className="text-slate-900 font-bold">
                      {prob.affectedCount.toLocaleString()}
                    </span>
                    <span className="text-slate-500 block text-[10px]">residents</span>
                  </td>
                  <td className="p-3.5">
                    {prob.claimedBy ? (
                      <span className="text-xs text-blue-900 font-semibold block line-clamp-1">
                        {prob.claimedBy.name}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Open for adoption
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectProblem(prob)}
                      className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
