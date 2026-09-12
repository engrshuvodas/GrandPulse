import React, { useState } from 'react';
import Modal from '../common/Modal';
import { usePulse } from '../../context/PulseContext';

const SCORING_RULES = {
  Small: 1,
  Medium: 2,
  Large: 3,
  Major: 5,
};

export default function LogContributionModal() {
  const { isLogContribOpen, setIsLogContribOpen, members, tasks, createNewContribution } = usePulse();

  const [memberId, setMemberId] = useState('shuvo');
  const [taskId, setTaskId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [level, setLevel] = useState('Large');
  const [hours, setHours] = useState(4.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const points = SCORING_RULES[level] || 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createNewContribution({
        member_id: memberId,
        task_id: taskId || null,
        title: title.trim(),
        category,
        level,
        hours: parseFloat(hours) || 2.0,
        points,
        verified: true,
      });
      setTitle('');
      setIsLogContribOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isLogContribOpen}
      onClose={() => setIsLogContribOpen(false)}
      title="Log Sprint Contribution"
      subtitle="Record high-impact deliverables, bug fixes, architecture, or design milestones."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Contributor Member */}
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Contributor Member *
          </label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id} className="bg-surface-container-high">
                {m.name} — {m.role}
              </option>
            ))}
          </select>
        </div>

        {/* Linked Sprint Task */}
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Associated Sprint Task (Optional)
          </label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">None (Independent Milestone / Peer Support)</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id} className="bg-surface-container-high">
                [{t.id}] {t.title} ({t.points} pts)
              </option>
            ))}
          </select>
        </div>

        {/* Contribution Title */}
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Deliverable Summary / Milestone Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Distributed WebSocket connection bus architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category & Impact Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Category Stream *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Development" className="bg-surface-container-high">Development (Frontend/Fullstack)</option>
              <option value="Architecture" className="bg-surface-container-high">Architecture &amp; Core Systems</option>
              <option value="Bug Fix" className="bg-surface-container-high">Bug Fix &amp; Hotpatch</option>
              <option value="Design" className="bg-surface-container-high">Design &amp; UI System</option>
              <option value="Testing" className="bg-surface-container-high">Testing &amp; QA Benchmark</option>
              <option value="DevOps" className="bg-surface-container-high">DevOps &amp; Infra Delivery</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Impact Tier *
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Small" className="bg-surface-container-high">Small (+1 pt) — Minor patch/review</option>
              <option value="Medium" className="bg-surface-container-high">Medium (+2 pts) — Feature component</option>
              <option value="Large" className="bg-surface-container-high">Large (+3 pts) — Core API / Module</option>
              <option value="Major" className="bg-surface-container-high">Major (+5 pts) — Architectural milestone</option>
            </select>
          </div>
        </div>

        {/* Work Time and Point Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-surface-container-lowest p-3.5 rounded-xl border border-surface-container-highest/60">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Logged Work Hours
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-1.5 text-on-surface font-mono-metric font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col sm:items-end justify-center">
            <span className="font-label-sm text-label-sm text-outline uppercase">
              Calculated Attribution
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-headline-md text-headline-md text-primary font-bold font-mono-metric">
                +{points}
              </span>
              <span className="font-title-sm text-title-sm text-tertiary font-bold">
                Impact Points
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-highest/50">
          <button
            type="button"
            onClick={() => setIsLogContribOpen(false)}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>{isSubmitting ? 'Logging...' : 'Confirm & Log'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
