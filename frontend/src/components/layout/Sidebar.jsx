import React from 'react';
import { usePulse } from '../../context/PulseContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'stacked_bar_chart' },
  { id: 'tasks-kanban', label: 'Tasks & Kanban', icon: 'view_kanban' },
  { id: 'contributions', label: 'Contributions', icon: 'award_star' },
  { id: 'team-members', label: 'Team Members', icon: 'group' },
  { id: 'analytics', label: 'Analytics', icon: 'insights' },
  { id: 'activity-history', label: 'Activity History', icon: 'history' },
  { id: 'export-reports', label: 'Export / Reports', icon: 'file_download' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = usePulse();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
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
            <span className="font-label-sm text-label-sm text-tertiary tracking-wider uppercase mt-space-xs font-semibold">
              Pulse Velocity
            </span>
          </div>
        </div>

        {/* Operational Core Navigation */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-md py-space-xs mb-space-xs">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
              Operational Core
            </span>
          </div>
          <nav className="flex flex-col gap-space-xs">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-colors text-left w-full ${
                    isActive
                      ? 'bg-surface-container-high text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="font-title-sm text-title-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Sprint Burndown Widget */}
      <div className="p-space-md bg-surface-container-lowest m-space-md rounded-xl border border-surface-container-highest/50 shadow-inner">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-sm text-label-sm text-outline font-semibold">
            Sprint Burndown
          </span>
          <span className="font-mono-metric text-mono-metric text-tertiary font-bold">
            88.4%
          </span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
          <div className="bg-tertiary h-full rounded-full w-[88%] transition-all duration-700"></div>
        </div>
        <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>Velocity: 64 pts</span>
          <span className="text-secondary font-bold">+12%</span>
        </div>
      </div>
    </aside>
  );
}
