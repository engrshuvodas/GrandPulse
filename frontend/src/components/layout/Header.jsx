import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';

export default function Header() {
  const { setIsLogContribOpen, setIsAuthOpen } = usePulse();
  const { user, logout } = useAuth();

  const handleDownloadExcel = () => {
    window.open(api.getExcelExportUrl(), '_blank');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 px-space-xl flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.2)] border-b border-surface-container-highest/30">
      {/* Left Area: Project Breadcrumb */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs font-title-sm text-title-sm">
          <span className="text-primary font-bold">RaktSeva Blood Bank System</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-medium">16-Week Gantt Schedule</span>
        </div>
      </div>

      {/* Right Area: Status & Actions */}
      <div className="flex items-center gap-space-md">
        {/* Active Week Tag */}
        <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg text-on-surface-variant font-label-md text-label-md border border-surface-container-highest/40">
          <span className="material-symbols-outlined text-[16px] text-primary">
            calendar_today
          </span>
          <span className="font-semibold text-xs">Active: Week 13 of 16</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => setIsLogContribOpen(true)}
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-label-md text-xs px-space-md py-1.5 rounded-lg transition-colors border border-surface-container-highest/50 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              add
            </span>
            <span className="font-semibold">Log Contribution</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs px-space-md py-1.5 rounded-lg transition-colors font-semibold shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">
              file_download
            </span>
            <span>Export Excel</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-surface-container-highest mx-space-xs"></div>

        {/* User Identity / Auth Trigger */}
        {user ? (
          <div className="flex items-center gap-space-sm pl-space-xs group relative">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-on-primary shadow-sm">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-md text-xs text-on-surface leading-tight font-bold">
                {user.username}
              </span>
              <span className="font-label-sm text-[10px] text-tertiary leading-none">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="ml-1 text-[11px] text-outline hover:text-error transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-space-sm pl-space-xs hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-md text-xs text-on-surface leading-tight font-bold">
                Shuvo Das
              </span>
              <span className="font-label-sm text-[10px] text-tertiary leading-none font-semibold">
                Lead Architect & Full-Stack
              </span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
