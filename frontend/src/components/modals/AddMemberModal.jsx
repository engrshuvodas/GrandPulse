import React, { useState } from 'react';
import Modal from '../common/Modal';
import { usePulse } from '../../context/PulseContext';

export default function AddMemberModal() {
  const { isAddMemberOpen, setIsAddMemberOpen, createNewMember } = usePulse();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Systems Engineer');
  const [email, setEmail] = useState('');
  const [techStack, setTechStack] = useState('React · Python · MySQL');
  const [avatarBg, setAvatarBg] = useState('bg-secondary');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    const initials = name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    setIsSubmitting(true);
    try {
      await createNewMember({
        id,
        name: name.trim(),
        role: role.trim(),
        email: email.trim() || `${id}@grandpulse.dev`,
        tech_stack: techStack.trim(),
        avatar_bg: avatarBg,
        avatar_text_color: 'text-on-primary',
        avatar_initial: initials,
        join_date: 'Joined Just now',
        active_lead: false,
      });
      setName('');
      setEmail('');
      setIsAddMemberOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isAddMemberOpen}
      onClose={() => setIsAddMemberOpen(false)}
      title="Add New Team Member"
      subtitle="Onboard a contributor into the GrandPulse velocity tracking pool."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Role &amp; Discipline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Backend Platform Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="alex@grandpulse.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Primary Tech Stack
          </label>
          <input
            type="text"
            placeholder="e.g. Go · Python · Kubernetes · Redis"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1.5">
            Avatar Accent Color
          </label>
          <div className="flex items-center gap-3">
            {[
              { id: 'bg-primary', label: 'Indigo' },
              { id: 'bg-secondary', label: 'Cyan' },
              { id: 'bg-tertiary', label: 'Emerald' },
              { id: 'bg-primary-container', label: 'Purple' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setAvatarBg(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  avatarBg === c.id
                    ? 'border-primary bg-surface-container-highest text-on-surface shadow-sm'
                    : 'border-surface-container-highest bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${c.id}`}></span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-highest/50">
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(false)}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>{isSubmitting ? 'Adding...' : 'Add Member'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
