import React, { useState } from 'react';
import { usePulse } from '../context/PulseContext';

const PRIORITY_BADGES = {
  Urgent: 'bg-error-container text-on-error-container border border-error/20',
  High: 'bg-surface-container-highest text-secondary-fixed border border-secondary/20',
  Medium: 'bg-primary-container/20 text-primary border border-primary/20',
  Small: 'bg-surface-container-highest text-on-surface-variant',
};

export default function KanbanPage() {
  const { tasks, members, summary, setIsNewTaskOpen, toggleTaskStatus } = usePulse();

  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (assigneeFilter !== 'ALL' && t.assignee_id !== assigneeFilter) {
      return false;
    }
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  const handleStartTask = (taskId) => {
    toggleTaskStatus(taskId); // from Pending -> In Progress
  };

  const handleCompleteTask = (taskId) => {
    toggleTaskStatus(taskId); // from In Progress -> Completed (auto points)
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Top Page Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg mb-space-xl pt-6">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase bg-primary-container/20 px-space-sm py-0.5 rounded font-bold border border-primary/20">
              Sprint Cycle 4.2
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Live Attribution Active
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Project Kanban &amp; Task Lifecycle
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Track multi-discipline output, assign technical tasks, and trace real-time contribution equity logs.
          </p>
        </div>

        {/* Quick Velocity Summary Chip */}
        <div className="flex items-center gap-space-lg bg-surface-container-low px-space-xl py-space-md rounded-xl self-start xl:self-auto shadow-sm border border-surface-container-highest/40">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Sprint Points Credited
            </span>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-md text-headline-md text-tertiary font-bold font-mono-metric">
                {summary.total_points}
              </span>
              <span className="font-label-sm text-label-sm text-tertiary-fixed-dim font-bold">
                pts
              </span>
            </div>
          </div>
          <div className="w-px h-8 bg-surface-container-highest"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Sprint Velocity Rate
            </span>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-md text-headline-md text-secondary font-bold font-mono-metric">
                94.2%
              </span>
              <span className="font-label-sm text-label-sm text-secondary-fixed font-bold">
                +8%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informational Incentive Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-space-lg rounded-xl mb-space-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-container-highest/40">
        <div className="flex items-center gap-space-md">
          <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">stars</span>
          </div>
          <div className="flex flex-col">
            <span className="font-title-sm text-title-sm text-on-surface font-bold">
              Automated Attribution Engine
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Moving a task to <span className="text-tertiary font-semibold">Completed</span> automatically assigns contribution points and updates the Grand Contribution Chart!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm self-end md:self-center">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
            Audit Sync:
          </span>
          <span className="inline-flex items-center gap-1 font-mono-metric text-mono-metric text-tertiary font-bold">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span> Synchronized
          </span>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="bg-surface-container-low p-space-md rounded-xl mb-space-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md shadow-sm border border-surface-container-highest/40">
        <div className="flex flex-wrap items-center gap-space-md">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              className="w-full bg-surface text-on-surface placeholder-outline font-body-sm text-body-sm pl-9 pr-space-md py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-highest/50"
              placeholder="Filter tasks by key or title..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-space-xs bg-surface px-space-md py-1.5 rounded-lg text-on-surface border border-surface-container-highest/50">
            <span className="material-symbols-outlined text-outline text-[18px]">person</span>
            <label className="font-label-sm text-label-sm text-outline font-semibold">
              Assignee:
            </label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="bg-transparent font-title-sm text-title-sm text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-surface-container-high">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id} className="bg-surface-container-high">
                  {m.name} ({m.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-space-xs bg-surface px-space-md py-1.5 rounded-lg text-on-surface border border-surface-container-highest/50">
            <span className="material-symbols-outlined text-outline text-[18px]">flag</span>
            <label className="font-label-sm text-label-sm text-outline font-semibold">
              Priority:
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent font-title-sm text-title-sm text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-surface-container-high">All Priorities</option>
              <option value="Urgent" className="bg-surface-container-high">Urgent</option>
              <option value="High" className="bg-surface-container-high">High</option>
              <option value="Medium" className="bg-surface-container-high">Medium</option>
              <option value="Small" className="bg-surface-container-high">Small</option>
            </select>
          </div>
        </div>

        {/* Primary Action: Add Task */}
        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm px-space-lg py-2.5 rounded-lg shadow-md transition-all active:scale-[0.98] font-bold"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add New Task</span>
        </button>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl items-start">
        {/* COLUMN 1: TO DO (Pending) */}
        <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-sm border border-surface-container-highest/40">
          <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container-highest/40">
            <div className="flex items-center gap-space-sm">
              <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
              <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">
                TO DO
              </span>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-bold">
                {todoTasks.length}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Sprint Backlog
            </span>
          </div>

          <div className="flex flex-col gap-space-md min-h-[460px]">
            {todoTasks.map((task) => {
              const member = members.find((m) => m.id === task.assignee_id) || {
                name: 'Unassigned',
                avatar_initial: '?',
                avatar_bg: 'bg-surface-variant',
                avatar_text_color: 'text-on-surface-variant',
              };
              return (
                <div
                  key={task.id}
                  className="flex flex-col bg-surface-container p-space-md rounded-lg shadow-sm hover:shadow-md transition-all border border-surface-container-highest/40"
                >
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-mono-metric text-mono-metric text-outline font-bold">
                      #{task.id}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        PRIORITY_BADGES[task.priority] || ''
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs line-clamp-2 font-bold">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-space-md bg-surface-container-lowest p-space-xs rounded-md border border-surface-container-highest/30">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[15px] text-outline">
                        schedule
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">
                        Est: {task.estimated_hours || 4}h
                      </span>
                    </div>
                    <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-primary-container/30 text-primary font-bold">
                      +{task.points} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <div
                        className={`w-6 h-6 rounded-full ${member.avatar_bg || 'bg-primary'} flex items-center justify-center font-bold text-[10px] ${
                          member.avatar_text_color || 'text-on-primary'
                        }`}
                      >
                        {member.avatar_initial || 'GP'}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate max-w-[100px]">
                        {member.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartTask(task.id)}
                      className="flex items-center gap-1 bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-md text-label-md px-space-sm py-1 rounded transition-colors font-semibold"
                    >
                      <span>Start</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-sm border border-surface-container-highest/40">
          <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container-highest/40">
            <div className="flex items-center gap-space-sm">
              <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">
                IN PROGRESS
              </span>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-bold">
                {inProgressTasks.length}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Active Execution
            </span>
          </div>

          <div className="flex flex-col gap-space-md min-h-[460px]">
            {inProgressTasks.map((task) => {
              const member = members.find((m) => m.id === task.assignee_id) || {
                name: 'Unassigned',
                avatar_initial: '?',
                avatar_bg: 'bg-secondary',
                avatar_text_color: 'text-on-secondary',
              };
              return (
                <div
                  key={task.id}
                  className="flex flex-col bg-surface-container p-space-md rounded-lg shadow-sm hover:shadow-md transition-all border border-surface-container-highest/40"
                >
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-mono-metric text-mono-metric text-outline font-bold">
                      #{task.id}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        PRIORITY_BADGES[task.priority] || ''
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs line-clamp-2 font-bold">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-space-md bg-surface-container-lowest p-space-xs rounded-md border border-surface-container-highest/30">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[15px] text-outline">
                        schedule
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">
                        Est: {task.estimated_hours || 4}h
                      </span>
                    </div>
                    <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-secondary-container/30 text-secondary font-bold">
                      +{task.points} pts
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <div
                        className={`w-6 h-6 rounded-full ${member.avatar_bg || 'bg-secondary'} flex items-center justify-center font-bold text-[10px] ${
                          member.avatar_text_color || 'text-on-secondary'
                        }`}
                      >
                        {member.avatar_initial || 'GP'}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium truncate max-w-[100px]">
                        {member.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="flex items-center gap-1 bg-tertiary-container/40 hover:bg-tertiary-container text-tertiary font-label-md text-label-md px-space-sm py-1 rounded transition-colors font-bold shadow-sm"
                    >
                      <span>Complete</span>
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED */}
        <div className="flex flex-col bg-surface-container-low rounded-xl p-space-md shadow-sm border border-surface-container-highest/40">
          <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-container-highest/40">
            <div className="flex items-center gap-space-sm">
              <span className="w-3 h-3 rounded-full bg-tertiary"></span>
              <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">
                COMPLETED
              </span>
              <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary font-bold">
                {completedTasks.length}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
              Done &amp; Attributed
            </span>
          </div>

          <div className="flex flex-col gap-space-md min-h-[460px]">
            {completedTasks.map((task) => {
              const member = members.find((m) => m.id === task.assignee_id) || {
                name: 'Unassigned',
                avatar_initial: '?',
                avatar_bg: 'bg-tertiary',
                avatar_text_color: 'text-on-tertiary',
              };
              return (
                <div
                  key={task.id}
                  className="flex flex-col bg-surface-container p-space-md rounded-lg shadow-sm opacity-85 hover:opacity-100 transition-all border border-surface-container-highest/40"
                >
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-mono-metric text-mono-metric text-outline font-bold">
                      #{task.id}
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Attributed
                    </span>
                  </div>

                  <h3 className="font-title-sm text-title-sm text-on-surface mb-space-xs line-clamp-2 line-through font-medium text-outline">
                    {task.title}
                  </h3>

                  <div className="flex items-center justify-between mb-space-md bg-surface-container-lowest p-space-xs rounded-md border border-surface-container-highest/30">
                    <span className="text-xs text-outline">{task.time_label || 'Closed'}</span>
                    <span className="font-mono-metric text-mono-metric px-2 py-0.5 rounded bg-surface-container-highest text-tertiary font-bold">
                      +{task.points} pts credited
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <div
                        className={`w-6 h-6 rounded-full ${member.avatar_bg || 'bg-tertiary'} flex items-center justify-center font-bold text-[10px] ${
                          member.avatar_text_color || 'text-on-tertiary'
                        }`}
                      >
                        {member.avatar_initial || 'GP'}
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                        {member.name}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="text-[11px] text-outline hover:text-on-surface transition-colors"
                      title="Reopen task"
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
