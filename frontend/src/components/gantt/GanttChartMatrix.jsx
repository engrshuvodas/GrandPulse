import React, { useState, useMemo } from 'react';
import { usePulse } from '../../context/PulseContext';
import { api } from '../../api/client';

const WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);

// 5 Project Phases with clean colors and styling
const PHASES = [
  { id: 'Planning', label: '1. Planning & Scope', color: 'from-violet-600 to-purple-600', text: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/30', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40', weeks: 'W1–W3' },
  { id: 'Design', label: '2. Architecture & Design', color: 'from-sky-500 to-blue-600', text: 'text-sky-400', bg: 'bg-sky-500/15', border: 'border-sky-500/30', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40', weeks: 'W4–W6' },
  { id: 'Development', label: '3. Core Development', color: 'from-blue-600 to-indigo-600', text: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', weeks: 'W5–W10' },
  { id: 'Testing', label: '4. Testing & QA', color: 'from-emerald-500 to-teal-600', text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', weeks: 'W10–W13' },
  { id: 'Deployment', label: '5. Deployment & Defense', color: 'from-amber-500 to-orange-600', text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', weeks: 'W12–W16' },
];

const PHASE_MAP = Object.fromEntries(PHASES.map((p) => [p.id, p]));

// Member Avatars & Roles
const MEMBER_INFO = {
  shuvo: { name: 'Shuvo Das', role: 'Lead Architect', initials: 'SD', color: 'bg-primary text-on-primary' },
  monami: { name: 'Monami Sadhu', role: 'Backend & DB Lead', initials: 'MS', color: 'bg-secondary text-on-secondary' },
  setu: { name: 'Setu Mondol', role: 'UI/UX Lead', initials: 'SM', color: 'bg-tertiary text-on-tertiary' },
};

export default function GanttChartMatrix() {
  const { ganttTasks, updateTaskProgress, members, milestones, summary } = usePulse();

  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'flat'
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [memberFilter, setMemberFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedPhases, setCollapsedPhases] = useState({});

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [editProgress, setEditProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);

  const activeWeek = summary?.active_week || 13;

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return ganttTasks.filter((t) => {
      const matchPhase = phaseFilter === 'ALL' || t.phase === phaseFilter;
      const matchMember = memberFilter === 'ALL' || t.assignee_id === memberFilter;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'Completed' && (t.status === 'Completed' || t.progress_pct === 100)) ||
        (statusFilter === 'In Progress' && (t.status === 'In Progress' || (t.progress_pct > 0 && t.progress_pct < 100))) ||
        (statusFilter === 'Pending' && t.status === 'Pending' && t.progress_pct === 0);
      const matchSearch =
        !searchTerm ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phase.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPhase && matchMember && matchStatus && matchSearch;
    });
  }, [ganttTasks, phaseFilter, memberFilter, statusFilter, searchTerm]);

  // Tasks grouped by phase
  const groupedTasks = useMemo(() => {
    const groups = {};
    PHASES.forEach((p) => {
      groups[p.id] = [];
    });
    filteredTasks.forEach((t) => {
      if (!groups[t.phase]) groups[t.phase] = [];
      groups[t.phase].push(t);
    });
    return groups;
  }, [filteredTasks]);

  const togglePhaseCollapse = (phaseId) => {
    setCollapsedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setEditProgress(task.progress_pct || 0);
  };

  const handleSaveProgress = async () => {
    if (!selectedTask) return;
    setIsSaving(true);
    try {
      await updateTaskProgress(selectedTask.id, parseInt(editProgress, 10));
      setSelectedTask(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadExcel = () => {
    window.open(api.getExcelExportUrl(), '_blank');
  };

  const handleDownloadPdf = () => {
    window.open(api.getPdfExportUrl(), '_blank');
  };

  // Quick stats
  const completedCount = ganttTasks.filter((t) => t.progress_pct === 100 || t.status === 'Completed').length;
  const inProgressCount = ganttTasks.filter((t) => t.progress_pct > 0 && t.progress_pct < 100).length;
  const overallPct = Math.round((ganttTasks.reduce((acc, t) => acc + (t.progress_pct || 0), 0) / (ganttTasks.length * 100 || 1)) * 100);

  return (
    <div className="bg-surface-container-low rounded-2xl border border-surface-container-highest/60 shadow-xl overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="p-space-lg border-b border-surface-container-highest/50 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-gradient-to-r from-surface-container-low via-surface-container-low to-primary/5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/20 text-primary border border-primary/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Week {activeWeek} of 16 • Testing & QA Phase
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {completedCount} / {ganttTasks.length} Tasks Complete ({overallPct}%)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              4 / 7 Milestones Approved
            </span>
          </div>

          <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">calendar_view_week</span>
            RaktSeva Blood Bank Management System
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-2xl">
            Interactive 16-Week Gantt Schedule • Software Project Management (SPM) • Parul University
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-surface-container-highest/60 p-1 rounded-xl flex items-center border border-surface-container-highest">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grouped'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Group tasks by project phases (Planning, Design, Development, Testing, Deployment)"
            >
              <span className="material-symbols-outlined text-[16px]">folder</span>
              <span>By Phase</span>
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'flat'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Show all 17 tasks chronologically"
            >
              <span className="material-symbols-outlined text-[16px]">view_timeline</span>
              <span>Timeline</span>
            </button>
          </div>

          {/* Presentation / Print Mode */}
          <button
            onClick={() => setIsPresentationOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface border border-surface-container-highest text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Open clean presentation view for university defense or printing"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">slideshow</span>
            <span>Presentation View</span>
          </button>

          {/* Download Buttons: Excel + PDF */}
          <div className="flex items-center gap-1.5">
            {/* Excel */}
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-l-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 border border-emerald-700"
              title="Download full 5-sheet styled Excel workbook (.xlsx)"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              <span>Excel</span>
            </button>
            {/* PDF */}
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-r-xl bg-primary hover:bg-primary/85 text-on-primary text-xs font-bold transition-all shadow-md active:scale-95 border border-primary/80"
              title="Download A4 Landscape PDF report for printing"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTERS & SEARCH TOOLBAR
         ───────────────────────────────────────────────────────────── */}
      <div className="p-space-md bg-surface-container-lowest/70 border-b border-surface-container-highest/40 flex flex-wrap items-center justify-between gap-space-md">
        {/* Left: Phase Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-outline uppercase tracking-wider mr-1">
            Phase:
          </span>
          <button
            onClick={() => setPhaseFilter('ALL')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              phaseFilter === 'ALL'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            All ({ganttTasks.length})
          </button>
          {PHASES.map((p) => {
            const count = ganttTasks.filter((t) => t.phase === p.id).length;
            const isActive = phaseFilter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPhaseFilter(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${p.color}`} />
                <span>{p.id}</span>
                <span className={`text-[10px] opacity-75 ${isActive ? 'text-on-primary' : 'text-outline'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Assignee, Status, Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Assignee Filter */}
          <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg border border-surface-container-highest/60 text-xs">
            <span className="material-symbols-outlined text-[16px] text-outline">person</span>
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-transparent text-on-surface text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-surface-container-high">All Engineers</option>
              <option value="shuvo" className="bg-surface-container-high">Shuvo Das (Lead)</option>
              <option value="monami" className="bg-surface-container-high">Monami Sadhu (DB/Backend)</option>
              <option value="setu" className="bg-surface-container-high">Setu Mondol (UI/UX)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-lg border border-surface-container-highest/60 text-xs">
            <span className="material-symbols-outlined text-[16px] text-outline">tune</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-on-surface text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-surface-container-high">All Statuses</option>
              <option value="Completed" className="bg-surface-container-high">Completed ({completedCount})</option>
              <option value="In Progress" className="bg-surface-container-high">In Progress ({inProgressCount})</option>
              <option value="Pending" className="bg-surface-container-high">Pending</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative w-48 sm:w-56">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-surface-container-high border border-surface-container-highest/60 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-[14px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN GANTT TIMELINE CANVAS
         ───────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto select-none">
        <div className="min-w-[1200px]">
          {/* Top Two-Tier Timeline Header */}
          <div className="sticky top-0 z-20 bg-surface-container-high border-b border-surface-container-highest shadow-sm">
            {/* Tier 1: Phase Bands Spans */}
            <div className="grid grid-cols-[400px_1fr] border-b border-surface-container-highest/60 text-[11px] font-bold">
              <div className="p-2.5 pl-4 flex items-center justify-between border-r border-surface-container-highest/60 text-outline uppercase tracking-wider font-semibold">
                <span>Task Scope & Assignment</span>
                <span className="text-[10px] font-mono text-outline">16 WEEKS TOTAL</span>
              </div>
              <div className="grid grid-cols-16 text-center">
                <div className="col-span-3 py-1 px-1 bg-violet-500/10 text-violet-300 border-r border-surface-container-highest/30 truncate font-semibold">
                  📋 Phase 1: Planning (W1–W3)
                </div>
                <div className="col-span-3 py-1 px-1 bg-sky-500/10 text-sky-300 border-r border-surface-container-highest/30 truncate font-semibold">
                  🎨 Phase 2: Design (W4–W6)
                </div>
                <div className="col-span-4 py-1 px-1 bg-blue-500/10 text-blue-300 border-r border-surface-container-highest/30 truncate font-semibold">
                  💻 Phase 3: Development (W5–W10)
                </div>
                <div className="col-span-3 py-1 px-1 bg-emerald-500/10 text-emerald-300 border-r border-surface-container-highest/30 truncate font-semibold">
                  🧪 Phase 4: Testing (W10–W13)
                </div>
                <div className="col-span-3 py-1 px-1 bg-amber-500/10 text-amber-300 truncate font-semibold">
                  🚀 Phase 5: Deploy (W12–W16)
                </div>
              </div>
            </div>

            {/* Tier 2: 16 Individual Week Columns */}
            <div className="grid grid-cols-[400px_1fr] text-xs font-bold text-on-surface">
              <div className="p-2.5 pl-4 border-r border-surface-container-highest/60 flex items-center justify-between text-outline text-[11px]">
                <span>Task Name / Lead</span>
                <div className="flex items-center gap-4 pr-2">
                  <span>Duration</span>
                  <span>Progress</span>
                </div>
              </div>

              <div className="grid grid-cols-16">
                {WEEKS.map((w) => {
                  const isCurrent = w === activeWeek;
                  const isPast = w < activeWeek;
                  return (
                    <div
                      key={w}
                      className={`py-2 text-center font-mono text-[11px] font-bold border-r border-surface-container-highest/30 transition-colors ${
                        isCurrent
                          ? 'bg-primary/25 text-primary border-b-2 border-b-primary font-black shadow-inner'
                          : isPast
                          ? 'text-on-surface-variant bg-surface-container-high/40'
                          : 'text-outline/80 bg-surface-container-high/10'
                      }`}
                    >
                      <span className="block">W{w}</span>
                      {isCurrent && (
                        <span className="block text-[8px] uppercase tracking-tighter text-primary font-black leading-none">
                          TODAY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integrated Milestone Diamond Row */}
            <div className="grid grid-cols-[400px_1fr] bg-surface-container-lowest/80 border-t border-surface-container-highest/30 py-1.5 text-xs items-center">
              <div className="pl-4 pr-2 border-r border-surface-container-highest/60 flex items-center gap-1.5 text-outline text-[10px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px] text-amber-400">flag</span>
                <span>Project Milestones (M1–M7):</span>
              </div>
              <div className="grid grid-cols-16 relative">
                {WEEKS.map((w) => {
                  const ms = milestones.find((m) => m.week === w);
                  const isCurrent = w === activeWeek;
                  return (
                    <div
                      key={w}
                      className={`flex items-center justify-center border-r border-surface-container-highest/20 h-7 ${
                        isCurrent ? 'bg-primary/10' : ''
                      }`}
                    >
                      {ms && (
                        <div
                          className={`relative group/ms cursor-pointer flex items-center justify-center p-1 rounded-full transition-transform hover:scale-125 ${
                            ms.completed
                              ? 'text-emerald-400'
                              : ms.status === 'In Progress'
                              ? 'text-primary animate-bounce'
                              : 'text-outline'
                          }`}
                          title={`Milestone ${ms.id}: ${ms.title} (Week ${ms.week})`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {ms.completed ? 'check_circle' : 'flag'}
                          </span>

                          {/* Popover Tooltip */}
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 hidden group-hover/ms:block w-52 p-2 rounded-lg bg-surface-container-highest shadow-2xl border border-surface-container-highest text-[10px] text-on-surface pointer-events-none">
                            <div className="font-bold text-primary flex items-center justify-between mb-0.5">
                              <span>Milestone #{ms.id} (W{ms.week})</span>
                              <span className={ms.completed ? 'text-emerald-400' : 'text-amber-400'}>
                                {ms.status}
                              </span>
                            </div>
                            <div className="text-on-surface-variant font-medium leading-tight">
                              {ms.title}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. TASK ROWS (Grouped or Flat)
             ───────────────────────────────────────────────────────────── */}
          <div className="divide-y divide-surface-container-highest/30">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-outline text-[40px] mb-2">search_off</span>
                <p className="text-sm font-semibold text-on-surface">No tasks match your current filters</p>
                <p className="text-xs text-on-surface-variant mt-1">Try resetting the phase, member, or search filters</p>
                <button
                  onClick={() => {
                    setPhaseFilter('ALL');
                    setMemberFilter('ALL');
                    setStatusFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grouped' ? (
              /* Grouped by Phase */
              PHASES.map((phase) => {
                const tasksInPhase = groupedTasks[phase.id] || [];
                if (tasksInPhase.length === 0 && phaseFilter !== 'ALL') return null;
                const isCollapsed = collapsedPhases[phase.id];
                const phaseDoneCount = tasksInPhase.filter((t) => t.progress_pct === 100 || t.status === 'Completed').length;
                const phasePct = tasksInPhase.length
                  ? Math.round(
                      (tasksInPhase.reduce((acc, t) => acc + (t.progress_pct || 0), 0) /
                        (tasksInPhase.length * 100)) *
                        100
                    )
                  : 0;

                return (
                  <div key={phase.id} className="bg-surface-container-lowest/30">
                    {/* Phase Header Row */}
                    <div
                      onClick={() => togglePhaseCollapse(phase.id)}
                      className="grid grid-cols-[400px_1fr] bg-surface-container-low/90 hover:bg-surface-container-high/60 cursor-pointer border-y border-surface-container-highest/50 py-2.5 pl-4 pr-2 text-xs font-bold select-none transition-colors"
                    >
                      <div className="flex items-center gap-2 border-r border-surface-container-highest/60 pr-2">
                        <span className="material-symbols-outlined text-[18px] text-outline transition-transform">
                          {isCollapsed ? 'chevron_right' : 'expand_more'}
                        </span>
                        <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${phase.color}`} />
                        <span className="text-on-surface font-bold">{phase.label}</span>
                        <span className="text-[10px] font-mono text-outline font-normal">
                          ({tasksInPhase.length} tasks)
                        </span>
                        <span className={`ml-auto mr-2 px-2 py-0.5 rounded text-[10px] font-bold ${phase.badge}`}>
                          {phaseDoneCount}/{tasksInPhase.length} Done ({phasePct}%)
                        </span>
                      </div>

                      {/* Phase Summary Bar on Timeline */}
                      <div className="grid grid-cols-16 items-center px-1">
                        <div className="col-span-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${phase.color} transition-all duration-500`}
                            style={{ width: `${phasePct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phase Task Items */}
                    {!isCollapsed &&
                      tasksInPhase.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          activeWeek={activeWeek}
                          onEdit={handleOpenEdit}
                          onHover={setHoveredTask}
                        />
                      ))}
                  </div>
                );
              })
            ) : (
              /* Flat Timeline View */
              filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  activeWeek={activeWeek}
                  onEdit={handleOpenEdit}
                  onHover={setHoveredTask}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. FOOTER SPECIFICATION & LEGEND
         ───────────────────────────────────────────────────────────── */}
      <div className="p-space-md bg-surface-container-lowest border-t border-surface-container-highest/50 flex flex-col md:flex-row md:items-center justify-between gap-space-md text-xs">
        {/* Visual Legend */}
        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
          <span className="font-bold text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">info</span>
            Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-gradient-to-r from-emerald-500 to-teal-600 inline-block shadow-sm"></span>
            <span className="font-medium">100% Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-gradient-to-r from-blue-600 to-indigo-600 inline-block shadow-sm"></span>
            <span className="font-medium">In Progress (Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-6 rounded bg-surface-container-highest border border-outline/30 inline-block"></span>
            <span className="font-medium">Scheduled (Pending)</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <span>Week {activeWeek} Active Sprint</span>
          </div>
        </div>

        {/* Academic context note */}
        <div className="text-[11px] font-mono text-outline flex items-center gap-2">
          <span>SPM Final Submission • 16-Week Waterfall/Agile Lifecycle</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL: INTERACTIVE TASK PROGRESS UPDATER
         ───────────────────────────────────────────────────────────── */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-surface-container-low rounded-2xl p-space-xl max-w-lg w-full border border-surface-container-highest shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-space-md border-b border-surface-container-highest/40 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                  {selectedTask.id}
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Task Progress & Status
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-outline hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Task Info */}
            <div className="bg-surface-container-lowest/80 p-space-md rounded-xl border border-surface-container-highest/50 mb-space-md">
              <div className="font-bold text-sm text-on-surface mb-1">
                {selectedTask.title}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant mt-2">
                <div>
                  <span className="text-outline block text-[10px] uppercase">Phase</span>
                  <span className="font-semibold text-on-surface">{selectedTask.phase}</span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase">Timeline</span>
                  <span className="font-mono text-on-surface">
                    Week {selectedTask.start_week} → Week {selectedTask.end_week} ({selectedTask.duration_weeks} wks)
                  </span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase">Assigned Engineer</span>
                  <span className="font-semibold text-primary">
                    {MEMBER_INFO[selectedTask.assignee_id]?.name || selectedTask.assignee_id}
                  </span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase">Velocity Points</span>
                  <span className="font-mono font-bold text-on-surface">{selectedTask.points} Pts</span>
                </div>
              </div>
            </div>

            {/* Interactive Progress Slider */}
            <div className="mb-space-lg">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-on-surface">Completion Percentage</span>
                <span className="font-mono text-primary font-bold text-base">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editProgress}
                onChange={(e) => setEditProgress(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />

              {/* Quick Presets */}
              <div className="flex items-center justify-between gap-1.5 mt-3">
                {[0, 25, 50, 75, 90, 100].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setEditProgress(preset)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                      editProgress === preset
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-high text-outline hover:text-on-surface border-surface-container-highest'
                    }`}
                  >
                    {preset}%
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-space-sm border-t border-surface-container-highest/40">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Save Progress</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. FULL-SCREEN PRESENTATION / UNIVERSITY DEFENSE VIEW MODAL
         ───────────────────────────────────────────────────────────── */}
      {isPresentationOpen && (
        <PresentationViewModal
          tasks={ganttTasks}
          milestones={milestones}
          summary={summary}
          activeWeek={activeWeek}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  SUB-COMPONENT: TASK ROW WITH CONTINUOUS GANTT BAR
// ─────────────────────────────────────────────────────────────────────────
function TaskRow({ task, activeWeek, onEdit, onHover }) {
  const phaseInfo = PHASE_MAP[task.phase] || PHASES[0];
  const member = MEMBER_INFO[task.assignee_id];
  const isCompleted = task.status === 'Completed' || task.progress_pct === 100;
  const isInProgress = task.status === 'In Progress' || (task.progress_pct > 0 && task.progress_pct < 100);

  // Continuous Gantt Bar geometry
  const leftPercent = ((task.start_week - 1) / 16) * 100;
  const widthPercent = (task.duration_weeks / 16) * 100;

  return (
    <div
      className="grid grid-cols-[400px_1fr] hover:bg-surface-container-high/40 transition-colors group text-xs items-center relative"
      onMouseEnter={() => onHover(task)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Left Info Panel (400px fixed) */}
      <div className="p-2.5 pl-4 pr-3 border-r border-surface-container-highest/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Task ID Badge */}
          <span className="font-mono text-[10px] font-bold text-outline bg-surface-container-high px-1.5 py-0.5 rounded border border-surface-container-highest/50 shrink-0">
            {task.id}
          </span>

          {/* Task Title & Assignee */}
          <div className="truncate">
            <div
              onClick={() => onEdit(task)}
              className="font-bold text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer text-xs"
              title={`${task.id}: ${task.title} (Click to edit)`}
            >
              {task.title}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Member pill */}
              {member && (
                <span className="flex items-center gap-1 text-[10px] text-on-surface-variant font-medium">
                  <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold text-[8px] ${member.color}`}>
                    {member.initials}
                  </span>
                  <span>{member.name.split(' ')[0]}</span>
                </span>
              )}

              {/* Phase tag */}
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${phaseInfo.badge}`}>
                {task.phase}
              </span>
            </div>
          </div>
        </div>

        {/* Duration & Progress Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono text-[10px] text-outline">
            <span className="block font-bold text-on-surface">W{task.start_week}–W{task.end_week}</span>
            <span>({task.duration_weeks} wks)</span>
          </div>

          <button
            onClick={() => onEdit(task)}
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all shadow-sm ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : isInProgress
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
                : 'bg-surface-container-highest text-outline border border-outline/20 hover:bg-surface-container-highest/90'
            }`}
            title="Click to change progress percentage"
          >
            {task.progress_pct}%
          </button>
        </div>
      </div>

      {/* Right Timeline Canvas with 16-Week Grid & Smooth Continuous Bar */}
      <div className="relative h-11 w-full flex items-center">
        {/* Background Grid Columns for all 16 Weeks */}
        <div className="absolute inset-0 grid grid-cols-16 pointer-events-none">
          {WEEKS.map((w) => {
            const isCurrent = w === activeWeek;
            const isAlt = w % 2 === 0;
            return (
              <div
                key={w}
                className={`h-full border-r border-surface-container-highest/20 ${
                  isCurrent
                    ? 'bg-primary/10 border-x-primary/40'
                    : isAlt
                    ? 'bg-surface-container-highest/5'
                    : ''
                }`}
              />
            );
          })}
        </div>

        {/* Current Week Vertical Indicator Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-primary z-10 pointer-events-none opacity-40 shadow-[0_0_8px_rgba(192,193,255,0.8)]"
          style={{ left: `${((activeWeek - 0.5) / 16) * 100}%` }}
        />

        {/* Continuous Rounded Gantt Bar */}
        <div
          onClick={() => onEdit(task)}
          className={`absolute h-7 rounded-lg shadow-md cursor-pointer transition-all duration-200 group/bar flex items-center overflow-hidden hover:brightness-110 hover:shadow-lg hover:scale-[1.01] z-10 ${
            isCompleted
              ? `bg-gradient-to-r ${phaseInfo.color}`
              : isInProgress
              ? `bg-surface-container-highest border border-indigo-500/40`
              : `bg-surface-container-highest/60 border border-dashed border-outline/30`
          }`}
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
          title={`${task.title} (Week ${task.start_week} to ${task.end_week}) - ${task.progress_pct}% Completed`}
        >
          {/* In-Progress Two-Tone Fill Track */}
          {isInProgress && (
            <div
              className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${phaseInfo.color} opacity-90 rounded-l-md transition-all`}
              style={{ width: `${task.progress_pct}%` }}
            />
          )}

          {/* Bar Label & Progress Details */}
          <div className="relative z-10 px-2.5 flex items-center justify-between w-full text-white font-bold text-[10px] truncate select-none">
            <span className="truncate flex items-center gap-1">
              {isCompleted ? (
                <span className="material-symbols-outlined text-[13px] text-white">check</span>
              ) : isInProgress ? (
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
              ) : null}
              <span className="truncate text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {task.title}
              </span>
            </span>

            <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-black/40 text-white shrink-0 ml-1">
              {task.progress_pct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
//  SUB-COMPONENT: FULL-SCREEN PRESENTATION VIEW MODAL (PRINT READY)
// ─────────────────────────────────────────────────────────────────────────
function PresentationViewModal({ tasks, milestones, summary, activeWeek, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 text-slate-100 p-4 sm:p-8 animate-fade-in print:p-0 print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl print:border-none print:shadow-none print:bg-white print:p-2">
        {/* Top Header & Close */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-indigo-400 text-[32px]">cast_for_education</span>
            <div>
              <h2 className="text-lg font-bold text-white">University Presentation & Print View</h2>
              <p className="text-xs text-slate-400">
                High-contrast, publication-grade Gantt schedule formatted for slide decks and university submission.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Academic Presentation Banner */}
        <div className="mt-6 mb-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 print:bg-white print:border-black print:text-black">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-indigo-400 font-mono print:text-black">
                PARUL UNIVERSITY • FACULTY OF ENGINEERING & TECHNOLOGY
              </div>
              <h1 className="text-2xl font-bold text-white mt-1 print:text-black">
                RaktSeva Blood Bank Management System
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl print:text-slate-700">
                Software Project Management (SPM) 16-Week Implementation & Delivery Schedule • Parul Sevashram Hospital
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300 print:text-black">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Team Members</span>
                <span className="font-bold text-white print:text-black">Shuvo Das • Monami Sadhu • Setu Mondol</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Current Week</span>
                <span className="font-mono font-bold text-emerald-400 print:text-black">Week 13 (Testing Phase)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Gantt Schedule Matrix */}
        <div className="overflow-x-auto border border-slate-800 rounded-2xl print:border-black">
          <div className="min-w-[1100px]">
            {/* Timeline Header */}
            <div className="grid grid-cols-[360px_1fr] bg-slate-800 border-b border-slate-700 text-xs font-bold text-slate-200 print:bg-slate-200 print:text-black">
              <div className="p-3 pl-4 border-r border-slate-700 flex items-center justify-between">
                <span>Task / Deliverable</span>
                <span>Weeks</span>
              </div>
              <div className="grid grid-cols-16">
                {WEEKS.map((w) => (
                  <div
                    key={w}
                    className={`py-2.5 text-center font-mono text-[11px] border-r border-slate-700/60 ${
                      w === activeWeek ? 'bg-indigo-900/60 text-indigo-300 font-black' : ''
                    }`}
                  >
                    W{w}
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="divide-y divide-slate-800 print:divide-slate-300">
              {tasks.map((task) => {
                const phase = PHASE_MAP[task.phase] || PHASES[0];
                const left = ((task.start_week - 1) / 16) * 100;
                const width = (task.duration_weeks / 16) * 100;
                const isDone = task.progress_pct === 100;

                return (
                  <div key={task.id} className="grid grid-cols-[360px_1fr] items-center text-xs">
                    <div className="p-2.5 pl-4 border-r border-slate-800 flex items-center justify-between gap-2 print:border-slate-300">
                      <div className="truncate">
                        <span className="font-mono text-[10px] font-bold text-indigo-400 mr-2">
                          {task.id}
                        </span>
                        <span className="font-semibold text-slate-200 print:text-black">
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        W{task.start_week}-W{task.end_week}
                      </span>
                    </div>

                    <div className="relative h-9 w-full flex items-center px-1">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-16 pointer-events-none">
                        {WEEKS.map((w) => (
                          <div
                            key={w}
                            className={`h-full border-r border-slate-800/40 ${
                              w === activeWeek ? 'bg-indigo-950/20' : ''
                            }`}
                          />
                        ))}
                      </div>

                      {/* Bar */}
                      <div
                        className={`absolute h-6 rounded-md shadow flex items-center px-2 text-[10px] font-bold text-white ${
                          isDone
                            ? `bg-gradient-to-r ${phase.color}`
                            : 'bg-indigo-700/80 border border-indigo-400/40'
                        }`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <span className="truncate">{task.title}</span>
                        <span className="ml-auto font-mono text-[9px]">{task.progress_pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Presentation Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 print:text-black print:border-black">
          <div>
            <span>Document Approved: Software Project Management Faculty Evaluation</span>
          </div>
          <div className="font-mono text-[11px]">
            Generated by GrandPulse SPM Engine • Date: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
