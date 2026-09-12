import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import { usePulse } from '../../context/PulseContext';
import { api } from '../../api/client';

export default function MemberDossierModal() {
  const { isMemberDossierOpen, setIsMemberDossierOpen, selectedMemberId } = usePulse();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMemberDossierOpen || !selectedMemberId) return;

    let mounted = true;
    setLoading(true);
    api
      .getMemberDossier(selectedMemberId)
      .then((data) => {
        if (mounted) {
          setDossier(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching dossier:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isMemberDossierOpen, selectedMemberId]);

  const member = dossier?.member;

  return (
    <Modal
      isOpen={isMemberDossierOpen}
      onClose={() => setIsMemberDossierOpen(false)}
      title={member ? `${member.name} — Detailed Velocity Audit` : 'Contributor Velocity Audit'}
      subtitle={member ? `${member.role} · ${dossier?.score || 0} Recorded Impact Points` : ''}
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-outline gap-2">
          <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
          <span className="text-sm">Loading contributor dossier...</span>
        </div>
      ) : dossier ? (
        <div className="flex flex-col gap-5">
          {/* Member Card Banner */}
          <div className="flex items-center gap-4 p-4 bg-surface-container rounded-xl border border-surface-container-highest/60">
            <div
              className={`w-12 h-12 rounded-xl ${member.avatar_bg || 'bg-primary'} ${member.avatar_text_color || 'text-on-primary'} flex items-center justify-center font-bold text-base shadow-md`}
            >
              {member.avatar_initial || 'GP'}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {member.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-highest text-tertiary uppercase tracking-wider">
                  {member.role.split(' ')[0]}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant font-medium mt-0.5">
                {member.tech_stack || member.role} · {member.join_date}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bento */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-surface-container-lowest rounded-xl border border-surface-container-highest/60">
            <div>
              <span className="text-xs text-outline block uppercase tracking-wider font-semibold">Total Points</span>
              <span className="text-xl font-bold font-mono-metric text-on-surface">
                {dossier.score} Pts
              </span>
            </div>
            <div>
              <span className="text-xs text-outline block uppercase tracking-wider font-semibold">Logged Hours</span>
              <span className="text-xl font-bold font-mono-metric text-secondary">
                {dossier.hours} hrs
              </span>
            </div>
            <div>
              <span className="text-xs text-outline block uppercase tracking-wider font-semibold">Tasks Closed</span>
              <span className="text-xl font-bold font-mono-metric text-tertiary">
                {dossier.tasksCompleted} done
              </span>
            </div>
          </div>

          {/* Category Distribution Chips */}
          {dossier.categoryBreakdown && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-outline block mb-2">
                Attribution by Discipline
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dossier.categoryBreakdown).map(([cat, pts]) => (
                  <div
                    key={cat}
                    className="px-3 py-1 rounded-lg bg-surface-container text-xs flex items-center gap-2 border border-surface-container-highest/50"
                  >
                    <span className="text-on-surface-variant font-medium">{cat}</span>
                    <span className="font-mono-metric font-bold text-primary">+{pts} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Contribution History */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-outline mb-2">
              Verified Contribution History ({dossier.contributions?.length || 0})
            </h5>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {dossier.contributions && dossier.contributions.length > 0 ? (
                dossier.contributions.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-surface-container flex items-center justify-between border border-surface-container-highest/40 hover:bg-surface-container-high transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-semibold text-on-surface truncate">
                        {log.title}
                      </div>
                      <div className="text-[11px] text-outline flex items-center gap-2 mt-0.5">
                        <span className="text-primary font-medium">{log.category}</span>
                        <span>·</span>
                        <span>{log.hours}h</span>
                        <span>·</span>
                        <span>{log.time_label || log.date}</span>
                        {log.task_id && (
                          <>
                            <span>·</span>
                            <span className="text-secondary font-mono-metric font-semibold">{log.task_id}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-surface-container-highest text-xs font-mono-metric font-bold text-primary shrink-0">
                      +{log.points} pts
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-outline">
                  No contributions recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
