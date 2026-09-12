import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import GrandChartRow from '../components/charts/GrandChartRow';

const CATEGORIES = ['ALL', 'Development', 'Bug Fix', 'Architecture', 'Design', 'Testing', 'DevOps'];
const TIMEFRAMES = [
  { id: 'all', label: 'All-Time' },
  { id: 'year', label: 'Year 2025' },
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
];

const CATEGORY_BADGES = {
  'Bug Fix': 'bg-rose-500/15 text-rose-300 border border-rose-500/20',
  Development: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
  Design: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20',
  Testing: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  Architecture: 'bg-purple-500/15 text-purple-300 border border-purple-500/20',
  DevOps: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
};

const PRIORITY_CLASSES = {
  Urgent: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
  High: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  Medium: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
  Small: 'bg-surface-container-highest text-on-surface-variant',
};

export default function DashboardPage() {
  const {
    members,
    tasks,
    contributions,
    summary,
    activeCategory,
    setActiveCategory,
    activeSort,
    setActiveSort,
    activeTimeframe,
    setActiveTimeframe,
    setIsLogContribOpen,
    setIsNewTaskOpen,
    toggleTaskStatus,
  } = usePulse();

  const [taskFilter, setTaskFilter] = useState('all');

  const totalScore = members.reduce((sum, m) => sum + m.score, 0) || 1;

  // Filtered tasks for task list
  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'all') return true;
    return t.status === taskFilter;
  });

  return (
    <div className="flex flex-col w-full relative">
      {/* Subtle Ambient Top Halo */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pt-6 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-tertiary-container/30 text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5 animate-pulse"></span>
              LIVE PULSE ACTIVE
            </span>
            <span className="text-outline text-xs font-mono-metric font-medium">
              Sprint v2.4 (Days 8 of 14)
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight flex items-center gap-3">
            Executive Velocity &amp; Contribution Console
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
            Algorithmic real-time performance synthesis and work-stream attribution across core engineers.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsLogContribOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-all shadow-sm border border-surface-container-highest/40 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              add_circle
            </span>
            <span>Log Contribution</span>
          </button>
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm transition-all shadow-md active:scale-95 font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">playlist_add</span>
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 1. SUMMARY METRICS ROW (8 Bento Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {/* M1 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Active Core
            </span>
            <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {summary.active_members}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary font-medium">/ 3 eng</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">Shuvo, Setu, Monami</div>
        </div>

        {/* M2 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Total Tasks
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary">assignment</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {summary.total_tasks}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">backlog</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">v2.4 Scope items</div>
        </div>

        {/* M3 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Completed
            </span>
            <span className="material-symbols-outlined text-[16px] text-tertiary">task_alt</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-tertiary font-bold">
              {summary.completed_tasks}
            </span>
            <span className="font-body-sm text-body-sm text-outline font-semibold">
              {summary.completed_ratio}%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-tertiary-fixed-dim truncate">+4 closed today</div>
        </div>

        {/* M4 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              In Progress
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">pending</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-secondary font-bold">
              {summary.inprogress_tasks}
            </span>
            <span className="font-body-sm text-body-sm text-outline">active</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">Zero blockers flagged</div>
        </div>

        {/* M5 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Pending / Todo
            </span>
            <span className="material-symbols-outlined text-[16px] text-outline">hourglass_empty</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {summary.pending_tasks}
            </span>
            <span className="font-body-sm text-body-sm text-outline">queued</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">Ready for pickup</div>
        </div>

        {/* M6 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Logged Logs
            </span>
            <span className="material-symbols-outlined text-[16px] text-primary-container">fact_check</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {summary.total_logs}
            </span>
            <span className="font-body-sm text-body-sm text-tertiary font-semibold">verified</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">Algorithmic scoring</div>
        </div>

        {/* M7 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Logged Hours
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              {summary.total_hours}
            </span>
            <span className="font-body-sm text-body-sm text-outline">hrs</span>
          </div>
          <div className="mt-1 text-[11px] text-on-surface-variant truncate">3.8 pts/hr efficiency</div>
        </div>

        {/* M8 */}
        <div className="bg-surface-container-low p-3.5 rounded-xl flex flex-col justify-between shadow-sm border border-surface-container-highest/30">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Sprint Health
            </span>
            <span className="material-symbols-outlined text-[16px] text-tertiary">trending_up</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-headline-md text-headline-md text-tertiary font-bold">
              {summary.sprint_health}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-tertiary truncate">Optimal burn-up</div>
        </div>
      </div>

      {/* 2. THE GRAND CONTRIBUTION CHART (HERO CENTERPIECE) */}
      <div className="bg-surface-container-low rounded-2xl p-6 lg:p-7 shadow-xl mb-7 relative overflow-hidden border border-surface-container-highest/40">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-5 border-b border-surface-container-highest/40">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">🏆</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                GRAND CONTRIBUTION CHART
              </h2>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs border border-surface-container-highest/50">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-mono-metric font-semibold text-on-surface">
                  {summary.total_points} Pts total recorded
                </span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Normalized impact score derived from code deliverables, task completion, and architectural review.
            </p>
          </div>

          {/* Controls: Timeframes & Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe selector */}
            <div className="flex items-center bg-surface-container-lowest p-1 rounded-xl border border-surface-container-highest/50">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setActiveTimeframe(tf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTimeframe === tf.id
                      ? 'bg-surface-container-high text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-surface-container-highest/50 text-xs">
              <span className="text-outline font-medium">Sort:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer"
              >
                <option value="score" className="bg-surface-container-high">Impact Points</option>
                <option value="hours" className="bg-surface-container-high">Total Hours</option>
                <option value="tasks" className="bg-surface-container-high">Tasks Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Stream Filter Pills */}
        <div className="relative z-10 flex items-center gap-2 pt-4 pb-5 overflow-x-auto">
          <span className="text-xs font-semibold uppercase text-outline mr-1 shrink-0">Stream:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container hover:text-on-surface border border-surface-container-highest/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Ranked Contributor Rows */}
        <div className="flex flex-col gap-3 relative z-10">
          {members.map((member, index) => (
            <GrandChartRow
              key={member.id}
              member={member}
              totalTeamScore={totalScore}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* 3. LOWER SECTION: Recent Contributions Stream & Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Contributions Activity Stream */}
        <div className="bg-surface-container-low p-6 rounded-2xl shadow-md border border-surface-container-highest/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container-highest/40">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  history_edu
                </span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Recent Contribution Activity
                </h3>
              </div>
              <span className="text-xs text-outline font-mono-metric font-medium">
                {contributions.length} logs
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {contributions.slice(0, 7).map((c) => {
                const member = members.find((m) => m.id === c.member_id) || {
                  name: c.member_id,
                  avatar_bg: 'bg-primary',
                  avatar_text_color: 'text-on-primary',
                  avatar_initial: 'GP',
                };
                const badgeClass =
                  CATEGORY_BADGES[c.category] ||
                  'bg-surface-container-highest text-on-surface-variant';

                return (
                  <div
                    key={c.id}
                    className="p-3 bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors flex items-center justify-between gap-3 border border-surface-container-highest/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg ${member.avatar_bg || 'bg-primary'} ${
                          member.avatar_text_color || 'text-on-primary'
                        } flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}
                      >
                        {member.avatar_initial || 'GP'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-on-surface truncate">
                          {c.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-outline">
                          <span className="font-medium text-on-surface-variant">{member.name}</span>
                          <span>·</span>
                          <span>{c.time_label || c.date}</span>
                          <span>·</span>
                          <span>{c.hours} hrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${badgeClass}`}>
                        {c.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest font-mono-metric font-bold text-xs text-primary">
                        +{c.points}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Tasks & Attribution Stream */}
        <div className="bg-surface-container-low p-6 rounded-2xl shadow-md border border-surface-container-highest/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container-highest/40">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-tertiary">
                  checklist
                </span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Sprint Task Attribution Matrix
                </h3>
              </div>
              <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg text-xs gap-1 border border-surface-container-highest/50">
                {['all', 'In Progress', 'Completed', 'Pending'].map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setTaskFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                      taskFilter === filterKey
                        ? 'bg-surface-container-high text-on-surface font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface font-medium'
                    }`}
                  >
                    {filterKey === 'all' ? 'All' : filterKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredTasks.slice(0, 8).map((task) => {
                const member = members.find((m) => m.id === task.assignee_id) || {
                  name: 'Unassigned',
                };
                const isDone = task.status === 'Completed';

                return (
                  <div
                    key={task.id}
                    className="p-3 bg-surface-container rounded-xl flex items-center justify-between gap-3 hover:bg-surface-container-high transition-colors border border-surface-container-highest/30"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        title={isDone ? 'Mark Incomplete' : 'Complete Task & Award Points'}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          isDone
                            ? 'bg-tertiary text-on-tertiary shadow-sm'
                            : 'border border-outline/50 hover:bg-surface-container-highest text-transparent hover:text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </button>

                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? 'line-through text-outline' : 'text-on-surface'
                          } truncate`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-outline mt-0.5">
                          <span className="font-mono-metric text-primary font-bold">
                            {task.id}
                          </span>
                          <span>·</span>
                          <span className="text-on-surface-variant font-medium">
                            {member.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          PRIORITY_CLASSES[task.priority] || ''
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="font-mono-metric text-xs font-bold text-on-surface-variant">
                        {task.points}pt
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
