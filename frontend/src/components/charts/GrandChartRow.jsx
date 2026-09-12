import React from 'react';
import { usePulse } from '../../context/PulseContext';

const RANK_THEMES = [
  {
    rank: 1,
    badgeBg: 'bg-amber-400/10 text-amber-300 border border-amber-400/30',
    trophyIcon: 'workspace_premium',
    trophyColor: 'text-amber-400',
    barGradient: 'from-amber-400 via-primary to-primary',
    scorePillBg: 'bg-amber-400/20 text-amber-300',
    shadowClass: 'shadow-[0_4px_24px_-4px_rgba(251,191,36,0.18)]',
  },
  {
    rank: 2,
    badgeBg: 'bg-slate-300/10 text-slate-300 border border-slate-300/30',
    trophyIcon: 'military_tech',
    trophyColor: 'text-slate-300',
    barGradient: 'from-secondary via-secondary-container to-secondary',
    scorePillBg: 'bg-secondary/20 text-secondary',
    shadowClass: 'shadow-[0_4px_20px_-4px_rgba(76,215,246,0.15)]',
  },
  {
    rank: 3,
    badgeBg: 'bg-amber-700/15 text-amber-500 border border-amber-700/30',
    trophyIcon: 'shield',
    trophyColor: 'text-amber-600',
    barGradient: 'from-tertiary-container via-tertiary to-tertiary-fixed',
    scorePillBg: 'bg-tertiary/20 text-tertiary',
    shadowClass: 'shadow-[0_4px_20px_-4px_rgba(78,222,163,0.15)]',
  },
];

export default function GrandChartRow({ member, totalTeamScore, index }) {
  const { openMemberAudit } = usePulse();

  const theme = RANK_THEMES[index] || {
    rank: index + 1,
    badgeBg: 'bg-surface-container text-on-surface-variant border border-surface-container-highest',
    trophyIcon: 'star',
    trophyColor: 'text-outline',
    barGradient: 'from-surface-variant to-primary',
    scorePillBg: 'bg-surface-container text-on-surface-variant',
    shadowClass: '',
  };

  const percentage = member.percentage || ((member.score / (totalTeamScore || 1)) * 100).toFixed(1);
  const barWidth = Math.min(100, Math.max(8, Number(percentage)));

  return (
    <div
      className={`group bg-surface-container p-4 lg:p-5 rounded-xl transition-all hover:bg-surface-container-high ${theme.shadowClass} flex flex-col gap-3 border border-surface-container-highest/40`}
    >
      {/* Member Row Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Rank Medal */}
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg ${theme.badgeBg} font-mono-metric font-bold text-xs shrink-0 shadow-sm`}
          >
            #{theme.rank}
          </div>

          {/* Avatar */}
          <div className="relative">
            <div
              className={`w-11 h-11 rounded-xl ${member.avatar_bg || 'bg-primary'} ${
                member.avatar_text_color || 'text-on-primary'
              } flex items-center justify-center font-bold text-sm shadow-md`}
            >
              {member.avatar_initial || 'GP'}
            </div>
            <span
              className={`material-symbols-outlined absolute -top-1.5 -right-1.5 text-[18px] ${theme.trophyColor}`}
            >
              {theme.trophyIcon}
            </span>
          </div>

          {/* Bio Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                {member.name}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant uppercase tracking-wider">
                {member.role?.split(' ')[0] || 'Core'}
              </span>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">
              {member.role}
            </span>
          </div>
        </div>

        {/* Metrics & Deep Dive trigger */}
        <div className="flex items-center justify-between md:justify-end gap-3.5">
          {/* Micro Stats Pills */}
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex flex-col items-end">
              <span className="font-mono-metric font-bold text-on-surface">
                {member.tasksCompleted}
              </span>
              <span className="text-[10px] text-outline uppercase font-semibold">
                Tasks Done
              </span>
            </div>
            <div className="h-6 w-px bg-surface-container-highest"></div>
            <div className="flex flex-col items-end">
              <span className="font-mono-metric font-bold text-on-surface">
                {member.logsCount}
              </span>
              <span className="text-[10px] text-outline uppercase font-semibold">
                Logged
              </span>
            </div>
            <div className="h-6 w-px bg-surface-container-highest"></div>
            <div className="flex flex-col items-end">
              <span className="font-mono-metric font-bold text-on-surface">
                {member.hours}h
              </span>
              <span className="text-[10px] text-outline uppercase font-semibold">
                Work Time
              </span>
            </div>
          </div>

          {/* Score Callout */}
          <div className="flex items-center gap-2">
            <div
              className={`px-3.5 py-1.5 rounded-xl ${theme.scorePillBg} flex items-baseline gap-1.5 shadow-sm border border-white/5`}
            >
              <span className="font-headline-sm text-headline-sm font-extrabold font-mono-metric">
                {member.score}
              </span>
              <span className="text-[11px] font-bold">
                PTS ({percentage}%)
              </span>
            </div>
            <button
              onClick={() => openMemberAudit(member.id)}
              title="Inspect Contributor Audit Log"
              className="p-2 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">read_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animated Horizontal Progress Bar with Segment Accent */}
      <div className="w-full bg-surface-container-lowest rounded-full h-3.5 p-0.5 overflow-hidden flex items-center border border-surface-container-highest/30">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} transition-all duration-700 ease-out relative flex items-center justify-end pr-1.5`}
          style={{ width: `${barWidth}%` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90 animate-ping"></span>
        </div>
      </div>
    </div>
  );
}
