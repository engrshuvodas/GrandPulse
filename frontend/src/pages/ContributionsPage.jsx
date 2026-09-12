import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { api } from '../api/client';

const CATEGORY_BADGES = {
  'Bug Fix': 'bg-rose-500/15 text-rose-300 border border-rose-500/20',
  Development: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
  Design: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
  Testing: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  Architecture: 'bg-purple-500/15 text-purple-300 border border-purple-500/20',
  DevOps: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
};

const IMPACT_BADGES = {
  Small: 'bg-surface-container-highest text-on-surface-variant',
  Medium: 'bg-secondary-container/20 text-secondary border border-secondary/20',
  Large: 'bg-primary-container/20 text-primary border border-primary/20',
  Major: 'bg-tertiary-container/30 text-tertiary border border-tertiary/20',
};

export default function ContributionsPage() {
  const {
    contributions,
    members,
    summary,
    setIsLogContribOpen,
    deleteContribution,
    openMemberAudit,
  } = usePulse();

  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredContributions = contributions.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchCategory) return false;
    }
    if (memberFilter !== 'ALL' && c.member_id !== memberFilter) return false;
    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (levelFilter !== 'ALL' && c.level !== levelFilter) return false;
    return true;
  });

  const totalScore = contributions.reduce((sum, c) => sum + c.points, 0);
  const totalHours = contributions.reduce((sum, c) => sum + c.hours, 0);

  const handleDownloadExcel = () => {
    window.location.href = api.getExcelExportUrl();
  };

  const handleDownloadCsv = () => {
    window.location.href = api.getCsvExportUrl();
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Subtle Ambient Top Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Section */}
      <div className="pt-6 pb-space-lg flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 font-semibold border border-tertiary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Peer-Audited Ledger
            </span>
            <span className="text-outline text-label-sm font-label-sm font-semibold">
              Sprint Epoch 2025.03
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Contribution Records &amp; Audit Trail
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Granular ledger measuring high-velocity engineering output, mission-critical delivery, and weighted merit allocation across engineering sprints.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-space-sm self-start xl:self-auto shrink-0 flex-wrap">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-all shadow-sm border border-surface-container-highest/40"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">
              download
            </span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-md py-2 rounded-lg transition-all shadow-sm border border-emerald-500/30"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-400">
              table_view
            </span>
            <span className="text-emerald-300 font-bold">Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setIsLogContribOpen(true)}
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-2 rounded-lg transition-all shadow-md active:scale-95 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Log New Contribution</span>
          </button>
        </div>
      </div>

      {/* Scoring Rules Config Bar */}
      <div className="bg-surface-container-low p-space-md rounded-xl mb-space-lg shadow-sm border border-surface-container-highest/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <div className="font-title-sm text-title-sm text-on-surface font-bold">
                GrandPulse Scoring Matrix v2.2
              </div>
              <div className="font-body-sm text-body-sm text-outline">
                Weight formula: Total Effort × Impact Tiers
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm flex-1 max-w-4xl lg:ml-space-xl">
            {/* Small */}
            <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-highest/30">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline group-hover:text-on-surface-variant font-semibold">
                  Small (1 pt)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  Minor fix, docs, review
                </span>
              </div>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-bold">
                +1
              </span>
            </div>

            {/* Medium */}
            <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-highest/30">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary group-hover:text-secondary-fixed font-semibold">
                  Medium (2 pts)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  Component dev, test
                </span>
              </div>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-secondary-container/20 text-secondary font-bold">
                +2
              </span>
            </div>

            {/* Large */}
            <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-highest/30">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary group-hover:text-primary-fixed font-semibold">
                  Large (3 pts)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  Core API, schema revamp
                </span>
              </div>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-primary-container/20 text-primary font-bold">
                +3
              </span>
            </div>

            {/* Major */}
            <div className="bg-surface-container p-space-sm rounded-lg flex items-center justify-between group hover:bg-surface-container-high transition-colors border border-surface-container-highest/30">
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary group-hover:text-tertiary-fixed font-semibold">
                  Major (5 pts)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface truncate">
                  Arch rewrite, cluster
                </span>
              </div>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-bold">
                +5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Analytics Bento Micro-bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-lg">
        <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container-highest/40">
          <div>
            <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Sprint Velocity Points
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-[32px] leading-tight text-on-surface font-bold">
                {totalScore}
              </span>
              <span className="font-mono-metric text-mono-metric text-tertiary font-bold">
                +18.4%
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Target: 120 pts (95% to cap)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">bolt</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container-highest/40">
          <div>
            <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Logged Man-Hours
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-[32px] leading-tight text-on-surface font-bold">
                {totalHours.toFixed(1)}
              </span>
              <span className="font-mono-metric text-mono-metric text-secondary font-bold">
                hrs
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Avg {(totalHours / (contributions.length || 1)).toFixed(1)}h / logged item
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">schedule</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container-highest/40">
          <div>
            <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Audit Pass Rate
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-[32px] leading-tight text-on-surface font-bold">
                96.8%
              </span>
              <span className="font-mono-metric text-mono-metric text-tertiary font-bold">
                Verified
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {contributions.length} Approved / 0 Flagged
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">verified_user</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container-highest/40">
          <div>
            <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Sprint MVP Leader
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {members[0]?.name || 'Shuvo K.'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest font-mono-metric text-[11px] text-primary font-bold">
                {members[0]?.score || 58} pts
              </span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {members[0]?.logsCount || 22} Contributions (Rank #1)
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-tertiary-fixed shadow-sm">
            <span className="material-symbols-outlined text-[26px]">military_tech</span>
          </div>
        </div>
      </div>

      {/* Filters, Search & View Controls Bar */}
      <div className="bg-surface-container-low p-space-md rounded-xl mb-space-md flex flex-col gap-space-md shadow-sm border border-surface-container-highest/40">
        <div className="flex flex-col md:flex-row gap-space-md items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              className="w-full bg-surface-container text-on-surface placeholder-outline font-body-sm text-body-sm pl-10 pr-space-md py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-inner border border-surface-container-highest/50"
              placeholder="Search contribution title, related task, member, category..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Member Filter */}
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-surface-container text-on-surface font-title-sm text-xs px-3 py-2 rounded-lg border border-surface-container-highest/50 focus:outline-none"
            >
              <option value="ALL">All Contributors</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container text-on-surface font-title-sm text-xs px-3 py-2 rounded-lg border border-surface-container-highest/50 focus:outline-none"
            >
              <option value="ALL">All Streams</option>
              <option value="Development">Development</option>
              <option value="Architecture">Architecture</option>
              <option value="Bug Fix">Bug Fix</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="DevOps">DevOps</option>
            </select>

            {/* Impact Tier Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-surface-container text-on-surface font-title-sm text-xs px-3 py-2 rounded-lg border border-surface-container-highest/50 focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="Major">Major (5 pts)</option>
              <option value="Large">Large (3 pts)</option>
              <option value="Medium">Medium (2 pts)</option>
              <option value="Small">Small (1 pt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-surface-container-low rounded-xl shadow-md border border-surface-container-highest/40 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-on-surface">
            <thead>
              <tr className="font-label-sm text-label-sm text-outline uppercase tracking-wider bg-surface-container-lowest/80 border-b border-surface-container-highest/60">
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4">Contribution Detail &amp; Scope</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Impact Tier</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Points</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/30 text-xs">
              {filteredContributions.map((c) => {
                const member = members.find((m) => m.id === c.member_id) || {
                  name: c.member_id,
                  avatar_initial: 'GP',
                  avatar_bg: 'bg-primary',
                  avatar_text_color: 'text-on-primary',
                };
                const catClass =
                  CATEGORY_BADGES[c.category] || 'bg-surface-container-highest text-on-surface-variant';
                const levelClass =
                  IMPACT_BADGES[c.level] || 'bg-surface-container-highest text-on-surface-variant';

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-surface-container transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono-metric font-bold text-outline">
                      {c.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => openMemberAudit(c.member_id)}
                        className="flex items-center gap-2 hover:opacity-80 text-left"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg ${member.avatar_bg || 'bg-primary'} ${
                            member.avatar_text_color || 'text-on-primary'
                          } flex items-center justify-center font-bold text-[11px] shadow-sm`}
                        >
                          {member.avatar_initial || 'GP'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">
                            {member.name}
                          </span>
                        </div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {c.title}
                      </div>
                      {c.task_id && (
                        <span className="font-mono-metric text-[11px] text-secondary mt-0.5 block">
                          Linked Task: {c.task_id}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${catClass}`}>
                        {c.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${levelClass}`}>
                        {c.level}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono-metric font-semibold text-on-surface">
                      {c.hours}h
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono-metric font-bold text-sm text-primary">
                        +{c.points}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-tertiary">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Verified
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-outline font-mono-metric text-[11px]">
                      {c.time_label || c.date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openMemberAudit(c.member_id)}
                          title="Inspect Contributor Dossier"
                          className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container-highest transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button
                          onClick={() => deleteContribution(c.id)}
                          title="Delete Ledger Record"
                          className="p-1 rounded text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
