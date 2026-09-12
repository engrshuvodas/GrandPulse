import React from 'react';
import { usePulse } from '../../context/PulseContext';

export default function MilestonesBanner() {
  const { milestones } = usePulse();

  return (
    <div className="bg-surface-container-low rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md border-b border-surface-container-highest/40 pb-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">flag</span>
          </div>
          <div>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Project Milestones Roadmap (16 Weeks)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Key delivery gates defined in Hostel Management System SPM specification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-md text-xs font-medium text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span> Current / Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-outline/40"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Roadmap track */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">
        {milestones.map((ms) => {
          const isCompleted = ms.completed;
          const isCurrent = ms.status === 'In Progress';
          return (
            <div
              key={ms.id}
              className={`relative rounded-xl p-space-sm border transition-all ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isCurrent
                  ? 'bg-primary/10 border-primary/40 shadow-sm text-primary ring-1 ring-primary/30'
                  : 'bg-surface-container-lowest/60 border-surface-container-highest/50 text-on-surface-variant'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-mono">
                  W{ms.week}
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  {isCompleted ? 'check_circle' : isCurrent ? 'hourglass_top' : 'radio_button_unchecked'}
                </span>
              </div>
              <div className="text-xs font-semibold text-on-surface line-clamp-2" title={ms.title}>
                {ms.title}
              </div>
              <div className="mt-1.5 text-[10px] font-medium tracking-wide uppercase opacity-75">
                {ms.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
