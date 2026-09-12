import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { setIsLogContribOpen, setIsNewTaskOpen, setIsAuthOpen } = usePulse();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 px-space-xl flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.2)] border-b border-surface-container-highest/30">
      {/* Left Area: Breadcrumb & Quick Search */}
      <div className="flex items-center gap-space-lg">
        <div className="flex items-center gap-space-xs font-title-sm text-title-sm">
          <span className="text-primary font-bold">Alpha Release v2.4</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface-variant font-medium">Engineering Sprint</span>
        </div>
        <div className="relative hidden xl:flex items-center">
          <span className="material-symbols-outlined absolute left-space-md text-outline text-[18px]">
            search
          </span>
          <input
            className="w-72 bg-surface-container-low text-on-surface placeholder-outline font-body-sm text-body-sm pl-9 pr-space-md py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest/40"
            placeholder="Search tasks, contributions, members..."
            type="text"
          />
        </div>
      </div>

      {/* Right Area: Sprint, Action Triggers & User Profile */}
      <div className="flex items-center gap-space-md">
        {/* Sprint Tag */}
        <div className="hidden md:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg text-on-surface-variant font-label-md text-label-md border border-surface-container-highest/40">
          <span className="material-symbols-outlined text-[16px] text-outline">
            calendar_today
          </span>
          <span className="font-semibold">This Sprint (W12)</span>
          <span className="material-symbols-outlined text-[16px] text-outline">
            arrow_drop_down
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => setIsLogContribOpen(true)}
            className="flex items-center gap-space-xs bg-surface-container-high hover:bg-surface-container hover:text-on-surface text-on-surface-variant font-label-md text-label-md px-space-md py-1.5 rounded-lg transition-colors border border-surface-container-highest/50 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              add
            </span>
            <span className="font-semibold">Log Contribution</span>
          </button>

          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-1.5 rounded-lg transition-colors font-semibold shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">
              add_task
            </span>
            <span>New Task</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-surface-container-highest mx-space-xs"></div>

        {/* Notifications Icon */}
        <button
          className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-pulse"></span>
        </button>

        {/* Dark Mode Icon */}
        <button
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          title="Theme Toggle"
        >
          <span className="material-symbols-outlined text-[20px]">
            dark_mode
          </span>
        </button>

        {/* User Identity / Auth Trigger */}
        {user ? (
          <div className="flex items-center gap-space-sm pl-space-xs group relative">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-on-primary shadow-sm">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
                {user.username}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary leading-none">
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
              <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
                Shuvo K.
              </span>
              <span className="font-label-sm text-label-sm text-tertiary leading-none font-semibold">
                Lead Architect (Demo)
              </span>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
