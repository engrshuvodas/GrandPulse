import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { api } from '../api/client';

export default function ExportPage() {
  const { summary, contributions, tasks, members } = usePulse();
  const [downloading, setDownloading] = useState(false);

  const handleExportExcel = () => {
    setDownloading(true);
    window.location.href = api.getExcelExportUrl();
    setTimeout(() => setDownloading(false), 3000);
  };

  const handleExportCsv = () => {
    window.location.href = api.getCsvExportUrl();
  };

  const totalHours = contributions.reduce((s, c) => s + (c.hours || 0), 0).toFixed(1);
  const totalPoints = contributions.reduce((s, c) => s + (c.points || 0), 0);

  const SHEETS = [
    { num: '1', icon: 'bar_chart', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30', name: 'Gantt Schedule', desc: '16-Week visual Gantt matrix with coloured progress bars, milestone markers, phase colour-coding, freeze panes, and print layout.' },
    { num: '2', icon: 'military_tech', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', name: 'Team Leaderboard', desc: 'Gold / Silver / Bronze ranked member table with points, hours, tasks completed, and team share percentage.' },
    { num: '3', icon: 'history_edu', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', name: 'Contribution Ledger', desc: `All ${contributions.length} verified contribution logs with categories, levels, hours, and verification status.` },
    { num: '4', icon: 'extension', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', name: 'Major Modules', desc: '10 major software modules with descriptions, completion percentage, and assigned module leads from SRS.' },
    { num: '5', icon: 'flag', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', name: 'Milestones', desc: '7 key project milestones with target weeks, deliverable descriptions, and achieved / upcoming status.' },
  ];

  return (
    <div className="flex flex-col w-full relative pt-6">
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-sm text-label-sm text-emerald-400 uppercase tracking-widest font-semibold">Data Extraction Suite</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-outline text-xs font-mono-metric font-semibold">Python openpyxl Engine · University Submission Ready</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Executive Export &amp; Reporting Center</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
          Generate the full RaktSeva Blood Bank SPM report as a styled, print-ready Excel workbook. 5 dedicated sheets, coloured Gantt bars, milestone gates, and a complete contribution ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-emerald-400">table_view</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Styled Excel Workbook (.xlsx)</h3>
                <span className="text-xs text-emerald-400 font-semibold font-mono-metric">5-Sheet · University Submission Ready</span>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              {SHEETS.map((s) => (
                <div key={s.num} className={`flex items-start gap-2 text-xs rounded-lg px-2 py-1.5 border ${s.bg}`}>
                  <span className={`material-symbols-outlined ${s.color} text-[16px] mt-0.5 shrink-0`}>{s.icon}</span>
                  <div>
                    <span className="font-bold text-on-surface">Sheet {s.num} — {s.name}:</span>{' '}
                    <span className="text-on-surface-variant">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleExportExcel} disabled={downloading}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all active:scale-98 disabled:opacity-50">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>{downloading ? 'Preparing Excel File...' : 'Download Excel Workbook (.xlsx)'}</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/50 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-secondary">data_object</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">csv</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">Raw Gantt Schedule (CSV)</h3>
                <span className="text-xs text-secondary font-semibold font-mono-metric">Machine-Readable · MS Project Compatible</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Lightweight raw data stream with all {tasks.length} Gantt tasks — ready for MS Project, Google Sheets, or pandas.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>All {tasks.length} tasks with Start/End weeks, Phase, Priority</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Status, progress %, assignee, and velocity points</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>UTF-8 encoded · Excel / Google Sheets / pandas compatible</span>
              </div>
            </div>
          </div>
          <button onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-sm shadow-md transition-all active:scale-98 border border-surface-container-highest/60">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Download Raw CSV Stream</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/40 shadow-md">
        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Export Scope &amp; Data Integrity Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Team Members</span>
            <span className="text-2xl font-bold font-mono-metric text-on-surface">{members.length}</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Gantt Tasks</span>
            <span className="text-2xl font-bold font-mono-metric text-secondary">{tasks.length}</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Contribution Logs</span>
            <span className="text-2xl font-bold font-mono-metric text-primary">{contributions.length}</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Total Points</span>
            <span className="text-2xl font-bold font-mono-metric text-tertiary">{totalPoints}</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Total Hours</span>
            <span className="text-2xl font-bold font-mono-metric text-emerald-400">{totalHours}h</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Excel Sheets</span>
            <span className="text-2xl font-bold font-mono-metric text-amber-400">5</span>
          </div>
        </div>
        <p className="text-xs text-outline mt-4 text-center font-mono">
          ✅ All data verified · RaktSeva Blood Bank System · Parul University SPM Project · 16 Weeks · Feb–May 2026
        </p>
      </div>
    </div>
  );
}
