import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';
import MajorModulesGrid from '../components/gantt/MajorModulesGrid';

export default function GrandChartPage() {
  const {
    members,
    contributions,
    setIsLogContribOpen,
    setIsAddMemberOpen,
    openEditMember,
    openMemberAudit,
  } = usePulse();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredContribs = contributions.filter(
    (c) => activeCategory === 'ALL' || c.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-space-lg pb-space-2xl">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm mb-1">
            <span className="material-symbols-outlined text-primary text-[24px]">leaderboard</span>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              Grand Contribution Chart & Module Architecture
            </h1>
          </div>
          <p className="text-xs text-on-surface-variant max-w-2xl">
            Real-time developer attribution, points ledger, and module progress across the 16-week project life cycle.
          </p>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-bold text-xs border border-surface-container-highest transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">person_add</span>
            <span>Add Member</span>
          </button>

          <button
            onClick={() => setIsLogContribOpen(true)}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all font-bold text-xs shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Log Contribution</span>
          </button>
        </div>
      </div>

      {/* 10 Major Modules Grid from PDF Page 3 */}
      <MajorModulesGrid />

      {/* Grand Contribution Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Leaderboard Cards (2 cols) */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-md">
          <div className="flex items-center justify-between mb-space-md border-b border-surface-container-highest/40 pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Engineering Team Leaderboard & Velocity
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-outline font-mono">Ranked by points</span>
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm">
            {members.length === 0 ? (
              <div className="p-8 text-center text-sm text-on-surface-variant">
                No team members registered yet. Click &quot;Add Member&quot; to onboard an engineer.
              </div>
            ) : (
              members.map((m, idx) => {
                const rank = idx + 1;
                const badgeBg =
                  rank === 1
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : rank === 2
                    ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                    : 'bg-amber-700/20 text-amber-500 border-amber-700/40';

                return (
                  <div
                    key={m.id}
                    onClick={() => openMemberAudit(m.id)}
                    className="bg-surface-container-lowest/80 hover:bg-surface-container-high/60 rounded-xl p-space-md border border-surface-container-highest/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm group"
                  >
                    <div className="flex items-center gap-space-md">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs border ${badgeBg}`}
                      >
                        #{rank}
                      </div>
                      <div className="relative">
                        <img
                          src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.id}`}
                          alt={m.name}
                          className="h-10 w-10 rounded-full bg-surface-container-high object-cover ring-2 ring-primary/30"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                          {m.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high font-mono text-outline uppercase">
                            {m.id}
                          </span>
                        </div>
                        <div className="text-xs text-on-surface-variant">{m.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-md sm:text-right pl-12 sm:pl-0">
                      <div>
                        <span className="text-[10px] text-outline uppercase block font-semibold">
                          Velocity Pts
                        </span>
                        <span className="text-base font-mono font-black text-primary">
                          {m.score} pts
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-outline uppercase block font-semibold">
                          Tasks
                        </span>
                        <span className="text-sm font-mono text-on-surface font-bold">
                          {m.completed_tasks_count || 0} done
                        </span>
                      </div>

                      {/* Edit / Delete Member Actions */}
                      <div className="flex items-center gap-1 pl-2 border-l border-surface-container-highest/40">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditMember(m);
                          }}
                          title="Edit Member"
                          className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditMember(m);
                          }}
                          title="Delete Member"
                          className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Contribution Feed (1 col) */}
        <div className="bg-surface-container-low rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-space-md border-b border-surface-container-highest/40 pb-space-sm">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Recent Contributions
              </h3>
            </div>
            <span className="text-xs text-outline font-mono">{filteredContribs.length} logs</span>
          </div>

          <div className="flex flex-col gap-space-sm overflow-y-auto max-h-[380px] pr-1">
            {filteredContribs.slice(0, 8).map((c) => (
              <div
                key={c.id}
                className="bg-surface-container-lowest/60 rounded-xl p-space-sm border border-surface-container-highest/40 flex items-start justify-between gap-space-sm"
              >
                <div>
                  <div className="text-xs font-semibold text-on-surface line-clamp-1">{c.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-outline font-mono">
                    <span className="text-primary font-bold uppercase">{c.member_id}</span>
                    <span>·</span>
                    <span>{c.category}</span>
                    <span>·</span>
                    <span>{c.hours}h</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/20 text-primary whitespace-nowrap">
                  +{c.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
