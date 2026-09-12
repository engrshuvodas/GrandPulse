import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import { api } from '../api/client';

export default function ExportPage() {
  const { summary, contributions, tasks, members } = usePulse();
  const [downloading, setDownloading] = useState(false);

  const handleExportExcel = () => {
    setDownloading(true);
    window.location.href = api.getExcelExportUrl();
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleExportCsv = () => {
    window.location.href = api.getCsvExportUrl();
  };

  return (
    <div className="flex flex-col w-full relative pt-6">
      {/* Ambient Top Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-sm text-label-sm text-emerald-400 uppercase tracking-widest font-semibold">
            Data Extraction Suite
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-outline text-xs font-mono-metric font-semibold">Python openpyxl Engine</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Executive Export &amp; Reporting Center
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
          Generate high-fidelity, styled spreadsheets and machine-readable data dumps for executive reporting and peer audits.
        </p>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Formatted Excel Workbook */}
        <div className="bg-surface-container-low p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-emerald-400">table_view</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">description</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Styled Excel Workbook (.xlsx)
                </h3>
                <span className="text-xs text-emerald-400 font-semibold font-mono-metric">
                  Powered by Python openpyxl
                </span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant mb-4">
              Multi-tab formatted spreadsheet with tailored headers, color themes, KPI summary boxes, and auto-adjusted column dimensions.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                <span><strong>Sheet 1:</strong> Executive Summary with KPI status targets</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                <span><strong>Sheet 2:</strong> Leaderboard with Gold/Silver/Bronze tiers</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                <span><strong>Sheet 3:</strong> Full Contribution Ledger with verify flags</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                <span><strong>Sheet 4:</strong> Sprint Backlog with priorities &amp; hours</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all active:scale-98 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>{downloading ? 'Preparing Excel File...' : 'Download Excel Workbook (.xlsx)'}</span>
          </button>
        </div>

        {/* Card 2: Raw Ledger CSV Dump */}
        <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/50 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[100px] text-secondary">data_object</span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">csv</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Raw Ledger Data Stream (CSV)
                </h3>
                <span className="text-xs text-secondary font-semibold font-mono-metric">
                  Comma-Separated Standard
                </span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant mb-4">
              Lightweight raw data stream ready for programmatic ingestion, BigQuery imports, pandas dataframes, or BI tools.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Granular rows for all {contributions.length} contribution logs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>Includes Task ID associations, hours, dates, and points</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>UTF-8 encoded standard format</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-sm shadow-md transition-all active:scale-98 border border-surface-container-highest/60"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Download Raw CSV Stream</span>
          </button>
        </div>
      </div>

      {/* Dataset Summary Snapshot */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/40 shadow-md">
        <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
          Export Scope &amp; Integrity Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Active Core</span>
            <span className="text-xl font-bold font-mono-metric text-on-surface">{members.length} members</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Sprint Tasks</span>
            <span className="text-xl font-bold font-mono-metric text-secondary">{tasks.length} items</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Verified Contributions</span>
            <span className="text-xl font-bold font-mono-metric text-primary">{contributions.length} logs</span>
          </div>
          <div className="p-3 bg-surface-container rounded-xl border border-surface-container-highest/30">
            <span className="text-xs text-outline block font-semibold">Total Score Credited</span>
            <span className="text-xl font-bold font-mono-metric text-tertiary">{summary.total_points} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
