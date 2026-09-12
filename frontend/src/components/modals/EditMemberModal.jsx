import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { usePulse } from '../../context/PulseContext';

export default function EditMemberModal() {
  const { isEditMemberOpen, closeEditMember, editingMember, updateMember, deleteMember } = usePulse();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [techStack, setTechStack] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name || '');
      setRole(editingMember.role || '');
      setEmail(editingMember.email || '');
      setTechStack(editingMember.tech_stack || '');
      setAvatarUrl(editingMember.avatar_url || '');
      setShowDeleteConfirm(false);
    }
  }, [editingMember]);

  if (!editingMember) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updateMember(editingMember.id, {
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        tech_stack: techStack.trim(),
        avatar_url: avatarUrl.trim() || null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteMember(editingMember.id);
      closeEditMember();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isEditMemberOpen}
      onClose={closeEditMember}
      title={`Edit Member: ${editingMember.name}`}
      subtitle={`Update profile information, role, and skills for ID [${editingMember.id}].`}
    >
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface font-body-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
              Role & Title *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
            Primary Tech Stack
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. React · Python · FastAPI · MySQL"
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1.5">
            Avatar Image URL (Optional)
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>

        {/* Delete Confirmation Safeguard */}
        {showDeleteConfirm ? (
          <div className="p-3 rounded-xl bg-error/15 border border-error/40 flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-error text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Are you sure you want to delete {editingMember.name}?
            </div>
            <p className="text-[11px] text-on-surface-variant">
              This action will permanently remove the member and unlink their tasks.
            </p>
            <div className="flex items-center gap-2 justify-end mt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-xs rounded bg-surface-container-high text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-3 py-1 text-xs font-bold rounded bg-error text-white hover:bg-error/90"
              >
                Yes, Delete Member
              </button>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-container-highest">
          {!showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-error hover:text-error/80 text-xs font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete Member
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={closeEditMember}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-md"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
