import React from 'react';
import { usePulse } from '../../context/PulseContext';

const NAV_ITEMS = [
  { id: 'gantt', label: 'Gantt & Timeline', icon: 'view_timeline', desc: '16-Week Schedule' },
  { id: 'grandchart', label: 'Grand Chart & Modules', icon: 'leaderboard', desc: 'Points & 10 Modules' },
  { id: 'analytics', label: 'Progress Analytics', icon: 'insights', desc: 'Velocity Curves' },
  { id: 'export', label: 'Export Center', icon: 'file_download', desc: 'Excel & CSV' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, summary } = usePulse();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-r border-surface-container-highest/30">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-space-xl flex items-center gap-space-sm bg-surface-container-low border-b border-surface-container-highest/40">
          <img
            alt="GrandPulse Logo"
            className="h-8 w-auto object-contain"
            src="/logo.svg"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-none tracking-tight font-bold">
              GrandPulse
            </span>
            <span className="font-label-sm text-[10px] text-primary tracking-wider uppercase mt-1 font-semibold">
              RaktSeva Blood Bank SPM
            </span>
          </div>
        </div>

        {/* Simplified Navigation */}
        <div className="px-space-md py-space-md">
          <div className="px-space-md py-space-xs mb-space-xs">
            <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-bold">
              Core Modules
            </span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-space-md px-space-md py-2.5 rounded-xl transition-all text-left w-full ${
                    isActive
                      ? 'bg-primary text-on-primary font-bold shadow-md'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    <span className={`text-[10px] leading-tight mt-0.5 ${isActive ? 'text-on-primary/80' : 'text-outline'}`}>
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 16-Week Schedule Status Widget */}
      <div className="p-space-md bg-surface-container-lowest m-space-md rounded-xl border border-surface-container-highest/50 shadow-inner">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
            16-Week Project Pace
          </span>
          <span className="font-mono text-primary font-bold text-xs">
            Week 6 of 16
          </span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700"
            style={{ width: `${summary.overall_progress_pct || 83}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>{summary.completed_tasks} / {summary.total_tasks} Tasks Done</span>
          <span className="text-emerald-400 font-bold">{summary.overall_progress_pct || 83}%</span>
        </div>
      </div>
    </aside>
  );
}
