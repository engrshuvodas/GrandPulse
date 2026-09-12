import React from 'react';
import { usePulse } from '../../context/PulseContext';

const MODULE_ICONS = {
  1: 'lock',
  2: 'person_add',
  3: 'domain',
  4: 'meeting_room',
  5: 'payments',
  6: 'badge',
  7: 'report_problem',
  8: 'how_to_reg',
  9: 'analytics',
  10: 'dashboard_customize',
};

export default function MajorModulesGrid() {
  const { modules } = usePulse();

  return (
    <div className="bg-surface-container-low rounded-2xl p-space-lg border border-surface-container-highest/60 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg border-b border-surface-container-highest/40 pb-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">view_module</span>
          </div>
          <div>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Major Modules of Hostel Management System (10 Modules)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Full core module inventory specified in PDF Page 3 with active architecture leads
            </p>
          </div>
        </div>
        <div className="text-xs text-outline font-mono">
          {modules.filter((m) => m.status === 'Completed').length} / {modules.length} Completed
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
        {modules.map((mod) => {
          const isDone = mod.status === 'Completed';
          const isWIP = mod.status === 'In Progress';
          const icon = MODULE_ICONS[mod.id] || 'layers';

          return (
            <div
              key={mod.id}
              className={`rounded-xl p-space-md border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-surface-container-lowest/80 border-emerald-500/30 shadow-sm'
                  : isWIP
                  ? 'bg-surface-container-lowest border-primary/40 ring-1 ring-primary/20'
                  : 'bg-surface-container-lowest/50 border-surface-container-highest/50 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-mono text-[10px] font-bold text-outline px-1.5 py-0.5 rounded bg-surface-container-high">
                    #{mod.id}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isDone
                        ? 'text-emerald-400'
                        : isWIP
                        ? 'text-primary'
                        : 'text-outline'
                    }`}
                  >
                    {icon}
                  </span>
                </div>
                <h4 className="font-title-sm text-title-sm font-bold text-on-surface leading-snug line-clamp-2">
                  {mod.name}
                </h4>
                <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">
                  {mod.description || 'Core module component'}
                </p>
              </div>

              <div className="mt-space-md pt-space-xs border-t border-surface-container-highest/40">
                <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isWIP
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-surface-container-high text-outline'
                    }`}
                  >
                    {mod.status}
                  </span>
                  <span className="font-mono text-on-surface">{mod.completion_pct}%</span>
                </div>

                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isDone ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${mod.completion_pct}%` }}
                  />
                </div>

                {mod.lead_id && (
                  <div className="mt-2 text-[10px] text-outline flex items-center justify-between font-mono">
                    <span>Lead:</span>
                    <span className="text-primary font-bold uppercase">{mod.lead_id}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
