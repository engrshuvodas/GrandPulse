import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const PulseContext = createContext(null);

export function PulseProvider({ children }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [summary, setSummary] = useState({
    active_members: 3,
    total_tasks: 24,
    completed_tasks: 15,
    completed_ratio: 62.5,
    inprogress_tasks: 6,
    pending_tasks: 3,
    total_logs: 22,
    total_hours: 168.5,
    total_points: 148,
    sprint_health: '+18.4%',
    sprint_velocity: '62.5%',
  });
  const [loading, setLoading] = useState(true);

  // Filters
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
      const [membersData, tasksData, contribsData, summaryData] = await Promise.all([
        api.getMembers(activeCategory, activeSort),
        api.getTasks(),
        api.getContributions(),
        api.getSummaryAnalytics(),
      ]);
      setMembers(membersData || []);
      setTasks(tasksData || []);
      setContributions(contribsData || []);
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching GrandPulse data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeSort]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Actions
  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus = 'Completed';
    if (task.status === 'Completed') {
      newStatus = 'In Progress';
    } else if (task.status === 'In Progress') {
      newStatus = 'Completed';
    } else {
      newStatus = 'In Progress';
    }

    try {
      const result = await api.updateTaskStatus(taskId, newStatus);
      if (result.attribution) {
        showToast(
          'Task Completed & Attributed!',
          result.attribution.message,
          'success'
        );
      } else {
        showToast('Task Updated', `Task ${taskId} moved to ${newStatus}`, 'info');
      }
      await refreshData();
    } catch (err) {
      console.error('Failed to update task status:', err);
      showToast('Error', err.message, 'error');
    }
  };

  const createNewTask = async (taskPayload) => {
    try {
      const created = await api.createTask(taskPayload);
      showToast('New Task Created', `Task [${created.id}] added to backlog`, 'success');
      await refreshData();
      setIsNewTaskOpen(false);
      return created;
    } catch (err) {
      console.error('Failed to create task:', err);
      showToast('Error', err.message, 'error');
      throw err;
    }
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
        tasks,
        contributions,
        summary,
        loading,
        activeCategory,
        setActiveCategory,
        activeSort,
        setActiveSort,
        activeTimeframe,
        setActiveTimeframe,
        refreshData,
        toggleTaskStatus,
        createNewTask,
        createNewContribution,
        createNewMember,
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
