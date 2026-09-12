import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import VelocityAreaChart from '../components/charts/VelocityAreaChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';
import { api } from '../api/client';

export default function TeamMembersPage() {
  const { members, tasks, contributions, summary, setIsAddMemberOpen } = usePulse();

  const [selectedMemberId, setSelectedMemberId] = useState('shuvo');
  const [activeHistoryTab, setActiveHistoryTab] = useState('contributions'); // 'contributions' | 'tasks'

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0] || {
    id: 'shuvo',
    name: 'Shuvo K.',
    role: 'Principal Full-Stack Engineer',
    email: 'shuvo@grandpulse.dev',
    tech_stack: 'React · Python · FastAPI · MySQL',
    avatar_bg: 'bg-primary',
    avatar_text_color: 'text-on-primary',
    avatar_initial: 'SK',
    join_date: 'Joined Jan 14, 2023 · 1y 3m',
    score: 58,
    hours: 64.5,
    tasksCompleted: 18,
    tasksInProgress: 3,
    percentage: 39.2,
    rank: 1,
  };

  const memberContributions = contributions.filter((c) => c.member_id === activeMember.id);
  const memberTasks = tasks.filter((t) => t.assignee_id === activeMember.id);

  const completedMemberTasks = memberTasks.filter((t) => t.status === 'Completed').length;
  const inProgressMemberTasks = memberTasks.filter((t) => t.status !== 'Completed').length;
  const completionRate = memberTasks.length > 0
    ? ((completedMemberTasks / memberTasks.length) * 100).toFixed(1)
    : '100.0';

  const handleExportDossier = () => {
    window.location.href = api.getExcelExportUrl();
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Subtle Ambient Top Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header & Switcher Strip */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pt-6 pb-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-1">
            <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-semibold">
              Attribution Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span className="font-mono-metric text-mono-metric text-outline font-semibold">
              Sprint Pulse W12
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Member Profiles &amp; Performance Matrix
          </h1>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          {/* Live Sync Pill */}
          <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded-lg text-on-surface-variant font-label-md text-label-md border border-surface-container-highest/50">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Aggregated Telemetry</span>
            <span className="font-mono-metric text-mono-metric text-primary font-bold ml-1">
              {summary.total_points} Pts Total
            </span>
          </div>

          {/* Add Member Modal Trigger */}
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-2 rounded-lg transition-all shadow-md active:scale-95 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Member Profile Selector / Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        {members.map((m, idx) => {
          const isSelected = m.id === activeMember.id;
          const rankTheme =
            idx === 0
              ? 'bg-amber-500/20 text-amber-300'
              : idx === 1
              ? 'bg-slate-400/20 text-slate-200'
              : 'bg-amber-700/20 text-amber-400';
          const medalIcon = idx === 0 ? 'workspace_premium' : idx === 1 ? 'military_tech' : 'star';

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`text-left p-space-md rounded-xl transition-all duration-200 shadow-md relative overflow-hidden group border ${
                isSelected
                  ? 'bg-surface-container-high border-primary/40'
                  : 'bg-surface-container hover:bg-surface-container-high border-surface-container-highest/40 text-on-surface-variant'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-secondary"></div>
              )}

              <div className="flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="relative">
                    {m.avatar_url ? (
                      <img
                        className="w-12 h-12 rounded-xl object-cover shadow-sm"
                        src={m.avatar_url}
                        alt={m.name}
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-xl ${m.avatar_bg || 'bg-primary'} ${
                          m.avatar_text_color || 'text-on-primary'
                        } flex items-center justify-center font-bold text-sm shadow-md`}
                      >
                        {m.avatar_initial || 'GP'}
                      </div>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm ${rankTheme}`}
                    >
                      <span className="material-symbols-outlined text-[11px]">{medalIcon}</span>#
                      {m.rank || idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-title-md text-title-md text-on-surface font-bold truncate">
                        {m.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-semibold">
                        {m.role?.split(' ')[0] || 'Core'}
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block truncate mt-0.5">
                      {m.role}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono-metric text-mono-metric text-tertiary font-bold">
                    {m.score} pts
                  </div>
                  <div className="font-label-sm text-label-sm text-outline">
                    {m.percentage}% share
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Member Comprehensive Profile Card Hero */}
      <div className="bg-surface-container-low rounded-2xl p-space-lg mb-space-lg shadow-lg relative overflow-hidden border border-surface-container-highest/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg relative z-10">
          <div className="flex items-center gap-space-lg">
            <div className="relative shrink-0">
              {activeMember.avatar_url ? (
                <img
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                  src={activeMember.avatar_url}
                  alt={activeMember.name}
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-2xl ${activeMember.avatar_bg || 'bg-primary'} ${
                    activeMember.avatar_text_color || 'text-on-primary'
                  } flex items-center justify-center font-bold text-2xl shadow-md`}
                >
                  {activeMember.avatar_initial || 'GP'}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-md border border-amber-500/30">
                <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                <span>Rank #{activeMember.rank || 1}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {activeMember.name}
                </h2>
                <span className="bg-surface-container-high text-secondary px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold border border-secondary/20">
                  {activeMember.role}
                </span>
                {activeMember.active_lead && (
                  <span className="flex items-center gap-1 text-tertiary font-label-sm text-label-sm bg-tertiary-container/30 px-2 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Active Sprint Lead
                  </span>
                )}
              </div>

              <div className="flex items-center gap-space-lg mt-space-xs text-on-surface-variant font-body-sm text-body-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">mail</span>
                  <span>{activeMember.email || `${activeMember.id}@grandpulse.dev`}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">calendar_month</span>
                  <span>{activeMember.join_date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">terminal</span>
                  <span>{activeMember.tech_stack}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm self-stretch lg:self-center justify-end">
            <button
              onClick={handleExportDossier}
              className="px-space-md py-2 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors border border-surface-container-highest/40 font-semibold"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              <span>Export Member Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Metric KPI Cards for Active Member */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-md mb-space-lg">
        {/* Score Velocity */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Score Velocity</span>
            <span className="p-1 rounded-md bg-primary/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">speed</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                {activeMember.score}
              </span>
              <span className="font-mono-metric text-mono-metric text-primary font-bold">Pts</span>
            </div>
            <div className="flex items-center gap-1 mt-space-xs">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-label-sm text-label-sm font-semibold">
                #{activeMember.rank || 1} Rank
              </span>
              <span className="text-tertiary font-label-sm text-label-sm font-bold">+18.4%</span>
            </div>
          </div>
        </div>

        {/* Contribution Share Percentage */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Project Share</span>
            <span className="p-1 rounded-md bg-secondary/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">pie_chart</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                {activeMember.percentage}%
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-space-sm overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500"
                style={{ width: `${activeMember.percentage}%` }}
              ></div>
            </div>
            <span className="font-label-sm text-label-sm text-outline block mt-1">
              {summary.total_points} total team points
            </span>
          </div>
        </div>

        {/* Tasks Assigned */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Assigned Tasks</span>
            <span className="p-1 rounded-md bg-surface-variant text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">assignment</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                {memberTasks.length}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">tasks</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs block">
              Sprint scope allocation
            </span>
          </div>
        </div>

        {/* Tasks Completed & Rate */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Completed</span>
            <span className="p-1 rounded-md bg-tertiary-container/40 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-tertiary leading-none font-bold">
                {completedMemberTasks}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                / {memberTasks.length}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-space-xs">
              <span className="font-mono-metric text-mono-metric text-tertiary font-bold">
                {completionRate}%
              </span>
              <span className="font-label-sm text-label-sm text-outline font-medium">rate</span>
            </div>
          </div>
        </div>

        {/* Tasks In Progress / Pending */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Pending / WIP</span>
            <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">pending</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-amber-400 leading-none font-bold">
                {inProgressMemberTasks}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">active</span>
            </div>
            <span className="font-label-sm text-label-sm text-outline mt-space-xs block">
              In Progress / Review
            </span>
          </div>
        </div>

        {/* Work Hours & Logged Records */}
        <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-highest/30">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline font-semibold">Hours &amp; Logs</span>
            <span className="p-1 rounded-md bg-primary-container/30 text-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">timer</span>
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display-lg text-display-lg text-on-surface leading-none font-bold">
                {activeMember.hours}
              </span>
              <span className="font-mono-metric text-mono-metric text-outline font-bold">hrs</span>
            </div>
            <div className="flex items-center gap-1 mt-space-xs">
              <span className="font-label-sm text-label-sm text-primary font-bold">
                {memberContributions.length} logs
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                · {(activeMember.hours / (memberContributions.length || 1)).toFixed(1)}h avg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Velocity Progression & Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-space-lg mb-space-lg">
        {/* Weekly Score Velocity Area & Bar Chart */}
        <div className="xl:col-span-2 bg-surface-container-low rounded-2xl p-space-lg shadow-md flex flex-col justify-between border border-surface-container-highest/40">
          <div className="flex items-center justify-between mb-space-md">
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Weekly Score Velocity
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                8-week historical trajectory against team benchmark
              </span>
            </div>
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant font-semibold">
                <span className="w-3 h-3 rounded-sm bg-primary"></span>
                <span>{activeMember.name} Velocity</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline font-semibold">
                <span className="w-3 h-0.5 bg-outline-variant"></span>
                <span>Sprint Target (45)</span>
              </div>
            </div>
          </div>

          <VelocityAreaChart
            memberId={activeMember.id}
            memberName={activeMember.name}
          />

          <div className="flex items-center justify-between pt-space-sm font-body-sm text-body-sm text-outline border-t border-surface-container-highest/30">
            <span>
              Sprint Pace: <strong className="text-tertiary">+7.2 pts/week avg acceleration</strong>
            </span>
            <span>Last updated: Real-time telemetry sync</span>
          </div>
        </div>

        {/* Category Attribution Donut Chart */}
        <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-md flex flex-col justify-between border border-surface-container-highest/40">
          <div>
            <div className="flex items-center justify-between mb-space-md">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Category Attribution
              </span>
              <span className="font-label-sm text-label-sm text-outline font-semibold">
                Sprint Distribution
              </span>
            </div>

            <CategoryDonutChart memberId={activeMember.id} />
          </div>

          <div className="pt-space-md mt-space-sm bg-surface-container-high/40 p-space-sm rounded-lg flex items-center justify-between font-label-md text-label-md text-outline border border-surface-container-highest/30">
            <span className="flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
              Automated PR cross-reference
            </span>
            <span className="text-primary hover:underline cursor-pointer font-semibold text-xs">
              Matrix Rules
            </span>
          </div>
        </div>
      </div>

      {/* History Tabs: Logged Contributions vs Assigned Tasks */}
      <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-md mb-space-2xl border border-surface-container-highest/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
          <div className="flex items-center bg-surface-container-lowest p-1 rounded-xl max-w-md border border-surface-container-highest/50">
            <button
              onClick={() => setActiveHistoryTab('contributions')}
              className={`flex-1 py-2 px-space-md rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-space-xs font-semibold ${
                activeHistoryTab === 'contributions'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
              <span>Logged Contributions ({memberContributions.length})</span>
            </button>
            <button
              onClick={() => setActiveHistoryTab('tasks')}
              className={`flex-1 py-2 px-space-md rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-space-xs font-semibold ${
                activeHistoryTab === 'tasks'
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">task</span>
              <span>Assigned Tasks ({memberTasks.length})</span>
            </button>
          </div>
        </div>

        {activeHistoryTab === 'contributions' ? (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-on-surface">
              <thead>
                <tr className="font-label-sm text-label-sm text-outline uppercase tracking-wider bg-surface-container-lowest/80 border-b border-surface-container-highest/40">
                  <th className="py-3 px-4">Contribution Detail</th>
                  <th className="py-3 px-4">Stream / Category</th>
                  <th className="py-3 px-4">Linked Task</th>
                  <th className="py-3 px-4">Logged Time</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/20 text-xs">
                {memberContributions.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3 px-4 font-semibold text-on-surface">{c.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-semibold">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono-metric text-secondary font-bold">
                      {c.task_id || 'Independent'}
                    </td>
                    <td className="py-3 px-4 font-mono-metric">{c.hours} hrs</td>
                    <td className="py-3 px-4 font-mono-metric font-bold text-tertiary">
                      +{c.points} pts
                    </td>
                    <td className="py-3 px-4 text-right text-outline">{c.time_label || c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-on-surface">
              <thead>
                <tr className="font-label-sm text-label-sm text-outline uppercase tracking-wider bg-surface-container-lowest/80 border-b border-surface-container-highest/40">
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 text-right">Estimated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest/20 text-xs">
                {memberTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container transition-colors">
                    <td className="py-3 px-4 font-mono-metric font-bold text-primary">{t.id}</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">{t.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          t.status === 'Completed'
                            ? 'bg-tertiary-container/40 text-tertiary'
                            : t.status === 'In Progress'
                            ? 'bg-secondary-container/20 text-secondary'
                            : 'bg-surface-container-highest text-outline'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-outline">{t.priority}</td>
                    <td className="py-3 px-4 font-mono-metric font-bold text-on-surface">
                      {t.points} pts
                    </td>
                    <td className="py-3 px-4 text-right font-mono-metric text-outline">
                      {t.estimated_hours || 4}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
