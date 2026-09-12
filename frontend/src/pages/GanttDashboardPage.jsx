import React from 'react';
import { usePulse } from '../context/PulseContext';
import GanttChartMatrix from '../components/gantt/GanttChartMatrix';
import MilestonesBanner from '../components/gantt/MilestonesBanner';
import { api } from '../api/client';

export default function GanttDashboardPage() {
  const { summary, loading } = usePulse();

  const handleDownloadExcel = () => {
    window.open(api.getExcelExportUrl(), '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-space-sm">
          <div className="h-10 w-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-on-surface-variant">Loading 16-Week Gantt Schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-lg pb-space-2xl">
      {/* Top Welcome & KPI Header */}
      <div className="bg-gradient-to-r from-surface-container-low via-surface-container-low to-primary/10 rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary uppercase tracking-wider">
                16-Week SPM Project
              </span>
              <span className="text-xs text-on-surface-variant font-mono">
                Week 13 of 16 — Testing &amp; Deployment Phase
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              RaktSeva Blood Bank System — Gantt &amp; Grand Chart
            </h1>
            <p className="text-xs text-on-surface-variant max-w-2xl mt-1">
              Interactive 16-week Gantt chart, milestone gates, and contributor velocity points for the Parul Sevashram Hospital Blood Bank SPM project.
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all font-bold text-xs shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Export Gantt Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Quick KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg pt-space-md border-t border-surface-container-highest/40">
          <div className="bg-surface-container-lowest/80 rounded-xl p-space-md border border-surface-container-highest/40">
            <span className="text-[11px] text-outline font-semibold uppercase">Schedule Duration</span>
            <div className="text-xl font-mono font-black text-on-surface mt-0.5">
              16 Weeks
            </div>
            <span className="text-[10px] text-primary font-bold">Week 13 — Testing Phase</span>
          </div>

          <div className="bg-surface-container-lowest/80 rounded-xl p-space-md border border-surface-container-highest/40">
            <span className="text-[11px] text-outline font-semibold uppercase">Tasks Tracked</span>
            <div className="text-xl font-mono font-black text-on-surface mt-0.5">
              {summary.completed_tasks} / {summary.total_tasks}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              {Math.round((summary.completed_tasks / (summary.total_tasks || 1)) * 100)}% Complete
            </span>
          </div>

          <div className="bg-surface-container-lowest/80 rounded-xl p-space-md border border-surface-container-highest/40">
            <span className="text-[11px] text-outline font-semibold uppercase">Milestones Met</span>
            <div className="text-xl font-mono font-black text-on-surface mt-0.5">
              {summary.milestones_met} / {summary.total_milestones}
            </div>
            <span className="text-[10px] text-indigo-400 font-bold">W2, W5, W9, W12 ✓ Approved</span>
          </div>

          <div className="bg-surface-container-lowest/80 rounded-xl p-space-md border border-surface-container-highest/40">
            <span className="text-[11px] text-outline font-semibold uppercase">Sprint Velocity</span>
            <div className="text-xl font-mono font-black text-primary mt-0.5">
              {summary.sprint_velocity || '94.8%'}
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">On Schedule ✓</span>
          </div>
        </div>
      </div>

      {/* 7 Milestones Roadmap Banner */}
      <MilestonesBanner />

      {/* 16-Week Interactive Gantt Chart Matrix */}
      <GanttChartMatrix />
    </div>
  );
}
