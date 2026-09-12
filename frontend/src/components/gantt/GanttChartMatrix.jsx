import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';

const WEEKS = Array.from({ length: 16 }, (_, i) => i + 1);

const PHASES = ['ALL', 'Planning', 'Design', 'Development', 'Testing', 'Deployment'];

const PHASE_COLORS = {
  Planning: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  Design: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
  Development: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  Testing: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  Deployment: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
};

export default function GanttChartMatrix() {
  const { ganttTasks, updateTaskProgress, members } = usePulse();
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [editProgress, setEditProgress] = useState(0);

  const activeWeek = 6; // Current project week

  // Filter tasks
  const filteredTasks = ganttTasks.filter((t) => {
    const matchesPhase = phaseFilter === 'ALL' || t.phase === phaseFilter;
    const matchesSearch =
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setEditProgress(task.progress_pct || 0);
  };

  const handleSaveProgress = async () => {
    if (!selectedTask) return;
    await updateTaskProgress(selectedTask.id, parseInt(editProgress, 10));
    setSelectedTask(null);
  };

  return (
    <div className="bg-surface-container-low rounded-2xl border border-surface-container-highest/60 shadow-lg overflow-hidden">
      {/* Top Header & Filters */}
      <div className="p-space-lg border-b border-surface-container-highest/50 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="material-symbols-outlined text-primary text-[24px]">view_timeline</span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Hostel Management System — 16-Week Gantt Schedule
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            Full 16-week timeline with task durations, weekly milestones, and live contributor velocity
          </p>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest/80 p-1.5 rounded-xl border border-surface-container-highest/40">
          {PHASES.map((ph) => (
            <button
              key={ph}
              onClick={() => setPhaseFilter(ph)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                phaseFilter === ph
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Search & Quick Legend */}
      <div className="px-space-lg py-space-sm bg-surface-container-lowest/50 border-b border-surface-container-highest/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search 17 project tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-surface-container-high border border-surface-container-highest/60 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-space-md text-xs">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded bg-emerald-500"></span>
            <span className="text-on-surface-variant">Completed (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded bg-indigo-600"></span>
            <span className="text-on-surface-variant">In Progress (█)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 rounded bg-surface-container-highest border border-outline/30"></span>
            <span className="text-on-surface-variant">Pending</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Current: Week {activeWeek}</span>
          </div>
        </div>
      </div>

      {/* Gantt Timeline Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-surface-container-high border-b border-surface-container-highest/60 text-xs font-bold text-on-surface">
            {/* Left Side: Task Info (5 Cols) */}
            <div className="col-span-5 grid grid-cols-12 p-3 items-center border-r border-surface-container-highest/50">
              <div className="col-span-6 font-semibold uppercase tracking-wider text-outline text-[11px]">
                Task & Phase
              </div>
              <div className="col-span-3 text-center uppercase tracking-wider text-outline text-[11px]">
                Weeks
              </div>
              <div className="col-span-3 text-right uppercase tracking-wider text-outline text-[11px] pr-2">
                Progress
              </div>
            </div>

            {/* Right Side: 16 Weeks (7 Cols) */}
            <div className="col-span-7 grid grid-cols-16 items-center">
              {WEEKS.map((w) => {
                const isCurrent = w === activeWeek;
                return (
                  <div
                    key={w}
                    className={`py-3 text-center text-[11px] font-mono font-bold border-r border-surface-container-highest/30 ${
                      isCurrent
                        ? 'bg-primary/20 text-primary border-b-2 border-b-primary font-black'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    W{w}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-surface-container-highest/30">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-sm text-on-surface-variant">
                No project tasks matching filter.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'Completed' || task.progress_pct === 100;
                const isInProgress = task.status === 'In Progress' || (task.progress_pct > 0 && task.progress_pct < 100);
                const phaseBadge = PHASE_COLORS[task.phase] || 'border-slate-500/40 text-slate-400 bg-slate-500/10';

                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 hover:bg-surface-container-high/40 transition-colors group text-xs items-center"
                  >
                    {/* Left Info */}
                    <div className="col-span-5 grid grid-cols-12 p-2.5 items-center border-r border-surface-container-highest/50">
                      <div className="col-span-6 flex flex-col pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-outline font-bold">
                            {task.id}
                          </span>
                          <span
                            className={`font-semibold text-on-surface truncate group-hover:text-primary transition-colors cursor-pointer`}
                            onClick={() => handleOpenEdit(task)}
                            title={`Click to edit progress: ${task.title}`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border ${phaseBadge}`}>
                            {task.phase}
                          </span>
                          {task.assignee_id && (
                            <span className="text-[10px] text-on-surface-variant uppercase font-mono">
                              👤 {task.assignee_id}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3 text-center font-mono text-[11px] text-on-surface-variant">
                        W{task.start_week}-W{task.end_week}
                        <span className="block text-[10px] text-outline">({task.duration_weeks} wks)</span>
                      </div>

                      <div className="col-span-3 flex items-center justify-end gap-1.5 pr-2">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : isInProgress
                              ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                              : 'bg-surface-container-highest text-outline hover:bg-surface-container-highest/80'
                          }`}
                          title="Click to update task progress"
                        >
                          {task.progress_pct}%
                        </button>
                      </div>
                    </div>

                    {/* Right: 16-Week Schedule Matrix Bar */}
                    <div className="col-span-7 grid grid-cols-16 h-full items-center">
                      {WEEKS.map((w) => {
                        const inRange = w >= task.start_week && w <= task.end_week;
                        const isStart = w === task.start_week;
                        const isEnd = w === task.end_week;
                        const isCurrentWeek = w === activeWeek;

                        if (!inRange) {
                          return (
                            <div
                              key={w}
                              className={`h-full min-h-[38px] border-r border-surface-container-highest/20 ${
                                isCurrentWeek ? 'bg-primary/5' : ''
                              }`}
                            />
                          );
                        }

                        // Active week block
                        return (
                          <div
                            key={w}
                            onClick={() => handleOpenEdit(task)}
                            className={`h-full min-h-[38px] p-1 flex items-center justify-center border-r border-surface-container-highest/20 cursor-pointer ${
                              isCurrentWeek ? 'bg-primary/10' : ''
                            }`}
                            title={`${task.title} (Week ${task.start_week}-${task.end_week}) - Click to edit`}
                          >
                            <div
                              className={`w-full h-6 flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-105 ${
                                isCompleted
                                  ? 'bg-emerald-500 hover:bg-emerald-400'
                                  : isInProgress
                                  ? 'bg-indigo-600 hover:bg-indigo-500'
                                  : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-highest/90'
                              } ${isStart ? 'rounded-l-md' : ''} ${isEnd ? 'rounded-r-md' : ''}`}
                            >
                              {/* Exact PDF symbol: █ */}
                              {isStart && task.progress_pct === 100 ? (
                                <span className="material-symbols-outlined text-[14px]">check</span>
                              ) : isStart && task.progress_pct > 0 ? (
                                `${task.progress_pct}%`
                              ) : (
                                '█'
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Specification Note matching PDF */}
      <div className="p-space-md bg-surface-container-lowest border-t border-surface-container-highest/50 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="font-bold text-on-surface">Legend:</span>
          <span>█ = Task is in progress during that week (PDF Specification)</span>
        </div>
        <div className="text-[11px] italic text-outline">
          Suitable for Software Engineering, SPM, and Mini/Major Project documentation
        </div>
      </div>

      {/* Quick Progress Adjuster Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low rounded-2xl p-space-xl max-w-md w-full border border-surface-container-highest shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Update Task Progress
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-space-md">
              <div className="font-bold text-sm text-on-surface mb-1">{selectedTask.title}</div>
              <div className="text-xs text-on-surface-variant">
                Scheduled: Week {selectedTask.start_week} to Week {selectedTask.end_week} ({selectedTask.duration_weeks} weeks) · {selectedTask.points} Velocity Pts
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container-highest/60 mb-space-lg">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-on-surface-variant">Progress Completion</span>
                <span className="font-mono text-primary font-bold text-sm">{editProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editProgress}
                onChange={(e) => setEditProgress(e.target.value)}
                className="w-full accent-primary cursor-pointer h-2 bg-surface-container-high rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-outline mt-1 font-mono">
                <span>0% (Pending)</span>
                <span>50% (In Progress)</span>
                <span>100% (Completed)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-space-md py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-space-lg py-2 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-md"
              >
                Save & Update Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
