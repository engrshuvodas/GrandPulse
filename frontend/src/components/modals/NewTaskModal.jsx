import React, { useState } from 'react';
import Modal from '../common/Modal';
import { usePulse } from '../../context/PulseContext';

export default function NewTaskModal() {
  const { isNewTaskOpen, setIsNewTaskOpen, members, createNewTask } = usePulse();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('shuvo');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('High');
  const [points, setPoints] = useState(3);
  const [estimatedHours, setEstimatedHours] = useState(4.0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createNewTask({
        title: title.trim(),
        description: description.trim() || null,
        assignee_id: assigneeId,
        status,
        priority,
        points: parseInt(points, 10) || 3,
        estimated_hours: parseFloat(estimatedHours) || 4.0,
      });
      setTitle('');
      setDescription('');
      setIsNewTaskOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isNewTaskOpen}
      onClose={() => setIsNewTaskOpen(false)}
      title="Create New Sprint Task"
      subtitle="Define actionable deliverables for engineering sprint v2.4."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Task Title */}
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Task Name &amp; Deliverable *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Distributed memory caching for dashboard metrics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Task Description */}
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Technical Scope / Acceptance Criteria
          </label>
          <textarea
            rows="2"
            placeholder="Brief technical requirements, PR links, or verification steps..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          ></textarea>
        </div>

        {/* Assignee & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Assignee *
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id} className="bg-surface-container-high">
                  {m.name} ({m.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Sprint Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Pending" className="bg-surface-container-high">Pending (Backlog / To Do)</option>
              <option value="In Progress" className="bg-surface-container-high">In Progress (Active Work)</option>
              <option value="Completed" className="bg-surface-container-high">Completed (Done &amp; Attributed)</option>
            </select>
          </div>
        </div>

        {/* Priority, Points & Est Hours */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-2.5 py-2 text-on-surface font-title-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Small">Small</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Story Points
            </label>
            <select
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-2.5 py-2 text-on-surface font-mono-metric font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="1">1 pt (Small)</option>
              <option value="2">2 pts (Minor)</option>
              <option value="3">3 pts (Standard)</option>
              <option value="5">5 pts (Major)</option>
              <option value="8">8 pts (Complex)</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Est. Hours
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-2.5 py-2 text-on-surface font-mono-metric font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-highest/50">
          <button
            type="button"
            onClick={() => setIsNewTaskOpen(false)}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">playlist_add</span>
            <span>{isSubmitting ? 'Creating...' : 'Create Task'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
