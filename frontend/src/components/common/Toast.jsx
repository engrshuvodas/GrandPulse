import React from 'react';
import { usePulse } from '../../context/PulseContext';

export default function Toast() {
  const { toast, hideToast } = usePulse();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-space-md bg-surface-container-highest border border-surface-container-high px-space-lg py-space-md rounded-xl shadow-2xl transition-all duration-300 animate-slide-up">
      <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary shrink-0 shadow-md">
        <span className="material-symbols-outlined text-[24px]">verified</span>
      </div>
      <div className="flex flex-col min-w-[220px]">
        <span className="font-title-sm text-title-sm text-on-surface font-bold">
          {toast.title}
        </span>
        <span className="font-body-sm text-body-sm text-tertiary font-medium">
          {toast.description}
        </span>
      </div>
      <button
        onClick={hideToast}
        className="text-on-surface-variant hover:text-on-surface ml-space-sm p-1 rounded-lg hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
