import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const PulseContext = createContext(null);

export function PulseProvider({ children }) {
  // Navigation: 'gantt', 'grandchart', 'analytics', 'export'
  const [activeTab, setActiveTab] = useState('gantt');

  // Core Data
  const [members, setMembers] = useState([]);
  const [ganttTasks, setGanttTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [modules, setModules] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [summary, setSummary] = useState({
    project_name: 'Hostel Management System',
    project_duration: '16 Weeks',
    active_week: 6,
    total_tasks: 17,
    completed_tasks: 12,
    inprogress_tasks: 3,
    pending_tasks: 2,
    total_modules: 10,
    completed_modules: 6,
    milestones_met: 3,
    total_milestones: 7,
    sprint_velocity: '94.8%',
    overall_progress_pct: 83,
    active_members: 3,
    total_logs: 12,
    total_hours: 95.0,
    total_points: 85,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activePhase, setActivePhase] = useState('ALL'); // ALL, Planning, Design, Development, Testing, Deployment
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSort, setActiveSort] = useState('score');
  const [activeTimeframe, setActiveTimeframe] = useState('all');

  // Modals state
  const [isLogContribOpen, setIsLogContribOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isMemberDossierOpen, setIsMemberDossierOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('shuvo');

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    description: '',
    type: 'success',
  });

  const showToast = useCallback((title, description, type = 'success') => {
    setToast({ visible: true, title, description, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4500);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  // Fetch all state
  const refreshData = useCallback(async () => {
    try {
      const [membersData, ganttData, milestonesData, modulesData, contribsData, summaryData] = await Promise.all([
        api.getMembers(activeCategory, activeSort),
        api.getGanttTasks(activePhase),
        api.getMilestones(),
        api.getProjectModules(),
        api.getContributions(),
        api.getGanttSummary().catch(() => api.getSummaryAnalytics()),
      ]);
      setMembers(membersData || []);
      setGanttTasks(ganttData || []);
      setMilestones(milestonesData || []);
      setModules(modulesData || []);
      setContributions(contribsData || []);
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching GrandPulse data:', err);
    } finally {
      setLoading(false);
    }
  }, [activePhase, activeCategory, activeSort]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Update Task Progress & Points in Gantt Schedule
  const updateTaskProgress = async (taskId, progressPct, status = null, assigneeId = null) => {
    try {
      const updated = await api.updateTaskProgress(taskId, progressPct, status, assigneeId);
      if (progressPct === 100) {
        showToast(
          'Task 100% Completed!',
          `${updated.title} marked complete! Velocity points attributed to ${updated.assignee_id ? updated.assignee_id.toUpperCase() : 'team'}.`,
          'success'
        );
      } else {
        showToast('Progress Updated', `${updated.title}: ${updated.progress_pct}% (${updated.status})`, 'info');
      }
      await refreshData();
      return updated;
    } catch (err) {
      console.error('Failed to update task progress:', err);
      showToast('Error', err.message, 'error');
    }
  };

  // Legacy task toggler for kanban/quick click
  const toggleTaskStatus = async (taskId) => {
    const task = ganttTasks.find((t) => t.id === taskId);
    if (!task) return;

    let newPct = 100;
    if (task.progress_pct === 100) {
      newPct = 50;
    } else if (task.progress_pct > 0) {
      newPct = 100;
    } else {
      newPct = 50;
    }
    await updateTaskProgress(taskId, newPct);
  };

  const createNewContribution = async (contribPayload) => {
    try {
      const created = await api.createContribution(contribPayload);
      showToast(
        'Contribution Logged!',
        `+${created.points} Points credited to ${contribPayload.member_id.toUpperCase()}`,
        'success'
      );
      await refreshData();
      setIsLogContribOpen(false);
      return created;
    } catch (err) {
      console.error('Failed to log contribution:', err);
      showToast('Error', err.message, 'error');
      throw err;
    }
  };

  const createNewMember = async (memberPayload) => {
    try {
      const created = await api.createMember(memberPayload);
      showToast('Team Member Added', `${created.name} onboarded to GrandPulse`, 'success');
      await refreshData();
      setIsAddMemberOpen(false);
      return created;
    } catch (err) {
      console.error('Failed to add member:', err);
      showToast('Error', err.message, 'error');
      throw err;
    }
  };

  const deleteContribution = async (contribId) => {
    try {
      await api.deleteContribution(contribId);
      showToast('Deleted', `Contribution ${contribId} removed`, 'info');
      await refreshData();
    } catch (err) {
      showToast('Error', err.message, 'error');
    }
  };

  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const openEditMember = (member) => {
    setEditingMember(member);
    setIsEditMemberOpen(true);
  };

  const closeEditMember = () => {
    setEditingMember(null);
    setIsEditMemberOpen(false);
  };

  const updateMember = async (memberId, updatePayload) => {
    try {
      const res = await api.updateMember(memberId, updatePayload);
      showToast('Member Updated', `${updatePayload.name || memberId} updated successfully`, 'success');
      await refreshData();
      closeEditMember();
      return res;
    } catch (err) {
      console.error('Failed to update member:', err);
      showToast('Error', err.message, 'error');
      throw err;
    }
  };

  const deleteMember = async (memberId) => {
    try {
      await api.deleteMember(memberId);
      showToast('Member Removed', `Member ${memberId.toUpperCase()} removed from project`, 'info');
      await refreshData();
    } catch (err) {
      console.error('Failed to delete member:', err);
      showToast('Error', err.message, 'error');
      throw err;
    }
  };

  const openMemberAudit = (memberId) => {
    setSelectedMemberId(memberId);
    setIsMemberDossierOpen(true);
  };

  return (
    <PulseContext.Provider
      value={{
        activeTab,
        setActiveTab,
        members,
        ganttTasks,
        tasks: ganttTasks, // compatibility alias
        milestones,
        modules,
        contributions,
        summary,
        loading,
        activePhase,
        setActivePhase,
        activeCategory,
        setActiveCategory,
        activeSort,
        setActiveSort,
        activeTimeframe,
        setActiveTimeframe,
        refreshData,
        updateTaskProgress,
        toggleTaskStatus,
        createNewContribution,
        createNewMember,
        updateMember,
        deleteMember,
        openEditMember,
        closeEditMember,
        deleteContribution,
        openMemberAudit,
        // Modals
        isLogContribOpen,
        setIsLogContribOpen,
        isNewTaskOpen,
        setIsNewTaskOpen,
        isMemberDossierOpen,
        setIsMemberDossierOpen,
        isAddMemberOpen,
        setIsAddMemberOpen,
        isEditMemberOpen,
        setIsEditMemberOpen,
        editingMember,
        isAuthOpen,
        setIsAuthOpen,
        selectedMemberId,
        setSelectedMemberId,
        // Toast
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </PulseContext.Provider>
  );
}

export function usePulse() {
  const context = useContext(PulseContext);
  if (!context) {
    throw new Error('usePulse must be used within a PulseProvider');
  }
  return context;
}
