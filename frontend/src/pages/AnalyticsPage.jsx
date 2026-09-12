import React from 'react';
import { usePulse } from '../context/PulseContext';
import VelocityAreaChart from '../components/charts/VelocityAreaChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';

export default function AnalyticsPage() {
  const { summary, members } = usePulse();

  return (
    <div className="flex flex-col w-full relative pt-6">
      {/* Ambient Glow */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">
            Telemetry &amp; Intelligence
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="text-outline text-xs font-mono-metric font-semibold">Analytics Console</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Sprint Velocity &amp; Attribution Analytics
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
          Deep-dive comparative performance metrics, team throughput curves, and category allocation.
        </p>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low p-5 rounded-xl border border-surface-container-highest/40 shadow-sm">
          <span className="text-xs text-outline uppercase font-semibold block">Sprint Burn-Up Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-metric text-on-surface">{summary.sprint_velocity}</span>
            <span className="text-xs text-tertiary font-bold">+12% vs target</span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1 block">15 of 24 tasks completed</span>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-surface-container-highest/40 shadow-sm">
          <span className="text-xs text-outline uppercase font-semibold block">Efficiency Quotient</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-metric text-primary">3.8</span>
            <span className="text-xs text-outline">pts / hour</span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1 block">Optimal engineering cadence</span>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-surface-container-highest/40 shadow-sm">
          <span className="text-xs text-outline uppercase font-semibold block">Total Team Output</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-metric text-secondary">{summary.total_points}</span>
            <span className="text-xs text-secondary-fixed font-bold">Points recorded</span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1 block">Exceeds 120 sprint target</span>
        </div>

        <div className="bg-surface-container-low p-5 rounded-xl border border-surface-container-highest/40 shadow-sm">
          <span className="text-xs text-outline uppercase font-semibold block">Quality &amp; Pass Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-metric text-tertiary">96.8%</span>
            <span className="text-xs text-tertiary font-bold">Passed</span>
          </div>
          <span className="text-xs text-on-surface-variant mt-1 block">Zero critical regressions</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/40 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              Team Throughput Trajectory (Weeks 5-12)
            </h3>
            <span className="text-xs text-outline">Benchmark Target: 45 pts</span>
          </div>
          <VelocityAreaChart memberId="shuvo" memberName="Team Aggregate" />
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/40 shadow-md flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-title-md text-title-md text-on-surface font-bold">
              Team Discipline Breakdown
            </h3>
            <span className="text-xs text-outline">Sprint category weighting</span>
          </div>
          <CategoryDonutChart memberId="ALL" />
        </div>
      </div>

      {/* Member Comparison Matrix */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-surface-container-highest/40 shadow-md">
        <h3 className="font-title-md text-title-md text-on-surface font-bold mb-4">
          Cross-Functional Velocity Benchmark
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <div key={m.id} className="bg-surface-container p-4 rounded-xl border border-surface-container-highest/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${m.avatar_bg || 'bg-primary'} flex items-center justify-center font-bold text-xs ${m.avatar_text_color || 'text-on-primary'}`}>
                    {m.avatar_initial || 'GP'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{m.name}</div>
                    <div className="text-[11px] text-outline">{m.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-metric font-bold text-sm text-tertiary">#{m.rank || i + 1}</div>
                  <div className="text-[10px] text-outline">{m.percentage}% share</div>
                </div>
              </div>

              <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{ width: `${m.percentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-surface-container-highest/30">
                <div>
                  <span className="text-outline text-[10px] block">Points</span>
                  <span className="font-bold text-on-surface font-mono-metric">{m.score}</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">Hours</span>
                  <span className="font-bold text-secondary font-mono-metric">{m.hours}h</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">Tasks Done</span>
                  <span className="font-bold text-tertiary font-mono-metric">{m.tasksCompleted}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
